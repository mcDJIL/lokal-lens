'use client';

import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-10 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-2 text-center sm:text-left"
          >
            <h1 className="text-[#1A1A1A] font-black text-2xl sm:text-3xl lg:text-4xl leading-snug tracking-[-1.188px]">
              Laporan Budaya Terancam
            </h1>
            <p className="text-[#887D63] font-normal text-sm sm:text-base leading-6">
              Tinjau dan kelola laporan mengenai budaya yang membutuhkan perhatian.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="/budaya-terancam/lapor"
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-primary-gold bg-[#D49B16] hover:bg-[#C08A14] transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16663 12.833H4.16663V11.1663H9.16663V6.16634H10.8333V11.1663H15.8333V12.833H10.8333V17.833H9.16663V12.833Z" fill="#1A1A1A"/>
            </svg>
            <span className="text-[#1A1A1A] text-sm sm:text-base font-bold leading-6">
              Kirim Laporan Baru
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
