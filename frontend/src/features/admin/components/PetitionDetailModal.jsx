import React from 'react';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';

export default function PetitionDetailModal({
  selectedPetition,
  setSelectedPetition,
  detailLoading,
  updateStatus,
  setUpdateStatus,
  adminNotes,
  setAdminNotes,
  updating,
  handleUpdateStatus,
  handleDeletePetition,
  handleAIAnalyze,
  analyzingAI,
}) {
  if (!selectedPetition) return null;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <div className="admin-modal-overlay" onClick={() => setSelectedPetition(null)}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="admin-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <h3 className="admin-modal-title" style={{ fontSize: 20, color: '#0f172a', marginBottom: 8 }}>{selectedPetition.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b' }}>
              <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 6, fontWeight: 600, color: '#334155', border: '1px solid #e2e8f0' }}>
                {selectedPetition.trackingCode}
              </span>
              <span>&bull;</span>
              <span>{formatDate(selectedPetition.createdAt)}</span>
            </div>
          </div>
          <button className="admin-modal-close" onClick={() => setSelectedPetition(null)}>&times;</button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {detailLoading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} /> Đang tải chi tiết...
            </div>
          ) : (
            <>
              {/* Info Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16,
                marginBottom: 24, padding: 20, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0'
              }}>
                {[
                  ['Họ tên', selectedPetition.fullName, '👤'],
                  ['Điện thoại', selectedPetition.phone || '-', '📞'],
                  ['CCCD', selectedPetition.cccd || '-', '🪪'],
                  ['Khu phố', selectedPetition.ward || '-', '📍'],
                  ['Địa chỉ', selectedPetition.address || '-', '🏠'],
                  ['Lĩnh vực', selectedPetition.category, '🏷️'],
                ].map(([label, value, icon]) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      <span style={{ marginRight: 6 }}>{icon}</span>{label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#0f172a' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 12 }}>Nội dung chi tiết</h4>
                <div style={{
                  background: '#fff', borderRadius: 10, padding: 20,
                  fontSize: 15, lineHeight: 1.7, border: '1px solid #e2e8f0',
                  color: '#334155', whiteSpace: 'pre-wrap', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  {selectedPetition.content}
                </div>
              </div>

              {/* Images */}
              {selectedPetition.imagePaths && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 12 }}>Tệp đính kèm</h4>
                  {(() => {
                    const imagesList = selectedPetition.imagePaths.split(',').filter(Boolean);
                    if (imagesList.length === 0) return null;
                    return (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: imagesList.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                        gap: 4,
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0'
                      }}>
                        {imagesList.map((img, idx) => {
                          let gridStyle = {};
                          const count = imagesList.length;

                          if (count === 1) {
                            gridStyle = { gridColumn: '1 / -1', maxHeight: 400 };
                          } else if (count === 3 && idx === 0) {
                            gridStyle = { gridColumn: '1 / -1', height: 250 };
                          } else if (count === 3 && idx > 0) {
                            gridStyle = { height: 150 };
                          } else if (count >= 4) {
                            gridStyle = { height: 150 };
                          } else {
                            // count === 2
                            gridStyle = { height: 200 };
                          }

                          return (
                            <a key={idx} href={`/uploads/${img}`} target="_blank" rel="noreferrer" style={{
                              position: 'relative',
                              width: '100%',
                              ...gridStyle,
                              overflow: 'hidden',
                              display: 'block'
                            }}>
                              <img
                                src={`/uploads/${img}`}
                                alt=""
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: count === 1 ? 'contain' : 'cover',
                                  display: 'block',
                                  background: '#f8fafc',
                                  transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = count === 1 ? 'none' : 'scale(1.03)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              />
                            </a>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* AI Analysis */}
              <div style={{
                marginBottom: 24, padding: 24, background: 'linear-gradient(145deg, #f0fdfa 0%, #ffffff 100%)',
                borderRadius: 12, border: '1px solid #a7f3d0', position: 'relative', overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.05)'
              }}>
                <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8, color: '#047857', fontSize: 16 }}>
                  <span style={{ fontSize: 20 }}>✨</span> Phân tích AI thông minh
                </h4>
                {selectedPetition.aiSummary ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', textTransform: 'uppercase', marginBottom: 6 }}>Tóm tắt nội dung</div>
                      <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{selectedPetition.aiSummary}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', textTransform: 'uppercase', marginBottom: 6 }}>Gợi ý xử lý</div>
                      <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{selectedPetition.aiSuggestion}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', textTransform: 'uppercase', marginBottom: 6 }}>Mức độ ưu tiên</div>
                      <PriorityBadge priority={selectedPetition.aiPriority} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', textTransform: 'uppercase', marginBottom: 6 }}>Lĩnh vực phân loại</div>
                      <span style={{ display: 'inline-block', padding: '4px 10px', background: '#d1fae5', color: '#047857', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                        {selectedPetition.aiCategory}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 16px 0' }}>Hệ thống chưa phân tích phản ánh này.</p>
                )}
                <button
                  className="btn btn-sm"
                  style={{
                    marginTop: 20, background: '#fff', border: '1px solid #10b981',
                    color: '#047857', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 8, boxShadow: '0 1px 2px rgba(16,185,129,0.1)'
                  }}
                  onClick={handleAIAnalyze}
                  disabled={analyzingAI}
                >
                  {analyzingAI ? (
                    <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: '#047857' }} /> Đang xử lý...</>
                  ) : 'Chạy phân tích AI'}
                </button>
              </div>

              {/* Status Update */}
              <div style={{ padding: 24, border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff', marginBottom: 24 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚙️</span> Cập nhật tiến độ
                </h4>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                  {['pending', 'processing', 'resolved', 'rejected'].map(s => (
                    <button
                      key={s}
                      style={{
                        padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                        border: updateStatus === s ? '2px solid var(--admin-primary)' : '1px solid #cbd5e1',
                        background: updateStatus === s ? '#f0fdf4' : '#f8fafc',
                        transition: 'all 0.2s', outline: 'none',
                        boxShadow: updateStatus === s ? '0 2px 4px rgba(34,197,94,0.1)' : 'none'
                      }}
                      onClick={() => setUpdateStatus(s)}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Ghi chú xử lý (Hiển thị cho công dân)</div>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Nhập chi tiết tiến trình, kết quả giải quyết, hoặc lý do từ chối..."
                  style={{
                    width: '100%', padding: 16, border: '1px solid #cbd5e1',
                    borderRadius: 8, fontSize: 14, minHeight: 120, resize: 'vertical',
                    outline: 'none', fontFamily: 'inherit', background: '#f8fafc',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--admin-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                />
              </div>

              {/* Tracking Logs */}
              {selectedPetition.logs && selectedPetition.logs.length > 0 && (
                <div style={{ padding: 24, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>📅 Lịch sử trạng thái</h4>
                  <div style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid #cbd5e1', marginLeft: 8 }}>
                    {selectedPetition.logs.map((log, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: i === selectedPetition.logs.length - 1 ? 0 : 24 }}>
                        <div style={{
                          position: 'absolute', left: -27, top: 4, width: 12, height: 12,
                          borderRadius: '50%', background: i === 0 ? 'var(--admin-primary)' : '#94a3b8', border: '2px solid #f8fafc',
                          boxShadow: i === 0 ? '0 0 0 2px rgba(34,197,94,0.2)' : 'none'
                        }} />
                        <div style={{ fontWeight: 600, fontSize: 14, color: i === 0 ? '#0f172a' : '#475569' }}>{log.action}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{formatDate(log.createdAt)}</div>
                        {log.notes && (
                          <div style={{
                            fontSize: 14, color: '#334155', marginTop: 8, background: '#fff',
                            padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0'
                          }}>
                            {log.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button
            className="btn btn-danger"
            style={{ width: 'auto', marginRight: 'auto', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px' }}
            onClick={() => handleDeletePetition(selectedPetition.id)}
          >
            🗑️ Xóa
          </button>

          <button
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '10px 20px' }}
            onClick={() => setSelectedPetition(null)}
          >
            Đóng
          </button>

          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '10px 24px' }}
            onClick={handleUpdateStatus}
            disabled={updating || detailLoading}
          >
            {updating ? 'Đang lưu...' : '💾 Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
}
