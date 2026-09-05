import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import PublicChatbot from '../ui/PublicChatbot';

const PublicLayout = ({ children }) => {
  const [tab, setTab] = useState('home');

  return (
    <div className="home-container">
      {/* ====== HEADER ====== */}
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <img src="/logo.png" alt="Hội Nông Dân" className="logo" />
            <div>
              <h1>HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ</h1>
              <div className="subtitle">CỔNG TIẾP NHẬN, XỬ LÝ PHẢN ÁNH, KIẾN NGHỊ<br />CỦA HỘI VIÊN</div>
            </div>
          </div>
          <div className="actions">
            <div className="action" onClick={() => window.location.href = '/admin/login'} style={{ cursor: 'pointer' }}>👤 &nbsp;ĐĂNG NHẬP</div>
            <div className="action hotline">☎ &nbsp;ĐƯỜNG DÂY NÓNG<br />0363789100/0838911445</div>
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
