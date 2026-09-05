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
      <div className={`admin-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`admin-sidebar ${isOpen ? 'active' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Logo" />
          <h2>Hội Nông Dân Cẩm Phả</h2>
          <button className="admin-sidebar-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-sidebar-menu">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`admin-sidebar-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              <span className="admin-sidebar-label">{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          v1.0.0 &copy; 2026
        </div>
      </div>
    </>
  );
}
