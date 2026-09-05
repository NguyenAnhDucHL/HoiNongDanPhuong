const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middlewares/auth');
const { aiLimiter, globalAiConcurrencyLimiter } = require('../middlewares/rateLimit');

// Apply Global Concurrency Limiter to ALL AI routes
router.use(globalAiConcurrencyLimiter);

// Public Chat with AI (citizens) - Requires rate limiting but NO auth
router.post('/chat/public', aiLimiter, aiController.publicChatWithAI);

// All admin AI routes require authentication + rate limiting
router.use(auth);
router.use(aiLimiter);

// Check AI service availability
router.get('/status', aiController.checkAIStatus);

// Analyze a specific petition
router.post('/analyze/:id', aiController.analyzePetition);

// Chat with AI agent
router.post('/chat', aiController.chatWithAI);

module.exports = router;
