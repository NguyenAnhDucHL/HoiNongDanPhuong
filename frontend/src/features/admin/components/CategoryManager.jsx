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
      <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 20 }}>Quản lý Lĩnh vực Phản ánh</h3>

      {error && (
        <div style={{ padding: 12, background: '#fef2f2', color: '#991b1b', borderRadius: 8, marginBottom: 20, border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Tên lĩnh vực mới..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          ➕ Thêm mới
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Đang tải...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Tên lĩnh vực</th>
              <th style={{ width: 150, textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map(c => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td>
                  {editingId === c.id ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--green)' }}
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleUpdate(c.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                  ) : (
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {editingId === c.id ? (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary" onClick={() => handleUpdate(c.id)} style={{ padding: '6px 12px' }}>Lưu</button>
                      <button className="btn btn-secondary" onClick={() => setEditingId(null)} style={{ padding: '6px 12px' }}>Hủy</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary" onClick={() => startEdit(c)} style={{ padding: '6px 12px' }}>Sửa</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(c.id)} style={{ padding: '6px 12px' }}>Xóa</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>
                  Chưa có lĩnh vực nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', gap: '15px' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--admin-border)',
              background: page === 1 ? '#f8fafc' : '#fff', color: page === 1 ? '#cbd5e1' : 'var(--admin-text)',
              cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 500
            }}
          >
            ← Trước
          </button>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--admin-text-muted)' }}>
            Trang {page} / {totalPages}
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--admin-border)',
              background: page === totalPages ? '#f8fafc' : '#fff', color: page === totalPages ? '#cbd5e1' : 'var(--admin-text)',
              cursor: page === totalPages ? 'not-allowed' : 'pointer', fontWeight: 500
            }}
          >
            Sau →
          </button>
        </div>
      )}

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
