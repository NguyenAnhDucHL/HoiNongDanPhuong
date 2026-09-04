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
    <section className="container stats" id="thong-ke">
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-icon">▤</div>
          <div><strong>{stats.total}</strong><span>Phản ánh, kiến nghị<br/>đã tiếp nhận</span></div>
        </div>
        <div className="stat">
          <div className="stat-icon">☷</div>
          <div><strong>{stats.processing}</strong><span>Phản ánh, kiến nghị<br/>đang xử lý</span></div>
        </div>
        <div className="stat">
          <div className="stat-icon">✓</div>
          <div><strong>{stats.resolved}</strong><span>Phản ánh, kiến nghị<br/>đã xử lý xong</span></div>
        </div>
        <div className="stat">
          <div className="stat-icon">♧</div>
          <div><strong>{stats.visitsToday?.toLocaleString('vi-VN')}</strong><span>Lượt truy cập<br/>hôm nay</span></div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
