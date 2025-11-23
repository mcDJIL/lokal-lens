'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Province {
  name: string;
  count: number;
  thumbnail: string | null;
}

const ProvinceCollectionSection = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [displayProvinces, setDisplayProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch province data
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/cultures/provinces');
        const data = await response.json();

        if (data.success) {
          setProvinces(data.data);
          // Tampilkan 3 random provinces
          randomizeProvinces(data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fungsi untuk random provinces
  const randomizeProvinces = (allProvinces: Province[]) => {
    // Shuffle array
    const shuffled = [...allProvinces].sort(() => Math.random() - 0.5);
    // Ambil 3 pertama
    setDisplayProvinces(shuffled.slice(0, 3));
  };

  // Re-randomize pada setiap component mount
  useEffect(() => {
    if (provinces.length > 0) {
      randomizeProvinces(provinces);
    }
  }, [provinces]);

  // Deskripsi default per provinsi (fallback)
  const provinceDescriptions: Record<string, string> = {
    'Jawa Barat': 'Dari Angklung yang mendunia hingga Tari Jaipong yang energik, Jawa Barat menyimpan kekayaan budaya Sunda yang mempesona.',
    'Bali': 'Pulau Dewata yang kaya akan tradisi, mulai dari upacara Ngaben yang sakral hingga Tari Kecak yang ikonik di pura-pura megah.',
    'Sumatera Utara': 'Jelajahi kekayaan budaya Batak, dari Kain Ulos yang penuh makna hingga tradisi lompat batu yang melegenda di Nias.',
    'DI Yogyakarta': 'Kota istimewa yang menjadi pusat budaya Jawa, dari batik hingga keraton yang penuh sejarah.',
    'Jawa Tengah': 'Tanah kelahiran keris dan wayang kulit, rumah bagi warisan budaya Jawa yang autentik.',
    'Aceh': 'Serambi Mekkah dengan kekayaan tarian dan musik tradisional yang khas.',
    'Sumatera Barat': 'Tanah Minangkabau dengan rumah gadang dan rendang yang mendunia.',
    'Papua': 'Kekayaan budaya suku-suku asli Papua dengan tarian dan kerajinan unik.',
    'Sulawesi Selatan': 'Tanah Bugis dan Makassar dengan warisan budaya maritim yang kuat.',
    'Kalimantan Timur': 'Budaya Dayak yang kaya dengan seni ukir dan tarian tradisional.',
  };

  const getDescription = (provinceName: string) => {
    return provinceDescriptions[provinceName] || 
      `Temukan keunikan budaya dari ${provinceName} yang telah kami kurasi secara khusus untuk Anda.`;
  };

  if (loading) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold leading-[30px] sm:leading-[35px] lg:leading-[37.5px] tracking-[-0.6px] text-[#333333] mb-3">
              Koleksi Pilihan Provinsi
            </h2>
            <p className="text-sm sm:text-base font-normal leading-6 text-[#618989] max-w-2xl mx-auto">
              Temukan keunikan budaya dari berbagai provinsi di Indonesia yang telah kami kurasi
              secara khusus untuk Anda.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A99D]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (displayProvinces.length === 0) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold leading-[30px] sm:leading-[35px] lg:leading-[37.5px] tracking-[-0.6px] text-[#333333] mb-3">
              Koleksi Pilihan Provinsi
            </h2>
            <p className="text-sm sm:text-base font-normal leading-6 text-[#618989] max-w-2xl mx-auto">
              Belum ada data provinsi tersedia.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold leading-[30px] sm:leading-[35px] lg:leading-[37.5px] tracking-[-0.6px] text-[#333333] mb-3">
            Koleksi Pilihan Provinsi
          </h2>
          <p className="text-sm sm:text-base font-normal leading-6 text-[#618989] max-w-2xl mx-auto">
            Temukan keunikan budaya dari berbagai provinsi di Indonesia yang telah kami kurasi
            secara khusus untuk Anda.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {displayProvinces.map((province, index) => (
            <motion.div
              key={`${province.name}-${index}`}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-[32px] bg-white shadow-sm overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    province.thumbnail || 
                    `https://via.placeholder.com/832x384/00A99D/FFFFFF?text=${encodeURIComponent(province.name)}`
                  }
                  alt={province.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold leading-7 text-white mb-0">
                    {province.name}
                  </h3>
                  <p className="text-sm font-normal leading-5 text-white/90">
                    {province.count} Budaya
                  </p>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <p className="text-sm font-normal leading-5 text-[#618989] mb-4 flex-1">
                  {getDescription(province.name)}
                </p>
                <motion.a
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  href={`/jelajahi`}
                  className="flex items-center gap-2 text-sm font-bold leading-5 text-[#00A99D] hover:text-[#008f85] transition-colors group"
                >
                  <span>Jelajahi</span>
                  <motion.svg 
                    whileHover={{ x: 3 }}
                    width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-7"
                  >
                    <path d="M16.0692 14.9723H4.23242V13.0278H16.0692L10.6248 7.58339L12.0102 6.22228L19.788 14.0001L12.0102 21.7778L10.6248 20.4167L16.0692 14.9723Z" fill="#00A99D"/>
                  </motion.svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProvinceCollectionSection;