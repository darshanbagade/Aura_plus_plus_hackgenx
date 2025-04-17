import express from 'express';
import cors from 'cors'; // Import CORS
import { db } from './config/firebaseConfig.js';
import detectionRoutes from './routes/detectionRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON in requests
app.use(express.json());

// Root route to fetch all detections
app.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('detections').get();
    const detections = snapshot.docs.map((doc) => doc.data());
    res.json(detections);
  } catch (err) {
    res.status(500).send("Error fetching detections: " + err.message);
  }
});

// Mount routes
app.use('/api/detections', detectionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});