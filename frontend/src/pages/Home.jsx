import React, { useState } from 'react';

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

      <section className="py-[30px]" id="gui-phan-anh">
        <div className="container mx-auto px-4">
          <div className="max-w-[850px] mx-auto bg-white border border-[#e5ece7] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-[16px] p-0">
            <div className="p-6 md:p-8">
              <h3 className="text-[#087c20] text-[22px] font-bold mb-[5px]">GỬI PHẢN ÁNH, KIẾN NGHỊ</h3>
              <p className="text-[#4e5e53] mb-[18px]">
                Vui lòng cung cấp đầy đủ thông tin để phản ánh được tiếp nhận và xử lý nhanh chóng.
              </p>
              <SubmitForm selectedCategory={selectedCategory} />
            </div>
          </div>
        </div>
      </section>

      <TrackPetition />
    </PublicLayout>
  );
};

export default Home;
