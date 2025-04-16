// /routes/detectionRoutes.js
import express from 'express';
import { db } from '../config/firebaseConfig.js';

const router = express.Router();

// ---------Haversine Formula to calculate distance between 2 GPS points---------
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

router.post('/', async (req, res) => {
  try {
    const { type, location, latitude, longitude, time } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Missing detection coordinates" });
    }

    const newDetection = { type, location, latitude, longitude, time };
    const detectionRef = await db.collection('detections').add(newDetection);

    const taskRef = await db.collection('tasks').add({
      detectionId: detectionRef.id,
      type,
      location,
      latitude,
      longitude,
      time,
      status: 'Pending',
      assignedTo: null,
      createdAt: new Date().toISOString()
    });

    // Get all crew users with location
    const crewSnapshot = await db.collection('users').where('role', '==', 'crew').get();
    const crewList = crewSnapshot.docs;

    let closestCrew = null;
    let minDistance = Infinity;

    for (const doc of crewList) {
      const data = doc.data();
      if (data.latitude && data.longitude) {
        const distance = getDistance(latitude, longitude, data.latitude, data.longitude);
        if (distance < minDistance) {
          minDistance = distance;
          closestCrew = { id: doc.id, data };
        }
      }
    }

    if (!closestCrew) {
      return res.status(500).json({ error: 'No crew with valid location found' });
    }

    await taskRef.update({
      assignedTo: closestCrew.id,
      status: 'Assigned'
    });

    await db.collection('users').doc(closestCrew.id).update({
      assignedCount: (closestCrew.data.assignedCount || 0) + 1
    });

    res.status(200).json({
      detectionId: detectionRef.id,
      taskId: taskRef.id,
      assignedCrew: {
        id: closestCrew.id,
        name: closestCrew.data.name,
        distance: `${minDistance.toFixed(2)} km`
      },
      message: 'Task assigned to closest crew'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//to check is task created, Checks garbage is clead or not, if not new task will not create new
import checkExistingTask from '../controllers/detectionController.js';

router.get('/check', checkExistingTask);

export default router;
