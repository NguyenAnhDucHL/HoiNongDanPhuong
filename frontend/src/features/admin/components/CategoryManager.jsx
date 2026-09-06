import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/categories');
      setCategories(data);
    } catch (e) {
      setError('Lỗi tải danh sách: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Vui lòng nhập tên lĩnh vực');
      return;
    }
    setError('');
    try {
      const added = await fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim() }),
      });
      setCategories([...categories, added]);
      setNewName('');
      setAlertMsg('Thêm lĩnh vực thành công!');
    } catch (e) {
      setError(e.message || 'Lỗi thêm mới');
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    setError('');
    try {
      await fetchApi(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editName.trim() }),
      });
      setCategories(categories.map(c => c.id === id ? { ...c, name: editName.trim() } : c));
      setEditingId(null);
    } catch (e) {
      setError(e.message || 'Lỗi cập nhật');
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setError('');
    try {
      await fetchApi(`/categories/${deleteId}`, { method: 'DELETE' });
      setCategories(categories.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      setError(e.message || 'Lỗi xóa');
      setDeleteId(null);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE) || 1;
  const paginatedCategories = categories.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div>
      <h3 className="text-[#087c20] font-extrabold mb-[20px] text-[18px]">Quản lý Lĩnh vực Phản ánh</h3>

      {error && (
        <div className="p-[12px] bg-[#fef2f2] text-[#991b1b] rounded-[8px] mb-[20px] border border-[#fecaca]">
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-[10px] mb-[30px]">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Tên lĩnh vực mới..."
          className="flex-1 px-[14px] py-[10px] rounded-[8px] border border-[#cbd5e1] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24]"
        />
        <button type="submit" className="bg-[#0a8c24] hover:bg-[#07701c] text-white px-[16px] py-[10px] rounded-[8px] font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm" disabled={loading}>
          ➕ Thêm mới
        </button>
      </form>

      {loading ? (
        <div className="text-center py-[40px] text-[#718096]">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] overflow-x-auto">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr>
                <th className="w-[80px] px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">ID</th>
                <th className="px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Tên lĩnh vực</th>
                <th className="w-[150px] text-right px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map(c => (
                <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[#718096]">#{c.id}</td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0]">
                    {editingId === c.id ? (
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-[10px] py-[6px] rounded-[6px] border border-[#0a8c24] outline-none focus:ring-1 focus:ring-[#0a8c24]"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleUpdate(c.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    ) : (
                      <span className="font-medium text-[#2d3748]">{c.name}</span>
                    )}
                  </td>
                  <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-right">
                    {editingId === c.id ? (
                      <div className="flex gap-[6px] justify-end">
                        <button className="bg-[#0a8c24] hover:bg-[#07701c] text-white px-[12px] py-[6px] rounded-[6px] font-medium text-[13px] transition-colors" onClick={() => handleUpdate(c.id)}>Lưu</button>
                        <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-[12px] py-[6px] rounded-[6px] font-medium text-[13px] transition-colors" onClick={() => setEditingId(null)}>Hủy</button>
                      </div>
                    ) : (
                      <div className="flex gap-[6px] justify-end">
                        <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-[12px] py-[6px] rounded-[6px] font-medium text-[13px] transition-colors" onClick={() => startEdit(c)}>Sửa</button>
                        <button className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] px-[12px] py-[6px] rounded-[6px] font-medium text-[13px] transition-colors" onClick={() => handleDelete(c.id)}>Xóa</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-[30px] text-[#718096] border-b border-[#e2e8f0]">
                    Chưa có lĩnh vực nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end items-center mt-[20px] gap-[15px]">
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

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa lĩnh vực này không? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Xóa"
      />

      <ConfirmModal
        isOpen={!!alertMsg}
        title="Thông báo"
        message={alertMsg}
        onConfirm={() => setAlertMsg('')}
        isAlert={true}
      />
    </div>
  );
}
