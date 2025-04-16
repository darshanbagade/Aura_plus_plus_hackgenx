// ECHO is on.
// /server.js
import express from 'express';
import { db } from './config/firebaseConfig.js'; // Import Firestore instance

const app = express();
const port = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('detections').get(); // Fetch all data from 'detections' collection
    const detections = snapshot.docs.map(doc => doc.data());  // Convert to array
    res.json(detections); // Respond with detections data from Firestore
  } catch (err) {
    res.status(500).send("Error fetching detections: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//--------Detection route--------------
import detectionRoutes from './routes/detectionRoutes.js';
app.use(express.json()); // For parsing JSON in requests

app.use('/api/detections', detectionRoutes); // Mount the detection API

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



//-------------Task Route----------------
import taskRoutes from './routes/taskRoutes.js';
app.use('/api/tasks', taskRoutes);


//---------Add/Remove Crew by admin-------
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
