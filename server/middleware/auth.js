const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No Authorization header or badly formatted');
    return res.status(400).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
