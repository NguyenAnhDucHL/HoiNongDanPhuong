const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimit');

// Admin login
router.post('/login', loginLimiter, authController.login);

// Verify token (protected)
router.get('/verify', auth, authController.verifyToken);

module.exports = router;
