'use client';

import { motion } from 'framer-motion';

interface CulturalItemCardProps {
  onClose: () => void;
  culture?: {
    id: string;
    name: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    category: string | null;
    categoryName: string | null;
    categoryIcon: string | null;
    location: string | null;
    province: string | null;
    city: string | null;
    thumbnail: string | null;
    image: string | null;
    distance?: number;
    is_endangered?: boolean;
  };
}

const categoryColors: Record<string, string> = {
  tarian: '#FD7E14',
  musik: '#4A90E2',
  pakaian: '#E91E63',
  arsitektur: '#9C27B0',
  kuliner: '#FF5722',
  upacara: '#D0021B',
  kerajinan: '#9013FE',
  senjata: '#795548',
  permainan: '#00BCD4',
  bahasa: '#4CAF50',
};

const categoryLabels: Record<string, string> = {
  tarian: 'Tarian',
  musik: 'Musik',
  pakaian: 'Pakaian',
  arsitektur: 'Arsitektur',
  kuliner: 'Kuliner',
  upacara: 'Upacara',
  kerajinan: 'Kerajinan',
  senjata: 'Senjata',
  permainan: 'Permainan',
  bahasa: 'Bahasa',
};

const CulturalItemCard = ({ onClose, culture }: CulturalItemCardProps) => {
  if (!culture) {
    return null;
  }

  const categorySlug = culture.category?.toLowerCase() || '';
  const categoryColor = categorySlug ? categoryColors[categorySlug] || '#00A99D' : '#00A99D';
  const categoryLabel = culture.categoryName || 'Lainnya';
  const displayImage = culture.image || culture.thumbnail || 'https://via.placeholder.com/432x320?text=No+Image';
  const displayDescription = culture.description || culture.subtitle || 'Tidak ada deskripsi tersedia';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:w-60 lg:w-[239px] rounded-[20px] bg-white shadow-lg overflow-hidden"
    >
      <div className="relative h-32 overflow-hidden rounded-t-[20px]">
        <img
          src={displayImage}
          alt={culture.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <span
            className="inline-flex px-2 py-1 rounded-full text-xs font-bold leading-4 text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryLabel}
          </span>
          {culture.distance !== undefined && (
            <span className="inline-flex px-2 py-1 rounded-full bg-white/90 text-xs font-bold leading-4 text-[#333333]">
              {culture.distance} km
            </span>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base font-bold leading-7 text-[#333333] mb-1">
          {culture.name}
        </h3>
        
        <div className="flex items-start gap-1 mb-2">
          <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mt-0.5 flex-shrink-0">
            <path d="M5.33333 6.66668C5.7 6.66668 6.01389 6.53612 6.275 6.27501C6.53611 6.0139 6.66667 5.70001 6.66667 5.33334C6.66667 4.96668 6.53611 4.65279 6.275 4.39168C6.01389 4.13057 5.7 4.00001 5.33333 4.00001C4.96667 4.00001 4.65278 4.13057 4.39167 4.39168C4.13056 4.65279 4 4.96668 4 5.33334C4 5.70001 4.13056 6.0139 4.39167 6.27501C4.65278 6.53612 4.96667 6.66668 5.33333 6.66668ZM5.33333 11.5667C6.68889 10.3222 7.69444 9.19168 8.35 8.17501C9.00556 7.15834 9.33333 6.25557 9.33333 5.46668C9.33333 4.25557 8.94722 3.2639 8.175 2.49168C7.40278 1.71945 6.45556 1.33334 5.33333 1.33334C4.21111 1.33334 3.26389 1.71945 2.49167 2.49168C1.71944 3.2639 1.33333 4.25557 1.33333 5.46668C1.33333 6.25557 1.66111 7.15834 2.31667 8.17501C2.97222 9.19168 3.97778 10.3222 5.33333 11.5667ZM5.33333 13.3333C3.54444 11.8111 2.20833 10.3972 1.325 9.09168C0.441667 7.78612 0 6.57779 0 5.46668C0 3.80001 0.536111 2.47223 1.60833 1.48334C2.68056 0.494454 3.92222 9.53674e-06 5.33333 9.53674e-06C6.74444 9.53674e-06 7.98611 0.494454 9.05833 1.48334C10.1306 2.47223 10.6667 3.80001 10.6667 5.46668C10.6667 6.57779 10.225 7.78612 9.34167 9.09168C8.45833 10.3972 7.12222 11.8111 5.33333 13.3333Z" fill="#618989"/>
          </svg>
          <span className="text-sm font-normal leading-5 text-[#618989]">
            {culture.city && culture.province
              ? `${culture.city}, ${culture.province}`
              : culture.province || culture.location || 'Indonesia'}
          </span>
        </div>

        <p className="text-sm font-normal leading-5 text-[#333333] mb-4 line-clamp-3">
          {displayDescription}
        </p>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={`/jelajahi/${culture.slug}`}
          className="block w-full h-11 px-4 rounded-full bg-[#00A99D] hover:bg-[#008f85] transition-colors"
        >
          <span className="flex items-center justify-center h-full text-sm font-bold leading-[21px] tracking-[0.21px] text-white">
            Lihat Info Selengkapnya
          </span>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default CulturalItemCard;
