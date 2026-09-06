import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { useNavigate } from 'react-router-dom';

// Map icon theo tên danh mục (fallback là 📋)
const getCategoryIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('nông') || n.includes('lâm') || n.includes('ngư')) return '🌱';
  if (n.includes('môi trường') || n.includes('vệ sinh')) return '♻️';
  if (n.includes('kinh doanh') || n.includes('sản xuất')) return '🏭';
  if (n.includes('hội viên') || n.includes('quyền lợi')) return '🤝';
  if (n.includes('hành chính') || n.includes('thủ tục')) return '📄';
  if (n.includes('đất đai') || n.includes('thủy lợi')) return '🌾';
  if (n.includes('phân bón') || n.includes('thuốc')) return '🧪';
  if (n.includes('vay') || n.includes('hỗ trợ')) return '💰';
  if (n.includes('thiên tai') || n.includes('dịch bệnh')) return '⚠️';
  return '📋';
};

const InfoSection = ({ onSelectCategory }) => {
  const [settings, setSettings] = useState({});
  const [news, setNews] = useState([]);
  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsRes, newsRes, guidesRes, categoriesRes] = await Promise.all([
          fetchApi('/settings'),
          fetchApi('/posts?type=news&limit=5'),
          fetchApi('/posts?type=guide&limit=5'),
          fetchApi('/categories'),
        ]);
        setSettings(settingsRes || {});
        setNews(newsRes.data || []);
        setGuides(guidesRes.data || []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu InfoSection:", error);
      }
    };
    loadData();
  }, []);

  const handleCategoryClick = (categoryName) => {
    // Pre-select category trong form
    if (onSelectCategory) onSelectCategory(categoryName);
    // Cuộn mượt xuống form gửi phản ánh
    const el = document.getElementById('gui-phan-anh');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight nhẹ form để thu hút sự chú ý
      el.style.transition = 'box-shadow 0.4s';
      el.style.boxShadow = '0 0 0 3px rgba(34,139,34,0.3)';
      setTimeout(() => { el.style.boxShadow = ''; }, 1500);
    }
  };

  return (
    <section className="container mx-auto px-4 py-[48px] pb-[20px]" id="gioi-thieu">
      {settings.intro_title && (
        <div className="mb-[30px] text-center">
          <h2 className="text-[#087c20] text-2xl font-bold mb-[10px]">{settings.intro_title}</h2>
          <p className="text-[#4e5e53] whitespace-pre-wrap leading-[1.6] max-w-[800px] mx-auto">
            {settings.intro_content}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
        {/* DANH MỤC PHẢN ÁNH — fetch từ API, không hardcode */}
        <div className="bg-white border border-[#e5ece7] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-[20px]">
          <h3 className="text-[#087c20] text-[18px] font-bold border-b border-[#e5ece7] pb-[10px] mb-[10px]">DANH MỤC PHẢN ÁNH, KIẾN NGHỊ</h3>
          {categories.length > 0 ? (
            <ul className="list-none max-h-[280px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c8e6c9 transparent' }}>
              {categories.map(c => (
                <li
                  key={c.id}
                  onClick={() => handleCategoryClick(c.name)}
                  className="p-[12px_4px] border-b border-[#edf2ee] flex justify-between items-center gap-[12px] cursor-pointer hover:bg-[#f9fdfa] transition-colors group"
                  title={`Gửi phản ánh về: ${c.name}`}
                >
                  <span className="flex items-center gap-3 font-semibold text-[#18301e] text-[15px]">
                    <i className="w-[30px] h-[30px] rounded-full grid place-items-center bg-[#eaf8ec] text-[#149b2f] text-[15px] not-italic">{getCategoryIcon(c.name)}</i>
                    {c.name.toUpperCase()}
                  </span>
                  <b className="text-[#a5bda8] text-xl group-hover:text-[#149b2f] transition-colors">›</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#4e5e53] text-[14px] mt-[10px]">Đang tải danh mục...</p>
          )}
        </div>

        <div className="bg-white border border-[#e5ece7] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-[20px]" id="huong-dan">
          <h3 className="text-[#087c20] text-[18px] font-bold border-b border-[#e5ece7] pb-[10px] mb-[15px]">QUY TRÌNH &amp; HƯỚNG DẪN</h3>
          {guides.length > 0 ? (
            <ul className="list-none">
              {guides.map(g => (
                <li 
                  key={g.id} 
                  onClick={() => navigate(`/post/${g.id}`)} 
                  className="p-[12px_4px] border-b border-[#edf2ee] flex justify-between items-center gap-[12px] cursor-pointer hover:bg-[#f9fdfa] transition-colors group"
                >
                  <span className="font-semibold text-[#18301e] text-[15px]">{g.title}</span>
                  <b className="text-[#a5bda8] text-xl group-hover:text-[#149b2f] transition-colors">›</b>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="list-none relative before:content-[''] before:absolute before:left-[15px] before:top-[15px] before:bottom-[15px] before:w-[2px] before:bg-[#cfe8d4]">
              <li className="relative flex gap-[13px] mb-[13px]">
                <span className="w-[30px] h-[30px] rounded-full bg-[#149b2f] text-white flex-shrink-0 grid place-items-center font-extrabold z-10">1</span>
                <div><b className="block text-[#18301e] mb-1">Tiếp nhận</b><span className="text-[14px] text-[#4e5e53]">Tiếp nhận phản ánh, kiến nghị qua hệ thống</span></div>
              </li>
              <li className="relative flex gap-[13px] mb-[13px]">
                <span className="w-[30px] h-[30px] rounded-full bg-[#149b2f] text-white flex-shrink-0 grid place-items-center font-extrabold z-10">2</span>
                <div><b className="block text-[#18301e] mb-1">Phân loại</b><span className="text-[14px] text-[#4e5e53]">Phân loại và chuyển đến đơn vị có thẩm quyền</span></div>
              </li>
              <li className="relative flex gap-[13px] mb-[13px]">
                <span className="w-[30px] h-[30px] rounded-full bg-[#149b2f] text-white flex-shrink-0 grid place-items-center font-extrabold z-10">3</span>
                <div><b className="block text-[#18301e] mb-1">Xử lý</b><span className="text-[14px] text-[#4e5e53]">Đơn vị có thẩm quyền xử lý theo quy định</span></div>
              </li>
              <li className="relative flex gap-[13px] mb-[13px]">
                <span className="w-[30px] h-[30px] rounded-full bg-[#149b2f] text-white flex-shrink-0 grid place-items-center font-extrabold z-10">4</span>
                <div><b className="block text-[#18301e] mb-1">Phản hồi</b><span className="text-[14px] text-[#4e5e53]">Phản hồi kết quả xử lý đến người phản ánh</span></div>
              </li>
            </ol>
          )}
        </div>

        <div className="bg-white border border-[#e5ece7] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-[20px]" id="tin-tuc">
          <h3 className="text-[#087c20] text-[18px] font-bold border-b border-[#e5ece7] pb-[10px] mb-[10px]">TIN TỨC - THÔNG BÁO</h3>
          {news.length > 0 ? (
            <ul className="list-none">
              {news.map(n => {
                let thumb = n.image;
                if (n.images) {
                  try {
                    const parsed = JSON.parse(n.images);
                    if (parsed.length > 0) thumb = parsed[0];
                  } catch (e) { }
                }
                return (
                  <li 
                    key={n.id} 
                    onClick={() => navigate(`/post/${n.id}`)} 
                    className="flex flex-col py-[10px] border-b border-[#f0f0f0] cursor-pointer hover:bg-[#f9fdfa] transition-colors"
                  >
                    <div className="flex gap-[10px]">
                      {thumb && <img src={`/uploads/${thumb}`} alt="" className="w-[60px] h-[60px] object-cover rounded-[4px]" />}
                      <div>
                        <span className="font-semibold block text-[14px] text-[#18301e] leading-snug mb-1 hover:text-[#149b2f] transition-colors">{n.title}</span>
                        <small className="text-[#4e5e53] text-[12px]">{new Date(n.createdAt).toLocaleDateString('vi-VN')}</small>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[#4e5e53] text-[14px] mt-[10px]">Chưa có tin tức nào.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
