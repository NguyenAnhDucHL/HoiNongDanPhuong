const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getAsync, runAsync } = require('../utils/db-promise');
const config = require('../config/config');
const asyncHandler = require('../middlewares/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
  }

  const admin = await getAsync(
    'SELECT id, username, password, fullName, failedLoginAttempts, lockedUntil FROM admins WHERE username = ?',
    [username.trim()]
  );

  if (admin && admin.lockedUntil) {
    const lockedUntilDate = new Date(admin.lockedUntil);
    if (lockedUntilDate > new Date()) {
      await runAsync(
        'INSERT INTO audit_logs (adminId, username, action, ipAddress, userAgent, details) VALUES (?, ?, ?, ?, ?, ?)',
        [admin.id, admin.username, 'LOGIN_FAILED', ipAddress, userAgent, 'Tài khoản đang bị khóa (Lockout)']
      );
      return res.status(401).json({ error: 'Tài khoản đang bị khóa do đăng nhập sai quá nhiều. Vui lòng thử lại sau 15 phút.' });
    }
  }

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    if (admin) {
      const attempts = (admin.failedLoginAttempts || 0) + 1;
      let lockedUntil = null;
      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      await runAsync('UPDATE admins SET failedLoginAttempts = ?, lockedUntil = ? WHERE id = ?', [attempts, lockedUntil, admin.id]);

      await runAsync(
        'INSERT INTO audit_logs (adminId, username, action, ipAddress, userAgent, details) VALUES (?, ?, ?, ?, ?, ?)',
        [admin.id, admin.username, 'LOGIN_FAILED', ipAddress, userAgent, `Sai mật khẩu (Lần ${attempts})`]
      );
    } else {
      await runAsync(
        'INSERT INTO audit_logs (adminId, username, action, ipAddress, userAgent, details) VALUES (?, ?, ?, ?, ?, ?)',
        [null, username, 'LOGIN_FAILED', ipAddress, userAgent, 'Tài khoản không tồn tại']
      );
    }
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  // Generate a random session token
  const sessionToken = crypto.randomBytes(16).toString('hex');
  await runAsync('UPDATE admins SET failedLoginAttempts = 0, lockedUntil = NULL, sessionToken = ? WHERE id = ?', [sessionToken, admin.id]);

  await runAsync(
    'INSERT INTO audit_logs (adminId, username, action, ipAddress, userAgent, details) VALUES (?, ?, ?, ?, ?, ?)',
    [admin.id, admin.username, 'LOGIN_SUCCESS', ipAddress, userAgent, 'Đăng nhập thành công']
  );

  const token = jwt.sign(
    {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      sessionToken
    },
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
  // Rotate sessionToken to force logout on all other devices
  const newSessionToken = crypto.randomBytes(16).toString('hex');
  await runAsync('UPDATE admins SET password = ?, sessionToken = ? WHERE id = ?', [hashedNewPassword, newSessionToken, adminId]);

  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  await runAsync(
    'INSERT INTO audit_logs (adminId, username, action, ipAddress, userAgent, details) VALUES (?, ?, ?, ?, ?, ?)',
    [adminId, req.admin.username, 'CHANGE_PASSWORD', ipAddress, userAgent, 'Đổi mật khẩu thành công']
  );

  res.json({ message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
});

const logout = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  // Clear the sessionToken to invalidate the current JWT
  await runAsync('UPDATE admins SET sessionToken = NULL WHERE id = ?', [adminId]);

  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  await runAsync(
    'INSERT INTO audit_logs (adminId, username, action, ipAddress, userAgent, details) VALUES (?, ?, ?, ?, ?, ?)',
    [adminId, req.admin.username, 'LOGOUT', ipAddress, userAgent, 'Đăng xuất thành công']
  );

  res.json({ message: 'Đăng xuất thành công.' });
});

const getAuditLogs = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const logs = await allAsync(
    'SELECT id, action, ipAddress, userAgent, details, createdAt FROM audit_logs WHERE adminId = ? ORDER BY createdAt DESC LIMIT 50',
    [adminId]
  );
  res.json(logs);
});

module.exports = { login, verifyToken, changePassword, logout, getAuditLogs };

