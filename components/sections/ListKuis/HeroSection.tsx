'use client';

import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="w-full bg-[url('/assets/img/hero-kuis.png')] bg-cover bg-center bg-[rgba(0,108,132,0.05)] py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-white/80 h-[400px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[896px] mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight lg:leading-[48px] tracking-[-1.2px] text-[#1A1A1A] mb-4"
          >
            Kuis Budaya Interaktif
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base font-semibold sm:text-lg leading-relaxed sm:leading-8 text-[#4B5563]"
          >
            Uji pengetahuanmu tentang kekayaan budaya Indonesia. Pilih kuis di bawah ini dan mulailah petualanganmu!
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
