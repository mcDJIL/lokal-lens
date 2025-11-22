'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ReportCardProps {
  report: {
    id: number;
    culture_name: string;
    image_url: string | null;
    status: string;
    threat_type: string;
    location: string;
    created_at: string;
  };
  onViewDetail?: (id: number) => void;
}

const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  pending: {
    label: 'Menunggu',
    bgColor: 'bg-[rgba(255,193,7,0.2)]',
    textColor: 'text-[#FFC107]',
  },
  approved: {
    label: 'Disetujui',
    bgColor: 'bg-[rgba(39,174,96,0.2)]',
    textColor: 'text-[#27AE60]',
  },
  rejected: {
    label: 'Ditolak',
    bgColor: 'bg-[rgba(192,57,43,0.2)]',
    textColor: 'text-[#C0392B]',
  },
};

const ReportCard = ({ report, onViewDetail }: ReportCardProps) => {
  const status = statusConfig[report.status] || statusConfig.pending;
  const displayImage = report.image_url || 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex flex-col gap-4 p-4 border border-[rgba(0,0,0,0.1)] rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetail && onViewDetail(report.id)}
    >
      <div className="relative w-full aspect-[376.66/211.86] rounded-lg overflow-hidden">
        <Image
          src={displayImage}
          alt={report.culture_name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[#1A1A1A] font-bold text-base leading-6">
              {report.culture_name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold leading-4 ${status.bgColor} ${status.textColor}`}>
              {status.label}
            </span>
          </div>

          <p className="text-[#887D63] font-normal text-sm leading-5">
            Ancaman: {report.threat_type}
          </p>

          <p className="text-[#887D63] font-normal text-sm leading-5">
            Lokasi: {report.location}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[#887D63] font-normal text-xs leading-4">
            Dilaporkan pada {formatDate(report.created_at)}
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail && onViewDetail(report.id);
            }}
            className="flex items-center justify-center px-4 h-9 min-w-[84px] rounded-lg bg-[rgba(212,155,22,0.2)] hover:bg-[rgba(212,155,22,0.3)] transition-colors"
          >
            <span className="text-primary-gold font-bold text-sm leading-5 text-[#D49B16]">
              Lihat Detail
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
