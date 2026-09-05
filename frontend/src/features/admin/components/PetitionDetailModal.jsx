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
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-title">{selectedPetition.title}</h3>
            <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
              <strong style={{ color: 'var(--admin-primary)' }}>{selectedPetition.trackingCode}</strong> &bull; {formatDate(selectedPetition.createdAt)}
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
              <div className="admin-detail-grid">
                {[
                  ['Họ tên', selectedPetition.fullName, '👤'],
                  ['Điện thoại', selectedPetition.phone || '-', '📞'],
                  ['CCCD', selectedPetition.cccd || '-', '🪪'],
                  ['Khu phố', selectedPetition.ward || '-', '📍'],
                  ['Địa chỉ', selectedPetition.address || '-', '🏠'],
                  ['Lĩnh vực', selectedPetition.category, '🏷️'],
                ].map(([label, value, icon]) => (
                  <div key={label} className="admin-detail-item">
                    <div className="admin-detail-label">{icon} {label}</div>
                    <div className="admin-detail-value">{value}</div>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>📝 Nội dung phản ánh</div>
                <div style={{ 
                  background: '#f8fafc', borderRadius: '8px', padding: '16px', 
                  fontSize: '15px', lineHeight: 1.6, border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text)'
                }}>
                  {selectedPetition.content}
                </div>
              </div>

              {/* Images */}
              {selectedPetition.imagePaths && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>🖼️ Ảnh đính kèm</div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedPetition.imagePaths.split(',').filter(Boolean).map((img, i) => (
                      <a key={i} href={`/uploads/${img}`} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                        <img
                          src={`/uploads/${img}`} alt={`Ảnh ${i + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--admin-border)', transition: 'transform 0.2s' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div className="admin-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)' }}>
                  🤖 Phân tích bởi Google Gemini
                </h4>
                {selectedPetition.aiSummary ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div className="admin-detail-label">Tóm tắt</div>
                      <p style={{ margin: 0, fontSize: '14px' }}>{selectedPetition.aiSummary}</p>
                    </div>
                    <div>
                      <div className="admin-detail-label">Gợi ý hành động</div>
                      <p style={{ margin: 0, fontSize: '14px' }}>{selectedPetition.aiSuggestion}</p>
                    </div>
                    <div>
                      <div className="admin-detail-label">Mức độ ưu tiên</div>
                      <PriorityBadge priority={selectedPetition.aiPriority} />
                    </div>
                    <div>
                      <div className="admin-detail-label">Lĩnh vực phân loại</div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{selectedPetition.aiCategory}</p>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', margin: '0 0 16px 0' }}>Chưa có phân tích AI cho phản ánh này.</p>
                )}
                <button
                  className="btn btn-sm"
                  style={{ 
                    marginTop: '16px', background: '#fff', border: '1px solid var(--admin-primary)', 
                    color: 'var(--admin-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px'
                  }}
                  onClick={handleAIAnalyze}
                  disabled={analyzingAI}
                >
                  {analyzingAI ? (
                    <><span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderTopColor: 'var(--admin-primary)' }} /> Đang phân tích...</>
                  ) : '✨ Phân tích ngay'}
                </button>
              </div>

              {/* Status Update */}
              <div className="admin-card" style={{ marginBottom: '8px' }}>
                <h4 className="admin-card-title">⚙️ Cập nhật tiến độ xử lý</h4>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {['pending', 'processing', 'resolved', 'rejected'].map(s => (
                    <button
                      key={s}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                        border: updateStatus === s ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                        background: updateStatus === s ? '#f0fdf4' : '#fff',
                        transition: 'all 0.2s', outline: 'none'
                      }}
                      onClick={() => setUpdateStatus(s)}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>

                <div className="admin-detail-label" style={{ marginBottom: '8px' }}>Ghi chú xử lý (Người dân sẽ xem được)</div>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Nhập phản hồi, kết quả giải quyết, hoặc lý do từ chối..."
                  style={{ 
                    width: '100%', padding: '12px', border: '1px solid var(--admin-border)', 
                    borderRadius: '8px', fontSize: '14px', minHeight: '100px', resize: 'vertical',
                    outline: 'none', fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--admin-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--admin-border)'}
                />
              </div>

              {/* Tracking Logs */}
              {selectedPetition.logs && selectedPetition.logs.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h4 className="admin-card-title">📅 Lịch sử trạng thái</h4>
                  <div style={{ position: 'relative', paddingLeft: '16px', borderLeft: '2px solid var(--admin-border)', marginLeft: '8px' }}>
                    {selectedPetition.logs.map((log, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: i === selectedPetition.logs.length - 1 ? 0 : '20px' }}>
                        <div style={{ 
                          position: 'absolute', left: '-22px', top: '2px', width: '10px', height: '10px', 
                          borderRadius: '50%', background: 'var(--admin-primary)', border: '2px solid #fff' 
                        }} />
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--admin-text)' }}>{log.action}</div>
                        {log.notes && <div style={{ fontSize: '14px', color: 'var(--admin-text-muted)', marginTop: '4px', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>{log.notes}</div>}
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{formatDate(log.createdAt)}</div>
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
            style={{ marginRight: 'auto', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}
            onClick={() => handleDeletePetition(selectedPetition.id)}
          >
            🗑️ Xóa
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => setSelectedPetition(null)}
          >
            Đóng
          </button>
          
          <button 
            className="btn btn-primary" 
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
