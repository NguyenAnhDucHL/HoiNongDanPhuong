import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    intro_title: '',
    intro_content: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      alert('✅ Lưu cấu hình thành công!');
    } catch (e) {
      alert('❌ Lỗi lưu cấu hình: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Đang tải cấu hình...</p>;

  return (
    <div style={{ maxWidth: 800 }}>
      <h3 style={{ color: 'var(--green-dark)', fontWeight: 800, marginBottom: 20 }}>⚙️ Cấu hình Giới thiệu chung</h3>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Tiêu đề phần Giới thiệu (trên trang chủ)</label>
            <input
              type="text"
              value={settings.intro_title}
              onChange={e => setSettings({ ...settings, intro_title: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
              placeholder="VD: Hội Nông Dân Phường Cẩm Phả..."
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Nội dung Giới thiệu</label>
            <textarea
              rows={8}
              value={settings.intro_content}
              onChange={e => setSettings({ ...settings, intro_content: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, lineHeight: 1.6 }}
              placeholder="Nhập nội dung giới thiệu sẽ hiển thị trên trang chủ..."
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : '💾 Lưu Cấu Hình'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
