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
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-[16px]" onClick={() => setSelectedPetition(null)}>
      <div className="bg-white rounded-[12px] w-full max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-start p-[24px] border-b border-[#e2e8f0] bg-white shrink-0">
          <div>
            <h3 className="font-bold text-[20px] text-[#0f172a] mb-[8px] leading-tight">{selectedPetition.title}</h3>
            <div className="flex items-center gap-[10px] text-[13px] text-[#64748b]">
              <span className="bg-[#f1f5f9] px-[8px] py-[4px] rounded-[6px] font-semibold text-[#334155] border border-[#e2e8f0]">
                {selectedPetition.trackingCode}
              </span>
              <span>&bull;</span>
              <span>{formatDate(selectedPetition.createdAt)}</span>
            </div>
          </div>
          <button className="text-[#64748b] hover:text-[#0f172a] text-[24px] leading-none transition-colors" onClick={() => setSelectedPetition(null)}>&times;</button>
        </div>

        {/* Body */}
        <div className="p-[24px] overflow-y-auto flex-1 bg-white">
          {detailLoading ? (
            <div className="py-[40px] text-center text-[#718096]">
              <div className="w-[30px] h-[30px] border-[3px] border-[#e2e8f0] border-t-[#0a8c24] rounded-full animate-spin mx-auto mb-[12px]" /> Đang tải chi tiết...
            </div>
          ) : (
            <>
              {/* Info Grid */}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[16px] mb-[24px] p-[20px] bg-[#f8fafc] rounded-[12px] border border-[#e2e8f0]">
                {[
                  ['Họ tên', selectedPetition.fullName, '👤'],
                  ['Điện thoại', selectedPetition.phone || '-', '📞'],
                  ['CCCD', selectedPetition.cccd || '-', '🪪'],
                  ['Khu phố', selectedPetition.ward || '-', '📍'],
                  ['Địa chỉ', selectedPetition.address || '-', '🏠'],
                  ['Lĩnh vực', selectedPetition.category, '🏷️'],
                ].map(([label, value, icon]) => (
                  <div key={label} className="flex flex-col gap-[6px]">
                    <div className="text-[12px] font-semibold text-[#64748b] uppercase tracking-[0.05em]">
                      <span className="mr-[6px]">{icon}</span>{label}
                    </div>
                    <div className="text-[15px] font-medium text-[#0f172a] break-words">{value}</div>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="mb-[24px]">
                <h4 className="text-[14px] font-semibold text-[#334155] mb-[12px]">Nội dung chi tiết</h4>
                <div className="bg-white rounded-[10px] p-[20px] text-[15px] leading-[1.7] border border-[#e2e8f0] text-[#334155] whitespace-pre-wrap shadow-inner">
                  {selectedPetition.content}
                </div>
              </div>

              {/* Images */}
              {selectedPetition.imagePaths && (
                <div className="mb-[24px]">
                  <h4 className="text-[14px] font-semibold text-[#334155] mb-[12px]">Tệp đính kèm</h4>
                  {(() => {
                    const imagesList = selectedPetition.imagePaths.split(',').filter(Boolean);
                    if (imagesList.length === 0) return null;
                    return (
                      <div className={`grid gap-[4px] rounded-[12px] overflow-hidden border border-[#e2e8f0] ${imagesList.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
                            <a key={idx} href={`/uploads/${img}`} target="_blank" rel="noreferrer" className="relative w-full block overflow-hidden" style={gridStyle}>
                              <img
                                src={`/uploads/${img}`}
                                alt=""
                                className="w-full h-full block bg-[#f8fafc] transition-transform duration-300 ease-in-out hover:scale-[1.03]"
                                style={{ objectFit: count === 1 ? 'contain' : 'cover' }}
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
              <div className="mb-[24px] p-[24px] bg-gradient-to-br from-[#f0fdfa] to-white rounded-[12px] border border-[#a7f3d0] relative overflow-hidden shadow-sm">
                <h4 className="flex items-center gap-[8px] text-[#047857] text-[16px] font-bold mb-[16px] m-0">
                  <span className="text-[20px]">✨</span> Phân tích AI thông minh
                </h4>
                {selectedPetition.aiSummary ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                    <div>
                      <div className="text-[12px] font-semibold text-[#059669] uppercase mb-[6px]">Tóm tắt nội dung</div>
                      <p className="m-0 text-[14px] text-[#334155] leading-[1.6]">{selectedPetition.aiSummary}</p>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#059669] uppercase mb-[6px]">Gợi ý xử lý</div>
                      <p className="m-0 text-[14px] text-[#334155] leading-[1.6]">{selectedPetition.aiSuggestion}</p>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#059669] uppercase mb-[6px]">Mức độ ưu tiên</div>
                      <PriorityBadge priority={selectedPetition.aiPriority} />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#059669] uppercase mb-[6px]">Lĩnh vực phân loại</div>
                      <span className="inline-block px-[10px] py-[4px] bg-[#d1fae5] text-[#047857] rounded-[6px] text-[13px] font-semibold">
                        {selectedPetition.aiCategory}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#64748b] text-[14px] m-0 mb-[16px]">Hệ thống chưa phân tích phản ánh này.</p>
                )}
                <div className="mt-[20px] flex items-center gap-[12px]">
                  <button
                    className="bg-white border border-[#10b981] text-[#047857] font-semibold inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] shadow-sm hover:bg-[#f0fdfa] transition-colors disabled:opacity-70"
                    onClick={handleAIAnalyze}
                    disabled={analyzingAI}
                  >
                    {analyzingAI ? (
                      <><span className="w-[14px] h-[14px] border-[2px] border-t-[#047857] border-transparent rounded-full animate-spin" /> Đang xử lý...</>
                    ) : 'Chạy phân tích AI'}
                  </button>
                  {analyzingAI && (
                    <span className="text-[#059669] text-[13px] animate-pulse">
                      Hệ thống đang phân tích ngữ nghĩa, quá trình này có thể mất một ít thời gian...
                    </span>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="p-[24px] border border-[#e2e8f0] rounded-[12px] bg-white mb-[24px]">
                <h4 className="text-[16px] font-semibold text-[#0f172a] mb-[16px] flex items-center gap-[8px]">
                  <span>⚙️</span> Cập nhật tiến độ
                </h4>

                <div className="flex gap-[12px] flex-wrap mb-[20px]">
                  {['pending', 'processing', 'resolved', 'rejected'].map(s => (
                    <button
                      key={s}
                      className={`px-[16px] py-[8px] rounded-[8px] cursor-pointer outline-none transition-all ${updateStatus === s ? 'border-2 border-[#0a8c24] bg-[#f0fdf4] shadow-[0_2px_4px_rgba(34,197,94,0.1)]' : 'border border-[#cbd5e1] bg-[#f8fafc]'}`}
                      onClick={() => setUpdateStatus(s)}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>

                <div className="text-[13px] font-semibold text-[#475569] mb-[8px]">Ghi chú xử lý (Hiển thị cho công dân)</div>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Nhập chi tiết tiến trình, kết quả giải quyết, hoặc lý do từ chối..."
                  className="w-full p-[16px] border border-[#cbd5e1] rounded-[8px] text-[14px] min-h-[120px] resize-y outline-none bg-[#f8fafc] focus:bg-white focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] transition-all font-sans"
                />
              </div>

              {/* Tracking Logs */}
              {selectedPetition.logs && selectedPetition.logs.length > 0 && (
                <div className="p-[24px] bg-[#f8fafc] rounded-[12px] border border-[#e2e8f0]">
                  <h4 className="text-[16px] font-semibold text-[#0f172a] mb-[20px]">📅 Lịch sử trạng thái</h4>
                  <div className="relative pl-[20px] border-l-2 border-[#cbd5e1] ml-[8px]">
                    {selectedPetition.logs.map((log, i) => (
                      <div key={i} className={`relative ${i === selectedPetition.logs.length - 1 ? 'mb-0' : 'mb-[24px]'}`}>
                        <div className={`absolute -left-[27px] top-[4px] w-[12px] h-[12px] rounded-full border-2 border-[#f8fafc] ${i === 0 ? 'bg-[#0a8c24] shadow-[0_0_0_2px_rgba(34,197,94,0.2)]' : 'bg-[#94a3b8]'}`} />
                        <div className={`font-semibold text-[14px] ${i === 0 ? 'text-[#0f172a]' : 'text-[#475569]'}`}>{log.action}</div>
                        <div className="text-[12px] text-[#64748b] mt-[4px]">{formatDate(log.createdAt)}</div>
                        {log.notes && (
                          <div className="text-[14px] text-[#334155] mt-[8px] bg-white px-[14px] py-[10px] rounded-[8px] border border-[#e2e8f0]">
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
        <div className="flex items-center justify-end gap-[12px] p-[20px] border-t border-[#e2e8f0] bg-[#f8fafc] shrink-0">
          <button
            className="mr-auto bg-transparent border border-[#ef4444] text-[#ef4444] hover:bg-[#fef2f2] px-[20px] py-[10px] rounded-[8px] font-medium transition-colors"
            onClick={() => handleDeletePetition(selectedPetition.id)}
          >
            🗑️ Xóa
          </button>

          <button
            className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-[20px] py-[10px] rounded-[8px] font-medium transition-colors"
            onClick={() => setSelectedPetition(null)}
          >
            Đóng
          </button>

          <button
            className="bg-[#0a8c24] hover:bg-[#07701c] text-white px-[24px] py-[10px] rounded-[8px] font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
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
