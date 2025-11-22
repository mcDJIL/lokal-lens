'use client';

import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 14.5V7H10.5V10H6V14.5H3ZM3 37V29.5H6V34H10.5V37H3ZM25.5 37V34H30V29.5H33V37H25.5ZM30 14.5V10H25.5V7H33V14.5H30ZM26.25 30.25H28.5V32.5H26.25V30.25ZM26.25 25.75H28.5V28H26.25V25.75ZM24 28H26.25V30.25H24V28ZM21.75 30.25H24V32.5H21.75V30.25ZM19.5 28H21.75V30.25H19.5V28ZM24 23.5H26.25V25.75H24V23.5ZM21.75 25.75H24V28H21.75V25.75ZM19.5 23.5H21.75V25.75H19.5V23.5ZM28.5 11.5V20.5H19.5V11.5H28.5ZM16.5 23.5V32.5H7.5V23.5H16.5ZM16.5 11.5V20.5H7.5V11.5H16.5ZM14.25 30.25V25.75H9.75V30.25H14.25ZM14.25 18.25V13.75H9.75V18.25H14.25ZM26.25 18.25V13.75H21.75V18.25H26.25Z" fill="#13EC5B"/>
        </svg>
      ),
      title: "Scan Budaya",
      description: "Pindai objek budaya di sekitar Anda menggunakan kamera untuk mendapatkan informasi mendalam secara instan."
    },
    {
      icon: (
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.5 35.5L13.5 32.35L6.525 35.05C6.025 35.25 5.5625 35.1937 5.1375 34.8812C4.7125 34.5687 4.5 34.15 4.5 33.625V12.625C4.5 12.3 4.59375 12.0125 4.78125 11.7625C4.96875 11.5125 5.225 11.325 5.55 11.2L13.5 8.5L22.5 11.65L29.475 8.95C29.975 8.75 30.4375 8.80625 30.8625 9.11875C31.2875 9.43125 31.5 9.85 31.5 10.375V31.375C31.5 31.7 31.4063 31.9875 31.2188 32.2375C31.0313 32.4875 30.775 32.675 30.45 32.8L22.5 35.5ZM21 31.825V14.275L15 12.175V29.725L21 31.825ZM24 31.825L28.5 30.325V12.55L24 14.275V31.825ZM7.5 31.45L12 29.725V12.175L7.5 13.675V31.45Z" fill="#13EC5B"/>
        </svg>
      ),
      title: "Map Budaya",
      description: "Lihat persebaran warisan budaya di seluruh Indonesia melalui peta interaktif kami yang kaya data."
    },
    {
      icon: (
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 37C15.925 37 13.975 36.6062 12.15 35.8187C10.325 35.0312 8.7375 33.9625 7.3875 32.6125C6.0375 31.2625 4.96875 29.675 4.18125 27.85C3.39375 26.025 3 24.075 3 22C3 19.925 3.39375 17.975 4.18125 16.15C4.96875 14.325 6.0375 12.7375 7.3875 11.3875C8.7375 10.0375 10.325 8.96875 12.15 8.18125C13.975 7.39375 15.925 7 18 7C21.65 7 24.8438 8.14375 27.5813 10.4312C30.3188 12.7187 32.025 15.5875 32.7 19.0375H29.625C29.15 17.2125 28.2938 15.5812 27.0563 14.1437C25.8188 12.7062 24.3 11.625 22.5 10.9V11.5C22.5 12.325 22.2063 13.0312 21.6188 13.6187C21.0312 14.2062 20.325 14.5 19.5 14.5H16.5V17.5C16.5 17.925 16.3563 18.2812 16.0688 18.5687C15.7813 18.8562 15.425 19 15 19H12V22H15V26.5H13.5L6.3 19.3C6.225 19.75 6.15625 20.2 6.09375 20.65C6.03125 21.1 6 21.55 6 22C6 25.275 7.15 28.0875 9.45 30.4375C11.75 32.7875 14.6 33.975 18 34V37ZM31.65 36.25L26.85 31.45C26.325 31.75 25.7625 32 25.1625 32.2C24.5625 32.4 23.925 32.5 23.25 32.5C21.375 32.5 19.7812 31.8438 18.4688 30.5312C17.1563 29.2187 16.5 27.625 16.5 25.75C16.5 23.875 17.1563 22.2812 18.4688 20.9688C19.7812 19.6562 21.375 19 23.25 19C25.125 19 26.7188 19.6562 28.0313 20.9688C29.3438 22.2812 30 23.875 30 25.75C30 26.425 29.9 27.0625 29.7 27.6625C29.5 28.2625 29.25 28.825 28.95 29.35L33.75 34.15L31.65 36.25ZM23.25 29.5C24.3 29.5 25.1875 29.1375 25.9125 28.4125C26.6375 27.6875 27 26.8 27 25.75C27 24.7 26.6375 23.8125 25.9125 23.0875C25.1875 22.3625 24.3 22 23.25 22C22.2 22 21.3125 22.3625 20.5875 23.0875C19.8625 23.8125 19.5 24.7 19.5 25.75C19.5 26.8 19.8625 27.6875 20.5875 28.4125C21.3125 29.1375 22.2 29.5 23.25 29.5Z" fill="#13EC5B"/>
        </svg>
      ),
      title: "Explore",
      description: "Jelajahi galeri dan direktori lengkap berisi berbagai jenis budaya dari Sabang sampai Merauke."
    },
    {
      icon: (
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5125 24.55L15.825 20.275L12.375 17.5H16.65L18 13.3L19.35 17.5H23.625L20.1375 20.275L21.45 24.55L18 21.8875L14.5125 24.55ZM9 38.5V26.9125C8.05 25.8625 7.3125 24.6625 6.7875 23.3125C6.2625 21.9625 6 20.525 6 19C6 15.65 7.1625 12.8125 9.4875 10.4875C11.8125 8.1625 14.65 7 18 7C21.35 7 24.1875 8.1625 26.5125 10.4875C28.8375 12.8125 30 15.65 30 19C30 20.525 29.7375 21.9625 29.2125 23.3125C28.6875 24.6625 27.95 25.8625 27 26.9125V38.5L18 35.5L9 38.5ZM18 28C20.5 28 22.625 27.125 24.375 25.375C26.125 23.625 27 21.5 27 19C27 16.5 26.125 14.375 24.375 12.625C22.625 10.875 20.5 10 18 10C15.5 10 13.375 10.875 11.625 12.625C9.875 14.375 9 16.5 9 19C9 21.5 9.875 23.625 11.625 25.375C13.375 27.125 15.5 28 18 28ZM12 34.0375L18 32.5L24 34.0375V29.3875C23.125 29.8875 22.1813 30.2812 21.1688 30.5687C20.1563 30.8562 19.1 31 18 31C16.9 31 15.8438 30.8562 14.8313 30.5687C13.8188 30.2812 12.875 29.8875 12 29.3875V34.0375Z" fill="#13EC5B"/>
        </svg>
      ),
      title: "Achievement",
      description: "Dapatkan lencana dan penghargaan menarik saat Anda berhasil menemukan dan mempelajari budaya baru."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full mt-12 sm:mt-16 lg:mt-[69px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center max-w-6xl mx-auto">
        <motion.h2 
          className="text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.33px] text-[#111813] text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Jelajahi Fitur Unggulan Kami
        </motion.h2>
        <motion.p 
          className="text-sm sm:text-base font-normal leading-6 text-[#4B5563] text-center max-w-full sm:max-w-xl lg:w-[717px] mt-3 sm:mt-[17px] px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Lokallens menyediakan berbagai fitur untuk membantu Anda terhubung dengan warisan budaya
          Indonesia secara interaktif dan menyenangkan.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 sm:mt-8 lg:mt-[38px] w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-2xl lg:rounded-[32px] border border-[#E5E7EB] bg-white p-5 sm:p-6 hover:shadow-xl transition-shadow"
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex flex-col">
                <motion.div 
                  className="w-9 h-11"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-base font-bold leading-5 text-[#111813] mt-2.5">
                  {feature.title}
                </h3>
                <p className="text-sm font-normal leading-[21px] text-[#6B7280] mt-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
