---
name: hnd-skill-docker-deploy
description: Hướng dẫn các thao tác chuẩn khi làm việc với hệ thống Docker trên VNPT server.
---

# Kỹ năng Quản trị Docker & Server VNPT

Hệ thống HND được triển khai trên máy chủ VNPT. Các ứng dụng chia sẻ chung 1 Nginx Proxy.

## 1. Rule số 1: Tránh chết chùm
- **CẤM** sử dụng lệnh `docker compose down` hoặc `docker network rm`. Nó sẽ làm sập con Nginx Proxy khiến toàn bộ các dự án khác trên máy chủ VNPT bị ngắt kết nối.
- Chỉ sử dụng: `docker compose up -d --build hnd-backend` hoặc tương tự để restart một service cụ thể.

## 2. Cách Build Frontend
Frontend không chạy node trên server mà được Nginx phục vụ tĩnh.
Quy trình:
1. `cd frontend`
2. `npm run build`
3. Thư mục `dist` sẽ được sinh ra. Nginx sẽ trỏ thẳng vào thư mục này để phục vụ nội dung.

## 3. Cập Nhật Môi Trường
- Mọi chỉnh sửa về Port hoặc Domain phải được cấu hình trong `hoinongdan.conf`.
- Bất cứ thay đổi nào ở `hoinongdan.conf` phải yêu cầu Developer kiểm tra trước khi reload Nginx.
