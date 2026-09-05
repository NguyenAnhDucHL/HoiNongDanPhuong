import React, { useState } from 'react';
import '../assets/styles/home.css';
import PublicLayout from '../components/Layout/PublicLayout';
import HeroSection from '../features/misc/components/HeroSection';
import StatsSection from '../features/misc/components/StatsSection';
import InfoSection from '../features/misc/components/InfoSection';
import TrackPetition from '../features/petitions/components/TrackPetition';
import SubmitForm from '../features/petitions/SubmitForm';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <PublicLayout>
      <HeroSection />
      <StatsSection />
      <InfoSection onSelectCategory={setSelectedCategory} />

      <section className="form-section" id="gui-phan-anh">
        <div className="container">
          <div className="form-card">
            <h3 style={{ color: 'var(--green-dark)', fontSize: 22, marginBottom: 5 }}>GỬI PHẢN ÁNH, KIẾN NGHỊ</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 18 }}>
              Vui lòng cung cấp đầy đủ thông tin để phản ánh được tiếp nhận và xử lý nhanh chóng.
            </p>
            <SubmitForm selectedCategory={selectedCategory} />
          </div>
        </div>
      </section>

      <TrackPetition />
    </PublicLayout>
  );
};

export default Home;
