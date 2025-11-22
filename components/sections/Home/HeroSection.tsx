'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-[87px] mt-8 sm:mt-12 lg:mt-[69px]">
      <motion.div 
        className="w-full h-[400px] sm:h-[500px] lg:h-[523px] max-w-7xl mx-auto rounded-3xl lg:rounded-[48px] relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/assets/img/hero.png"
          alt="Indonesian Culture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.2)]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-[249px] gap-3 sm:gap-4">
          <motion.div 
            className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold leading-tight lg:leading-[60px] tracking-tight lg:tracking-[-1.584px] text-white text-center max-w-full lg:w-[643px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Scan Budaya Indonesia untuk
              Melihat Identitasnya.
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base font-normal leading-relaxed text-[rgba(255,255,255,0.9)] text-center max-w-full sm:max-w-md lg:w-[555px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              Temukan kekayaan budaya di sekitar Anda melalui teknologi canggih kami.
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-[36px] w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(19, 236, 91, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={'/scan-budaya'} className="flex items-center justify-center px-6 py-3 rounded-full bg-[#13EC5B] w-full sm:w-auto sm:min-w-[133px] h-12 hover:bg-[#10d952] transition-colors">
                <span className="text-base font-bold leading-6 tracking-[0.24px] text-[#111813]">
                  Mulai Scan
                </span>
              </Link>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,0,0,0.3)] backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
            >
              <span className="text-sm font-medium leading-[21px] text-[rgba(255,255,255,0.9)]">
                Budaya Terdata:
              </span>
              <motion.span 
                className="text-sm font-bold leading-[17.5px] text-white"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                +1200
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
