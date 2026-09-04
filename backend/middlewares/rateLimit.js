const rateLimit = require('express-rate-limit');

// Rate limiter for public petition submission (prevent spam)
const petitionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 submissions per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Bạn đã gửi quá nhiều phản ánh. Vui lòng thử lại sau 15 phút.',
  },
});

// Rate limiter for admin login (prevent brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
  },
});

// Rate limiter for AI API (Gemini has quotas)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Quá nhiều yêu cầu AI. Vui lòng chờ một chút.',
  },
});

module.exports = { petitionLimiter, loginLimiter, aiLimiter };
