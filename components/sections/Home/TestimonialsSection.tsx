'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      avatar: "/assets/img/testimoni.png",
      name: "Andini Putri",
      role: "Travel Blogger",
      quote: "\"Lokallens benar-benar membuka mata saya terhadap budaya yang ada di sekitar. Fitur scan-nya luar biasa, seperti punya ensiklopedia budaya di saku!\""
    },
    {
      avatar: "/assets/img/testimoni.png",
      name: "Budi Santoso",
      role: "Mahasiswa Sejarah",
      quote: "\"Sebagai mahasiswa sejarah, aplikasi ini sangat membantu riset saya. Peta budayanya detail dan informatif. Wajib punya untuk akademisi dan peneliti.\""
    },
    {
      avatar: "/assets/img/testimoni.png",
      name: "Citra Lestari",
      role: "Guru Seni Budaya",
      quote: "\"Saya menggunakan Lokallens sebagai media pembelajaran di kelas. Anak- anak jadi lebih antusias belajar budaya lokal. Sangat edukatif dan interaktif!\""
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full mt-12 sm:mt-16 lg:mt-[88px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-8 sm:gap-10 max-w-6xl mx-auto">
        <motion.div 
          className="flex flex-col items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl sm:text-[30px] font-bold leading-tight tracking-[-0.45px] text-[#1A1A1A] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Kata Mereka Tentang Lokallens
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base font-normal leading-6 text-[#4B5563] text-center max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Dengarkan cerita dan pengalaman pengguna yang telah menjelajahi kekayaan budaya bersama kami.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex flex-col gap-4 p-5 sm:p-[25px] rounded-2xl lg:rounded-[32px] border border-[#E5E7EB] hover:shadow-xl transition-shadow"
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                >
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <h4 className="text-base font-bold leading-6 text-[#1A1A1A]">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm font-normal leading-5 text-[#6B7280]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-sm sm:text-base font-normal italic leading-6 text-[#374151]">
                {testimonial.quote}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
