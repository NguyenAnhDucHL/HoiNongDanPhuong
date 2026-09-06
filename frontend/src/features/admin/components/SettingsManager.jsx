import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    intro_title: '',
    intro_content: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/settings');
      setSettings({
        intro_title: res.intro_title || '',
        intro_content: res.intro_content || ''
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      setAlertMsg('✅ Lưu cấu hình thành công!');
    } catch (e) {
      setAlertMsg('❌ Lỗi lưu cấu hình: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[#718096]">Đang tải cấu hình...</p>;

  return (
    <div className="max-w-[800px]">
      <h3 className="text-[#087c20] font-extrabold text-[18px] mb-[20px]">⚙️ Cấu hình Giới thiệu chung</h3>

      <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0] p-[24px]">
        <div className="flex flex-col gap-[16px]">
          <div>
            <label className="font-semibold block mb-[8px] text-[#2d3748]">Tiêu đề phần Giới thiệu (trên trang chủ)</label>
            <input
              type="text"
              value={settings.intro_title}
              onChange={e => setSettings({ ...settings, intro_title: e.target.value })}
              className="w-full px-[14px] py-[10px] border border-[#cbd5e1] rounded-[8px] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24]"
              placeholder="VD: Hội Nông Dân Phường Cẩm Phả..."
            />
          </div>

          <div>
            <label className="font-semibold block mb-[8px] text-[#2d3748]">Nội dung Giới thiệu</label>
            <textarea
              rows={8}
              value={settings.intro_content}
              onChange={e => setSettings({ ...settings, intro_content: e.target.value })}
              className="w-full px-[14px] py-[10px] border border-[#cbd5e1] rounded-[8px] outline-none focus:border-[#0a8c24] focus:ring-1 focus:ring-[#0a8c24] leading-[1.6]"
              placeholder="Nhập nội dung giới thiệu sẽ hiển thị trên trang chủ..."
            />
          </div>

          <div className="mt-[10px]">
            <button
              className="bg-[#0a8c24] hover:bg-[#07701c] text-white px-[16px] py-[10px] rounded-[8px] font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : '💾 Lưu Cấu Hình'}
            </button>
          </div>
        </div>
      </div>

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
