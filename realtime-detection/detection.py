import cv2
import requests
import time
import os
import logging
from ultralytics import YOLO
from dotenv import load_dotenv
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore


load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")


LOG_FILE = os.path.join(os.path.dirname(__file__), "detections.log")
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logging.info("Logging is set up successfully.")


FIREBASE_KEY_PATH = "D:/Real-Time Garbage detection/backend/config/firebaseServiceAccountKey.json"
cred = credentials.Certificate(FIREBASE_KEY_PATH)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load YOLOv8 models
garbage_model = YOLO("models/best.pt")
spill_model = YOLO("models/best_spill2.pt")

# Hardcoded camera info
CAMERA_LOCATION = "Room1 Hall"
LATITUDE = 50.2003
LONGITUDE = 21.0899

# Open webcam or CCTV feed
cap = cv2.VideoCapture(0)

def log_detection(task_type, confidence):
    logging.info(f"Task Type: {task_type}, Location: {CAMERA_LOCATION}, Confidence: {confidence}")

def task_exists(task_type):
    try:
        # /api/detections/check endpoint
        check_url = f"{BACKEND_URL.replace('/api/detections', '')}/api/detections/check"
        response = requests.get(check_url, params={
            "type": task_type,
            "location": CAMERA_LOCATION
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get("exists", False)
        return False
    except Exception as e:
        print(f"Error checking task existence: {e}")
        # Fall back to direct Firestore query if API call fails
        query = db.collection("tasks") \
            .where("type", "==", task_type) \
            .where("location", "==", CAMERA_LOCATION) \
            .where("status", "in", ["Pending", "Assigned"]) \
            .stream()
        return any(query)

def send_payload(payload):
    try:
        res = requests.post(BACKEND_URL, json=payload)
        print("Payload sent:", res.status_code, res.text)
    except Exception as e:
        print("Error sending payload:", e)

def draw_detections(frame, results, detection_type):
    # Colors for bounding boxes 
    color = (0, 0, 255) if detection_type == "garbage" else (0, 255, 255)  # Red for garbage, Yellow for spill
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
          
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            
  
            confidence = float(box.conf[0])
            
            
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            
            label = f"{detection_type.capitalize()}: {confidence:.2f}"
            (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
            cv2.rectangle(frame, (x1, y1 - 20), (x1 + w, y1), color, -1)
            
           
            cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    
    return frame

while True:
    success, frame = cap.read()
    if not success:
        print("Failed to capture frame")
        break

    resized = cv2.resize(frame, (640, 480))
    display_frame = resized.copy()  
    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M")

  
    results_garbage = garbage_model.predict(resized, conf=0.6)
    display_frame = draw_detections(display_frame, results_garbage, "garbage")
    
    for r in results_garbage:
        for box in r.boxes:
            confidence = float(box.conf[0])
            if not task_exists("garbage"):
                payload = {
                    "type": "garbage",
                    "location": CAMERA_LOCATION,
                    "latitude": LATITUDE,
                    "longitude": LONGITUDE,
                    "time": timestamp,
                    "confidence": round(confidence, 2),
                    "isTaskCreated": False
                }
                send_payload(payload)
                log_detection("garbage", confidence)
                time.sleep(5)

    # Spill Detection
    results_spill = spill_model.predict(resized, conf=0.6)
    display_frame = draw_detections(display_frame, results_spill, "spill")
    
    for r in results_spill:
        for box in r.boxes:
            confidence = float(box.conf[0])
            if not task_exists("spill"):
                payload = {
                    "type": "spill",
                    "location": CAMERA_LOCATION,
                    "latitude": LATITUDE,
                    "longitude": LONGITUDE,
                    "time": timestamp,
                    "confidence": round(confidence, 2),
                    "isTaskCreated": False
                }
                send_payload(payload)
                log_detection("spill", confidence)
                time.sleep(5)

    # Show video stream with detections
    cv2.imshow("Live CCTV Feed", display_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()