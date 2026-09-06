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

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/posts?type=${type}&page=${page}&limit=${limit}`);
      setPosts(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      setAlertMsg('Lỗi tải dữ liệu: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [type, page]);

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
      <div className="flex justify-between items-center mb-[20px]">
        <h3 className="text-[#087c20] font-extrabold text-[18px]">Quản lý {title}</h3>
        <button className="bg-[#0a8c24] hover:bg-[#07701c] text-white px-[16px] py-[8px] rounded-[8px] font-medium transition-colors shadow-sm" onClick={() => openForm()}>+ Thêm mới</button>
      </div>

      <div className="mt-[20px]">
        {loading ? <p className="text-center py-[40px] text-[#718096]">Đang tải...</p> : (
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] overflow-x-auto">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr>
                  <th className="w-[60px] px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">ID</th>
                  <th className="w-[100px] px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Ảnh</th>
                  <th className="px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Tiêu đề</th>
                  <th className="w-[120px] px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Ngày tạo</th>
                  <th className="w-[160px] text-right px-[16px] py-[12px] bg-[#f8fafc] text-[#718096] font-semibold text-[12px] uppercase tracking-[0.05em] border-b border-[#e2e8f0]">Thao tác</th>
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
                    <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[#718096]">#{p.id}</td>
                      <td className="px-[16px] py-[14px] border-b border-[#e2e8f0]">
                        {thumb ? <img src={`/uploads/${thumb}`} className="w-[50px] h-[50px] object-cover rounded-[4px] block" alt="" /> : <span className="text-[#cbd5e1]">-</span>}
                      </td>
                      <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] font-medium text-[#2d3748]">{p.title}</td>
                      <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-[#718096]">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-[16px] py-[14px] border-b border-[#e2e8f0] text-right">
                        <div className="flex gap-[6px] justify-end">
                          <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-[12px] py-[6px] rounded-[6px] font-medium text-[13px] transition-colors" onClick={() => openForm(p)}>Sửa</button>
                          <button className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] px-[12px] py-[6px] rounded-[6px] font-medium text-[13px] transition-colors" onClick={() => handleDelete(p.id)}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {posts.length === 0 && <tr><td colSpan="5" className="text-center py-[30px] text-[#718096] border-b border-[#e2e8f0]">Chưa có dữ liệu</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {Math.ceil(total / limit) > 0 && (
        <div className="flex justify-center items-center gap-[16px] mt-[24px]">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className={`px-[16px] py-[8px] rounded-[6px] border border-[#e2e8f0] font-medium transition-colors ${page === 1 ? 'bg-[#f8fafc] text-[#cbd5e1] cursor-not-allowed' : 'bg-white text-[#2d3748] hover:bg-[#f8fafc] cursor-pointer'}`}
          >
            ← Trước
          </button>
          <div className="text-[14px] font-medium text-[#718096]">
            Trang {page} / {Math.ceil(total / limit)}
          </div>
          <button
            disabled={page === Math.ceil(total / limit)}
            onClick={() => setPage(p => p + 1)}
            className={`px-[16px] py-[8px] rounded-[6px] border border-[#e2e8f0] font-medium transition-colors ${page === Math.ceil(total / limit) ? 'bg-[#f8fafc] text-[#cbd5e1] cursor-not-allowed' : 'bg-white text-[#2d3748] hover:bg-[#f8fafc] cursor-pointer'}`}
          >
            Sau →
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-[16px]">
          <div className="bg-white p-[24px] rounded-[12px] w-full max-w-[700px] max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="text-[#087c20] font-bold text-[18px] mb-[20px]">{currentPost ? 'Sửa' : 'Thêm'} {title}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              <div>
                <label className="block font-semibold text-[#2d3748] mb-[6px]">Tiêu đề</label>
                <input type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} className="w-full px-[14px] py-[10px] border border-[#cbd5e1] rounded-[8px] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24]" required />
              </div>
              <div>
                <label className="block font-semibold text-[#2d3748] mb-[6px]">Hình ảnh đính kèm (có thể chọn nhiều)</label>
                <input type="file" multiple onChange={e => setNewFiles(Array.from(e.target.files))} accept="image/*" className="text-[#718096]" />

                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-[10px] mt-[12px]">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={`/uploads/${img}`} className="w-[60px] h-[60px] object-cover rounded-[4px] border border-[#e2e8f0]" alt="" />
                        <button
                          type="button"
                          onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-[6px] -right-[6px] bg-[#ef4444] text-white rounded-full w-[20px] h-[20px] flex items-center justify-center text-[12px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#dc2626]"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {newFiles.length > 0 && <p className="text-[13px] text-[#087c20] mt-[8px] font-medium">+ {newFiles.length} ảnh mới được chọn</p>}
              </div>
              <div>
                <label className="block font-semibold text-[#2d3748] mb-[6px]">Nội dung chi tiết</label>
                <textarea rows={12} value={postContent} onChange={e => setPostContent(e.target.value)} className="w-full px-[14px] py-[10px] border border-[#cbd5e1] rounded-[8px] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24]" required />
              </div>
              <div className="flex gap-[12px] justify-end mt-[10px]">
                <button type="button" className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-[16px] py-[8px] rounded-[8px] font-medium transition-colors" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                <button type="submit" className="bg-[#0a8c24] hover:bg-[#07701c] text-white px-[16px] py-[8px] rounded-[8px] font-medium transition-colors">💾 Lưu lại</button>
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
