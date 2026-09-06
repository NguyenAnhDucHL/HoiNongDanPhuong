import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import PublicChatbot from '../ui/PublicChatbot';

const PublicLayout = ({ children }) => {
  const [tab, setTab] = useState('home');

  return (
    <div className="home-container">
      <style>{`
      {/* ====== HEADER ====== */}
      <header className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #079323 0%, #0b7d20 65%, #075f19 100%)' }}>
        {/* Background circle decoration */}
        <div className="absolute rounded-full" style={{ width: '520px', height: '330px', background: 'rgba(184, 227, 106, 0.1)', right: '-130px', top: '-110px' }}></div>
        
        <div className="container mx-auto px-4 md:px-0 flex flex-col md:flex-row items-center justify-between min-h-[80px] md:min-h-[154px] py-4 md:py-0 relative z-10 gap-4 md:gap-0">
          
          <div className="flex flex-row items-center gap-2 md:gap-[15px]">
            <img src="/logo.png" alt="Hội Nông Dân" className="w-[44px] h-[44px] md:w-[94px] md:h-[94px] flex-shrink-0" />
            <div className="flex flex-col justify-center gap-1 md:gap-[4px]">
              <h1 className="text-[14px] md:text-[34px] font-extrabold m-0 text-left uppercase leading-tight md:leading-[1.1] tracking-wide" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.18)' }}>HỘI NÔNG DÂN CẨM PHẢ</h1>
              <div className="text-[10px] md:text-[18px] text-left opacity-90 leading-tight md:leading-[1.25] font-semibold whitespace-normal md:whitespace-nowrap">Cổng tiếp nhận & xử lý phản ánh hội viên</div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 md:gap-[15px] flex-shrink-0">
            <div 
              className="flex items-center p-2 md:py-[10px] md:px-[22px] border border-white/40 md:border-white/20 rounded-lg md:rounded-[12px] bg-white/5 md:bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
              onClick={() => alert('Đường dây nóng:\n0363.789.100\n0838.911.445')}
            >
              <span className="flex-shrink-0">
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
              <span className="hidden md:block ml-[9px] text-[13px] font-bold leading-[1.3] text-left">ĐƯỜNG DÂY NÓNG<br />0363789100/0838911445</span>
            </div>
            <div 
              className="flex items-center p-2 md:py-[10px] md:px-[35px] border border-white/40 md:border-white/20 rounded-lg md:rounded-[12px] bg-white/5 md:bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
              onClick={() => window.location.href = '/admin/login'}
            >
              <span className="flex-shrink-0">
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <span className="hidden md:block ml-[9px] text-[14px] font-bold tracking-wider">ĐĂNG NHẬP</span>
            </div>
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
              href={item.hash} 
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
          <div className="footer-bottom" style={{ lineHeight: '1.5' }}>
            <span>© 2026 HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ.</span>
            <br />
            <span>Bản quyền thuộc về UBND phường Cẩm Phả</span>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <PublicChatbot />
    </div>
  );
};

export default PublicLayout;
