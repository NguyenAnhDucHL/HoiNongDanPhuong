import React, { useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';
import SubmitForm from '../features/petitions/SubmitForm';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';

const TABS = [
  { id: 'submit', label: '📝 Gửi phản ánh' },
  { id: 'search', label: '🔍 Tra cứu & Danh sách' },
  { id: 'process', label: '📋 Quy trình xử lý' },
  { id: 'docs', label: '📄 Văn bản, Thông báo' },
];

export default function Home() {
  const [tab, setTab] = useState('submit');
  const [stats, setStats] = useState({ total: 0, resolved: 0, processing: 0, pending: 0 });

  // Search & list state
  const [petitions, setPetitions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingList, setLoadingList] = useState(false);

  // Track state
  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);

  useEffect(() => {
    fetchApi('/petitions/stats').then(setStats).catch(() => { });
  }, []);

  useEffect(() => {
    if (tab === 'search') {
      loadPetitions(page);
    }
  }, [tab, page]);

  const loadPetitions = async (p) => {
    setLoadingList(true);
    try {
      const res = await fetchApi(`/petitions?page=${p}&limit=9`);
      setPetitions(res.data || []);
      setTotalPages(Math.ceil((res.total || 0) / 9));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  const handleTrack = async () => {
    setTrackError('');
    setTrackResult(null);
    if (!trackCode.trim()) {
      setTrackError('Vui lòng nhập mã tra cứu.');
      return;
    }
    setTrackLoading(true);
    try {
      const res = await fetchApi(`/petitions/track/${trackCode.trim()}`);
      setTrackResult(res);
    } catch (e) {
      setTrackError(e.message || 'Không tìm thấy mã tra cứu này.');
    } finally {
      setTrackLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : '';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ====== HEADER ====== */}
      <header className="hnd-header">
        <div className="container header-inner">
          <div className="brand">
            <img src="/logo.png" alt="Logo" className="logo" />
            <div className="brand-text">
              <h1>HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ</h1>
              <p className="subtitle">CỔNG TIẾP NHẬN, XỬ LÝ PHẢN ÁNH, KIẾN NGHỊ CỦA HỘI VIÊN VÀ NHÂN DÂN</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="header-action-item hotline">
              📞 Hotline: 0987 654 321
            </div>
            <div className="header-action-item">
              🕐 Thứ 2 - Thứ 6: 7:30 - 17:00
            </div>
            <a href="/admin/login" className="btn-admin-login">
              🔒 Đăng nhập cán bộ
            </a>
          </div>
        </div>
      </header>

      {/* ====== STATS BAR ====== */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Tổng phản ánh</div>
            </div>
            <div className="stat-item resolved">
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Đã giải quyết</div>
            </div>
            <div className="stat-item processing">
              <div className="stat-number">{stats.processing}</div>
              <div className="stat-label">Đang xử lý</div>
            </div>
            <div className="stat-item pending">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Chờ xử lý</div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== NAVIGATION ====== */}
      <nav className="hnd-nav">
        <div className="container">
          <div className="nav-inner">
            {TABS.map(t => (
              <div
                key={t.id}
                className={`nav-item ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </div>
            ))}
            <a
              href="https://www.hoinongdan.org.vn"
              target="_blank"
              rel="noreferrer"
              className="nav-item nav-item-link"
            >
              🏛️ Hội Nông Dân Việt Nam ↗
            </a>
          </div>
        </div>
      </nav>

      {/* ====== MAIN ====== */}
      <main className="main-wrapper" style={{ flex: 1 }}>

        {/* --- TAB: GỬI PHẢN ÁNH --- */}
        {tab === 'submit' && (
          <div>
            <h2 className="section-title">Gửi phản ánh, kiến nghị nông nghiệp</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
              <SubmitForm />
              {/* Sidebar info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 12, fontSize: 16 }}>
                    📌 Lĩnh vực tiếp nhận
                  </h3>
                  {[
                    ['🌱', 'Trồng trọt', 'Cây lúa, rau màu, cây ăn quả'],
                    ['🐄', 'Chăn nuôi', 'Gia súc, gia cầm, dịch bệnh'],
                    ['🐟', 'Thủy sản', 'Nuôi trồng, đánh bắt'],
                    ['🏞️', 'Đất đai - Thủy lợi', 'Đất sản xuất, kênh mương'],
                    ['🧴', 'Phân bón - BVTV', 'Chất lượng, giá cả vật tư'],
                    ['💰', 'Vay vốn - Hỗ trợ', 'Tín dụng, trợ cấp, bảo hiểm'],
                    ['⛈️', 'Thiên tai - Dịch bệnh', 'Thiệt hại, hỗ trợ khắc phục'],
                  ].map(([icon, title, desc]) => (
                    <div key={title} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f5f1' }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ background: 'var(--green-light)', border: '1px solid var(--green-muted)' }}>
                  <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 10, fontSize: 15 }}>
                    ⏱️ Thời gian xử lý
                  </h3>
                  <ul style={{ listStyle: 'none', fontSize: 14, lineHeight: 1.8 }}>
                    <li>✅ Tiếp nhận: <strong>Ngay lập tức</strong></li>
                    <li>📋 Phân loại: <strong>Trong 24 giờ</strong></li>
                    <li>🔄 Xử lý thông thường: <strong>7-15 ngày</strong></li>
                    <li>⚡ Khẩn cấp (thiên tai...): <strong>24-48 giờ</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: TRA CỨU & DANH SÁCH --- */}
        {tab === 'search' && (
          <div>
            <h2 className="section-title">Tra cứu kết quả xử lý</h2>

            {/* Track Box */}
            <div className="track-box">
              <h3 style={{ fontWeight: 700, marginBottom: 14, color: 'var(--green-dark)' }}>
                🔍 Tra cứu theo mã
              </h3>
              <div className="track-input-row">
                <input
                  type="text"
                  placeholder="Nhập mã tra cứu (VD: HND-260904-AB12)"
                  value={trackCode}
                  onChange={e => setTrackCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleTrack()}
                  style={{ flex: 1, padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 15 }}
                />
                <button className="btn btn-primary" onClick={handleTrack} disabled={trackLoading}>
                  {trackLoading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : '🔍 Tra cứu'}
                </button>
              </div>

              {trackError && (
                <div className="alert alert-error" style={{ marginTop: 12 }}>❌ {trackError}</div>
              )}

              {trackResult && (
                <div className="track-result">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{trackResult.title}</h4>
                      <div style={{ fontSize: 14, color: 'var(--muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span>📄 Mã: <strong>{trackResult.trackingCode}</strong></span>
                        <span>📅 {formatDate(trackResult.createdAt)}</span>
                        <span>🏷️ {trackResult.category}</span>
                        {trackResult.ward && <span>📍 {trackResult.ward}</span>}
                      </div>
                    </div>
                    <StatusBadge status={trackResult.status} />
                  </div>

                  {trackResult.adminNotes && (
                    <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, marginBottom: 14, border: '1px solid var(--border)' }}>
                      <strong style={{ fontSize: 13, color: 'var(--muted)' }}>Ghi chú từ cán bộ:</strong>
                      <p style={{ marginTop: 4, fontSize: 14 }}>{trackResult.adminNotes}</p>
                    </div>
                  )}

                  {trackResult.aiSummary && (
                    <div className="ai-analysis-card">
                      <h4>🤖 Phân tích AI</h4>
                      <div className="ai-field">
                        <label>Tóm tắt</label>
                        <p>{trackResult.aiSummary}</p>
                      </div>
                      {trackResult.aiPriority && (
                        <PriorityBadge priority={trackResult.aiPriority} />
                      )}
                    </div>
                  )}

                  {/* Timeline */}
                  {trackResult.logs && trackResult.logs.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <strong style={{ fontSize: 14, color: 'var(--muted)' }}>Lịch sử xử lý:</strong>
                      <ul className="track-timeline" style={{ marginTop: 10 }}>
                        {trackResult.logs.map((log, i) => (
                          <li key={i}>
                            <div className="track-dot">✓</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{log.action}</div>
                              {log.notes && <div style={{ fontSize: 13, color: 'var(--muted)' }}>{log.notes}</div>}
                              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{formatDate(log.createdAt)}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Public List */}
            <h2 className="section-title">Danh sách phản ánh công khai</h2>

            {loadingList ? (
              <div className="loading-spinner">
                <div className="spinner" /> Đang tải...
              </div>
            ) : petitions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <h3>Chưa có phản ánh nào</h3>
                <p>Hãy là người đầu tiên gửi phản ánh!</p>
              </div>
            ) : (
              <div className="petition-grid">
                {petitions.map(p => (
                  <div key={p.id} className="petition-card">
                    <div className="petition-card-header">
                      <StatusBadge status={p.status} />
                      {p.aiPriority && <PriorityBadge priority={p.aiPriority} />}
                      <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
                        {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="petition-card-title">{p.title}</div>
                    <div className="petition-card-meta">
                      <span>🏷️ {p.category}</span>
                      <span>👤 {p.fullName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Trang trước</button>
                <div className="page-info">Trang {page} / {totalPages}</div>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Trang sau →</button>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: QUY TRÌNH --- */}
        {tab === 'process' && (
          <div>
            <h2 className="section-title">Quy trình tiếp nhận & xử lý phản ánh</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="card">
                <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 16, fontSize: 16 }}>
                  📋 Các bước xử lý
                </h3>
                <ul className="process-list">
                  {[
                    ['1', 'Tiếp nhận phản ánh', 'Hội viên / Nhân dân gửi phản ánh qua cổng điện tử. Hệ thống cấp mã tra cứu ngay lập tức.'],
                    ['2', 'Phân loại & Xem xét', 'AI hỗ trợ phân loại sơ bộ. Cán bộ HND xem xét nội dung và xác định mức độ ưu tiên.'],
                    ['3', 'Xử lý & Giải quyết', 'Cán bộ phụ trách liên hệ, phối hợp các đơn vị liên quan để xử lý phản ánh.'],
                    ['4', 'Phản hồi kết quả', 'Cập nhật kết quả giải quyết. Hội viên tra cứu theo mã hoặc được thông báo trực tiếp.'],
                  ].map(([num, title, desc]) => (
                    <li key={num}>
                      <div className="step-num">{num}</div>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--green-dark)', fontSize: 15 }}>{title}</strong>
                        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 12, fontSize: 16 }}>📞 Liên hệ trực tiếp</h3>
                  <ul style={{ listStyle: 'none', fontSize: 14, lineHeight: 2 }}>
                    <li>🏢 <strong>Địa chỉ:</strong> Phường Cẩm Phả, TP. Cẩm Phả, Quảng Ninh</li>
                    <li>📞 <strong>Điện thoại:</strong> 0987 654 321</li>
                    <li>🕐 <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6 (7:30 - 17:00)</li>
                    <li>📧 <strong>Email:</strong> hnd.campha@gmail.com</li>
                  </ul>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #f0fff4, #e8f5e9)' }}>
                  <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 10, fontSize: 15 }}>
                    🤖 Hỗ trợ từ AI
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    Hệ thống AI sử dụng công nghệ Google Gemini để hỗ trợ cán bộ:
                  </p>
                  <ul style={{ listStyle: 'none', fontSize: 14, marginTop: 10, lineHeight: 1.8 }}>
                    <li>🔹 Tự động phân loại lĩnh vực</li>
                    <li>🔹 Tóm tắt nội dung phản ánh</li>
                    <li>🔹 Đánh giá mức độ ưu tiên</li>
                    <li>🔹 Gợi ý hành động xử lý</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: VĂN BẢN --- */}
        {tab === 'docs' && (
          <div>
            <h2 className="section-title">Văn bản, Thông báo & Chỉ đạo</h2>
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <h3>Đang cập nhật</h3>
              <p>Tính năng tra cứu văn bản đang được hoàn thiện. Vui lòng liên hệ trực tiếp để được hỗ trợ.</p>
            </div>
          </div>
        )}
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="hnd-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-title"><img src="/logo.png" alt="Logo" className="footer-logo" /> HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ</div>
              <p>Cổng tiếp nhận, xử lý phản ánh, kiến nghị của hội viên và nhân dân về các vấn đề nông nghiệp, nông thôn.</p>
              <p style={{ marginTop: 10 }}>📍 Phường Cẩm Phả, TP. Cẩm Phả, Quảng Ninh</p>
            </div>
            <div>
              <div className="footer-title">🔗 Liên kết</div>
              <p><a href="https://www.hoinongdan.org.vn" target="_blank" rel="noreferrer" style={{ color: '#e8f7ea' }}>→ Hội Nông Dân Việt Nam</a></p>
              <p><a href="https://www.quangninh.gov.vn" target="_blank" rel="noreferrer" style={{ color: '#e8f7ea' }}>→ UBND Tỉnh Quảng Ninh</a></p>
              <p><a href="https://campha.quangninh.gov.vn" target="_blank" rel="noreferrer" style={{ color: '#e8f7ea' }}>→ TP. Cẩm Phả</a></p>
            </div>
            <div>
              <div className="footer-title">📞 Liên hệ</div>
              <p>Điện thoại: 0987 654 321</p>
              <p>Email: hnd.campha@gmail.com</p>
              <p>Giờ làm việc: T2-T6, 7:30-17:00</p>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 Hội Nông Dân Phường Cẩm Phả, Bản quyền thuộc về UBND phường Cẩm Phả
          </div>
        </div>
      </footer>
    </div>
  );
}
