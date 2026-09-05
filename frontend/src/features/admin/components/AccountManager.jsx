import React, { useState } from 'react';
import { fetchApi } from '../../../lib/api';

export default function AccountManager() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchApi('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setSuccess(res.message || 'Đổi mật khẩu thành công.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError(e.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 20 }}>Quản lý Tài khoản</h3>

      <div className="admin-card" style={{ maxWidth: 500, padding: 30 }}>
        <h4 style={{ marginBottom: 20, color: 'var(--admin-text)' }}>Đổi mật khẩu</h4>

        {error && (
          <div style={{ padding: 12, background: '#fef2f2', color: '#991b1b', borderRadius: 8, marginBottom: 20, border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: 12, background: '#f0fdf4', color: '#166534', borderRadius: 8, marginBottom: 20, border: '1px solid #bbf7d0' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--admin-text)' }}>Mật khẩu hiện tại</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--admin-text)' }}>Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--admin-text)' }}>Nhập lại mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
