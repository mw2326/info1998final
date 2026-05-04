const express = require('express');
const { db } = require('../firebase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register — called from frontend after Firebase Auth creates the user
// Creates the Firestore user doc with role='student'
router.post('/register', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const { uid, email } = req.user;

    const existing = await db.collection('users').doc(uid).get();
    if (existing.exists) {
      return res.json({ user: { uid, ...existing.data() } });
    }

    const userData = {
      name: name || '',
      email,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').doc(uid).set(userData);
    res.status(201).json({ user: { uid, ...userData } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

// GET /api/auth/me — return the current user's profile
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
