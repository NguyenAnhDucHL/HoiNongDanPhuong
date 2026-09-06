import React from 'react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
  { id: 'petitions', label: 'Danh sách phản ánh', icon: '📋' },
  { id: 'categories', label: 'Lĩnh vực', icon: '📑' },
  { id: 'wards', label: 'Khu phố', icon: '🏘️' },
  { id: 'news', label: 'Tin tức', icon: '📰' },
  { id: 'guides', label: 'Hướng dẫn', icon: '📖' },
  { id: 'settings', label: 'Cài đặt hệ thống', icon: '⚙️' },
  { id: 'account', label: 'Tài khoản', icon: '👤' },
];

export default function AdminSidebar({ currentTab, onTabChange, isOpen, onClose }) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[95] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`} 
        onClick={onClose}
      ></div>
      
      <div className={`w-[260px] bg-[#1a3622] text-white flex flex-col transition-all duration-300 z-[100] shadow-[2px_0_10px_rgba(0,0,0,0.1)] fixed md:relative top-0 h-screen md:h-auto shrink-0 ${isOpen ? 'left-0' : '-left-[260px] md:left-0'}`}>
        
        <div className="h-[64px] flex items-center px-[20px] bg-black/15 border-b border-white/5 shrink-0 relative">
          <img src="/logo.png" alt="Logo" className="w-[36px] h-[36px] mr-[12px]" />
          <h2 className="text-[15px] font-bold m-0 text-white leading-[1.2]">Hội Nông Dân Cẩm Phả</h2>
          <button 
            className="md:hidden absolute right-[12px] top-1/2 -translate-y-1/2 text-white/70 bg-transparent border-none text-[20px] cursor-pointer p-2 hover:text-white" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[12px] py-[24px] flex flex-col gap-[6px]">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`flex items-center px-[16px] py-[12px] rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer border-none w-full text-left ${
                currentTab === item.id 
                  ? 'bg-[#0a8c24] text-white shadow-[0_4px_6px_rgba(10,140,36,0.2)]' 
                  : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="mr-[12px] text-[18px] w-[24px] text-center">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-[20px] text-[12px] text-white/40 text-center shrink-0">
          v1.0.0 &copy; 2026
        </div>
      </div>
    </>
  );
}
