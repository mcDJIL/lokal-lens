'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReportCardDynamic from './ReportCardDynamic';
import ReportDetailModal from './ReportDetailModal';

interface Report {
  id: number;
  culture_name: string;
  threat_type: string;
  description: string;
  location: string;
  province: string | null;
  city: string | null;
  image_url: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  is_anonymous: boolean;
  user_id: number | null;
  status: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ReportGridSectionProps {
  searchQuery: string;
  selectedStatus: string;
  selectedThreatType: string;
  selectedProvince: string;
}

const ReportGridSectionDynamic = ({
  searchQuery,
  selectedStatus,
  selectedThreatType,
  selectedProvince,
}: ReportGridSectionProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  useEffect(() => {
    fetchReports();
  }, [currentPage, searchQuery, selectedStatus, selectedThreatType, selectedProvince]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedThreatType && { threat_type: selectedThreatType }),
        ...(selectedProvince && { province: selectedProvince }),
      });

      const response = await fetch(`/api/endangered-reports?${params}`);
      const data = await response.json();

      if (data.success) {
        setReports(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-10">
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#D49B16]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (reports.length === 0) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center"
          >
            <p className="text-[#887D63] text-base sm:text-lg mb-2 sm:mb-4">Tidak ada laporan ditemukan</p>
            <p className="text-[#887D63] text-sm">Coba ubah filter atau kata kunci pencarian</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
          >
            {reports.map((report) => (
              <ReportCardDynamic
                key={report.id}
                report={report}
                onViewDetail={setSelectedReportId}
              />
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-6 sm:pt-8">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6667 17L6.66669 12L11.6667 7L12.8334 8.16667L9.00002 12L12.8334 15.8333L11.6667 17Z" fill="#1A1A1A" fillOpacity="0.6"/>
                  </svg>
                </motion.button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold leading-5 transition-colors ${
                          currentPage === page
                            ? 'bg-[rgba(212,155,22,0.2)] text-[#D49B16]'
                            : 'text-[rgba(26,26,26,0.6)] hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </motion.button>
                    );
                  } else if (
                    (page === currentPage - 2 && page > 1) ||
                    (page === currentPage + 2 && page < totalPages)
                  ) {
                    return (
                      <span key={page} className="text-[rgba(26,26,26,0.6)]">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 12L6.66669 8.16667L7.83335 7L12.8334 12L7.83335 17L6.66669 15.8333L10.5 12Z" fill="#1A1A1A" fillOpacity="0.6"/>
                  </svg>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedReportId && (
          <ReportDetailModal
            reportId={selectedReportId}
            onClose={() => setSelectedReportId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ReportGridSectionDynamic;
