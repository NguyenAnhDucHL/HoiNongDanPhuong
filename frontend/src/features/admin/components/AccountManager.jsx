import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';

export default function AccountManager() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoadingLogs(true);
        const data = await fetchApi('/auth/audit-logs');
        if (Array.isArray(data)) {
          setAuditLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, []);

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
      <h3 className="text-[#087c20] font-extrabold text-[18px] mb-[20px]">Quản lý Tài khoản</h3>

      <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[30px] max-w-[500px]">
        <h4 className="font-bold text-[#2d3748] text-[16px] mb-[20px]">Đổi mật khẩu</h4>

        {error && (
          <div className="p-[12px] bg-[#fef2f2] text-[#991b1b] rounded-[8px] mb-[20px] border border-[#fecaca]">
            {error}
          </div>
        )}

        {success && (
          <div className="p-[12px] bg-[#f0fdf4] text-[#166534] rounded-[8px] mb-[20px] border border-[#bbf7d0]">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
          <div>
            <label className="block mb-[8px] font-medium text-[#2d3748]">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                className="w-full px-[14px] py-[10px] border border-[#cbd5e1] rounded-[8px] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] pr-[40px]"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-[10px] top-[50%] -translate-y-[50%] bg-transparent border-none cursor-pointer text-[16px] opacity-60 hover:opacity-100 transition-opacity"
              >
                {showCurrent ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-[8px] font-medium text-[#2d3748]">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                className="w-full px-[14px] py-[10px] border border-[#cbd5e1] rounded-[8px] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] pr-[40px]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-[10px] top-[50%] -translate-y-[50%] bg-transparent border-none cursor-pointer text-[16px] opacity-60 hover:opacity-100 transition-opacity"
              >
                {showNew ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-[8px] font-medium text-[#2d3748]">Nhập lại mật khẩu mới</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full px-[14px] py-[10px] border border-[#cbd5e1] rounded-[8px] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] pr-[40px]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-[10px] top-[50%] -translate-y-[50%] bg-transparent border-none cursor-pointer text-[16px] opacity-60 hover:opacity-100 transition-opacity"
              >
                {showConfirm ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <div className="mt-[10px]">
            <button
              type="submit"
              className="w-full bg-[#0a8c24] hover:bg-[#07701c] text-white px-[16px] py-[12px] rounded-[8px] font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[30px] mt-[30px]">
        <h4 className="font-bold text-[#2d3748] text-[16px] mb-[20px]">Nhật ký bảo mật (Gần đây)</h4>
        
        {loadingLogs ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : auditLogs.length === 0 ? (
          <p className="text-gray-500">Chưa có dữ liệu bảo mật.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Thời gian</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Hành động</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Địa chỉ IP</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Trình duyệt (User Agent)</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        log.action.includes('SUCCESS') ? 'bg-green-100 text-green-800' :
                        log.action.includes('FAILED') ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{log.ipAddress || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate" title={log.userAgent}>
                      {log.userAgent || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
