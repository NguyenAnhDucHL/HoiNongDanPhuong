---
name: hnd-skill-ai-integration
description: Hướng dẫn kỹ thuật và format chuẩn khi dùng Google Gemini AI trong dự án HND.
---

# Kỹ Năng Tích Hợp Gemini AI

Dự án sử dụng gói `@google/generative-ai` để phân tích nội dung phản ánh.

## 1. Nguyên Tắc Gọi API
- Luôn sử dụng Model `gemini-1.5-flash` (nhanh, rẻ, đủ dùng cho Text).
- Prompt phải ép buộc AI (LLM) trả về **định dạng JSON thô**, cấm trả markdown (```json ... ```).

## 2. Error Handling Bắt Buộc
API Gemini có thể bị lỗi do Rate Limit (429) hoặc Token Hết Hạn. Bạn phải bắt try/catch và trả về kết quả dự phòng (fallback) để luồng chính của hệ thống HND không bị đứng.

## 3. Template AI Service
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function analyzeText(text) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Phân tích: ${text}. Trả về ĐÚNG 1 JSON object { "category": "x", "priority": "y" } không chứa code block.`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("AI Error:", error);
        return { category: "Khác", priority: "Thấp" }; // Fallback an toàn
    }
}
```
