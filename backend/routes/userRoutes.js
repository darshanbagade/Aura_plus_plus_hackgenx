// /routes/userRoutes.js

import express from 'express';
import { db } from '../config/firebaseConfig.js';

const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Add new crew member
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newCrew = {
      name,
      role: 'crew',
      assignedCount: 0,
      lastAssigned: false
    };

    const userRef = await db.collection('users').add(newCrew);

    res.status(201).json({
      id: userRef.id,
      message: 'Crew member added'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a crew member
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('users').doc(id).delete();

    res.status(200).json({
      message: `Crew member with ID ${id} deleted`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all crew users (optional for dashboard)
 */
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .where('role', '==', 'crew')
      .get();

    const crew = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(crew);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
