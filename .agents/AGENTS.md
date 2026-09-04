# HỘI NÔNG DÂN PHƯỜNG — AGENT CONSTITUTION (AGENTS.md)

Bạn là **AI Agent** đang làm việc trong dự án **Hội Nông Dân Phường Cẩm Phả** — Cổng tiếp nhận và xử lý phản ánh, kiến nghị. Nhiệm vụ của bạn là thực thi các yêu cầu của Developer, tuân thủ nghiêm ngặt kiến trúc và các quy tắc dưới đây. Đọc tài liệu này **TRƯỚC KHI** thực hiện bất kỳ thay đổi nào.

---

## I. Nguyên Tắc Cốt Lõi (Core Principles)

1. **Architecture-Integrity (Frontend):** 
   - Bắt buộc tuân thủ cấu trúc **bulletproof-react**.
   - Tuyệt đối KHÔNG viết code Monolith (gom cục vào 1 file). Mọi UI phải được chia nhỏ thành `Layout`, `Features`, `Components`.
   - **UI Fidelity:** CSS và HTML phải giống 100% so với thiết kế gốc. Không tự ý thay đổi màu sắc, bố cục, khoảng cách.
2. **Architecture-Integrity (Backend):**
   - Tuân thủ mô hình **Route → Controller → Service**.
   - Logic nghiệp vụ (như gọi AI, xử lý logic phức tạp) phải đặt ở tầng `Service` (`/backend/services/`).
3. **Data Protection:** Không bao giờ dùng lệnh xóa (drop table, delete data) trên database nếu không có sự cho phép rõ ràng.
4. **Zero-Secret:** Tuyệt đối không commit API key (Gemini, v.v.), password, connection string vào Git. Bắt buộc dùng file `.env`.
5. **No-Guessing:** Khi gặp lỗi hoặc requirements không rõ ràng, **hỏi lại Developer** thay vì tự ý giả định và đập đi xây lại.
6. **PRODUCTION-SAFETY:** 
   - Mã nguồn được triển khai thông qua Github Actions. Mọi thay đổi cấu hình liên quan đến Docker hoặc Nginx (`hoinongdan.conf`) phải cực kỳ cẩn thận.
   - Thư mục `frontend/dist/` không được đưa lên Git.

---

## II. Stack Công Nghệ (Tech Stack — Bắt buộc tuân thủ)

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| **Backend** | Node.js, Express 5 | Middleware phân tầng rõ ràng |
| **Database** | SQLite3 | Truy vấn an toàn, không query injection |
| **Frontend** | React 18 + Vite | Vanilla CSS, không dùng thư viện component ngoài nếu không được phép |
| **Security** | Helmet, HPP, express-rate-limit, bcrypt | Bảo vệ API, chống bruteforce |
| **AI Integration**| Google Generative AI (Gemini) | Dùng `@google/generative-ai` trong `aiService.js` |
| **Deployment** | Docker, Nginx, Github Actions | Deploy tự động lên server VNPT |

---

## III. Cấu trúc Thư mục Trọng yếu

```
HoiNongDanPhuong/
├── .agents/                      ← [PROTECTED] Quy tắc AI
│   └── AGENTS.md                 ← File này
├── backend/
│   ├── config/                   ← Cấu hình database, env, upload
│   ├── controllers/              ← Nhận request, trả response
│   ├── routes/                   ← Định tuyến API
│   └── services/                 ← Chứa logic chính (aiService.js, petitionService.js)
├── frontend/
│   └── src/
│       ├── assets/styles/        ← CSS tĩnh nguyên bản (home.css)
│       ├── components/Layout/    ← PublicLayout
│       ├── features/             ← Các module chức năng (misc, petitions)
│       └── pages/                ← Lắp ráp các component thành trang
└── hoinongdan.conf               ← Cấu hình Nginx Proxy (Vùng cảnh báo)
```

---

## IV. Ma trận Quyền Hạn (Governance Matrix)

### ✅ Vùng Tự do (Có thể sửa đổi tự do)
- `frontend/src/features/` và `frontend/src/pages/`
- `backend/controllers/` và `backend/services/`
- `backend/routes/`

### ⚠️ Vùng Tinh chỉnh (Cẩn thận khi sửa — Báo cáo rõ ràng)
- `backend/config/` (Sửa config Database, Multer)
- `frontend/package.json` và `backend/package.json` (Thêm thư viện)
- `hoinongdan.conf` (Nginx)

### 🚫 Vùng Cấm (Không được tự ý sửa)
- Xóa data trong SQLite.
- Sửa đổi cấu trúc `.agents/AGENTS.md` trừ khi có lệnh trực tiếp.

---

## V. Decision Ladder

| Tình huống | Hành động |
|---|---|
| Refactor React components | Tuân theo chuẩn bulletproof-react, tách file, không phá CSS |
| Thêm thư viện mới | Giải thích lý do và hỏi Developer trước khi `npm install` |
| Sửa lỗi UI | Đối chiếu với file HTML gốc, KHÔNG dùng inline-style tràn lan |
| Commit code | Dùng lệnh `git add` & `git commit` rõ ràng, sau đó `git push` để trigger deploy |

**Status:** ACTIVE — HỘI NÔNG DÂN PHƯỜNG PROJECT RULES
**See also:** [hnd-rule-nodejs-convention.md](rules/hnd-rule-nodejs-convention.md) | [hnd-rule-ai-behavior.md](rules/hnd-rule-ai-behavior.md) | [feature-development.md](workflows/feature-development.md) | [git-push.md](workflows/git-push.md)
