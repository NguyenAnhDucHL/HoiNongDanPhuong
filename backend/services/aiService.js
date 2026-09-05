const { GoogleGenerativeAI } = require('@google/generative-ai');

// Node 18+ has built-in fetch.
const _fetch = fetch;

function isOllamaAvailable() {
  return !!process.env.OLLAMA_API_URL;
}

function isGeminiAvailable() {
  return !!process.env.GEMINI_API_KEY;
}

function isAvailable() {
  return isOllamaAvailable() || isGeminiAvailable();
}

async function askOllama(prompt, systemPrompt = "") {
  const ollamaUrl = process.env.OLLAMA_API_URL;
  const ollamaModel = process.env.OLLAMA_MODEL || 'qwen';

  const response = await _fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      prompt: prompt,
      system: systemPrompt,
      stream: false,
      format: "json"
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama API error (${response.status}): ${response.statusText}. Response: ${errText}`);
  }

  const data = await response.json();
  return data.response;
}

async function analyzePetition(petition) {
  if (!isAvailable()) {
    return {
      category: "Khác",
      priority: "Thấp",
      summary: "Tính năng AI đang tạm tắt (Chưa cấu hình Ollama/Gemini).",
      suggestion: "Cần cán bộ kiểm tra thủ công."
    };
  }

  const prompt = `Phân tích nội dung phản ánh sau đây và trả về định dạng JSON thuần túy (không chứa markdown).
Tiêu đề: "${petition.title}"
Nội dung phản ánh: "${petition.content}"

Hãy trả về chính xác 1 đối tượng JSON chứa các khóa sau:
- "category": Lĩnh vực liên quan nhất (chọn 1 trong: 'Trồng trọt', 'Chăn nuôi', 'Thủy sản', 'Đất đai - Thủy lợi', 'Phân bón - Thuốc BVTV', 'Vay vốn - Hỗ trợ', 'Thiên tai - Dịch bệnh', 'Khác').
- "priority": Mức độ ưu tiên ('Cao', 'Trung bình', 'Thấp').
- "summary": Tóm tắt nội dung phản ánh (khoảng 1-2 câu).
- "suggestion": Gợi ý cách giải quyết (ngắn gọn, thiết thực).`;

  const systemPrompt = "Bạn là trợ lý AI của Hệ thống quản lý phản ánh Hội Nông Dân. Chỉ trả về JSON hợp lệ.";

  try {
    let responseText = "";

    if (isOllamaAvailable()) {
      // Use Ollama
      responseText = await askOllama(prompt, systemPrompt);
    } else {
      // Use Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const fullPrompt = `${systemPrompt}\n${prompt}`;
      const result = await model.generateContent(fullPrompt);
      responseText = result.response.text();
    }

    // Clean up markdown syntax and extract JSON block robustly
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      responseText = responseText.substring(jsonStart, jsonEnd + 1);
    }

    return JSON.parse(responseText);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      category: "Khác",
      priority: "Thấp",
      summary: `Phân tích thất bại: ${error.message}`,
      suggestion: "Cần cán bộ kiểm tra thủ công."
    };
  }
}

async function chatWithAI(message, context) {
  if (!isAvailable()) {
    return { reply: "Xin lỗi, AI chưa được cấu hình. Vui lòng thêm OLLAMA_API_URL hoặc GEMINI_API_KEY." };
  }

  const prompt = `Đây là dữ liệu ngữ cảnh hiện tại của hệ thống: ${JSON.stringify(context)}. 
Câu hỏi của người dùng: "${message}". 
Hãy trả lời ngắn gọn, súc tích và thân thiện. Trả về dưới định dạng JSON: { "reply": "nội dung trả lời" }`;

  const systemPrompt = "Bạn là trợ lý ảo (Chatbot) của Hệ thống quản lý phản ánh Hội Nông Dân phường. Chỉ trả về JSON chứa field 'reply'.";

  try {
    let responseText = "";

    if (isOllamaAvailable()) {
      // Use Ollama
      responseText = await askOllama(prompt, systemPrompt);
    } else {
      // Use Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const fullPrompt = `${systemPrompt}\n${prompt}`;
      const result = await model.generateContent(fullPrompt);
      responseText = result.response.text();
    }

    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(responseText);

  } catch (error) {
    console.error("AI Chat Error:", error);
    return { reply: `Lỗi hệ thống AI: ${error.message}` };
  }
}

module.exports = {
  isAvailable,
  analyzePetition,
  chatWithAI,
};
