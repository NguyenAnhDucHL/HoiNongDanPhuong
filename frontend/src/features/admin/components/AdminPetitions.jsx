import React from 'react';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';

export default function AdminPetitions({
  petitions,
  total,
  page,
  totalPages,
  setPage,
  loadingList,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  searchInput,
  setSearchInput,
  setSearch,
  statusOptions,
  categories,
  onOpenDetail,
}) {

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

  return (
    <div className="admin-content">
      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-filter-input"
          placeholder="🔍 Tìm kiếm theo tên, tiêu đề, mã, SĐT..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
        />
        <select
          className="admin-filter-select"
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
        >
          {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          className="admin-filter-select"
          value={filterCategory}
          onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
        >
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Tất cả lĩnh vực' : c}</option>)}
        </select>
        <button
          className="btn btn-primary btn-sm"
          style={{ padding: '8px 16px', borderRadius: '6px' }}
          onClick={() => { setSearch(searchInput); setPage(1); }}
        >
          Tìm kiếm
        </button>
        <button
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px 16px', borderRadius: '6px' }}
          onClick={() => {
            setSearchInput(''); setSearch('');
            setFilterStatus('all'); setFilterCategory('all'); setPage(1);
          }}
        >
          Xóa lọc
        </button>
      </div>

      <div style={{ marginBottom: '16px', color: 'var(--admin-text-muted)', fontSize: '14px', fontWeight: 500 }}>
        Tổng cộng: <strong style={{ color: 'var(--admin-text)' }}>{total}</strong> phản ánh, kiến nghị
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loadingList ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <div>Đang tải dữ liệu...</div>
          </div>
        ) : petitions.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.5 }}>📭</span>
            <h3 style={{ color: 'var(--admin-text-muted)', fontWeight: 500 }}>Không tìm thấy phản ánh nào</h3>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã tra cứu</th>
                <th>Người gửi</th>
                <th>Khu phố</th>
                <th>Tiêu đề</th>
                <th>Lĩnh vực</th>
                <th>Trạng thái</th>
                <th>Phân tích AI</th>
                <th>Ngày gửi</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {petitions.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--admin-primary)' }}>
                    {p.trackingCode}
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.fullName}</td>
                  <td>{p.ward || '-'}</td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.title}>
                    {p.title}
                  </td>
                  <td>{p.category}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    {p.aiPriority ? (
                      <PriorityBadge priority={p.aiPriority} />
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)', fontSize: '12px' }}>-</span>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {formatDate(p.createdAt)}
                  </td>
                  <td>
                    <button
                      onClick={() => onOpenDetail(p.id)}
                      style={{
                        background: '#f1f5f9', color: '#0f172a', border: 'none',
                        padding: '6px 12px', borderRadius: '6px', fontSize: '13px',
                        fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                      onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--admin-border)',
              background: page === 1 ? '#f8fafc' : '#fff', color: page === 1 ? '#cbd5e1' : 'var(--admin-text)',
              cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 500
            }}
          >
            ← Trước
          </button>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--admin-text-muted)' }}>
            Trang {page} / {totalPages}
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--admin-border)',
              background: page === totalPages ? '#f8fafc' : '#fff', color: page === totalPages ? '#cbd5e1' : 'var(--admin-text)',
              cursor: page === totalPages ? 'not-allowed' : 'pointer', fontWeight: 500
            }}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
