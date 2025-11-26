'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SearchFilterSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedThreatType: string;
  setSelectedThreatType: (value: string) => void;
  selectedProvince: string;
  setSelectedProvince: (value: string) => void;
  onReset: () => void;
}

const SearchFilterSection = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedThreatType,
  setSelectedThreatType,
  selectedProvince,
  setSelectedProvince,
  onReset,
}: SearchFilterSectionProps) => {
  const provinces = [
    'Semua Provinsi',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'DI Yogyakarta',
    'Bali',
    'Sumatera Utara',
    'Sumatera Selatan',
    'Aceh',
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full bg-white border-t border-[rgba(0,0,0,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-6">
        <div className="flex flex-col gap-4">
          <div className="sm:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-[#F7F7F7] border border-[rgba(0,0,0,0.1)] rounded-lg text-[#1A1A1A] text-sm font-medium"
            >
              Filter
              <svg
                className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="mt-2 p-4 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-md">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama budaya..."
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[rgba(0,0,0,0.1)] rounded-lg text-[#887D63] text-sm outline-none focus:ring-2 focus:ring-primary-gold"
                  />

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[rgba(0,0,0,0.1)] rounded-lg text-[#1A1A1A] text-sm"
                  >
                    <option value="">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>

                  <select
                    value={selectedThreatType}
                    onChange={(e) => setSelectedThreatType(e.target.value)}
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[rgba(0,0,0,0.1)] rounded-lg text-[#1A1A1A] text-sm"
                  >
                    <option value="">Semua Ancaman</option>
                    <option value="Modernisasi">Modernisasi</option>
                    <option value="Kurangnya Minat">Kurangnya Minat</option>
                    <option value="Urbanisasi">Urbanisasi</option>
                    <option value="Tekanan Ekonomi">Tekanan Ekonomi</option>
                    <option value="Bencana Alam">Bencana Alam</option>
                    <option value="Konflik">Konflik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>

                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[rgba(0,0,0,0.1)] rounded-lg text-[#1A1A1A] text-sm"
                  >
                    {provinces.map((prov) => (
                      <option key={prov} value={prov === 'Semua Provinsi' ? '' : prov}>
                        {prov}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={onReset}
                    className="w-full px-4 py-2 bg-red-50 text-primary-red text-sm font-medium rounded-lg hover:bg-red-100"
                  >
                    Hapus Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-4 p-4 border border-[rgba(0,0,0,0.1)] rounded-xl bg-white">
            <div className="flex-1">
              <div className="flex items-center h-12 rounded-lg overflow-hidden">
                <div className="flex items-center justify-center px-4 h-full bg-[#F7F7F7] border border-[rgba(0,0,0,0.1)] border-r-0 rounded-l-lg">
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.3333 19.5L11.0833 14.25C10.6667 14.5833 10.1875 14.8472 9.64583 15.0417C9.10417 15.2361 8.52778 15.3333 7.91667 15.3333C6.40278 15.3333 5.12153 14.809 4.07292 13.7604C3.02431 12.7118 2.5 11.4306 2.5 9.91667C2.5 8.40278 3.02431 7.12153 4.07292 6.07292C5.12153 5.02431 6.40278 4.5 7.91667 4.5C9.43056 4.5 10.7118 5.02431 11.7604 6.07292C12.809 7.12153 13.3333 8.40278 13.3333 9.91667C13.3333 10.5278 13.2361 11.1042 13.0417 11.6458C12.8472 12.1875 12.5833 12.6667 12.25 13.0833L17.5 18.3333L16.3333 19.5ZM7.91667 13.6667C8.95833 13.6667 9.84375 13.3021 10.5729 12.5729C11.3021 11.8438 11.6667 10.9583 11.6667 9.91667C11.6667 8.875 11.3021 7.98958 10.5729 7.26042C9.84375 6.53125 8.95833 6.16667 7.91667 6.16667C6.875 6.16667 5.98958 6.53125 5.26042 7.26042C4.53125 7.98958 4.16667 8.875 4.16667 9.91667C4.16667 10.9583 4.53125 11.8438 5.26042 12.5729C5.98958 13.3021 6.875 13.6667 7.91667 13.6667Z" fill="#887D63"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama budaya..."
                  className="flex-1 h-full px-4 bg-[#F7F7F7] border border-[rgba(0,0,0,0.1)] border-l-0 rounded-r-lg text-[#887D63] text-sm sm:text-base font-normal outline-none focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#F7F7F7] hover:bg-gray-200 transition-colors cursor-pointer text-[#1A1A1A] text-xs sm:text-sm font-medium leading-5 border-none outline-none appearance-none pr-8 sm:pr-10"
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={selectedThreatType}
                  onChange={(e) => setSelectedThreatType(e.target.value)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#F7F7F7] hover:bg-gray-200 transition-colors cursor-pointer text-[#1A1A1A] text-xs sm:text-sm font-medium leading-5 border-none outline-none appearance-none pr-8 sm:pr-10"
                >
                  <option value="">Semua Ancaman</option>
                  <option value="Modernisasi">Modernisasi</option>
                  <option value="Kurangnya Minat">Kurangnya Minat</option>
                  <option value="Urbanisasi">Urbanisasi</option>
                  <option value="Tekanan Ekonomi">Tekanan Ekonomi</option>
                  <option value="Bencana Alam">Bencana Alam</option>
                  <option value="Konflik">Konflik</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#F7F7F7] hover:bg-gray-200 transition-colors cursor-pointer text-[#1A1A1A] text-xs sm:text-sm font-medium leading-5 border-none outline-none appearance-none pr-8 sm:pr-10"
                >
                  {provinces.map((prov) => (
                    <option key={prov} value={prov === 'Semua Provinsi' ? '' : prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <span className="text-primary-red text-xs sm:text-sm font-medium leading-5">Hapus Filter</span>
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.33329 17.833L4.16663 16.6663L8.83329 11.9997L4.16663 7.33301L5.33329 6.16634L9.99996 10.833L14.6666 6.16634L15.8333 7.33301L11.1666 11.9997L15.8333 16.6663L14.6666 17.833L9.99996 13.1663L5.33329 17.833Z" fill="#C0392B"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SearchFilterSection;
