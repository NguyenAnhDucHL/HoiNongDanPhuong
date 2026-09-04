# HND Node.js Convention

AI Agent bắt buộc phải tuân thủ nghiêm ngặt các quy tắc lập trình sau khi code Node.js tại backend:

## 1. Asynchronous Programming
- **BẮT BUỘC** sử dụng `async/await`.
- **CẤM** sử dụng Promise chains `.then().catch()` hoặc callback hell.
- Khi gọi nhiều hàm async độc lập, sử dụng `Promise.all()` để tối ưu hiệu năng.

## 2. Naming Conventions
- Biến (Variables) và Hàm (Functions): `camelCase` (ví dụ: `getUserInfo`).
- Class, Models: `PascalCase` (ví dụ: `PetitionModel`).
- Hằng số (Constants): `UPPER_SNAKE_CASE` (ví dụ: `MAX_UPLOAD_SIZE`).

## 3. Error Handling
- Bắt lỗi bằng khối `try/catch` bên trong Controllers.
- Lỗi phải được đẩy về **Global Error Middleware** thông qua hàm `next(error)`.
- Không nuốt lỗi (swallow errors) kiểu `catch(e) { console.log(e); }` mà không có phản hồi cho client.

## 4. API Response Contract
Mọi Endpoint API đều phải trả về theo một chuẩn duy nhất, không ngoại lệ:
```javascript
{
  "success": true | false,
  "data": { ... } | null,
  "message": "Mô tả trạng thái (VD: Thành công, Không tìm thấy...)"
}
```

## 5. Security & Logs
- Tuyệt đối không dùng `console.log()` chứa dữ liệu nhạy cảm (password, tokens, PII).
- Không được trả lỗi nguyên thủy của Database (SQL syntax error) về cho Client. Bọc lại bằng câu thông báo thân thiện.

## 6. SQL Injection Prevention
- **TUYỆT ĐỐI CẤM** việc nối chuỗi trực tiếp dữ liệu đầu vào của người dùng vào câu lệnh SQL (Ví dụ: \`SELECT * FROM users WHERE id = \${id}\` hoặc \`"UPDATE table SET val = '" + val + "'"\`).
- **BẮT BUỘC** sử dụng **Parameterized Queries** (truy vấn tham số) với các dấu `?` (Ví dụ: \`db.run('INSERT INTO table (val) VALUES (?)', [val])\`).
- Việc nối chuỗi (String Concatenation) chỉ được phép sử dụng cho việc xây dựng Cấu trúc Câu lệnh (VD: ghép chuỗi \`" WHERE type = ? "\` nếu có filter), KHÔNG được phép ghép chuỗi giá trị biến.
