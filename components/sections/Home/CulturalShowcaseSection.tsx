'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Culture {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  province: string;
}

const CulturalShowcaseSection = () => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCultures = async () => {
      try {
        const response = await fetch('/api/cultures?limit=4');
        const data = await response.json();
        if (data.success) {
          setCultures(data.data);
        }
      } catch (error) {
        console.error('Error fetching cultures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCultures();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <section className="w-full mt-12 sm:mt-16 lg:mt-[69px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-[30px] font-bold leading-tight tracking-[-0.45px] text-[#181611] text-center mb-8 sm:mb-12 lg:mb-[62px]">
            Jelajahi Kekayaan Nusantara
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-[22px] w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-[350px] sm:h-[381px] rounded-2xl lg:rounded-[24px] bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mt-12 sm:mt-16 lg:mt-[69px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-[30px] font-bold leading-tight tracking-[-0.45px] text-[#181611] text-center mb-8 sm:mb-12 lg:mb-[62px]"
        >
          Jelajahi Kekayaan Nusantara
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-[22px] w-full"
        >
          {cultures.map((culture) => (
            <motion.div
              key={culture.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/jelajahi/${culture.slug}`}
                className="block w-full h-[350px] sm:h-[381px] rounded-2xl lg:rounded-[24px] relative overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              >
                <Image
                  src={culture.thumbnail || '/assets/img/batik.png'}
                  alt={culture.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] via-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.6)]" />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-0"
                >
                  <h3 className="text-lg font-bold leading-[22.5px] text-white">
                    {culture.name}
                  </h3>
                  <p className="text-sm font-medium leading-5 text-white">
                    {culture.province}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CulturalShowcaseSection;
