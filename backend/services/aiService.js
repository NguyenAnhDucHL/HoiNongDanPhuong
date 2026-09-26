const { GoogleGenerativeAI } = require('@google/generative-ai');

function isAvailable() {
  return !!process.env.GEMINI_API_KEY;
}

async function analyzePetition(petition) {
  if (!isAvailable()) {
    return {
      category: "Khác",
      priority: "Thấp",
      summary: "Tính năng AI đang tạm tắt (Chưa cấu hình GEMINI_API_KEY).",
      suggestion: "Cần cán bộ kiểm tra thủ công."
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Phân tích nội dung phản ánh sau đây và trả về định dạng JSON thuần túy (không chứa markdown).
Tiêu đề: "${petition.title}"
Nội dung phản ánh: "${petition.content}"

Hãy trả về chính xác 1 đối tượng JSON chứa các khóa sau:
- "category": Lĩnh vực liên quan nhất (chọn 1 trong: 'Trồng trọt', 'Chăn nuôi', 'Thủy sản', 'Đất đai - Thủy lợi', 'Phân bón - Thuốc BVTV', 'Vay vốn - Hỗ trợ', 'Thiên tai - Dịch bệnh', 'Khác').
- "priority": Mức độ ưu tiên ('Cao', 'Trung bình', 'Thấp').
- "summary": Tóm tắt nội dung phản ánh (khoảng 1-2 câu).
- "suggestion": Gợi ý cách giải quyết (ngắn gọn, thiết thực).`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up markdown syntax and extract JSON block robustly
    let rawJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const jsonStart = rawJson.indexOf('{');
    const jsonEnd = rawJson.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      rawJson = rawJson.substring(jsonStart, jsonEnd + 1);
    }

    rawJson = rawJson.replace(/,\s*([}\]])/g, '$1');

    try {
      return JSON.parse(rawJson);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", rawJson, parseError);
      return {
        category: "Khác",
        priority: "Thấp",
        summary: `Chờ xử lý (Lỗi AI parse data)`,
        suggestion: "AI không thể tóm tắt. Cần cán bộ kiểm tra thủ công."
      };
    }

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      category: "Khác",
      priority: "Thấp",
      summary: `Phân tích thất bại (Lỗi hệ thống/mạng)`,
      suggestion: "Cần cán bộ kiểm tra thủ công."
    };
  }
}

async function chatWithAI(message, context) {
  if (!isAvailable()) {
    return { reply: "Xin lỗi, AI chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào biến môi trường." };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Bạn là trợ lý ảo (Chatbot) của Hệ thống quản lý phản ánh Hội Nông Dân phường. Chỉ trả lời ngắn gọn, súc tích, thân thiện và phải trả về dưới định dạng JSON thô (không có code block), với duy nhất 1 trường 'reply'."
    });
    
    const prompt = `Đây là dữ liệu ngữ cảnh hiện tại của hệ thống: ${JSON.stringify(context)}. 
Câu hỏi của người dùng: "${message}". 
Hãy trả lời ngắn gọn, súc tích và thân thiện. Trả về dưới định dạng JSON thô: { "reply": "nội dung trả lời" }`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    let rawJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const jsonStart = rawJson.indexOf('{');
    const jsonEnd = rawJson.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      rawJson = rawJson.substring(jsonStart, jsonEnd + 1);
    }

    rawJson = rawJson.replace(/,\s*([}\]])/g, '$1');

    try {
      return JSON.parse(rawJson);
    } catch (parseError) {
      console.error("Failed to parse AI Chat JSON:", rawJson, parseError);
      return { reply: "Xin lỗi, tôi đang gặp chút bối rối khi xử lý ngôn ngữ. Vui lòng hỏi lại một cách khác nhé!" };
    }

  } catch (error) {
    console.error("AI Chat Error:", error);
    return { reply: `Xin lỗi, hệ thống AI đang quá tải hoặc mất kết nối mạng. Vui lòng thử lại sau. (Lỗi: ${error.message})` };
  }
}

module.exports = {
  isAvailable,
  analyzePetition,
  chatWithAI,
};
