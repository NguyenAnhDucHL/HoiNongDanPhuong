import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero" id="trang-chu">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h2>CHUNG TAY XÂY DỰNG<br/>PHƯỜNG CẨM PHẢ PHÁT TRIỂN BỀN VỮNG, VĂN MINH VÀ HẠNH PHÚC</h2>
          <p><b>Lắng nghe – Tiếp nhận – Xử lý – Phản hồi</b></p>
          <p>Mọi ý kiến của bạn đều được trân trọng!</p>
        </div>
        <div className="hero-card">
          <h3>GỬI PHẢN ÁNH, KIẾN NGHỊ!</h3>
          <p>Hãy gửi phản ánh, kiến nghị của bạn để chúng tôi phục vụ bạn tốt hơn!</p>
          <button className="btn btn-primary" onClick={() => document.querySelector('#gui-phan-anh').scrollIntoView()}>➤ &nbsp;
            GỬI NGAY</button>
          <button className="btn btn-outline" onClick={() => document.querySelector('#tra-cuu').scrollIntoView()}>⌕ &nbsp; TRA CỨU
            KẾT QUẢ</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
