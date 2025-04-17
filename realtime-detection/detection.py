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

# Load .env variables
load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")
CAMERA_LOCATION = os.getenv("CAMERA_LOCATION", "Room1 Hall")
LATITUDE = float(os.getenv("LATITUDE", 50.2003))
LONGITUDE = float(os.getenv("LONGITUDE", 21.0899))

# Absolute paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FIREBASE_KEY_PATH = os.path.join(BASE_DIR, "backend", "config", "firebaseServiceAccountKey.json")
garbage_model_path = os.path.join(BASE_DIR, "models", "best.pt")
spill_model_path = os.path.join(BASE_DIR, "models", "best_spill_2.pt")

# Check model files
if not os.path.isfile(garbage_model_path):
    raise FileNotFoundError(f"Garbage model not found at: {garbage_model_path}")
if not os.path.isfile(spill_model_path):
    raise FileNotFoundError(f"Spill model not found at: {spill_model_path}")

# Logging setup
LOG_FILE = os.path.join(os.path.dirname(__file__), "detections.log")
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logging.info("Logging is set up successfully.")

# Initialize Firebase
try:
    cred = credentials.Certificate(FIREBASE_KEY_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logging.info("Firebase initialized successfully.")
except Exception as e:
    logging.error(f"Failed to initialize Firebase: {e}")
    raise

# Load YOLOv8 models
try:
    garbage_model = YOLO(garbage_model_path)
    spill_model = YOLO(spill_model_path)
    logging.info("Models loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load YOLO models: {e}")
    raise

cap = cv2.VideoCapture(0)

def log_detection(task_type, confidence):
    logging.info(f"Task Type: {task_type}, Location: {CAMERA_LOCATION}, Confidence: {confidence}")

def task_exists(task_type):
    try:
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
        logging.warning(f"Error checking task existence via API: {e}")
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
    color = (0, 0, 255) if detection_type == "garbage" else (0, 255, 255)
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = float(box.conf[0])
            label = f"{detection_type.capitalize()}: {confidence:.2f}"

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
            cv2.rectangle(frame, (x1, y1 - 20), (x1 + w, y1), color, -1)
            cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    return frame

def process_detection(model, frame, detection_type):
    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M")
    results = model.predict(frame, conf=0.6)
    for r in results:
        for box in r.boxes:
            confidence = float(box.conf[0])
            if not task_exists(detection_type):
                payload = {
                    "type": detection_type,
                    "location": CAMERA_LOCATION,
                    "latitude": LATITUDE,
                    "longitude": LONGITUDE,
                    "time": timestamp,
                    "confidence": round(confidence, 2),
                    "isTaskCreated": False
                }
                send_payload(payload)
                log_detection(detection_type, confidence)
                time.sleep(5)
    return draw_detections(frame, results, detection_type)

# Main Loop
while True:
    success, frame = cap.read()
    if not success:
        print("Failed to capture frame")
        break

    resized = cv2.resize(frame, (640, 480))
    display_frame = resized.copy()

    display_frame = process_detection(garbage_model, display_frame, "garbage")
    display_frame = process_detection(spill_model, display_frame, "spill")

    cv2.imshow("Live CCTV Feed", display_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
