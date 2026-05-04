const express = require('express');
const { db } = require('../firebase');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// GET /api/opportunities — list all, with optional ?search= and ?category=
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = db.collection('opportunities');
    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    let opportunities = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const term = search.toLowerCase();
      opportunities = opportunities.filter(
        (o) =>
          o.title?.toLowerCase().includes(term) ||
          o.organization?.toLowerCase().includes(term) ||
          o.description?.toLowerCase().includes(term)
      );
    }

    opportunities.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    res.json(opportunities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// GET /api/opportunities/:id — get a single opportunity
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('opportunities').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
});

// POST /api/opportunities — create (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, organization, description, category, location, date, spots } = req.body;

    if (!title || !organization) {
      return res.status(400).json({ error: 'title and organization are required' });
    }

    const data = {
      title,
      organization,
      description: description || '',
      category: category || '',
      location: location || '',
      date: date || '',
      spots: Number(spots) || 10,
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid,
    };

    const ref = await db.collection('opportunities').add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
});

// PUT /api/opportunities/:id — update (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const ref = db.collection('opportunities').doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    if (updates.spots) updates.spots = Number(updates.spots);
    await ref.update(updates);

    const updated = await ref.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update opportunity' });
  }
});

// DELETE /api/opportunities/:id — delete (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const ref = db.collection('opportunities').doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    await ref.delete();
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
});

module.exports = router;
