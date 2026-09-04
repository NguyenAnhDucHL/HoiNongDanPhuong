const config = require('../config/config');

// Lazy-load Gemini to avoid crash when no API key
let genAI = null;
let geminiModel = null;

const initGemini = () => {
  if (!config.geminiApiKey || config.geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return false;
  }
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return true;
  } catch (e) {
    console.error('[AI] Failed to initialize Gemini:', e.message);
    return false;
  }
};

const isAvailable = () => {
  if (!geminiModel) return initGemini();
  return true;
};

/**
 * Analyze a single petition using Gemini AI
 * Returns: { summary, priority, suggestion, category }
 */
const analyzePetition = async (petition) => {
  if (!isAvailable()) {
    return {
      summary: 'Chức năng AI chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env.',
      priority: 'trung bình',
      suggestion: 'Xem xét và xử lý theo quy trình thông thường.',
      category: petition.category,
    };
  }

  const prompt = `Bạn là trợ lý AI hỗ trợ cán bộ Hội Nông Dân phường Cẩm Phả xử lý phản ánh, kiến nghị của hội viên và người dân.

Hãy phân tích phản ánh sau và trả lời ĐÚNG định dạng JSON:

THÔNG TIN PHẢN ÁNH:
- Họ tên: ${petition.fullName}
- Khu phố: ${petition.ward || 'Không rõ'}
- Lĩnh vực đã khai báo: ${petition.category}
- Tiêu đề: ${petition.title}
- Nội dung: ${petition.content}

Trả lời theo định dạng JSON sau (không thêm gì khác):
{
  "summary": "Tóm tắt ngắn gọn nội dung phản ánh trong 1-2 câu",
  "priority": "cao | trung bình | thấp",
  "suggestion": "Gợi ý hành động xử lý cụ thể cho cán bộ (1-2 câu)",
  "category": "Lĩnh vực đúng nhất: Trồng trọt | Chăn nuôi | Thủy sản | Đất đai - Thủy lợi | Phân bón - Thuốc BVTV | Vay vốn - Hỗ trợ | Thiên tai - Dịch bệnh | Khác"
}

Quy tắc đánh giá mức độ ưu tiên:
- CAO: Thiên tai, dịch bệnh nghiêm trọng, vấn đề môi trường cấp bách, ảnh hưởng nhiều hộ dân
- TRUNG BÌNH: Vấn đề cần giải quyết trong 1-2 tuần, ảnh hưởng một số hộ
- THẤP: Yêu cầu thông tin, thắc mắc thông thường, kiến nghị dài hạn`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || 'Không có tóm tắt.',
      priority: parsed.priority || 'trung bình',
      suggestion: parsed.suggestion || 'Xem xét xử lý theo quy trình.',
      category: parsed.category || petition.category,
    };
  } catch (err) {
    console.error('[AI] analyzePetition error:', err.message);
    return {
      summary: `[AI Error] ${err.message}`,
      priority: 'trung bình',
      suggestion: 'Xem xét xử lý theo quy trình thông thường.',
      category: petition.category,
    };
  }
};

/**
 * Chat with AI about petition data (admin query interface)
 * @param {string} userMessage - Admin's question
 * @param {object} context - Optional database context (stats, recent petitions)
 */
const chatWithAI = async (userMessage, context = {}) => {
  if (!isAvailable()) {
    return {
      reply: '⚠️ Chức năng AI chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env của backend.',
    };
  }

  // Build context string from database data
  let contextStr = '';
  if (context.stats) {
    contextStr += `\nTHỐNG KÊ HIỆN TẠI:
- Tổng phản ánh: ${context.stats.total}
- Đã giải quyết: ${context.stats.resolved}
- Đang xử lý: ${context.stats.processing}
- Chờ xử lý: ${context.stats.pending}
- Bị từ chối: ${context.stats.rejected}
- Ưu tiên cao: ${context.stats.highPriority || 0}
- Hôm nay: ${context.stats.today || 0}`;
  }

  if (context.byCategory && context.byCategory.length > 0) {
    contextStr += '\n\nPHÂN LOẠI THEO LĨNH VỰC:\n';
    context.byCategory.forEach(c => {
      contextStr += `- ${c.category}: ${c.count} phản ánh\n`;
    });
  }

  if (context.recentPetitions && context.recentPetitions.length > 0) {
    contextStr += '\n\nPHẢN ÁNH GẦN ĐÂY:\n';
    context.recentPetitions.forEach(p => {
      contextStr += `- [${p.trackingCode}] ${p.title} (${p.category}, ${p.status})\n`;
    });
  }

  const systemPrompt = `Bạn là trợ lý AI thông minh của Hội Nông Dân phường Cẩm Phả. 
Nhiệm vụ của bạn là hỗ trợ cán bộ quản lý phân tích dữ liệu phản ánh, đưa ra nhận định và gợi ý.
Trả lời bằng tiếng Việt, ngắn gọn, chuyên nghiệp, thân thiện.
${contextStr}

Câu hỏi của cán bộ: ${userMessage}`;

  try {
    const result = await geminiModel.generateContent(systemPrompt);
    const reply = result.response.text().trim();
    return { reply };
  } catch (err) {
    console.error('[AI] chatWithAI error:', err.message);
    return { reply: `Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi: ${err.message}` };
  }
};

/**
 * Batch analyze multiple petitions
 */
const batchAnalyzePetitions = async (petitions) => {
  const results = [];
  for (const petition of petitions) {
    const analysis = await analyzePetition(petition);
    results.push({ id: petition.id, ...analysis });
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return results;
};

module.exports = {
  analyzePetition,
  chatWithAI,
  batchAnalyzePetitions,
  isAvailable,
};
