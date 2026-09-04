require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3002,
  jwtSecret: process.env.JWT_SECRET || 'hnd-campha-super-secret-key-2026',
  env: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};
