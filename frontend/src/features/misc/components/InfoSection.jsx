import React from 'react';

const InfoSection = () => {
  return (
    <section className="section container" id="gioi-thieu">
      <div className="grid3">
        <div className="card">
          <h3>DANH MỤC PHẢN ÁNH, KIẾN NGHỊ</h3>
          <ul className="list">
            <li><span><i className="badge-icon">🌱</i>LĨNH VỰC NÔNG - LÂM - NGƯ NGHIỆP</span><b>›</b></li>
            <li><span><i className="badge-icon">◈</i>VỆ SINH MÔI TRƯỜNG</span><b>›</b></li>
            <li><span><i className="badge-icon">▣</i>SẢN XUẤT KINH DOANH</span><b>›</b></li>
            <li><span><i className="badge-icon">♣</i>QUYỀN LỢI CHÍNH ĐÁNG CỦA HỘI VIÊN</span><b>›</b></li>
            <li><span><i className="badge-icon">▤</i>THỦ TỤC HÀNH CHÍNH</span><b>›</b></li>
          </ul>
        </div>
        <div className="card" id="huong-dan">
          <h3>QUY TRÌNH TIẾP NHẬN VÀ XỬ LÝ</h3>
          <ol className="process">
            <li><span className="step">1</span>
              <div><b>Tiếp nhận</b>Tiếp nhận phản ánh, kiến nghị qua hệ thống</div>
            </li>
            <li><span className="step">2</span>
              <div><b>Phân loại</b>Phân loại và chuyển đến đơn vị có thẩm quyền</div>
            </li>
            <li><span className="step">3</span>
              <div><b>Xử lý</b>Đơn vị có thẩm quyền xử lý theo quy định</div>
            </li>
            <li><span className="step">4</span>
              <div><b>Phản hồi</b>Phản hồi kết quả xử lý đến người phản ánh</div>
            </li>
            <li><span className="step">5</span>
              <div><b>Đánh giá</b>Người dân đánh giá mức độ hài lòng</div>
            </li>
          </ol>
        </div>
        <div className="card" id="tin-tuc">
          <h3>TIN TỨC - THÔNG BÁO</h3>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
