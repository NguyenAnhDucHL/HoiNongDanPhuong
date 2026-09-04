---
name: hnd-workflow-git-push
description: "Quy trình chuẩn để AI tự động commit và push code lên repository để kích hoạt tự động deploy."
---

# HND-WORKFLOW-GIT-PUSH

Quy trình này là đường commit chuẩn bắt buộc cho mọi thao tác của AI Agent trong dự án Hội Nông Dân Phường.

## Bước 1 — Kiểm tra thay đổi
Đảm bảo tất cả các file cần thiết đã được lưu lại và loại trừ các thư mục không cần thiết (như `frontend/dist`) bằng `.gitignore`.

## Bước 2 — Đặt Tên Commit (Conventional Commits)
AI phải sử dụng định dạng Conventional Commits để đặt tên cho mọi thao tác git.
- `feat(scope):` Thêm tính năng mới (vd: `feat(ai): tích hợp gemini`).
- `fix(scope):` Sửa lỗi (vd: `fix(ui): sửa CSS bị lệch trên mobile`).
- `refactor(scope):` Cấu trúc lại code (vd: `refactor(frontend): chia component react`).
- `docs(scope):` Thay đổi tài liệu, rules, agent constitution.

## Bước 3 — Stage và Commit
```bash
git add .
git commit -m "feat(scope): mô tả chi tiết công việc"
```

## Bước 4 — Push và Chờ Deploy
Mọi thay đổi cục bộ không có tác dụng trên server VNPT thật cho đến khi thực thi lệnh push:
```bash
git push origin main
```
Sau khi push, báo cáo cho người dùng biết rằng Github Actions đang chạy và quá trình deploy lên VNPT sẽ mất vài phút.
