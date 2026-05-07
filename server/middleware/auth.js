const { auth, db } = require('../firebase');

// Verifies the Firebase token only — does NOT require a Firestore user doc.
// Use on routes that create the user doc (e.g. /register).
async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = header.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Verifies the token AND ensures a Firestore user doc exists.
// Auto-creates the doc for valid Firebase users who missed the /register step.
async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = header.split('Bearer ')[1];
    const decoded = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) {
      const userData = {
        name: decoded.name || '',
        email: decoded.email || '',
        role: 'student',
        createdAt: new Date().toISOString(),
      };
      await db.collection('users').doc(decoded.uid).set(userData);
      req.user = { uid: decoded.uid, ...userData };
    } else {
      req.user = { uid: decoded.uid, ...userDoc.data() };
    }

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { verifyToken, requireAuth };
