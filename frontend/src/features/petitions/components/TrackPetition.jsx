import React, { useState } from 'react';
import { fetchApi } from '../../../lib/api';

const StatusBadge = ({ status }) => {
  const statusMap = {
    'PENDING': { label: 'Đang chờ', type: 'pending' },
    'IN_PROGRESS': { label: 'Đang xử lý', type: 'processing' },
    'RESOLVED': { label: 'Đã hoàn thành', type: 'resolved' },
    'REJECTED': { label: 'Từ chối', type: 'rejected' }
  };

  const mapped = statusMap[status] || { label: status, type: 'pending' };

  return (
    <span className={`badge badge-${mapped.type}`}>{mapped.label}</span>
  );
};

const TrackPetition = () => {
  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackCode.trim()) return;
    setTrackError('');
    setTrackResult(null);
    setTrackLoading(true);

    try {
      const res = await fetchApi(`/petitions/track/${trackCode.trim()}`);
      if (res.status === 'success') {
        setTrackResult(res.data);
      } else {
        setTrackError(res.message || 'Không tìm thấy phản ánh nào với mã này.');
      }
    } catch (err) {
      setTrackError('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <section className="section container" id="tra-cuu">
      <div className="card" style={{ maxWidth: 850, margin: 'auto' }}>
        <h3>TRA CỨU KẾT QUẢ XỬ LÝ</h3>
        <p style={{ margin: '8px 0 12px', color: 'var(--muted)' }}>Nhập mã tiếp nhận để xem tình trạng xử lý phản ánh.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            id="lookup"
            placeholder="Ví dụ: HND-260904-AB12"
            value={trackCode}
            onChange={e => setTrackCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
          />
          <button className="btn btn-primary" style={{ width: 'auto', minWidth: 150 }} onClick={handleTrack} disabled={trackLoading}>
            {trackLoading ? 'ĐANG XỬ LÝ...' : 'TRA CỨU'}
          </button>
        </div>

        {trackError && (
          <div className="alert alert-error" style={{ marginTop: 12 }}>❌ {trackError}</div>
        )}

        {trackResult && (
          <div className="track-result" style={{ marginTop: 15, background: '#f5f9f6', padding: 20, borderRadius: 8, border: '1px solid #dbe7de' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{trackResult.title}</h4>
                <div style={{ fontSize: 14, color: 'var(--muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span>📄 Mã: <strong>{trackResult.trackingCode}</strong></span>
                  <span>📅 {new Date(trackResult.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span>🏷️ {trackResult.category}</span>
                </div>
              </div>
              <StatusBadge status={trackResult.status} />
            </div>
            {trackResult.aiSummary && (
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: 13, color: 'var(--muted)' }}>🤖 Tóm tắt tự động:</strong>
                <p style={{ marginTop: 4, fontSize: 14 }}>{trackResult.aiSummary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackPetition;
