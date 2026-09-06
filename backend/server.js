require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const hpp = require('hpp');

const config = require('./config/config');

// Initialize database (runs schema migrations + seed data)
require('./config/database');

// Initialize backup service
require('./services/backupService');

const apiRoutes = require('./routes/index');

const app = express();

// Trust proxy if behind nginx
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS - allow frontend dev server
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint không tồn tại.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.message);
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    error: err.message || 'Lỗi hệ thống không xác định.',
    ...(config.env !== 'production' && { stack: err.stack }),
  });
});

app.listen(config.port, () => {
  console.log(`\n🌿 Hội Nông Dân Cẩm Phả Backend đang chạy tại http://localhost:${config.port}`);
  console.log(`📡 API: http://localhost:${config.port}/api/health`);
  console.log(`🤖 AI Agent: ${config.geminiApiKey && config.geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE' ? 'Đã cấu hình ✅' : 'Chưa cấu hình (thêm GEMINI_API_KEY vào .env) ⚠️'}\n`);
});
