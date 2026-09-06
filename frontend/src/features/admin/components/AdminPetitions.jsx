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
      <div className="flex gap-[12px] mb-[20px] flex-wrap items-center bg-white p-[16px] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0]">
        <input
          type="text"
          className="px-[12px] py-[8px] border border-[#e2e8f0] rounded-[6px] text-[14px] outline-none bg-white min-w-[160px] w-auto focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24]"
          placeholder="🔍 Tìm kiếm theo tên, tiêu đề, mã, SĐT..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
        />
        <select
          className="px-[12px] py-[8px] border border-[#e2e8f0] rounded-[6px] text-[14px] outline-none bg-white min-w-[160px] w-auto focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24]"
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
        >
          {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          className="px-[12px] py-[8px] border border-[#e2e8f0] rounded-[6px] text-[14px] outline-none bg-white min-w-[160px] w-auto focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24]"
          value={filterCategory}
          onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
        >
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Tất cả lĩnh vực' : c}</option>)}
        </select>
        <button
          className="bg-[#0a8c24] hover:bg-[#07701c] text-white px-[16px] py-[8px] rounded-[6px] font-medium text-[14px] transition-colors shadow-sm"
          onClick={() => { setSearch(searchInput); setPage(1); }}
        >
          Tìm kiếm
        </button>
        <button
          className="bg-white hover:bg-[#f8fafc] text-[#475569] border border-[#cbd5e1] px-[16px] py-[8px] rounded-[6px] font-medium text-[14px] transition-colors shadow-sm"
          onClick={() => {
            setSearchInput(''); setSearch('');
            setFilterStatus('all'); setFilterCategory('all'); setPage(1);
          }}
        >
          Xóa lọc
        </button>
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
