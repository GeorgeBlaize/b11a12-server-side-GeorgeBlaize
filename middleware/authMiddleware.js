// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Restrict certain routes to admins only
    if (req.path.includes('/users') || req.path.includes('/candidates') || req.path.includes('/packages')) {
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;