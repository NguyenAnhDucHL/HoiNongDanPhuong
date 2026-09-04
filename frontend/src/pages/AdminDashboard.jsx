import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import AIAssistant from '../components/ui/AIAssistant';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: '⏳ Chờ xử lý' },
  { value: 'processing', label: '🔄 Đang xử lý' },
  { value: 'resolved', label: '✅ Đã giải quyết' },
  { value: 'rejected', label: '❌ Từ chối' },
];

const CATEGORIES = [
  'all', 'Trồng trọt', 'Chăn nuôi', 'Thủy sản',
  'Đất đai - Thủy lợi', 'Phân bón - Thuốc BVTV',
  'Vay vốn - Hỗ trợ', 'Thiên tai - Dịch bệnh', 'Khác',
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hnd_admin_info') || '{}'); } catch { return {}; }
  });

  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Detail modal
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const LIMIT = 20;

  const logout = () => {
    localStorage.removeItem('hnd_admin_token');
    localStorage.removeItem('hnd_admin_info');
    navigate('/admin/login');
  };

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetchApi('/admin/dashboard');
      setStats(res);
    } catch (e) {
      if (e.status === 401 || e.status === 403) logout();
    }
  }, []);

  const loadPetitions = useCallback(async () => {
    setLoadingList(true);
    try {
      const params = new URLSearchParams({
        page, limit: LIMIT,
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(search && { search }),
      });
      const res = await fetchApi(`/admin/petitions?${params}`);
      setPetitions(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      if (e.status === 401 || e.status === 403) logout();
    } finally {
      setLoadingList(false);
    }
  }, [page, filterStatus, filterCategory, search]);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (tab === 'petitions') loadPetitions();
  }, [tab, loadPetitions]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setAiResult(null);
    try {
      const p = await fetchApi(`/admin/petitions/${id}`);
      setSelectedPetition(p);
      setUpdateStatus(p.status);
      setAdminNotes(p.adminNotes || '');
    } catch (e) {
      alert('Không thể tải chi tiết.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPetition) return;
    setUpdating(true);
    try {
      await fetchApi(`/admin/petitions/${selectedPetition.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: updateStatus, adminNotes }),
      });
      setSelectedPetition(prev => ({ ...prev, status: updateStatus, adminNotes }));
      loadPetitions();
      alert('✅ Cập nhật thành công!');
    } catch (e) {
      alert('❌ Lỗi: ' + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!selectedPetition) return;
    setAnalyzingAI(true);
    setAiResult(null);
    try {
      const res = await fetchApi(`/ai/analyze/${selectedPetition.id}`, { method: 'POST' });
      setAiResult(res.analysis);
      setSelectedPetition(prev => ({
        ...prev,
        aiSummary: res.analysis.summary,
        aiPriority: res.analysis.priority,
        aiSuggestion: res.analysis.suggestion,
        aiCategory: res.analysis.category,
      }));
      loadPetitions();
    } catch (e) {
      alert('❌ AI lỗi: ' + e.message);
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleDeletePetition = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa phản ánh này?')) return;
    try {
      await fetchApi(`/admin/petitions/${id}`, { method: 'DELETE' });
      setSelectedPetition(null);
      loadPetitions();
    } catch (e) {
      alert('❌ Lỗi xóa: ' + e.message);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="admin-layout">
      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-topbar-brand">
          <img src="/logo.png" alt="Logo" className="dashboard-logo-img" />
          <span>HND Cẩm Phả - Quản trị</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 14, opacity: 0.85 }}>👤 {adminInfo.fullName || adminInfo.username}</span>
          <a href="/" style={{ color: '#d7efd9', fontSize: 13, opacity: 0.8 }}>← Trang chính</a>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            onClick={logout}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      <div className="admin-main">
        {/* Tabs */}
        <div className="admin-tabs">
          {[
            { id: 'dashboard', label: '📊 Tổng quan' },
            { id: 'petitions', label: '📋 Danh sách phản ánh' },
          ].map(t => (
            <button
              key={t.id}
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== DASHBOARD TAB ===== */}
        {tab === 'dashboard' && stats && (
          <div>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-card-number">{stats.overview?.total || 0}</div>
                <div className="stat-card-label">Tổng phản ánh</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-card-number">{stats.overview?.pending || 0}</div>
                <div className="stat-card-label">⏳ Chờ xử lý</div>
              </div>
              <div className="stat-card processing">
                <div className="stat-card-number">{stats.overview?.processing || 0}</div>
                <div className="stat-card-label">🔄 Đang xử lý</div>
              </div>
              <div className="stat-card resolved">
                <div className="stat-card-number">{stats.overview?.resolved || 0}</div>
                <div className="stat-card-label">✅ Đã giải quyết</div>
              </div>
              <div className="stat-card rejected">
                <div className="stat-card-number">{stats.overview?.rejected || 0}</div>
                <div className="stat-card-label">❌ Từ chối</div>
              </div>
              <div className="stat-card high-priority">
                <div className="stat-card-number">{stats.overview?.highPriority || 0}</div>
                <div className="stat-card-label">🔴 Ưu tiên cao</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-number">{stats.overview?.today || 0}</div>
                <div className="stat-card-label">📅 Hôm nay</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 8 }}>
              {/* By Category */}
              <div className="card">
                <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 14 }}>
                  🏷️ Phân loại theo lĩnh vực
                </h3>
                {(stats.byCategory || []).map(c => (
                  <div key={c.category} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid #f0f5f1', fontSize: 14,
                  }}>
                    <span>{c.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        height: 8, borderRadius: 999, background: 'var(--green)',
                        width: `${Math.min(100, (c.count / (stats.overview?.total || 1)) * 180)}px`,
                        opacity: 0.7,
                      }} />
                      <strong>{c.count}</strong>
                    </div>
                  </div>
                ))}
                {(!stats.byCategory || stats.byCategory.length === 0) && (
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>Chưa có dữ liệu</p>
                )}
              </div>

              {/* Recent */}
              <div className="card">
                <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 14 }}>
                  🕐 Phản ánh mới nhất
                </h3>
                {(stats.recentPetitions || []).map(p => (
                  <div key={p.id} style={{
                    display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f5f1',
                    cursor: 'pointer',
                  }} onClick={() => { setTab('petitions'); openDetail(p.id); }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {p.category} · {formatDate(p.createdAt)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      <StatusBadge status={p.status} />
                      {p.aiPriority && <PriorityBadge priority={p.aiPriority} />}
                    </div>
                  </div>
                ))}
                {(!stats.recentPetitions || stats.recentPetitions.length === 0) && (
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>Chưa có phản ánh nào</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== PETITIONS TAB ===== */}
        {tab === 'petitions' && (
          <div>
            {/* Filter Bar */}
            <div className="filter-bar">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên, tiêu đề, mã, SĐT..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              />
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'Tất cả lĩnh vực' : c}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => { setSearch(searchInput); setPage(1); }}>
                Tìm kiếm
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => {
                setSearchInput(''); setSearch('');
                setFilterStatus('all'); setFilterCategory('all'); setPage(1);
              }}>
                Xóa bộ lọc
              </button>
            </div>

            <div style={{ marginBottom: 14, color: 'var(--muted)', fontSize: 14 }}>
              Tổng: <strong>{total}</strong> phản ánh
            </div>

            {/* Table */}
            <div className="petition-table">
              {loadingList ? (
                <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
              ) : petitions.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <h3>Không có phản ánh nào</h3>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Mã tra cứu</th>
                      <th>Họ tên</th>
                      <th>Khu phố</th>
                      <th>Tiêu đề</th>
                      <th>Lĩnh vực</th>
                      <th>Trạng thái</th>
                      <th>AI</th>
                      <th>Ngày gửi</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petitions.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--green-dark)' }}>
                          {p.trackingCode}
                        </td>
                        <td style={{ fontWeight: 600 }}>{p.fullName}</td>
                        <td style={{ fontSize: 13 }}>{p.ward || '-'}</td>
                        <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </td>
                        <td style={{ fontSize: 13 }}>{p.category}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td>
                          {p.aiPriority ? (
                            <PriorityBadge priority={p.aiPriority} />
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Chưa phân tích</span>
                          )}
                        </td>
                        <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                          {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openDetail(p.id)}
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
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Trước</button>
                <div className="page-info">{page} / {totalPages}</div>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Sau →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {selectedPetition && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          z: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          zIndex: 200,
        }}>
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 720,
            maxHeight: '92vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--green-deep), var(--green-dark))',
              color: '#fff', padding: '18px 24px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px 20px 0 0',
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{selectedPetition.title}</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                  {selectedPetition.trackingCode} · {formatDate(selectedPetition.createdAt)}
                </div>
              </div>
              <button onClick={() => setSelectedPetition(null)} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                borderRadius: 8, padding: '6px 12px', fontSize: 20, cursor: 'pointer',
              }}>×</button>
            </div>

            <div style={{ padding: '24px' }}>
              {detailLoading ? (
                <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
              ) : (
                <>
                  {/* Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    {[
                      ['👤 Họ tên', selectedPetition.fullName],
                      ['📞 Điện thoại', selectedPetition.phone || '-'],
                      ['🪪 CCCD', selectedPetition.cccd || '-'],
                      ['📍 Khu phố', selectedPetition.ward || '-'],
                      ['🏠 Địa chỉ', selectedPetition.address || '-'],
                      ['🏷️ Lĩnh vực', selectedPetition.category],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 6 }}>📝 Nội dung phản ánh</div>
                    <div style={{ background: '#f8fbf9', borderRadius: 8, padding: 14, fontSize: 14, lineHeight: 1.7 }}>
                      {selectedPetition.content}
                    </div>
                  </div>

                  {/* Images */}
                  {selectedPetition.imagePaths && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>🖼️ Ảnh đính kèm</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {selectedPetition.imagePaths.split(',').filter(Boolean).map((img, i) => (
                          <a key={i} href={`/uploads/${img}`} target="_blank" rel="noreferrer">
                            <img
                              src={`/uploads/${img}`} alt={`Ảnh ${i + 1}`}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  <div className="ai-analysis-card">
                    <h4>🤖 Phân tích AI (Google Gemini)</h4>
                    {selectedPetition.aiSummary ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="ai-field">
                          <label>Tóm tắt</label>
                          <p>{selectedPetition.aiSummary}</p>
                        </div>
                        <div className="ai-field">
                          <label>Gợi ý hành động</label>
                          <p>{selectedPetition.aiSuggestion}</p>
                        </div>
                        <div className="ai-field">
                          <label>Mức độ ưu tiên</label>
                          <PriorityBadge priority={selectedPetition.aiPriority} />
                        </div>
                        <div className="ai-field">
                          <label>Lĩnh vực AI xác định</label>
                          <p>{selectedPetition.aiCategory}</p>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Chưa có phân tích AI.</p>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleAIAnalyze}
                      disabled={analyzingAI}
                      style={{ marginTop: 12 }}
                    >
                      {analyzingAI ? (
                        <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Đang phân tích...</>
                      ) : '🤖 Phân tích / Cập nhật AI'}
                    </button>
                  </div>

                  {/* Status Update */}
                  <div style={{ marginTop: 20, background: '#f8fbf9', padding: 18, borderRadius: 'var(--radius-sm)' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 14, color: 'var(--green-dark)', fontSize: 15 }}>
                      ⚙️ Cập nhật trạng thái xử lý
                    </h4>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                      {['pending', 'processing', 'resolved', 'rejected'].map(s => (
                        <button
                          key={s}
                          className={`btn btn-sm ${updateStatus === s ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setUpdateStatus(s)}
                        >
                          <StatusBadge status={s} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      placeholder="Ghi chú cho người gửi (sẽ hiển thị khi tra cứu)..."
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, minHeight: 80, marginBottom: 12 }}
                    />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeletePetition(selectedPetition.id)}>
                        🗑️ Xóa phản ánh
                      </button>
                      <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={updating}>
                        {updating ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                      </button>
                    </div>
                  </div>

                  {/* Tracking Logs */}
                  {selectedPetition.logs && selectedPetition.logs.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <h4 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--green-dark)', fontSize: 15 }}>
                        📅 Lịch sử xử lý
                      </h4>
                      <ul className="track-timeline">
                        {selectedPetition.logs.map((log, i) => (
                          <li key={i}>
                            <div className="track-dot" style={{ fontSize: 10 }}>✓</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{log.action}</div>
                              {log.notes && <div style={{ fontSize: 13, color: 'var(--muted)' }}>{log.notes}</div>}
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>{formatDate(log.createdAt)}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Floating Button */}
      <AIAssistant />
    </div>
  );
}
