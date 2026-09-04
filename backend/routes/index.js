const express = require('express');
const router = express.Router();

const petitionRoutes = require('./petitionRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const aiRoutes = require('./aiRoutes');

router.use('/petitions', petitionRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HND Cẩm Phả Backend',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
