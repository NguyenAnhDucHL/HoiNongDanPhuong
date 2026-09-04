const aiService = require('../services/aiService');
const adminService = require('../services/adminService');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * Analyze a single petition and save AI results
 */
const analyzePetition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const petition = await adminService.getPetitionById(parseInt(id));

  const analysis = await aiService.analyzePetition(petition);

  // Save AI results back to database
  await adminService.updateAIAnalysis(parseInt(id), {
    aiSummary: analysis.summary,
    aiPriority: analysis.priority,
    aiSuggestion: analysis.suggestion,
    aiCategory: analysis.category,
  });

  res.json({
    message: 'Phân tích AI thành công.',
    analysis,
  });
});

/**
 * Chat with AI agent about petition data
 */
const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Tin nhắn không được để trống.' });
  }

  // Fetch real-time dashboard stats as context for AI
  const dashboardData = await adminService.getDashboardStats();
  const context = {
    stats: dashboardData.overview,
    byCategory: dashboardData.byCategory,
    recentPetitions: dashboardData.recentPetitions,
  };

  const result = await aiService.chatWithAI(message.trim(), context);
  res.json(result);
});

/**
 * Check if AI is available (has valid API key)
 */
const checkAIStatus = asyncHandler(async (req, res) => {
  const available = aiService.isAvailable();
  res.json({
    available,
    message: available
      ? 'AI Agent đang hoạt động bình thường.'
      : 'AI Agent chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env.',
  });
});

module.exports = {
  analyzePetition,
  chatWithAI,
  checkAIStatus,
};
