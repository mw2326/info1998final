const express = require('express');
const { db } = require('../firebase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/:uid/saved — get a user's saved opportunities
router.get('/:uid/saved', requireAuth, async (req, res) => {
  try {
    if (req.user.uid !== req.params.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const snapshot = await db
      .collection('savedOpportunities')
      .where('userId', '==', req.params.uid)
      .get();

    const savedIds = snapshot.docs.map((doc) => doc.data().opportunityId);

    if (savedIds.length === 0) return res.json([]);

    const opps = await Promise.all(
      savedIds.map((id) => db.collection('opportunities').doc(id).get())
    );

    const result = opps
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved opportunities' });
  }
});

// POST /api/users/:uid/saved — save an opportunity
router.post('/:uid/saved', requireAuth, async (req, res) => {
  try {
    if (req.user.uid !== req.params.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { opportunityId } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ error: 'opportunityId is required' });
    }

    const docId = `${req.params.uid}_${opportunityId}`;
    const existing = await db.collection('savedOpportunities').doc(docId).get();

    if (existing.exists) {
      return res.status(409).json({ error: 'Already saved' });
    }

    await db.collection('savedOpportunities').doc(docId).set({
      userId: req.params.uid,
      opportunityId,
      savedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Opportunity saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save opportunity' });
  }
});

// PUT /api/users/:uid/profile — update display name
router.put('/:uid/profile', requireAuth, async (req, res) => {
  try {
    if (req.user.uid !== req.params.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    await db.collection('users').doc(req.params.uid).update({ name: name.trim() });
    res.json({ message: 'Profile updated', name: name.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// DELETE /api/users/:uid/saved/:oppId — unsave an opportunity
router.delete('/:uid/saved/:oppId', requireAuth, async (req, res) => {
  try {
    if (req.user.uid !== req.params.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const docId = `${req.params.uid}_${req.params.oppId}`;
    await db.collection('savedOpportunities').doc(docId).delete();
    res.json({ message: 'Opportunity removed from saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unsave opportunity' });
  }
});

module.exports = router;
