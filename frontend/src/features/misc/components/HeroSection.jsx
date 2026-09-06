import React from 'react';

const HeroSection = () => {
  return (
    <section 
      className="relative overflow-hidden bg-cover bg-center min-h-[365px] py-12" 
      id="trang-chu" 
      style={{ backgroundImage: "linear-gradient(rgba(238, 248, 239, 0.18), rgba(238, 248, 239, 0.18)), url('/bg-ha-long.jpg')" }}
    >
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-7 items-center max-w-5xl">
        <div className="md:col-span-7 bg-white/90 backdrop-blur-sm p-7 rounded-2xl border border-white/95">
          <h2 className="text-[#087c20] text-2xl md:text-[26px] font-bold leading-tight mb-4">
            CHUNG TAY XÂY DỰNG<br/>PHƯỜNG CẨM PHẢ PHÁT TRIỂN BỀN VỮNG, VĂN MINH VÀ HẠNH PHÚC
          </h2>
          <p className="font-bold text-[#18301e] mb-2">Lắng nghe – Tiếp nhận – Xử lý – Phản hồi</p>
          <p className="text-[#3d5e44]">Mọi ý kiến của bạn đều được trân trọng!</p>
        </div>
        <div className="md:col-span-5 bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col gap-4">
          <h3 className="text-[#087c20] text-xl font-bold">GỬI PHẢN ÁNH, KIẾN NGHỊ!</h3>
          <p className="text-[#3d5e44] text-sm">Hãy gửi phản ánh, kiến nghị của bạn để chúng tôi phục vụ bạn tốt hơn!</p>
          <button 
            className="w-full bg-[#149b2f] hover:bg-[#087c20] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            onClick={() => document.querySelector('#gui-phan-anh').scrollIntoView()}
          >
            ➤ GỬI NGAY
          </button>
          <button 
            className="w-full bg-white text-[#149b2f] border border-[#149b2f] hover:bg-[#eaf8ec] font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            onClick={() => document.querySelector('#tra-cuu').scrollIntoView()}
          >
            ⌕ TRA CỨU KẾT QUẢ
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
