'use client';

import { motion } from 'framer-motion';

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedProvince: string;
  setSelectedProvince: (value: string) => void;
  selectedRarity: string;
  setSelectedRarity: (value: string) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
}

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedProvince,
  setSelectedProvince,
  selectedRarity,
  setSelectedRarity,
  onApplyFilter,
  onResetFilter,
}: FilterSidebarProps) => {
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full lg:w-[352px] flex-shrink-0"
    >
      <div className="rounded-[32px] bg-[#E8C547] shadow-sm p-6">
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-0"
          >
            <h2 className="text-lg font-bold leading-[27px] text-[#333333] mb-0">
              Filter Peta
            </h2>
            <p className="text-sm font-normal leading-[21px] text-[#000000]">
              Saring berdasarkan preferensi Anda
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-0">
              <label className="text-sm font-medium leading-[21px] text-[#333333] pb-2">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-[42px] px-3 py-2 rounded-[32px] border border-[#1B2A41] bg-[#E8C547] text-base font-normal leading-6 text-[#333333] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B2A41]"
                >
                  <option value="Semua Kategori">Semua Kategori</option>
                  <option value="Tarian">Tarian</option>
                  <option value="Musik">Musik</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Upacara Adat">Upacara Adat</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.2002 9.60001L12.0002 14.4L16.8002 9.60001" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0">
              <label className="text-sm font-medium leading-[21px] text-[#333333] pb-2">
                Provinsi
              </label>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full h-[42px] px-3 py-2 rounded-[32px] border border-[#1B2A41] bg-[#E8C547] text-base font-normal leading-6 text-[#333333] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B2A41]"
                >
                  <option value="Seluruh Indonesia">Seluruh Indonesia</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Bali">Bali</option>
                  <option value="Sumatera Utara">Sumatera Utara</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.2002 9.60001L12.0002 14.4L16.8002 9.60001" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0">
              <label className="text-sm font-medium leading-[21px] text-[#333333] pb-2">
                Tingkat Kelangkaan
              </label>
              <div className="relative">
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="w-full h-[42px] px-3 py-2 rounded-[32px] border border-[#1B2A41] bg-[#E8C547] text-base font-normal leading-6 text-[#333333] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B2A41]"
                >
                  <option value="Semua Tingkat">Semua Tingkat</option>
                  <option value="Umum">Umum</option>
                  <option value="Langka">Langka</option>
                  <option value="Sangat Langka">Sangat Langka</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.2002 9.59998L12.0002 14.4L16.8002 9.59998" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col gap-2 pt-4 border-t border-[#F0F2F5]"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onApplyFilter}
              className="w-full h-11 px-4 rounded-full bg-[#004E89] hover:bg-[#003d6d] transition-colors"
            >
              <span className="text-sm font-bold leading-[21px] tracking-[0.21px] text-[#E8C547]">
                Terapkan Filter
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResetFilter}
              className="w-full h-11 px-4 rounded-full bg-[#F0F2F5] hover:bg-[#E5E7EB] transition-colors"
            >
              <span className="text-sm font-bold leading-[21px] tracking-[0.21px] text-[#333333]">
                Reset
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
};

export default FilterSidebar;
