'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BergabungSuksesPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 15 seconds
    const timer = setTimeout(() => {
      router.push('/profil');
    }, 15000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(212, 160, 23, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 108, 132, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(192, 57, 43, 0.3) 0%, transparent 50%)
          `
        }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="w-full max-w-[672px] relative z-10"
      >
        {/* Card with Glass Effect */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              background: `
                radial-gradient(141.42% 141.42% at 100% 100%, rgba(212, 160, 23, 0.00) 16.84%, #D4A017 16.84%, #D4A017 17.68%, rgba(212, 160, 23, 0.00) 17.68%),
                linear-gradient(90deg, #D4A017 0%, #006C84 100%)
              `
            }}
          />

          {/* Content */}
          <div className="relative p-6 sm:p-8 md:p-10">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                {/* Outer Ring */}
                <div className="absolute inset-0 bg-primary-gold/20 rounded-full blur-md animate-pulse" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-gold/20 shadow-[0_0_0_4px_rgba(212,160,23,0.3)] flex items-center justify-center">
                  {/* Inner Circle */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-gold flex items-center justify-center">
                    {/* Check Icon */}
                    <svg className="w-7 h-8 sm:w-9 sm:h-11" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                        d="M12.9 37.75L10.05 32.95L4.65 31.75L5.175 26.2L1.5 22L5.175 17.8L4.65 12.25L10.05 11.05L12.9 6.25L18 8.425L23.1 6.25L25.95 11.05L31.35 12.25L30.825 17.8L34.5 22L30.825 26.2L31.35 31.75L25.95 32.95L23.1 37.75L18 35.575L12.9 37.75ZM14.175 33.925L18 32.275L21.9 33.925L24 30.325L28.125 29.35L27.75 25.15L30.525 22L27.75 18.775L28.125 14.575L24 13.675L21.825 10.075L18 11.725L14.1 10.075L12 13.675L7.875 14.575L8.25 18.775L5.475 22L8.25 25.15L7.875 29.425L12 30.325L14.175 33.925ZM16.425 27.325L24.9 18.85L22.8 16.675L16.425 23.05L13.2 19.9L11.1 22L16.425 27.325Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-900 font-bold text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight mb-3"
            >
              Selamat! Pendaftaran Anda Berhasil.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center text-gray-600 text-sm sm:text-base leading-relaxed mb-6"
            >
              Terima kasih telah bergabung dalam misi pelestarian budaya bersama Lokallens. Kami sangat antusias menyambut Anda di komunitas kami.
            </motion.p>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 mb-6" />

            {/* Next Steps Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 mb-6"
            >
              <h2 className="text-gray-900 font-semibold text-lg sm:text-xl leading-7">
                Langkah Selanjutnya
              </h2>

              {/* Step 1: Review */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                {/* Icon */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-600/90 flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-5 h-6 sm:w-6 sm:h-7" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.12107 21.7777H15.8988V18.8611C15.8988 17.7916 15.5181 16.8761 14.7565 16.1145C13.9949 15.353 13.0794 14.9722 12.01 14.9722C10.9405 14.9722 10.025 15.353 9.26343 16.1145C8.50185 16.8761 8.12107 17.7916 8.12107 18.8611V21.7777ZM4.23218 23.7222V21.7777H6.17662V18.8611C6.17662 17.8726 6.40753 16.945 6.86933 16.0781C7.33114 15.2112 7.97523 14.5185 8.80162 13.9999C7.97523 13.4814 7.33114 12.7887 6.86933 11.9218C6.40753 11.0549 6.17662 10.1273 6.17662 9.13883V6.22217H4.23218V4.27772H19.7877V6.22217H17.8433V9.13883C17.8433 10.1273 17.6124 11.0549 17.1506 11.9218C16.6888 12.7887 16.0447 13.4814 15.2183 13.9999C16.0447 14.5185 16.6888 15.2112 17.1506 16.0781C17.6124 16.945 17.8433 17.8726 17.8433 18.8611V21.7777H19.7877V23.7222H4.23218Z" fill="white"/>
                  </svg>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-semibold text-base leading-6 mb-1">
                    Peninjauan Pendaftaran
                  </h3>
                  <p className="text-gray-600 text-sm leading-5">
                    Tim kami akan meninjau pendaftaran Anda. Proses ini biasanya memakan waktu hingga{' '}
                    <span className="font-bold text-primary-gold">2×24 jam</span>.
                  </p>
                </div>
              </motion.div>

              {/* Step 2: Email Confirmation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                {/* Icon */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-red/90 flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-5 h-6 sm:w-6 sm:h-7" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.8503 23.7222L11.7184 19.5902L13.0795 18.2291L15.8503 20.9999L21.3434 15.5069L22.7045 16.868L15.8503 23.7222ZM12.0101 13.0277L19.7878 8.16661H4.23229L12.0101 13.0277ZM12.0101 14.9722L4.23229 10.1111V19.8333H9.23923L11.1837 21.7777H4.23229C3.69756 21.7777 3.23981 21.5873 2.85902 21.2065C2.47824 20.8258 2.28784 20.368 2.28784 19.8333V8.16661C2.28784 7.63189 2.47824 7.17414 2.85902 6.79335C3.23981 6.41256 3.69756 6.22217 4.23229 6.22217H19.7878C20.3226 6.22217 20.7803 6.41256 21.1611 6.79335C21.5419 7.17414 21.7323 7.63189 21.7323 8.16661V12.3958L19.7878 14.3402V10.1111L12.0101 14.9722Z" fill="white"/>
                  </svg>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-semibold text-base leading-6 mb-1">
                    Email Konfirmasi
                  </h3>
                  <p className="text-gray-600 text-sm leading-5">
                    Anda akan menerima email konfirmasi setelah akun Anda disetujui dan diaktifkan. Mohon periksa folder spam Anda secara berkala.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Dashboard Button */}
              <Link href="/dashboard/contributor">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-primary-gold rounded-lg text-gray-900 font-bold text-base leading-6 shadow-lg shadow-primary-gold/30 hover:shadow-xl hover:shadow-primary-gold/40 transition-all"
                >
                  Ke Dashboard
                </motion.button>
              </Link>

              {/* Home Button */}
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-white rounded-lg text-gray-900 font-bold text-base leading-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  Kembali ke Beranda
                </motion.button>
              </Link>
            </motion.div>

            {/* Auto Redirect Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center text-xs text-gray-500 mt-6"
            >
              Halaman ini akan otomatis mengarahkan Anda ke profil dalam 15 detik
            </motion.p>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
              <p className="text-gray-500 text-center sm:text-left">
                © 2024 Lokallens. Semua Hak Cipta Dilindungi.
              </p>
              <div className="flex items-center gap-4">
                <Link 
                  href="/tentang-kami" 
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Tentang Kami
                </Link>
                <Link 
                  href="/tentang-kami" 
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
