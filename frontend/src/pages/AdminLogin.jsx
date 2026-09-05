import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchApi } from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('logout') === 'success') {
      setSuccess('Hẹn gặp lại!');
      navigate('/admin/login', { replace: true });
      // Tự động ẩn toast sau 4 giây
      setTimeout(() => setSuccess(''), 4000);
    } else if (params.get('error') === 'kicked_out') {
      setError('Tài khoản của bạn vừa được đăng nhập trên một thiết bị khác. Bạn đã bị đăng xuất khỏi hệ thống!');
      navigate('/admin/login', { replace: true });
    }

    // Already logged in?
    const token = localStorage.getItem('hnd_admin_token');
    if (token && !params.get('error')) navigate('/admin');
  }, [location.search, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      localStorage.setItem('hnd_admin_token', res.token);
      localStorage.setItem('hnd_admin_info', JSON.stringify(res.admin));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Toast đăng xuất — góc trên phải, nhỏ gọn */}
      {success && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          backgroundColor: '#ffffff',
          color: '#1e7e34',
          padding: '10px 14px 10px 12px',
          borderRadius: '8px',
          border: '1px solid #d4edda',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500',
          minWidth: 160,
          maxWidth: 280,
          animation: 'slideInRight 0.3s ease-out',
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: '50%',
            backgroundColor: '#28a745', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, flexShrink: 0, fontWeight: 'bold'
          }}>✓</span>
          <span style={{ flex: 1 }}>{success}</span>
          <button
            onClick={() => setSuccess('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d', fontSize: 16, lineHeight: 1, padding: '0 0 0 4px', flexShrink: 0 }}
            title="Đóng"
          >×</button>
        </div>
      )}
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="Logo" className="login-logo-img" />
          <h2>HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ</h2>
          <p>Cổng quản trị - Dành cho cán bộ</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 16,
                  color: 'var(--muted)',
                  padding: 4
                }}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              ❌ {error}
            </div>
          )}


          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Đang đăng nhập...</>
            ) : '🔑 Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <a href="/" style={{ color: 'var(--muted)', fontSize: 13 }}>← Quay về trang chính</a>
        </div>


      </div>
    </div>
  );
}
