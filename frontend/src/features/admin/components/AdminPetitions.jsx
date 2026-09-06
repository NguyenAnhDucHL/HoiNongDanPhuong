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
    <div className="flex-1 overflow-y-auto p-[24px]">
      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-[20px] bg-white p-[16px] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0]">
        
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-[16px] w-[16px] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-[36px] pr-[12px] py-[9px] border border-[#cbd5e1] rounded-[8px] text-[14px] outline-none bg-white focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] transition-colors"
            placeholder="Tìm kiếm theo tên, tiêu đề, mã..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 relative">
          <select
            className="w-full px-[12px] py-[9px] border border-[#cbd5e1] rounded-[8px] text-[14px] outline-none bg-white focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] transition-colors appearance-none cursor-pointer"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          >
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3 relative">
          <select
            className="w-full px-[12px] py-[9px] border border-[#cbd5e1] rounded-[8px] text-[14px] outline-none bg-white focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] transition-colors appearance-none cursor-pointer"
            value={filterCategory}
            onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
          >
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Tất cả lĩnh vực' : c}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex gap-2">
          <button
            className="flex-1 bg-[#0a8c24] hover:bg-[#07701c] text-white px-[12px] py-[9px] rounded-[8px] font-medium text-[14px] transition-colors shadow-sm flex items-center justify-center gap-1"
            onClick={() => { setSearch(searchInput); setPage(1); }}
          >
            Tìm
          </button>
          <button
            className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 px-[12px] py-[9px] rounded-[8px] font-medium text-[14px] transition-colors shadow-sm flex items-center justify-center"
            onClick={() => {
              setSearchInput(''); setSearch('');
              setFilterStatus('all'); setFilterCategory('all'); setPage(1);
            }}
            title="Xóa bộ lọc"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>
      </div>

      <div className="mb-[16px] text-[#718096] text-[14px] font-medium">
        Tổng cộng: <strong className="text-[#2d3748]">{total}</strong> phản ánh, kiến nghị
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] overflow-x-auto">
        {loadingList ? (
          <div className="py-[60px] text-center text-[#718096]">
            <div className="w-[30px] h-[30px] border-[3px] border-[#e2e8f0] border-t-[#0a8c24] rounded-full animate-spin mx-auto mb-[12px]" />
            <div>Đang tải dữ liệu...</div>
          </div>
        ) : petitions.length === 0 ? (
          <div className="py-[60px] text-center">
            <span className="text-[48px] block mb-[16px] opacity-50">📭</span>
            <h3 className="text-[#718096] font-medium">Không tìm thấy phản ánh nào</h3>
          </div>
        ) : (
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Mã tra cứu</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Người gửi</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Khu phố</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Tiêu đề</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Lĩnh vực</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Trạng thái</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Phân tích AI</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Ngày gửi</th>
                <th className="px-[16px] py-[14px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {petitions.map(p => (
                <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[14px] font-mono font-semibold text-[#0a8c24]">
                    {p.trackingCode}
                  </td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[14px] font-semibold text-[#2d3748]">{p.fullName}</td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[14px] text-[#2d3748]">{p.ward || '-'}</td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[14px] text-[#2d3748] max-w-[220px] truncate" title={p.title}>
                    {p.title}
                  </td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[14px] text-[#2d3748]">{p.category}</td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0]"><StatusBadge status={p.status} /></td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0]">
                    {p.aiPriority ? (
                      <PriorityBadge priority={p.aiPriority} />
                    ) : (
                      <span className="text-[#718096] text-[12px]">-</span>
                    )}
                  </td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[14px] text-[#2d3748] whitespace-nowrap">
                    {formatDate(p.createdAt)}
                  </td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0]">
                    <button
                      onClick={() => onOpenDetail(p.id)}
                      className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] border-none px-[12px] py-[6px] rounded-[6px] text-[13px] font-semibold cursor-pointer transition-colors"
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
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-[16px] mt-[24px]">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className={`px-[16px] py-[8px] rounded-[6px] border border-[#e2e8f0] font-medium transition-colors ${page === 1 ? 'bg-[#f8fafc] text-[#cbd5e1] cursor-not-allowed' : 'bg-white text-[#2d3748] hover:bg-[#f8fafc] cursor-pointer'}`}
          >
            ← Trước
          </button>
          <div className="text-[14px] font-medium text-[#718096]">
            Trang {page} / {totalPages}
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className={`px-[16px] py-[8px] rounded-[6px] border border-[#e2e8f0] font-medium transition-colors ${page === totalPages ? 'bg-[#f8fafc] text-[#cbd5e1] cursor-not-allowed' : 'bg-white text-[#2d3748] hover:bg-[#f8fafc] cursor-pointer'}`}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
