import React, { useState } from 'react';
import { fetchApi } from '../../../lib/api';

const StatusBadge = ({ status }) => {
  const statusMap = {
    'pending': { label: 'Đang chờ', type: 'pending' },
    'processing': { label: 'Đang xử lý', type: 'processing' },
    'resolved': { label: 'Đã hoàn thành', type: 'resolved' },
    'rejected': { label: 'Từ chối', type: 'rejected' }
  };

  const mapped = statusMap[status] || { label: status, type: 'pending' };

  const colorStyles = {
    pending: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]',
    processing: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
    resolved: 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]',
    rejected: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
  };

  return (
    <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[13px] font-bold border ${colorStyles[mapped.type]}`}>
      {mapped.label}
    </span>
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
      const data = await fetchApi(`/petitions/track/${trackCode.trim()}`);
      setTrackResult(data);
    } catch (err) {
      setTrackError(err.message || 'Không tìm thấy phản ánh nào với mã này.');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-[48px] pb-[40px]" id="tra-cuu">
      <div className="max-w-[850px] mx-auto bg-white border border-[#e5ece7] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-[16px] p-6 md:p-8">
        <div className="mb-[15px]">
          <h3 className="text-[#087c20] text-[22px] font-bold pb-[8px] border-b-[3px] border-[#149b2f] inline-block">TRA CỨU KẾT QUẢ XỬ LÝ</h3>
        </div>
        <p className="my-[8px] mb-[12px] text-[#4e5e53]">Nhập mã tiếp nhận để xem tình trạng xử lý phản ánh.</p>
        <div className="flex flex-col md:flex-row gap-[10px]">
          <input
            className="flex-1 p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
            id="lookup"
            placeholder="Ví dụ: HND-260904-AB12"
            value={trackCode}
            onChange={e => setTrackCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
          />
          <button 
            className="bg-[#149b2f] hover:bg-[#087c20] text-white font-bold p-[11px_24px] rounded-[8px] transition-colors min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleTrack} 
            disabled={trackLoading}
          >
            {trackLoading ? 'ĐANG XỬ LÝ...' : 'TRA CỨU'}
          </button>
        </div>

        {trackError && (
          <div className="bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] rounded-[8px] p-[12px_16px] font-medium flex items-center gap-[10px] mt-[12px]">
            ❌ {trackError}
          </div>
        )}

        {trackResult && (
          <div className="mt-[15px] bg-[#f5f9f6] p-[20px] rounded-[8px] border border-[#dbe7de]">
            <div className="flex justify-between items-start flex-wrap gap-[10px] mb-[14px]">
              <div>
                <h4 className="font-bold text-[17px] mb-[6px] text-[#18301e]">{trackResult.title}</h4>
                <div className="text-[14px] text-[#4e5e53] flex gap-[16px] flex-wrap">
                  <span>📄 Mã: <strong>{trackResult.trackingCode}</strong></span>
                  <span>📅 {new Date(trackResult.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span>🏷️ {trackResult.category}</span>
                </div>
              </div>
              <StatusBadge status={trackResult.status} />
            </div>
            {trackResult.aiSummary && (
              <div className="bg-white p-[12px_16px] rounded-[8px] border border-[#e5ece7]">
                <strong className="text-[13px] text-[#4e5e53]">🤖 Tóm tắt tự động:</strong>
                <p className="mt-[4px] text-[14px] text-[#18301e]">{trackResult.aiSummary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackPetition;
