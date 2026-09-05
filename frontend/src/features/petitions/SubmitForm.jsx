import React, { useState, useEffect } from 'react';
import { postFormData, fetchApi } from '../../lib/api';



const initialForm = {
  fullName: '', phone: '', cccd: '', ward: '', address: '',
  title: '', category: '', content: '',
};

export default function SubmitForm() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { trackingCode }
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    fetchApi('/wards')
      .then(data => setWards(data))
      .catch(() => { });

    fetchApi('/categories')
      .then(data => setCategories(data))
      .catch(() => { });
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Họ tên là bắt buộc';
    if (!form.title.trim()) errs.title = 'Tiêu đề là bắt buộc';
    if (!form.category) errs.category = 'Vui lòng chọn lĩnh vực';
    if (form.category === 'Khác' && !customCategory.trim()) errs.customCategory = 'Vui lòng nhập chi tiết lĩnh vực';
    if (!form.content.trim()) errs.content = 'Nội dung phản ánh là bắt buộc';
    if (form.content.trim().length < 20) errs.content = 'Nội dung quá ngắn (tối thiểu 20 ký tự)';
    if (form.phone && !/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => {
      const combined = [...prev, ...newFiles].slice(0, 10);
      return combined;
    });
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'category' && v === 'Khác') {
          fd.append(k, `Khác - ${customCategory.trim()}`);
        } else {
          fd.append(k, v);
        }
      });
      files.forEach(f => fd.append('images', f));

      const res = await postFormData('/petitions', fd);
      setSuccess({ trackingCode: res.trackingCode });
      setForm(initialForm);
      setCustomCategory('');
      setFiles([]);
    } catch (err) {
      setSubmitError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-dark)', marginBottom: 12 }}>
          Phản ánh đã được tiếp nhận thành công!
        </h3>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
          Hội Nông Dân Phường Cẩm Phả đã nhận được phản ánh của bạn và sẽ xem xét, xử lý trong thời gian sớm nhất.
        </p>
        <div style={{
          background: 'var(--green-light)', border: '2px solid var(--green-muted)',
          borderRadius: 'var(--radius)', padding: '20px', marginBottom: 24,
        }}>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>Mã tra cứu của bạn:</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#d32f2f', letterSpacing: 2 }}>
            {success.trackingCode}
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
            Lưu lại mã này để theo dõi trạng thái xử lý phản ánh
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setSuccess(null)}>
          📝 Gửi phản ánh khác
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        📋 Thông tin phản ánh, kiến nghị
      </h3>

      <div className="form-grid">
        {/* Họ tên */}
        <div className="form-group">
          <label>Họ và tên <span className="required">*</span></label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
          {errors.fullName && <span style={{ color: '#ef4444', fontSize: 13 }}>{errors.fullName}</span>}
        </div>

        {/* Số điện thoại */}
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0912 345 678"
          />
          {errors.phone && <span style={{ color: '#ef4444', fontSize: 13 }}>{errors.phone}</span>}
        </div>

        {/* CCCD */}
        <div className="form-group">
          <label>Số CCCD / CMND</label>
          <input
            type="text"
            name="cccd"
            value={form.cccd}
            onChange={handleChange}
            placeholder="012345678901"
          />
        </div>

        {/* Khu phố */}
        <div className="form-group">
          <label>Khu phố</label>
          <select name="ward" value={form.ward} onChange={handleChange}>
            <option value="">-- Chọn khu phố --</option>
            {wards.map(w => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Địa chỉ */}
        <div className="form-group full">
          <label>Địa chỉ cụ thể</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Số nhà, tên đường, tổ dân phố..."
          />
        </div>

        {/* Lĩnh vực */}
        <div className="form-group" style={{ gridColumn: form.category === 'Khác' ? '1 / -1' : 'auto' }}>
          <label>Lĩnh vực <span className="required">*</span></label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">-- Chọn lĩnh vực --</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          {errors.category && <span style={{ color: '#ef4444', fontSize: 13 }}>{errors.category}</span>}

          {form.category === 'Khác' && (
            <div style={{ marginTop: 12 }}>
              <label>Nhập lĩnh vực phản ánh <span className="required">*</span></label>
              <textarea
                value={customCategory}
                onChange={e => {
                  setCustomCategory(e.target.value);
                  if (errors.customCategory) setErrors(prev => ({ ...prev, customCategory: '' }));
                }}
                placeholder="VD: Cấp phép xây dựng, tranh chấp lối đi chung..."
                style={{ minHeight: 60 }}
              />
              {errors.customCategory && <span style={{ color: '#ef4444', fontSize: 13, display: 'block' }}>{errors.customCategory}</span>}
            </div>
          )}
        </div>

        {/* Tiêu đề */}
        <div className="form-group">
          <label>Tiêu đề phản ánh <span className="required">*</span></label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Mô tả ngắn gọn vấn đề..."
          />
          {errors.title && <span style={{ color: '#ef4444', fontSize: 13 }}>{errors.title}</span>}
        </div>

        {/* Nội dung */}
        <div className="form-group full">
          <label>Nội dung chi tiết <span className="required">*</span></label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Mô tả chi tiết vấn đề cần phản ánh, kiến nghị. Thông tin càng chi tiết, chúng tôi càng xử lý hiệu quả hơn..."
            style={{ minHeight: 150 }}
          />
          <span style={{ fontSize: 12, color: form.content.length < 20 ? '#ef4444' : 'var(--muted)' }}>
            {form.content.length} ký tự (tối thiểu 20)
          </span>
          {errors.content && <span style={{ color: '#ef4444', fontSize: 13 }}>{errors.content}</span>}
        </div>

        {/* Ảnh đính kèm */}
        <div className="form-group full">
          <label>Ảnh đính kèm (tối đa 10 ảnh, mỗi ảnh ≤ 5MB)</label>
          <label className="file-upload-area" htmlFor="image-upload">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <div style={{ color: 'var(--green-dark)' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
              <div style={{ fontWeight: 600 }}>Nhấn để chọn ảnh hoặc kéo thả vào đây</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Hỗ trợ: JPEG, PNG, GIF, WebP
              </div>
            </div>
          </label>

          {files.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 15 }}>
              {files.map((f, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    style={{
                      position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white',
                      border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold'
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {submitError && (
        <div className="alert alert-error" style={{ marginTop: 16 }}>
          ❌ {submitError}
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => { setForm(initialForm); setFiles([]); setErrors({}); setSubmitError(''); }}
          style={{ width: 'auto', minWidth: 140, padding: '12px 24px', background: 'var(--green-light)', color: 'var(--green-dark)' }}
        >
          🗑️ Xóa form
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: 'auto', minWidth: 200, padding: '12px 32px' }}
        >
          {loading ? (
            <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Đang gửi...</>
          ) : (
            '📤 Gửi phản ánh'
          )}
        </button>
      </div>

      {/* Notice */}
      <div className="alert alert-info" style={{ marginTop: 20 }}>
        🔒 Thông tin của bạn được bảo mật và chỉ được sử dụng để xử lý phản ánh.
        Sau khi gửi, bạn sẽ nhận được mã tra cứu để theo dõi tiến trình xử lý.
      </div>
    </form>
  );
}
