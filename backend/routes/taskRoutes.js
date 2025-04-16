// /routes/taskRoutes.js
import express from 'express';
import { db } from '../config/firebaseConfig.js';

const router = express.Router();

// GET /api/tasks → Fetch all tasks or by crew ID
// GET /api/tasks → Filter by crew ID, status, or type
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
  
      // 🔍 Do location search filtering in Node.js after fetching
      if (location) {
        tasks = tasks.filter(task =>
          task.location.toLowerCase().includes(location.toLowerCase())
        );
      }
  
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Add this new PUT route to update a task by ID
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;
    
    // Get a reference to the task document
    const taskRef = db.collection('tasks').doc(taskId);
    
    // Check if task exists
    const doc = await taskRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update the task
    await taskRef.update(updateData);
    
    // Return the updated task
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