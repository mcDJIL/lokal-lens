'use client';

import Image from 'next/image';

interface EventCardProps {
  id?: number;
  title: string;
  slug?: string;
  date: string;
  location: string;
  price: string | null;
  image: string;
  status: 'TERSEDIA' | 'GRATIS' | 'HABIS' | 'DIBATALKAN' | 'SELESAI';
  statusColor: 'red' | 'green' | 'gray';
  category?: string | null;
  views?: number;
}

export default function EventCard({
  title,
  slug,
  date,
  location,
  price,
  image,
  status,
  statusColor,
}: EventCardProps) {
  const statusColors = {
    red: 'bg-[#E57373]',
    green: 'bg-[#16A34A]',
    gray: 'bg-[#6B7280]',
  };

  const isDisabled = status === 'HABIS' || status === 'DIBATALKAN' || status === 'SELESAI';
  const eventSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  return (
    <div className="group relative bg-white rounded-xl border border-[#EAE3D9] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full ${statusColors[statusColor]}`}>
          <span className="text-xs font-bold text-white">{status}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-[#192A51] line-clamp-1 transition-colors group-hover:text-[#D4A017]">
          {title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M3.33333 16.6665C2.96667 16.6665 2.65278 16.5359 2.39167 16.2748C2.13056 16.0137 2 15.6998 2 15.3332V5.99984C2 5.63317 2.13056 5.31928 2.39167 5.05817C2.65278 4.79706 2.96667 4.6665 3.33333 4.6665H4V3.33317H5.33333V4.6665H10.6667V3.33317H12V4.6665H12.6667C13.0333 4.6665 13.3472 4.79706 13.6083 5.05817C13.8694 5.31928 14 5.63317 14 5.99984V15.3332C14 15.6998 13.8694 16.0137 13.6083 16.2748C13.3472 16.5359 13.0333 16.6665 12.6667 16.6665H3.33333ZM3.33333 15.3332H12.6667V8.6665H3.33333V15.3332ZM3.33333 7.33317H12.6667V5.99984H3.33333V7.33317Z" fill="#5C6B8A"/>
          </svg>
          <span className="text-sm text-[#5C6B8A]">{date}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M8.00001 9.99984C8.36667 9.99984 8.68056 9.86928 8.94167 9.60817C9.20278 9.34706 9.33334 9.03317 9.33334 8.6665C9.33334 8.29984 9.20278 7.98595 8.94167 7.72484C8.68056 7.46373 8.36667 7.33317 8.00001 7.33317C7.63334 7.33317 7.31945 7.46373 7.05834 7.72484C6.79723 7.98595 6.66667 8.29984 6.66667 8.6665C6.66667 9.03317 6.79723 9.34706 7.05834 9.60817C7.31945 9.86928 7.63334 9.99984 8.00001 9.99984ZM8.00001 14.8998C9.35556 13.6554 10.3611 12.5248 11.0167 11.5082C11.6722 10.4915 12 9.58873 12 8.79984C12 7.58873 11.6139 6.59706 10.8417 5.82484C10.0694 5.05261 9.12223 4.6665 8.00001 4.6665C6.87778 4.6665 5.93056 5.05261 5.15834 5.82484C4.38612 6.59706 4.00001 7.58873 4.00001 8.79984C4.00001 9.58873 4.32778 10.4915 4.98334 11.5082C5.63889 12.5248 6.64445 13.6554 8.00001 14.8998ZM8.00001 16.6665C6.21112 15.1443 4.87501 13.7304 3.99167 12.4248C3.10834 11.1193 2.66667 9.91095 2.66667 8.79984C2.66667 7.13317 3.20278 5.80539 4.27501 4.8165C5.34723 3.82761 6.58889 3.33317 8.00001 3.33317C9.41112 3.33317 10.6528 3.82761 11.725 4.8165C12.7972 5.80539 13.3333 7.13317 13.3333 8.79984C13.3333 9.91095 12.8917 11.1193 12.0083 12.4248C11.125 13.7304 9.78889 15.1443 8.00001 16.6665Z" fill="#5C6B8A"/>
          </svg>
          <span className="text-sm text-[#5C6B8A]">{location}</span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {price ? (
            <span className="text-base font-bold text-[#D4A017]">{price}</span>
          ) : (
            <div className="flex items-center">
              {status === 'GRATIS' && (
                <span className="text-base font-bold text-[#D4A017]">Rp 0</span>
              )}
            </div>
          )}
          <a
            href={isDisabled ? undefined : `/event-budaya/${eventSlug}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
              isDisabled
                ? 'border-[#9CA3AF] text-[#9CA3AF] cursor-not-allowed pointer-events-none'
                : 'border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white hover:shadow-md'
            }`}
          >
            <span className="text-sm font-bold">Detail</span>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7833 10.6668H2.66666V9.3335H10.7833L7.04999 5.60016L7.99999 4.66683L13.3333 10.0002L7.99999 15.3335L7.04999 14.4002L10.7833 10.6668Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
