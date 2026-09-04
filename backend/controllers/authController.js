const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getAsync } = require('../utils/db-promise');
const config = require('../config/config');
const asyncHandler = require('../middlewares/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
  }

  const admin = await getAsync(
    'SELECT id, username, password, fullName FROM admins WHERE username = ?',
    [username.trim()]
  );

  if (!admin) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, fullName: admin.fullName },
    config.jwtSecret,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
    },
  });
});

const verifyToken = asyncHandler(async (req, res) => {
  // If we reach here, the auth middleware already verified the token
  res.json({ valid: true, admin: req.admin });
});

module.exports = { login, verifyToken };
