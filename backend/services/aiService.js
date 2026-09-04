const { GoogleGenerativeAI } = require('@google/generative-ai');

function isAvailable() {
  return !!process.env.GEMINI_API_KEY;
}

async function analyzePetition(petition) {
  if (!isAvailable()) {
    return { 
      category: "Khác", 
      priority: "Thấp",
      summary: "Tính năng AI đang tạm tắt (Chưa cấu hình API Key).",
      suggestion: "Cần cán bộ kiểm tra thủ công."
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Bạn là trợ lý AI của Hệ thống quản lý phản ánh Hội Nông Dân.
Hãy phân tích nội dung phản ánh sau đây và trả về định dạng JSON thuần túy (không chứa markdown \`\`\`json ... \`\`\`).
Tiêu đề: "${petition.title}"
Nội dung phản ánh: "${petition.content}"

Hãy trả về chính xác 1 đối tượng JSON chứa các khóa sau:
- "category": Lĩnh vực liên quan nhất (chọn 1 trong: 'Trồng trọt', 'Chăn nuôi', 'Thủy sản', 'Đất đai - Thủy lợi', 'Phân bón - Thuốc BVTV', 'Vay vốn - Hỗ trợ', 'Thiên tai - Dịch bệnh', 'Khác').
- "priority": Mức độ ưu tiên ('Cao', 'Trung bình', 'Thấp').
- "summary": Tóm tắt nội dung phản ánh (khoảng 1-2 câu).
- "suggestion": Gợi ý cách giải quyết (ngắn gọn, thiết thực).`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up markdown syntax if AI still returns it
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Error:", error);
    return { 
      category: "Khác", 
      priority: "Thấp",
      summary: "Phân tích tự động thất bại do lỗi hệ thống/mạng.",
      suggestion: "Cần cán bộ kiểm tra thủ công."
    };
  }
}

async function chatWithAI(message, context) {
  if (!isAvailable()) {
    return { reply: "Xin lỗi, AI chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY." };
  }
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Bạn là trợ lý ảo của Hệ thống quản lý phản ánh Hội Nông Dân. 
Đây là dữ liệu ngữ cảnh hiện tại của hệ thống: ${JSON.stringify(context)}. 
Câu hỏi của người dùng: "${message}". 
Hãy trả lời ngắn gọn, súc tích và thân thiện. Trả về dưới định dạng JSON: { "reply": "nội dung trả lời" }`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Chat Error:", error);
    return { reply: "Xin lỗi, đã xảy ra lỗi trong quá trình xử lý câu hỏi của bạn." };
  }
}

module.exports = {
  isAvailable,
  analyzePetition,
  chatWithAI,
};
