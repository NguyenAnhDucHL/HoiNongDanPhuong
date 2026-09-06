import React from 'react';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';

export default function AdminOverview({ stats, onNavigateToPetitions, onOpenDetail }) {
  if (!stats) return null;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <div className="flex-1 overflow-y-auto p-[24px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[24px]">
        <div className="bg-white rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] border-l-[4px] border-l-[#0a8c24] flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -top-[10px] -right-[10px] text-[64px] opacity-5">📋</div>
          <div className="text-[32px] font-bold text-[#2d3748] mb-[4px]">{stats.overview?.total || 0}</div>
          <div className="text-[14px] color-[#718096] font-medium text-[#718096]">Tổng phản ánh</div>
        </div>
        <div className="bg-white rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] border-l-[4px] border-l-[#f59e0b] flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -top-[10px] -right-[10px] text-[64px] opacity-5">⏳</div>
          <div className="text-[32px] font-bold text-[#2d3748] mb-[4px]">{stats.overview?.pending || 0}</div>
          <div className="text-[14px] color-[#718096] font-medium text-[#718096]">Chờ xử lý</div>
        </div>
        <div className="bg-white rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] border-l-[4px] border-l-[#3b82f6] flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -top-[10px] -right-[10px] text-[64px] opacity-5">🔄</div>
          <div className="text-[32px] font-bold text-[#2d3748] mb-[4px]">{stats.overview?.processing || 0}</div>
          <div className="text-[14px] color-[#718096] font-medium text-[#718096]">Đang xử lý</div>
        </div>
        <div className="bg-white rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] border-l-[4px] border-l-[#10b981] flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -top-[10px] -right-[10px] text-[64px] opacity-5">✅</div>
          <div className="text-[32px] font-bold text-[#2d3748] mb-[4px]">{stats.overview?.resolved || 0}</div>
          <div className="text-[14px] color-[#718096] font-medium text-[#718096]">Đã giải quyết</div>
        </div>
        <div className="bg-white rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] border-l-[4px] border-l-[#ef4444] flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -top-[10px] -right-[10px] text-[64px] opacity-5">❌</div>
          <div className="text-[32px] font-bold text-[#2d3748] mb-[4px]">{stats.overview?.rejected || 0}</div>
          <div className="text-[14px] color-[#718096] font-medium text-[#718096]">Từ chối</div>
        </div>
        <div className="bg-white rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] border-l-[4px] border-l-[#ef4444] flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -top-[10px] -right-[10px] text-[64px] opacity-5">🔴</div>
          <div className="text-[32px] font-bold text-[#2d3748] mb-[4px]">{stats.overview?.highPriority || 0}</div>
          <div className="text-[14px] color-[#718096] font-medium text-[#718096]">Ưu tiên cao</div>
        </div>
        <div className="bg-white rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex flex-col relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -top-[10px] -right-[10px] text-[64px] opacity-5">📅</div>
          <div className="text-[32px] font-bold text-[#2d3748] mb-[4px]">{stats.overview?.today || 0}</div>
          <div className="text-[14px] color-[#718096] font-medium text-[#718096]">Nhận hôm nay</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[24px]">
        {/* By Category */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px] flex flex-col">
          <h3 className="text-[16px] font-bold text-[#2d3748] m-0 pb-[16px] border-b border-[#e2e8f0]">🏷️ Phân loại theo lĩnh vực</h3>
          <div className="mt-[20px]">
            {(stats.byCategory || []).map(c => (
              <div key={c.category} className="flex justify-between items-center py-[12px] border-b border-[#e2e8f0] text-[14px]">
                <span className="font-medium">{c.category}</span>
                <div className="flex items-center gap-[12px]">
                  <div className="h-[8px] rounded-full bg-[#0a8c24] opacity-80" style={{
                    width: `${Math.min(100, (c.count / (stats.overview?.total || 1)) * 180)}px`
                  }} />
                  <strong className="min-w-[24px] text-right">{c.count}</strong>
                </div>
              </div>
            ))}
            {(!stats.byCategory || stats.byCategory.length === 0) && (
              <p className="text-[#718096] text-[14px] text-center py-[20px]">
                Chưa có dữ liệu
              </p>
            )}
          </div>
        </div>

        {/* Recent */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px] flex flex-col">
          <h3 className="text-[16px] font-bold text-[#2d3748] m-0 pb-[16px] border-b border-[#e2e8f0] flex items-center">
            <span className="flex-1">🕐 Phản ánh mới nhất</span>
            <button
              onClick={onNavigateToPetitions}
              className="bg-transparent border-none text-[#0a8c24] cursor-pointer text-[14px] font-semibold"
            >
              Xem tất cả →
            </button>
          </h3>
          <div className="mt-[10px]">
            {(stats.recentPetitions || []).map(p => (
              <div key={p.id} className="flex gap-[12px] py-[14px] px-[12px] border-b border-[#e2e8f0] cursor-pointer transition-colors duration-200 rounded-[8px] hover:bg-[#f8fafc]"
                onClick={() => onOpenDetail(p.id)}
              >
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold text-[14px] truncate text-[#2d3748]">
                    {p.title}
                  </div>
                  <div className="text-[12px] text-[#718096] mt-[4px]">
                    {p.category} &bull; {formatDate(p.createdAt)}
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] items-end shrink-0">
                  <StatusBadge status={p.status} />
                  {p.aiPriority && <PriorityBadge priority={p.aiPriority} />}
                </div>
              </div>
            ))}
            {(!stats.recentPetitions || stats.recentPetitions.length === 0) && (
              <p className="text-[#718096] text-[14px] text-center py-[20px]">
                Chưa có phản ánh nào
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
