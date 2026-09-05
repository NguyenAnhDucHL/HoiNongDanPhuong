const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getAsync, runAsync } = require('../utils/db-promise');
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

const changePassword = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
  }

  const admin = await getAsync('SELECT password FROM admins WHERE id = ?', [adminId]);
  if (!admin) {
    return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng.' });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await runAsync('UPDATE admins SET password = ? WHERE id = ?', [hashedNewPassword, adminId]);

  res.json({ message: 'Đổi mật khẩu thành công.' });
});

module.exports = { login, verifyToken, changePassword };

