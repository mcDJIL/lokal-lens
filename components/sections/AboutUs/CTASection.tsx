"use client";

import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="w-full bg-[#F5F5DC] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-[568px] mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-[36px] font-bold leading-[40px] tracking-[-0.9px] text-[#4A2C2A]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Mari Bergabung Dalam Gerakan Ini
          </motion.h2>
          <motion.p 
            className="text-base font-normal leading-[26px] text-[#6F5E5D]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Jadilah bagian dari perjalanan kami untuk melestarikan warisan budaya.
            Jelajahi, berkontribusi, dan sebarkan kekayaan budaya Indonesia kepada
            dunia.
          </motion.p>
          <motion.button 
            className="inline-flex items-center justify-center px-[18px] py-[13px] rounded-full bg-[#FDB813] hover:bg-[#e5a711] transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0px 10px 30px rgba(253, 184, 19, 0.4)",
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base font-bold leading-6 tracking-[0.24px] text-[#181611]">
              Bergabung Sebagai Kontributor
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
