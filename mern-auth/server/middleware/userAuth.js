import jwt from 'jsonwebtoken';

// ✅ General user/auth middleware
export const userAuth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Login again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role; // role bhi set ho raha hai
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Login again' });
  }
};

// ✅ Admin only middleware
export const adminAuth = (req, res, next) => {
  userAuth(req, res, () => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admins only' });
    }
    next();
  });
};
