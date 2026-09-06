import React, { useState, useEffect } from 'react';
import { postFormData, fetchApi } from '../../lib/api';



const initialForm = {
  fullName: '', phone: '', cccd: '', ward: '', address: '',
  title: '', category: '', content: '',
};

export default function SubmitForm({ selectedCategory = '' }) {
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

  // Khi người dùng click danh mục từ InfoSection → tự điền vào dropdown
  useEffect(() => {
    if (selectedCategory) {
      setForm(prev => ({ ...prev, category: selectedCategory }));
      setErrors(prev => ({ ...prev, category: '' }));
    }
  }, [selectedCategory]);

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
      <div className="max-w-[850px] mx-auto bg-white border border-[#e5ece7] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-[16px] text-center p-6 md:p-8">
        <div className="text-[64px] mb-[16px]">✅</div>
        <h3 className="text-[22px] font-extrabold text-[#087c20] mb-[12px]">
          Phản ánh đã được tiếp nhận thành công!
        </h3>
        <p className="text-[#4e5e53] mb-[20px]">
          Hội Nông Dân Phường Cẩm Phả đã nhận được phản ánh của bạn và sẽ xem xét, xử lý trong thời gian sớm nhất.
        </p>
        <div className="bg-[#e9f8eb] border-2 border-[#cfe8d4] rounded-lg p-[20px] mb-[24px]">
          <p className="text-[14px] text-[#4e5e53] mb-[8px]">Mã tra cứu của bạn:</p>
          <p className="text-[28px] font-extrabold text-[#d32f2f] tracking-[2px]">
            {success.trackingCode}
          </p>
          <p className="text-[13px] text-[#4e5e53] mt-[8px]">
            Lưu lại mã này để theo dõi trạng thái xử lý phản ánh
          </p>
        </div>
        <button className="bg-[#149b2f] hover:bg-[#087c20] text-white font-bold py-[12px] px-[24px] rounded-[8px] transition-colors" onClick={() => setSuccess(null)}>
          📝 Gửi phản ánh khác
        </button>
      </div>
    );
  }

  return (
    <form className="max-w-[850px] mx-auto bg-white border border-[#e5ece7] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-[16px] p-0" onSubmit={handleSubmit} noValidate>
      <div className="p-6 md:p-8">
      <h3 className="text-[17px] font-bold text-[#087c20] mb-[20px] flex items-center gap-[8px]">
        📋 Thông tin phản ánh, kiến nghị
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
        {/* Họ tên */}
        <div>
          <label className="font-semibold text-[14px] mb-[5px] block">Họ và tên <span className="text-[#ef4444]">*</span></label>
          <input
            className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
          {errors.fullName && <span className="text-[#ef4444] text-[13px]">{errors.fullName}</span>}
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="font-semibold text-[14px] mb-[5px] block">Số điện thoại</label>
          <input
            className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0912 345 678"
          />
          {errors.phone && <span className="text-[#ef4444] text-[13px]">{errors.phone}</span>}
        </div>

        {/* CCCD */}
        <div>
          <label className="font-semibold text-[14px] mb-[5px] block">Số CCCD / CMND</label>
          <input
            className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
            type="text"
            name="cccd"
            value={form.cccd}
            onChange={handleChange}
            placeholder="012345678901"
          />
        </div>

        {/* Khu phố */}
        <div>
          <label className="font-semibold text-[14px] mb-[5px] block">Khu phố</label>
          <select className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors" name="ward" value={form.ward} onChange={handleChange}>
            <option value="">-- Chọn khu phố --</option>
            {wards.map(w => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Địa chỉ */}
        <div className="col-span-1 md:col-span-2">
          <label className="font-semibold text-[14px] mb-[5px] block">Địa chỉ cụ thể</label>
          <input
            className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Số nhà, tên đường, tổ dân phố..."
          />
        </div>

        {/* Lĩnh vực */}
        <div className={form.category === 'Khác' ? 'col-span-1 md:col-span-2' : ''}>
          <label className="font-semibold text-[14px] mb-[5px] block">Lĩnh vực <span className="text-[#ef4444]">*</span></label>
          <select className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors" name="category" value={form.category} onChange={handleChange}>
            <option value="">-- Chọn lĩnh vực --</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          {errors.category && <span className="text-[#ef4444] text-[13px]">{errors.category}</span>}

          {form.category === 'Khác' && (
            <div className="mt-[12px]">
              <label className="font-semibold text-[14px] mb-[5px] block">Nhập lĩnh vực phản ánh <span className="text-[#ef4444]">*</span></label>
              <textarea
                className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors min-h-[60px]"
                value={customCategory}
                onChange={e => {
                  setCustomCategory(e.target.value);
                  if (errors.customCategory) setErrors(prev => ({ ...prev, customCategory: '' }));
                }}
                placeholder="VD: Cấp phép xây dựng, tranh chấp lối đi chung..."
              />
              {errors.customCategory && <span className="text-[#ef4444] text-[13px] block">{errors.customCategory}</span>}
            </div>
          )}
        </div>

        {/* Tiêu đề */}
        <div>
          <label className="font-semibold text-[14px] mb-[5px] block">Tiêu đề phản ánh <span className="text-[#ef4444]">*</span></label>
          <input
            className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Mô tả ngắn gọn vấn đề..."
          />
          {errors.title && <span className="text-[#ef4444] text-[13px]">{errors.title}</span>}
        </div>

        {/* Nội dung */}
        <div className="col-span-1 md:col-span-2">
          <label className="font-semibold text-[14px] mb-[5px] block">Nội dung chi tiết <span className="text-[#ef4444]">*</span></label>
          <textarea
            className="w-full p-[11px_12px] border border-[#cddbd1] rounded-[8px] outline-none focus:border-[#149b2f] transition-colors min-h-[150px]"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Mô tả chi tiết vấn đề cần phản ánh, kiến nghị. Thông tin càng chi tiết, chúng tôi càng xử lý hiệu quả hơn..."
          />
          <span className={`text-[12px] ${form.content.length < 20 ? 'text-[#ef4444]' : 'text-[#4e5e53]'}`}>
            {form.content.length} ký tự (tối thiểu 20)
          </span>
          {errors.content && <span className="text-[#ef4444] text-[13px] block">{errors.content}</span>}
        </div>

        {/* Ảnh đính kèm */}
        <div className="col-span-1 md:col-span-2">
          <label className="font-semibold text-[14px] mb-[5px] block">Ảnh đính kèm (tối đa 10 ảnh, mỗi ảnh ≤ 5MB)</label>
          <label className="block border-2 border-dashed border-[#cddbd1] rounded-[8px] p-[25px_15px] text-center cursor-pointer hover:border-[#149b2f] hover:bg-[#f9fdfa] transition-colors" htmlFor="image-upload">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-[#087c20]">
              <div className="text-[28px] mb-[6px]">📷</div>
              <div className="font-semibold">Nhấn để chọn ảnh hoặc kéo thả vào đây</div>
              <div className="text-[13px] text-[#4e5e53] mt-[4px]">
                Hỗ trợ: JPEG, PNG, GIF, WebP
              </div>
            </div>
          </label>

          {files.length > 0 && (
            <div className="flex gap-[10px] flex-wrap mt-[15px]">
              {files.map((f, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    className="w-[70px] h-[70px] object-cover rounded-[6px] border border-[#ddd]"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label={`Xóa ảnh ${f.name}`}
                    className="absolute -top-[8px] -right-[8px] bg-[#ef4444] text-white border-none rounded-full w-[22px] h-[22px] cursor-pointer flex items-center justify-center text-[12px] font-bold z-10"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {submitError && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] rounded-[8px] p-[12px_16px] font-medium flex items-center gap-[10px] mt-[16px]">
          ❌ {submitError}
        </div>
      )}

      <div className="mt-[32px] flex flex-row items-center gap-[16px]">
        <button
          type="button"
          onClick={() => { setForm(initialForm); setFiles([]); setErrors({}); setSubmitError(''); }}
          className="bg-transparent border-none text-[#64748b] p-[12px_16px] cursor-pointer text-[15px] font-medium flex items-center gap-[6px] rounded-[8px] hover:bg-[#f1f5f9] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          Làm mới
        </button>
        
        <button
          type="submit"
          className="flex-1 bg-[#149b2f] hover:bg-[#087c20] text-white font-bold p-[14px_24px] text-[16px] rounded-[8px] transition-colors flex justify-center items-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <><div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-white"></div> Đang xử lý...</>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              GỬI PHẢN ÁNH
            </>
          )}
        </button>
      </div>

      {/* Notice */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] rounded-[8px] p-[12px_16px] font-medium flex items-center gap-[10px] mt-[20px]">
        🔒 Thông tin của bạn được bảo mật và chỉ được sử dụng để xử lý phản ánh.
        Sau khi gửi, bạn sẽ nhận được mã tra cứu để theo dõi tiến trình xử lý.
      </div>
      </div>
    </form>
  );
}
