
import express from 'express';
import { db } from './config/firebaseConfig.js';
const app = express();
const port = process.env.PORT || 5000;
app.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('detections').get(); 
    const detections = snapshot.docs.map(doc => doc.data());  
    res.json(detections); 
  } catch (err) {
    res.status(500).send("Error fetching detections: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import detectionRoutes from './routes/detectionRoutes.js';
app.use(express.json()); 
app.use('/api/detections', detectionRoutes); 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import taskRoutes from './routes/taskRoutes.js';
app.use('/api/tasks', taskRoutes);

import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
