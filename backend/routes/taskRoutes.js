import express from 'express';
import { db } from '../config/firebaseConfig.js';

const router = express.Router();

// GET /api/tasks → Fetch all tasks or by crew ID
router.get('/', async (req, res) => {
  try {
    const { assignedTo, status, type, location } = req.query;

    let query = db.collection('tasks');

    if (assignedTo) {
      query = query.where('assignedTo', '==', assignedTo);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    let tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (location) {
      tasks = tasks.filter(task =>
        task.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Fetch crew names for assigned tasks
    const crewIds = [...new Set(tasks.map(task => task.assignedTo).filter(Boolean))];
    const crewSnapshot = await db.collection('users').where('__name__', 'in', crewIds).get();
    const crewMap = crewSnapshot.docs.reduce((map, doc) => {
      map[doc.id] = doc.data().name;
      return map;
    }, {});

    // Add crew names to tasks
    tasks = tasks.map(task => ({
      ...task,
      assignedCrew: crewMap[task.assignedTo] || null
    }));

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;

    const taskRef = db.collection('tasks').doc(taskId);

    const doc = await taskRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await taskRef.update(updateData);

    const updatedDoc = await taskRef.get();
    res.status(200).json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;