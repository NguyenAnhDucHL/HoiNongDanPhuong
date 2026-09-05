import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../../../lib/api';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function PostManager({ type, title }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/posts?type=${type}&limit=100`);
      setPosts(res.data || []);
    } catch (e) {
      setAlertMsg('Lỗi tải dữ liệu: ' + e.message);
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
    setNewFiles([]);

    let parsedImages = [];
    if (post) {
      if (post.images) {
        try { parsedImages = JSON.parse(post.images); } catch (e) { }
      } else if (post.image) {
        parsedImages = [post.image];
      }
    }
    setExistingImages(parsedImages);
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
    if (!postTitle || !postContent) {
      setAlertMsg('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', postTitle);
    formData.append('content', postContent);
    formData.append('existingImages', JSON.stringify(existingImages));

    newFiles.forEach(file => {
      formData.append('images', file);
    });

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
      setAlertMsg('Lưu thành công!');
    } catch (e) {
      setAlertMsg('Lỗi lưu dữ liệu: ' + e.message);
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
      setAlertMsg('Lỗi xóa: ' + e.message);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ color: 'var(--green-dark)', fontWeight: 800 }}>Quản lý {title}</h3>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Thêm mới</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {loading ? <p>Đang tải...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th style={{ width: 100 }}>Ảnh</th>
                <th>Tiêu đề</th>
                <th style={{ width: 120 }}>Ngày tạo</th>
                <th style={{ width: 160, textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => {
                let thumb = p.image;
                if (p.images) {
                  try {
                    const parsed = JSON.parse(p.images);
                    if (parsed.length > 0) thumb = parsed[0];
                  } catch (e) { }
                }
                return (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{thumb ? <img src={`/uploads/${thumb}`} width="50" height="50" style={{ objectFit: 'cover', borderRadius: 4, display: 'block' }} alt="" /> : <span style={{ color: '#ccc' }}>-</span>}</td>
                    <td style={{ fontWeight: 600 }}>{p.title}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" onClick={() => openForm(p)} style={{ padding: '6px 12px' }}>Sửa</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px' }}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Hình ảnh đính kèm (có thể chọn nhiều)</label>
                <input type="file" multiple onChange={e => setNewFiles(Array.from(e.target.files))} accept="image/*" />

                {existingImages.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                    {existingImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={`/uploads/${img}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} alt="" />
                        <button
                          type="button"
                          onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute', top: -5, right: -5, background: 'red', color: 'white',
                            border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {newFiles.length > 0 && <p style={{ fontSize: 13, color: 'var(--green-dark)', marginTop: 8 }}>+ {newFiles.length} ảnh mới được chọn</p>}
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
