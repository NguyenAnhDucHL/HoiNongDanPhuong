import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';

const StatsSection = () => {
  const [stats, setStats] = useState({ total: 0, processing: 0, resolved: 0, visitsToday: 0 });

  useEffect(() => {
    // Record visit, then fetch stats
    fetchApi('/petitions/visit', { method: 'POST' })
      .then(() => fetchApi('/petitions/stats'))
      .then(data => setStats(data))
      .catch(err => console.error("Could not fetch stats:", err));
  }, []);

  return (
    <section className="container mx-auto px-4 mt-5 mb-10 max-w-[1200px]" id="thong-ke">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-[#e5ece7] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-[#e5ece7]">
        <div className="flex items-center gap-[13px] py-[20px] px-[18px]">
          <div className="w-12 h-12 rounded-full grid place-items-center bg-[#e9f8eb] text-[#149b2f] text-2xl flex-shrink-0">▤</div>
          <div>
            <strong className="block text-[25px] text-[#087c20] leading-[1.1]">{stats.total}</strong>
            <span className="text-[13px] text-[#4e5e53]">Phản ánh, kiến nghị<br/>đã tiếp nhận</span>
          </div>
        </div>
        
        <div className="flex items-center gap-[13px] py-[20px] px-[18px]">
          <div className="w-12 h-12 rounded-full grid place-items-center bg-[#e9f8eb] text-[#149b2f] text-2xl flex-shrink-0">☷</div>
          <div>
            <strong className="block text-[25px] text-[#087c20] leading-[1.1]">{stats.processing}</strong>
            <span className="text-[13px] text-[#4e5e53]">Phản ánh, kiến nghị<br/>đang xử lý</span>
          </div>
        </div>
        
        <div className="flex items-center gap-[13px] py-[20px] px-[18px]">
          <div className="w-12 h-12 rounded-full grid place-items-center bg-[#e9f8eb] text-[#149b2f] text-2xl flex-shrink-0">✓</div>
          <div>
            <strong className="block text-[25px] text-[#087c20] leading-[1.1]">{stats.resolved}</strong>
            <span className="text-[13px] text-[#4e5e53]">Phản ánh, kiến nghị<br/>đã xử lý xong</span>
          </div>
        </div>
        
        <div className="flex items-center gap-[13px] py-[20px] px-[18px]">
          <div className="w-12 h-12 rounded-full grid place-items-center bg-[#e9f8eb] text-[#149b2f] text-2xl flex-shrink-0">♧</div>
          <div>
            <strong className="block text-[25px] text-[#087c20] leading-[1.1]">{stats.visitsToday?.toLocaleString('vi-VN')}</strong>
            <span className="text-[13px] text-[#4e5e53]">Lượt truy cập<br/>hôm nay</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
