const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/petitionController');
const { petitionLimiter } = require('../middlewares/rateLimit');
const upload = require('../config/upload');
const multer = require('multer');

// Submit petition (public) - with rate limit + file upload
router.post(
  '/',
  petitionLimiter,
  (req, res, next) => {
    const uploadMiddleware = upload.array('images', 10);
    uploadMiddleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Lỗi tải ảnh: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  petitionController.createPetition
);

// Get public petitions list (paginated)
router.get('/', petitionController.getPublicPetitions);

// Get stats for homepage
router.get('/stats', petitionController.getStats);

// Get wards list for dropdown
router.get('/wards', petitionController.getWards);

// Track petition by code
router.get('/track/:code', petitionController.trackPetition);

module.exports = router;
