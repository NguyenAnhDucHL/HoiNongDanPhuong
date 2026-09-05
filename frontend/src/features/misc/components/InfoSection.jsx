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
    <section className="section container" id="gioi-thieu">
      {settings.intro_title && (
        <div style={{ marginBottom: 30, textAlign: 'center' }}>
          <h2 style={{ color: 'var(--green-dark)', marginBottom: 10 }}>{settings.intro_title}</h2>
          <p style={{ color: 'var(--muted)', whiteSpace: 'pre-wrap', lineHeight: 1.6, maxWidth: 800, margin: '0 auto' }}>
            {settings.intro_content}
          </p>
        </div>
      )}

      <div className="grid3">
        {/* DANH MỤC PHẢN ÁNH — fetch từ API, không hardcode */}
        <div className="card">
          <h3>DANH MỤC PHẢN ÁNH, KIẾN NGHỊ</h3>
          {categories.length > 0 ? (
            <ul className="list">
              {categories.map(c => (
                <li
                  key={c.id}
                  onClick={() => handleCategoryClick(c.name)}
                  style={{ cursor: 'pointer' }}
                  title={`Gửi phản ánh về: ${c.name}`}
                >
                  <span>
                    <i className="badge-icon">{getCategoryIcon(c.name)}</i>
                    {c.name.toUpperCase()}
                  </span>
                  <b>›</b>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 10 }}>Đang tải danh mục...</p>
          )}
        </div>

        <div className="card" id="huong-dan">
          <h3>QUY TRÌNH &amp; HƯỚNG DẪN</h3>
          {guides.length > 0 ? (
            <ul className="list">
              {guides.map(g => (
                <li key={g.id} onClick={() => navigate(`/post/${g.id}`)} style={{ cursor: 'pointer' }}>
                  <span>{g.title}</span><b>›</b>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="process">
              <li><span className="step">1</span><div><b>Tiếp nhận</b>Tiếp nhận phản ánh, kiến nghị qua hệ thống</div></li>
              <li><span className="step">2</span><div><b>Phân loại</b>Phân loại và chuyển đến đơn vị có thẩm quyền</div></li>
              <li><span className="step">3</span><div><b>Xử lý</b>Đơn vị có thẩm quyền xử lý theo quy định</div></li>
              <li><span className="step">4</span><div><b>Phản hồi</b>Phản hồi kết quả xử lý đến người phản ánh</div></li>
            </ol>
          )}
        </div>

        <div className="card" id="tin-tuc">
          <h3>TIN TỨC - THÔNG BÁO</h3>
          {news.length > 0 ? (
            <ul className="list">
              {news.map(n => {
                let thumb = n.image;
                if (n.images) {
                  try {
                    const parsed = JSON.parse(n.images);
                    if (parsed.length > 0) thumb = parsed[0];
                  } catch(e) {}
                }
                return (
                  <li key={n.id} onClick={() => navigate(`/post/${n.id}`)} style={{ display: 'flex', flexDirection: 'column', padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {thumb && <img src={`/uploads/${thumb}`} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />}
                      <div>
                        <span style={{ fontWeight: 600, display: 'block', fontSize: 14 }}>{n.title}</span>
                        <small style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(n.createdAt).toLocaleDateString('vi-VN')}</small>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 10 }}>Chưa có tin tức nào.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
