import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import PublicChatbot from '../ui/PublicChatbot';

const PublicLayout = ({ children }) => {
  const [tab, setTab] = useState('home');

  return (
    <div className="home-container">
      <style>{`
        @media (max-width: 900px) {
          .header-inner { flex-direction: row !important; padding: 10px 15px !important; }
          .brand { flex-direction: row !important; align-items: center !important; }
          .brand-top { gap: 5px !important; }
          .logo { width: 44px !important; height: 44px !important; }
          .brand h1 { font-size: 14px !important; }
          .brand .subtitle { display: none !important; }
          .actions { flex-direction: row !important; width: auto !important; margin: 0 !important; }
          .action { padding: 5px !important; min-width: auto !important; }
          .action-text { display: none !important; }
        }
      `}</style>
      {/* ====== HEADER ====== */}
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-top">
              <img src="/logo.png" alt="Hội Nông Dân" className="logo" />
              <h1>HỘI NÔNG DÂN <span className="badge-cp">CP</span></h1>
            </div>
            <div className="subtitle">Cổng tiếp nhận & xử lý phản ánh hội viên</div>
          </div>
          <div className="actions">
            <div className="action hotline" onClick={() => alert('Đường dây nóng:\n0363.789.100\n0838.911.445')} style={{ cursor: 'pointer' }}>
              <span className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
              <span className="action-text">&nbsp;ĐƯỜNG DÂY NÓNG<br />0363789100/0838911445</span>
            </div>
            <div className="action" onClick={() => window.location.href = '/admin/login'} style={{ cursor: 'pointer' }}>
              <span className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <span className="action-text">&nbsp;ĐĂNG NHẬP</span>
            </div>
          </div>
        </div>
      </header>

      {/* ====== NAVIGATION ====== */}
      <nav className="nav">
        <div className="container nav-inner">
          <a className={tab === 'home' ? 'active' : ''} href="#trang-chu" onClick={() => setTab('home')}>⌂ &nbsp; TRANG CHỦ</a>
          <a className={tab === 'intro' ? 'active' : ''} href="#gioi-thieu" onClick={() => setTab('intro')}>GIỚI THIỆU</a>
          <a className={tab === 'submit' ? 'active' : ''} href="#gui-phan-anh" onClick={() => setTab('submit')}>GỬI PHẢN ÁNH, KIẾN NGHỊ</a>
          <a className={tab === 'search' ? 'active' : ''} href="#tra-cuu" onClick={() => setTab('search')}>TRA CỨU KẾT QUẢ</a>
          <a className={tab === 'guide' ? 'active' : ''} href="#huong-dan" onClick={() => setTab('guide')}>HƯỚNG DẪN</a>
          <a className={tab === 'stats' ? 'active' : ''} href="#thong-ke" onClick={() => setTab('stats')}>THỐNG KÊ</a>
          <a className={tab === 'news' ? 'active' : ''} href="#tin-tuc" onClick={() => setTab('news')}>TIN TỨC</a>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main>
        {children}
      </main>

      {/* ====== FOOTER ====== */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-title">HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ</div>
              <p>Cổng tiếp nhận, xử lý phản ánh, kiến nghị của hội viên.</p>
              <p>Địa chỉ: 376, Đường Trần Phú, Phường Cẩm Phả, Tỉnh Quảng Ninh</p>
            </div>
            <div>
              <div className="footer-title">HỖ TRỢ & LIÊN HỆ</div>
              <p>☎ 0363789100/0838911445</p>
              <p>✉ hoinongdanphuongcampha@gmail.com</p>
            </div>
            <div>
              <div className="footer-title">THỜI GIAN LÀM VIỆC</div>
              <p>Sáng: 7h30 – 11h30</p>
              <p>Chiều: 13h30 – 17h00</p>
              <p>Thứ 2 đến Thứ 6</p>
            </div>
          </div>
          <div className="footer-bottom">© 2026 HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ. Bản quyền thuộc về UBND phường Cẩm Phả</div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <PublicChatbot />
    </div>
  );
};

export default PublicLayout;
