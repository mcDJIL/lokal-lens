'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ReportDetailModalProps {
  reportId: number;
  onClose: () => void;
}

const ReportDetailModal = ({ reportId, onClose }: ReportDetailModalProps) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportDetail();
  }, [reportId]);

  const fetchReportDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/endangered-reports/${reportId}`);
      const data = await response.json();
      if (data.success) {
        setReport(data.data);
      }
    } catch (error) {
      console.error('Error fetching report detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
    pending: {
      label: 'Menunggu Review',
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D49B16]"></div>
          </div>
        ) : report ? (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  {report.culture_name}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusConfig[report.status]?.bgColor} ${statusConfig[report.status]?.textColor}`}>
                  {statusConfig[report.status]?.label}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18M6 18L18 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </motion.button>
            </div>

            {/* Image */}
            {report.image_url && (
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
                <Image
                  src={report.image_url}
                  alt={report.culture_name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#887D63] mb-1">Jenis Ancaman</h3>
                <p className="text-base text-[#1A1A1A]">{report.threat_type}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#887D63] mb-1">Lokasi</h3>
                <p className="text-base text-[#1A1A1A]">
                  {report.city && report.province
                    ? `${report.city}, ${report.province}`
                    : report.location}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#887D63] mb-1">Deskripsi</h3>
                <p className="text-base text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>

              {report.admin_notes && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-[#887D63] mb-1">Catatan Admin</h3>
                  <p className="text-base text-[#1A1A1A] leading-relaxed">
                    {report.admin_notes}
                  </p>
                </div>
              )}

              {/* Reporter Info */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-[#887D63] mb-2">Informasi Pelapor</h3>
                {report.is_anonymous ? (
                  <p className="text-sm text-[#887D63]">Laporan dikirim secara anonim</p>
                ) : (
                  <div className="space-y-1">
                    {report.reporter_name && (
                      <p className="text-sm text-[#1A1A1A]">Nama: {report.reporter_name}</p>
                    )}
                    {report.reporter_email && (
                      <p className="text-sm text-[#1A1A1A]">Email: {report.reporter_email}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t border-gray-200 text-xs text-[#887D63] space-y-1">
                <p>Dilaporkan pada: {formatDate(report.created_at)}</p>
                {report.reviewed_at && (
                  <p>Ditinjau pada: {formatDate(report.reviewed_at)}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-[#887D63]">Laporan tidak ditemukan</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReportDetailModal;
