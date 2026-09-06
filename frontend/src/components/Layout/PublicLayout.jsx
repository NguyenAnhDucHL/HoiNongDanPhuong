import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import PublicChatbot from '../ui/PublicChatbot';

const PublicLayout = ({ children }) => {
  const [tab, setTab] = useState('home');
  const location = useLocation();
  const isAdminLoggedIn = !!localStorage.getItem('hnd_admin_token');

  return (
    <div className="home-container">

      {/* ====== HEADER ====== */}
      <header className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #079323 0%, #0b7d20 65%, #075f19 100%)' }}>
        {/* Background circle decoration */}
        <div className="absolute rounded-full" style={{ width: '520px', height: '330px', background: 'rgba(184, 227, 106, 0.1)', right: '-130px', top: '-110px' }}></div>

        <div className="container mx-auto px-4 md:px-0 flex flex-row items-center justify-between min-h-[80px] md:min-h-[154px] py-4 md:py-0 relative z-10 gap-2 md:gap-0">

          <div className="flex flex-row items-center gap-2 md:gap-[15px]">
            <img src="/logo.png" alt="Hội Nông Dân" className="w-[44px] h-[44px] md:w-[94px] md:h-[94px] flex-shrink-0" />
            <div className="flex flex-col justify-center gap-1 md:gap-[4px]">
              <h1 className="text-[14px] md:text-[34px] font-extrabold m-0 text-left uppercase leading-tight md:leading-[1.1] tracking-wide" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.18)' }}>HỘI NÔNG DÂN CẨM PHẢ</h1>
              <div className="text-[10px] md:text-[18px] text-left opacity-90 leading-tight md:leading-[1.25] font-semibold whitespace-normal md:whitespace-nowrap">Cổng tiếp nhận & xử lý phản ánh hội viên</div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 md:gap-[15px] flex-shrink-0">
            <a
              href="tel:0363789100"
              className="flex items-center p-2 md:py-[10px] md:px-[22px] border border-white/40 md:border-white/20 rounded-lg md:rounded-[12px] bg-white/5 md:bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
            >
              <span className="flex-shrink-0">
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
              <span className="hidden md:block ml-[9px] text-[13px] font-bold leading-[1.3] text-left">ĐƯỜNG DÂY NÓNG<br />0363789100/0838911445</span>
            </a>
            <button
              className="flex items-center p-2 md:py-[10px] md:px-[35px] border border-white/40 md:border-white/20 rounded-lg md:rounded-[12px] bg-white/5 md:bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
              onClick={() => window.location.href = isAdminLoggedIn ? '/admin' : '/admin/login'}
              aria-label={isAdminLoggedIn ? 'Đi tới trang quản trị' : 'Đăng nhập trang quản trị'}
            >
              <span className="flex-shrink-0">
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <span className="hidden md:block ml-[9px] text-[14px] font-bold tracking-wider">{isAdminLoggedIn ? 'TRANG QUẢN TRỊ' : 'ĐĂNG NHẬP'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ====== NAVIGATION ====== */}
      <nav className="bg-white border-b border-[#dbe7de] shadow-[0_3px_10px_rgba(0,0,0,0.06)] sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-start md:justify-center overflow-x-auto whitespace-nowrap hide-scrollbar">
          {[
            { id: 'home', hash: '#trang-chu', label: '⌂  TRANG CHỦ' },
            { id: 'intro', hash: '#gioi-thieu', label: 'GIỚI THIỆU' },
            { id: 'submit', hash: '#gui-phan-anh', label: 'GỬI PHẢN ÁNH, KIẾN NGHỊ' },
            { id: 'search', hash: '#tra-cuu', label: 'TRA CỨU KẾT QUẢ' },
            { id: 'guide', hash: '#huong-dan', label: 'HƯỚNG DẪN' },
            { id: 'stats', hash: '#thong-ke', label: 'THỐNG KÊ' },
            { id: 'news', hash: '#tin-tuc', label: 'TIN TỨC' }
          ].map((item) => (
            <a
              key={item.id}
              className={`px-4 md:px-[19px] py-4 font-semibold text-[#18301e] border-b-4 hover:text-[#149b2f] hover:border-[#149b2f] transition-colors ${tab === item.id ? 'border-[#149b2f] text-[#149b2f]' : 'border-transparent'}`}
              href={location.pathname === '/' ? item.hash : '/' + item.hash}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main>
        {children}
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="mt-[40px] text-white py-[30px] pb-[16px]" style={{ background: 'linear-gradient(135deg, #0a8c24, #075f19)' }}>
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-[28px]">
            <div>
              <div className="font-extrabold text-[16px] mb-[14px] flex items-center gap-[8px]">HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ</div>
              <p className="my-[5px] text-[#e8f7ea] text-[14px]">Cổng tiếp nhận, xử lý phản ánh, kiến nghị của hội viên.</p>
              <p className="my-[5px] text-[#e8f7ea] text-[14px]">Địa chỉ: 376, Đường Trần Phú, Phường Cẩm Phả, Tỉnh Quảng Ninh</p>
            </div>
            <div>
              <div className="font-extrabold text-[16px] mb-[14px] flex items-center gap-[8px]">HỖ TRỢ & LIÊN HỆ</div>
              <p className="my-[5px] text-[#e8f7ea] text-[14px]">☎ 0363789100/0838911445</p>
              <p className="my-[5px] text-[#e8f7ea] text-[14px]">✉ hoinongdanphuongcampha@gmail.com</p>
            </div>
            <div>
              <div className="font-extrabold text-[16px] mb-[14px] flex items-center gap-[8px]">THỜI GIAN LÀM VIỆC</div>
              <p className="my-[5px] text-[#e8f7ea] text-[14px]">Sáng: 7h30 – 11h30</p>
              <p className="my-[5px] text-[#e8f7ea] text-[14px]">Chiều: 13h30 – 17h00</p>
              <p className="my-[5px] text-[#e8f7ea] text-[14px]">Thứ 2 đến Thứ 6</p>
            </div>
          </div>
          <div className="mt-[22px] pt-[12px] text-center text-[13px] text-[#d7efd9] border-t border-white/20 leading-[1.5]">
            <span>© 2026 HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <PublicChatbot />
    </div>
  );
};

export default PublicLayout;
