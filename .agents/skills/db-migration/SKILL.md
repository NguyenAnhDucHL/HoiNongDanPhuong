---
name: hnd-skill-db-migration
description: Hướng dẫn an toàn khi AI cần thay đổi cấu trúc Database (thêm cột, sửa bảng) trong SQLite. Đọc kỹ trước khi đụng vào DB.
---

# Kỹ năng Migrate Database (SQLite)

Hệ thống dùng **SQLite3** thuần túy không có công cụ Migration (như Prisma, Sequelize). AI phải thực hiện thao tác thủ công và cực kỳ cẩn thận.

## 1. Nguyên Tắc Sống Còn
- **TUYỆT ĐỐI** không được tự ý xóa dữ liệu thật của người dân.
- Khi sử dụng câu lệnh `CREATE TABLE IF NOT EXISTS`, SQLite sẽ **BỎ QUA** nếu bảng đã tồn tại, dẫn đến việc các cột mới khai báo trong schema sẽ **KHÔNG** được thêm vào bảng thực tế gây lỗi `500`.

## 2. Quy trình thêm cột (ALTER TABLE)
1. Xác định bảng cần thêm.
2. Sao lưu database trước: `cp backend/data/database.sqlite backend/data/database.sqlite.bak`.
3. Viết script SQL `ALTER TABLE <table_name> ADD COLUMN <column_name> <type> DEFAULT <value>;`.
4. Viết script JavaScript nhỏ trong thư mục `backend/` để chạy lệnh SQL đó.
5. Kiểm tra kỹ càng.

## 3. Template code
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

db.run(`ALTER TABLE petitions ADD COLUMN ai_summary TEXT DEFAULT ''`, (err) => {
    if (err) console.error("Lỗi:", err.message);
    else console.log("Thêm cột thành công!");
});
```
