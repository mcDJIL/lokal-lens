'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TrendingScan {
  title: string;
  type: string;
  scans: number;
  image: string | null;
  cultureSlug?: string;
}

const TrendingScansSection = () => {
  const [trendingScans, setTrendingScans] = useState<TrendingScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingScans();
  }, []);

  const fetchTrendingScans = async () => {
    try {
      const response = await fetch('/api/scan-culture/trending');
      if (response.ok) {
        const data = await response.json();
        setTrendingScans(data.slice(0, 3)); // Ambil top 3
      }
    } catch (error) {
      console.error('Error fetching trending scans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Default items jika belum ada data atau loading
  const defaultItems: TrendingScan[] = [
    {
      title: 'Wayang Kulit',
      type: 'wayang',
      scans: 0,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/98fa8e9222d2c1ce57a5e9c9924ef58b34058361?width=338'
    },
    {
      title: 'Angklung',
      type: 'alat musik',
      scans: 0,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/6096c4f296ecaa961a68d09bc420385ef8b3d849?width=338'
    },
    {
      title: 'Salung',
      type: 'alat musik',
      scans: 0,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/50431d3f08ad682d7e5422364169aa66260c1670?width=340'
    }
  ];

  const displayItems = trendingScans.length > 0 ? trendingScans : defaultItems;

  return (
    <motion.section 
      className="w-full"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div className="rounded-[20px] border border-[#EAEAEA] bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 space-y-4">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-8 sm:w-[30px] sm:h-9 shrink-0">
            <path d="M4.25 25.5L2.5 23.75L11.75 14.4375L16.75 19.4375L23.25 13H20V10.5H27.5V18H25V14.75L16.75 23L11.75 18L4.25 25.5Z" fill="#C0392B"/>
          </svg>
          <div className="flex-1">
            <h3 className="text-lg sm:text-[20px] font-bold leading-7 text-[#1A1A1A]">
              Tren Scan Saat Ini
            </h3>
            <p className="text-xs sm:text-sm font-normal leading-5 text-[#666]">
              Paling banyak discan minggu ini oleh komunitas
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {displayItems.map((item, index) => {
              const content = (
                <motion.div 
                  className="rounded-xl border border-[#EAEAEA] overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    {item.image ? (
                      <>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-3">
                      <h4 className="text-base sm:text-lg font-bold leading-7 text-white drop-shadow-lg">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  <div className="p-3 bg-[#F7F7F7]">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5 shrink-0">
                        <path d="M7.60065 7.99996H12.934C12.634 7.23329 12.1757 6.57496 11.559 6.02496C10.9423 5.47496 10.234 5.08885 9.43398 4.86663L7.60065 7.99996ZM6.06732 9.33329L8.73398 4.73329C8.61176 4.71107 8.48954 4.6944 8.36732 4.68329C8.2451 4.67218 8.12287 4.66663 8.00065 4.66663C7.26732 4.66663 6.58398 4.80551 5.95065 5.08329C5.31732 5.36107 4.75621 5.73329 4.26732 6.19996L6.06732 9.33329ZM2.83398 11.3333H6.46732L3.80065 6.73329C3.4451 7.18885 3.16732 7.69163 2.96732 8.24163C2.76732 8.79163 2.66732 9.37774 2.66732 9.99996C2.66732 10.2333 2.68121 10.4583 2.70898 10.675C2.73676 10.8916 2.77843 11.1111 2.83398 11.3333ZM6.56732 15.1333L8.36732 12H3.06732C3.36732 12.7666 3.82565 13.425 4.44232 13.975C5.05898 14.525 5.76732 14.9111 6.56732 15.1333ZM8.00065 15.3333C8.73398 15.3333 9.41732 15.1944 10.0507 14.9166C10.684 14.6388 11.2451 14.2666 11.734 13.8L9.93398 10.6666L7.26732 15.2666C7.38954 15.2888 7.50898 15.3055 7.62565 15.3166C7.74232 15.3277 7.86732 15.3333 8.00065 15.3333ZM12.2007 13.2666C12.5562 12.8111 12.834 12.3083 13.034 11.7583C13.234 11.2083 13.334 10.6222 13.334 9.99996C13.334 9.76663 13.3201 9.54163 13.2923 9.32496C13.2645 9.10829 13.2229 8.88885 13.1673 8.66663H9.53399L12.2007 13.2666ZM8.00065 16.6666C7.08954 16.6666 6.22843 16.4916 5.41732 16.1416C4.60621 15.7916 3.89787 15.3138 3.29232 14.7083C2.68676 14.1027 2.20898 13.3944 1.85898 12.5833C1.50898 11.7722 1.33398 10.9111 1.33398 9.99996C1.33398 9.07774 1.50898 8.21385 1.85898 7.40829C2.20898 6.60274 2.68676 5.89718 3.29232 5.29163C3.89787 4.68607 4.60621 4.20829 5.41732 3.85829C6.22843 3.50829 7.08954 3.33329 8.00065 3.33329C8.92287 3.33329 9.78676 3.50829 10.5923 3.85829C11.3979 4.20829 12.1034 4.68607 12.709 5.29163C13.3145 5.89718 13.7923 6.60274 14.1423 7.40829C14.4923 8.21385 14.6673 9.07774 14.6673 9.99996C14.6673 10.9111 14.4923 11.7722 14.1423 12.5833C13.7923 13.3944 13.3145 14.1027 12.709 14.7083C12.1034 15.3138 11.3979 15.7916 10.5923 16.1416C9.78676 16.4916 8.92287 16.6666 8.00065 16.6666Z" fill="#C0392B"/>
                      </svg>
                      <span className="text-xs sm:text-sm font-medium leading-5 text-[#666]">
                        {item.scans > 0 ? `${item.scans.toLocaleString()} Pindai` : 'Belum ada scan'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );

              return item.cultureSlug ? (
                <Link href={`/jelajahi/${item.cultureSlug}`} key={index}>
                  {content}
                </Link>
              ) : (
                <div key={index}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default TrendingScansSection;
