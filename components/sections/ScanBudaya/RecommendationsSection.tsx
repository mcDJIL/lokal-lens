'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Recommendation {
  type: string;
  categoryColor: string;
  title: string;
  slug: string;
  image: string;
  link: string;
}

interface RecommendationsSectionProps {
  scanResult?: {
    name?: string;
    location?: string;
  } | null;
}

const RecommendationsSection = ({ scanResult }: RecommendationsSectionProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scanResult?.name) {
      fetchRecommendations();
    }
  }, [scanResult]);

  const fetchRecommendations = async () => {
    if (!scanResult?.name) return;
    
    setIsLoading(true);
    try {
      // Extract object type from name for better search
      const objectType = scanResult.name.split(' ')[0];
      
      const params = new URLSearchParams({
        objectName: scanResult.name,
        objectType: objectType,
        location: scanResult.location || '',
      });

      const response = await fetch(`/api/scan-culture/recommendations?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.slice(0, 3)); // Ambil 3 recommendations
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Default recommendations jika belum ada scan atau loading
  const defaultRecommendations: Recommendation[] = [
    {
      type: 'ARTIKEL',
      categoryColor: '#006C84',
      title: 'Mengenal Wayang Kulit: Seni Pertunjukan Klasik Jawa',
      slug: 'mengenal-wayang-kulit-seni-pertunjukan-klasik-jawa',
      image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80',
      link: '/artikel/mengenal-wayang-kulit-seni-pertunjukan-klasik-jawa'
    },
    {
      type: 'EVENT',
      categoryColor: '#C0392B',
      title: 'Gelar Seni & Pesta Rakyat 2024',
      slug: 'gelar-seni-pesta-rakyat-2024',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop&q=80',
      link: '/event-budaya/gelar-seni-pesta-rakyat-2024'
    },
    {
      type: 'KUIS',
      categoryColor: '#D4A017',
      title: 'Jelajah Candi Nusantara',
      slug: 'jelajah-candi-nusantara',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
      link: '/kuis/jelajah-candi-nusantara/detail'
    }
  ];

  const displayRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations;

  return (
    <motion.section 
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="rounded-[20px] bg-[#006C84] shadow-xl p-6 sm:p-8 space-y-5">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-8 sm:w-[30px] sm:h-9 shrink-0">
            <path d="M11.875 23.625L20.625 18L11.875 12.375V23.625ZM5 28C4.3125 28 3.72396 27.7552 3.23438 27.2656C2.74479 26.776 2.5 26.1875 2.5 25.5V10.5C2.5 9.8125 2.74479 9.22396 3.23438 8.73438C3.72396 8.24479 4.3125 8 5 8H25C25.6875 8 26.276 8.24479 26.7656 8.73438C27.2552 9.22396 27.5 9.8125 27.5 10.5V25.5C27.5 26.1875 27.2552 26.776 26.7656 27.2656C26.276 27.7552 25.6875 28 25 28H5ZM5 25.5H25V10.5H5V25.5Z" fill="#F7F7F7"/>
          </svg>
          <div className="flex-1">
            <h3 className="text-lg sm:text-[20px] font-bold leading-7 text-[#F7F7F7]">
              Rekomendasi Konten Berbasis Scan Anda
            </h3>
            <p className="text-xs sm:text-sm font-normal leading-5 text-[rgba(247,247,247,0.8)]">
              {scanResult?.name 
                ? `Terkait dengan ${scanResult.name}` 
                : 'Temukan konten menarik lainnya'}
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 line-clamp-1">
            {displayRecommendations.map((item, index) => (
              <Link href={item.link} key={index}>
                <motion.div 
                  className="rounded-xl bg-white shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 space-y-1 line-clamp-1">
                    <motion.div 
                      className="text-xs font-bold leading-4 tracking-[0.6px] uppercase" 
                      style={{ color: item.categoryColor }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.type}
                    </motion.div>
                    <h4
                      className="text-sm sm:text-base font-bold leading-6 text-[#1A1A1A] truncate"
                      title={item.title}
                    >
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default RecommendationsSection;
