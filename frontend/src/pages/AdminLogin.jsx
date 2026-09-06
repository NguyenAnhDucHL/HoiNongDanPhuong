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
    <div className="min-h-screen bg-gradient-to-br from-[#0a8c24] to-[#075f19] flex items-center justify-center p-4">
      {/* Toast đăng xuất */}
      {success && (
        <div className="fixed top-5 right-5 z-[9999] bg-white text-[#1e7e34] py-2.5 px-3 rounded-lg border border-[#d4edda] shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center gap-2 text-sm font-medium min-w-[160px] max-w-[280px] animate-[slideInRight_0.3s_ease-out]">
          <span className="w-5 h-5 rounded-full bg-[#28a745] text-white flex items-center justify-center text-xs flex-shrink-0 font-bold">✓</span>
          <span className="flex-1">{success}</span>
          <button
            onClick={() => setSuccess('')}
            className="bg-transparent border-none cursor-pointer text-[#6c757d] text-base leading-none pl-1 flex-shrink-0"
            title="Đóng"
          >×</button>
        </div>
      )}

      <div className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-full max-w-[440px] p-8 md:p-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <img src="/logo.png" alt="Logo" className="w-[72px] h-[72px] mb-3" />
          <h2 className="text-[18px] md:text-[20px] font-extrabold text-[#087c20] uppercase leading-tight">HỘI NÔNG DÂN PHƯỜNG CẨM PHẢ</h2>
          <p className="text-[13px] text-[#6b7280] mt-1 font-medium">Cổng quản trị - Dành cho cán bộ</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-[14px] font-bold text-[#18301e] mb-1.5">
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
              className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[14px] font-bold text-[#18301e] mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                className="w-full p-[11px_12px] pr-10 border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base text-[#9ca3af] p-1 hover:text-[#4b5563] transition-colors"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] rounded-[8px] p-[10px_14px] text-[14px] font-medium flex items-center gap-2">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#149b2f] hover:bg-[#087c20] text-white font-bold py-[12px] rounded-[8px] transition-colors flex justify-center items-center gap-2 shadow-[0_4px_10px_rgba(20,155,47,0.3)] hover:shadow-[0_6px_15px_rgba(20,155,47,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              '🔑 Đăng nhập'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-[#6b7280] text-[13px] hover:text-[#149b2f] transition-colors font-medium">← Quay về trang chính</a>
        </div>
      </div>
    </div>
  );
}
