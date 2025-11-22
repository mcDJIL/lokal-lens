'use client';

import { useState } from 'react';
import HeroSection from "@/components/sections/BudayaTerancam/HeroSection";
import SearchFilterSection from "@/components/sections/BudayaTerancam/SearchFilterSection";
import ReportGridSectionDynamic from "@/components/sections/BudayaTerancam/ReportGridSectionDynamic";

export default function BudayaTerancamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedThreatType, setSelectedThreatType] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const handleReset = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedThreatType('');
    setSelectedProvince('');
  };

  return (
    <main className="w-full bg-white">
      <HeroSection />
      <SearchFilterSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedThreatType={selectedThreatType}
        setSelectedThreatType={setSelectedThreatType}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        onReset={handleReset}
      />
      <ReportGridSectionDynamic
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        selectedThreatType={selectedThreatType}
        selectedProvince={selectedProvince}
      />
    </main>
  );
}
