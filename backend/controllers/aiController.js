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
 * Public Chat with AI agent for citizens
 */
const publicChatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Tin nhắn không được để trống.' });
  }

  // Provide public context instead of sensitive admin stats
  const context = {
    organization: "Hội Nông Dân Phường Cẩm Phả",
    purpose: "Hỗ trợ người dân nộp phản ánh, kiến nghị liên quan đến nông nghiệp, đất đai, thủ tục hành chính.",
    navigation: {
      submitPetition: "Để gửi phản ánh, kiến nghị: nhấn vào mục 'GỬI PHẢN ÁNH, KIẾN NGHỊ' trên thanh điều hướng hoặc kéo xuống phần form trên trang chủ.",
      trackPetition: "Để tra cứu kết quả xử lý: nhấn vào mục 'TRA CỨU KẾT QUẢ' trên thanh điều hướng và nhập mã tra cứu được cấp sau khi gửi.",
      contact: "Đường dây nóng: 0363789100 / 0838911445",
      categories: "Các lĩnh vực có thể phản ánh: Trồng trọt, Chăn nuôi, Thủy sản, Đất đai - Thủy lợi, Phân bón - Thuốc BVTV, Vay vốn - Hỗ trợ, Thiên tai - Dịch bệnh, Thủ tục hành chính, Vệ sinh môi trường, và các lĩnh vực khác."
    },
    instructions: "Trả lời ngắn gọn, thân thiện bằng tiếng Việt. Khi hướng dẫn người dân gửi phản ánh, hãy dùng ĐÚNG tên mục 'GỬI PHẢN ÁNH, KIẾN NGHỊ' (không được gọi là 'Gửi phản ánh mới' hay tên khác)."
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
      : 'AI Agent chưa được cấu hình. Vui lòng thêm OLLAMA_API_URL hoặc GEMINI_API_KEY vào file .env.',
  });
});

module.exports = {
  analyzePetition,
  chatWithAI,
  publicChatWithAI,
  checkAIStatus,
};
