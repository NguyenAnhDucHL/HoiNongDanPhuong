import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../../../lib/api';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function PostManager({ type, title }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/posts?type=${type}&limit=100`);
      setPosts(res.data || []);
    } catch (e) {
      alert('Lỗi tải dữ liệu: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const openForm = async (post = null) => {
    setCurrentPost(post);
    setPostTitle(post ? post.title : '');
    setImageFile(null);
    setShowModal(true);

    if (post) {
      setPostContent('Đang tải...');
      try {
        const res = await fetchApi(`/posts/${post.id}`);
        setPostContent(res.content || '');
      } catch (e) {
        setPostContent('Lỗi tải nội dung!');
      }
    } else {
      setPostContent('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postTitle || !postContent) return alert('Vui lòng nhập tiêu đề và nội dung');

    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', postTitle);
    formData.append('content', postContent);
    if (imageFile) formData.append('image', imageFile);

    try {
      const token = localStorage.getItem('hnd_admin_token');
      const url = currentPost ? `/api/posts/${currentPost.id}` : '/api/posts';
      const method = currentPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error(await res.text());

      setShowModal(false);
      loadPosts();
      alert('Lưu thành công!');
    } catch (e) {
      alert('Lỗi lưu dữ liệu: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetchApi(`/posts/${deleteId}`, { method: 'DELETE' });
      loadPosts();
      setDeleteId(null);
    } catch (e) {
      alert('Lỗi xóa: ' + e.message);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ color: 'var(--green-dark)', fontWeight: 800 }}>Quản lý {title}</h3>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Thêm mới</button>
      </div>

      <div className="petition-table">
        {loading ? <p>Đang tải...</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.image ? <img src={`/api/uploads/${p.image}`} width="50" height="50" style={{ objectFit: 'cover', borderRadius: 4 }} alt="" /> : '-'}</td>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openForm(p)} style={{ marginRight: 8 }}>✏️ Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan="5">Chưa có dữ liệu</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
            <h3 style={{ marginBottom: 20, color: 'var(--green-dark)' }}>{currentPost ? 'Sửa' : 'Thêm'} {title}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Tiêu đề</label>
                <input type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }} required />
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Hình ảnh đính kèm (nếu có)</label>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
                {currentPost?.image && !imageFile && <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Đã có ảnh. Tải lên ảnh mới sẽ ghi đè ảnh cũ.</p>}
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Nội dung chi tiết</label>
                <textarea rows={12} value={postContent} onChange={e => setPostContent(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }} required />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary">💾 Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Xóa"
      />
    </div>
  );
}
