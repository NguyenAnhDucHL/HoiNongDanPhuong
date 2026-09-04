# HND Feature Development Workflow

Khi nhận được yêu cầu phát triển một tính năng mới (ví dụ: thêm API thống kê, thêm tính năng AI), AI Agent PHẢI thực hiện tuần tự qua 5 bước sau, không được nhảy cóc:

1. **Phân tích (Analysis):** 
   - Xác định file nào bị ảnh hưởng.
   - Kiểm tra kỹ xem DB đã có table/column cần thiết chưa.

2. **Cập nhật Model/DB (Database Layer):**
   - Nếu cần thêm cột/bảng, tạo migration script (nếu có) hoặc báo cáo Developer.
   - Tuyệt đối không xóa dữ liệu đang có.

3. **Viết Logic (Service Layer):**
   - Đặt mọi logic nghiệp vụ, tính toán phức tạp vào `backend/services/`.

4. **Tích hợp API (Controller & Route Layer):**
   - Viết controller gọi Service và trả về Response theo chuẩn `hnd-rule-nodejs-convention.md`.
   - Bọc route vào Middleware xác thực (nếu cần).

5. **Tích hợp Frontend (UI Layer):**
   - Gọi API qua Fetch/Axios.
   - Hiển thị UI theo chuẩn `bulletproof-react`.
   - Giữ nguyên cấu trúc CSS cũ.
