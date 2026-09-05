import React from 'react';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';

export default function AdminOverview({ stats, onNavigateToPetitions, onOpenDetail }) {
  if (!stats) return null;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <div className="admin-content">
      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-icon">📋</div>
          <div className="admin-stat-value">{stats.overview?.total || 0}</div>
          <div className="admin-stat-label">Tổng phản ánh</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-icon">⏳</div>
          <div className="admin-stat-value">{stats.overview?.pending || 0}</div>
          <div className="admin-stat-label">Chờ xử lý</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-icon">🔄</div>
          <div className="admin-stat-value">{stats.overview?.processing || 0}</div>
          <div className="admin-stat-label">Đang xử lý</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-value">{stats.overview?.resolved || 0}</div>
          <div className="admin-stat-label">Đã giải quyết</div>
        </div>
        <div className="admin-stat-card danger">
          <div className="admin-stat-icon">❌</div>
          <div className="admin-stat-value">{stats.overview?.rejected || 0}</div>
          <div className="admin-stat-label">Từ chối</div>
        </div>
        <div className="admin-stat-card danger">
          <div className="admin-stat-icon">🔴</div>
          <div className="admin-stat-value">{stats.overview?.highPriority || 0}</div>
          <div className="admin-stat-label">Ưu tiên cao</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📅</div>
          <div className="admin-stat-value">{stats.overview?.today || 0}</div>
          <div className="admin-stat-label">Nhận hôm nay</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* By Category */}
        <div className="admin-card">
          <h3 className="admin-card-title">🏷️ Phân loại theo lĩnh vực</h3>
          <div style={{ marginTop: '20px' }}>
            {(stats.byCategory || []).map(c => (
              <div key={c.category} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--admin-border)', fontSize: '14px',
              }}>
                <span style={{ fontWeight: 500 }}>{c.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    height: '8px', borderRadius: '999px', background: 'var(--admin-primary)',
                    width: `${Math.min(100, (c.count / (stats.overview?.total || 1)) * 180)}px`,
                    opacity: 0.8,
                  }} />
                  <strong style={{ minWidth: '24px', textAlign: 'right' }}>{c.count}</strong>
                </div>
              </div>
            ))}
            {(!stats.byCategory || stats.byCategory.length === 0) && (
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                Chưa có dữ liệu
              </p>
            )}
          </div>
        </div>

        {/* Recent */}
        <div className="admin-card">
          <h3 className="admin-card-title">
            <span style={{ flex: 1 }}>🕐 Phản ánh mới nhất</span>
            <button 
              onClick={onNavigateToPetitions}
              style={{ background: 'none', border: 'none', color: 'var(--admin-primary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              Xem tất cả →
            </button>
          </h3>
          <div style={{ marginTop: '10px' }}>
            {(stats.recentPetitions || []).map(p => (
              <div key={p.id} style={{
                display: 'flex', gap: '12px', padding: '14px 12px', borderBottom: '1px solid var(--admin-border)',
                cursor: 'pointer', transition: 'background 0.2s', borderRadius: '8px'
              }} 
              onClick={() => onOpenDetail(p.id)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--admin-text)' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                    {p.category} &bull; {formatDate(p.createdAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <StatusBadge status={p.status} />
                  {p.aiPriority && <PriorityBadge priority={p.aiPriority} />}
                </div>
              </div>
            ))}
            {(!stats.recentPetitions || stats.recentPetitions.length === 0) && (
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                Chưa có phản ánh nào
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
