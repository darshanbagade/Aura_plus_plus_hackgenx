import admin from '../config/firebaseConfig.js';
const db = admin.firestore();

const checkExistingTask = async (req, res) => {
  const { type, location } = req.query;

  try {
    const tasksRef = db.collection('tasks');
    const snapshot = await tasksRef
      .where('type', '==', type)
      .where('location', '==', location)
      .where('status', 'in', ['Pending', 'Assigned'])
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking task existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default checkExistingTask;
