const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middlewares/auth');
const { aiLimiter } = require('../middlewares/rateLimit');

// All AI routes require authentication + rate limiting
router.use(auth);
router.use(aiLimiter);

// Check AI service availability
router.get('/status', aiController.checkAIStatus);

// Analyze a specific petition
router.post('/analyze/:id', aiController.analyzePetition);

// Chat with AI agent
router.post('/chat', aiController.chatWithAI);

module.exports = router;
