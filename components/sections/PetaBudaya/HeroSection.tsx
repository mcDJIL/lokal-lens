'use client';

import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-0">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold leading-[35px] sm:leading-[40px] lg:leading-[45px] tracking-[-1.188px] text-[#333333] mb-3 sm:mb-4"
        >
          Jelajahi Peta Budaya Lokallens
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-base font-normal leading-6 text-[#618989] max-w-[569px]"
        >
          Temukan dan pelajari keragaman budaya yang tersebar di seluruh Indonesia.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
