const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'business_web_secret_key_change_in_production_2026');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const ownerOnly = (req, res, next) => {
  if (req.user.role !== 'owner' && req.user.role !== 'cashier') {
    return res.status(403).json({ error: 'Access denied. Owner/Cashier only.' });
  }
  next();
};

module.exports = { auth, ownerOnly };
