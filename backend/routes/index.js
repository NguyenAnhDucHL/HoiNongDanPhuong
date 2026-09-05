const express = require('express');
const router = express.Router();

const petitionRoutes = require('./petitionRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const aiRoutes = require('./aiRoutes');

const settingRoutes = require('./settingRoutes');
const postRoutes = require('./postRoutes');
const categoryRoutes = require('./categoryRoutes');

router.use('/petitions', petitionRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/settings', settingRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Hội Nông Dân Cẩm Phả Backend',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
