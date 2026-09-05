const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { getAsync } = require('../utils/db-promise');

const auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Không có token xác thực. Vui lòng đăng nhập.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Check if session token matches the one in DB
    const admin = await getAsync('SELECT sessionToken FROM admins WHERE id = ?', [decoded.id]);
    
    if (!admin || admin.sessionToken !== decoded.sessionToken) {
      return res.status(401).json({ error: 'kicked_out' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

module.exports = auth;
