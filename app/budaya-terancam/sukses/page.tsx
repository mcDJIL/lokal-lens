'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BudayaTerancamSuksesPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 25 }}
        className="w-full max-w-[832px] p-8 sm:p-12 flex flex-col items-stretch rounded-xl border border-[#E5E2DC] bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]"
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 flex items-center justify-center rounded-full bg-[#DCFCE7]"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              width="60" height="72" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M26.5 47.5L44.125 29.875L40.625 26.375L26.5 40.5L19.375 33.375L15.875 36.875L26.5 47.5ZM30 61C26.5417 61 23.2917 60.3438 20.25 59.0312C17.2083 57.7188 14.5625 55.9375 12.3125 53.6875C10.0625 51.4375 8.28125 48.7917 6.96875 45.75C5.65625 42.7083 5 39.4583 5 36C5 32.5417 5.65625 29.2917 6.96875 26.25C8.28125 23.2083 10.0625 20.5625 12.3125 18.3125C14.5625 16.0625 17.2083 14.2812 20.25 12.9688C23.2917 11.6562 26.5417 11 30 11C33.4583 11 36.7083 11.6562 39.75 12.9688C42.7917 14.2812 45.4375 16.0625 47.6875 18.3125C49.9375 20.5625 51.7188 23.2083 53.0312 26.25C54.3438 29.2917 55 32.5417 55 36C55 39.4583 54.3438 42.7083 53.0312 45.75C51.7188 48.7917 49.9375 51.4375 47.6875 53.6875C45.4375 55.9375 42.7917 57.7188 39.75 59.0312C36.7083 60.3438 33.4583 61 30 61ZM30 56C35.5833 56 40.3125 54.0625 44.1875 50.1875C48.0625 46.3125 50 41.5833 50 36C50 30.4167 48.0625 25.6875 44.1875 21.8125C40.3125 17.9375 35.5833 16 30 16C24.4167 16 19.6875 17.9375 15.8125 21.8125C11.9375 25.6875 10 30.4167 10 36C10 41.5833 11.9375 46.3125 15.8125 50.1875C19.6875 54.0625 24.4167 56 30 56Z" fill="#27AE60"/>
            </motion.svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <h1 className="text-[#1A1A1A] text-center font-black text-3xl sm:text-4xl leading-10 tracking-[-1.08px]">
              Laporan Anda Telah Diterima!
            </h1>
            
            <p className="text-[#1A1A1A] text-center text-lg sm:text-xl leading-7 max-w-[672px]">
              Terima Kasih Atas Partisipasi Anda dalam Pelestarian Budaya.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-[576px] p-4 flex flex-col items-center rounded-lg border border-[#BFDBFE] bg-[#EFF6FF]"
          >
            <p className="text-[#887D63] text-center text-sm leading-[22.75px]">
              Tim kami akan meninjau laporan Anda dalam waktu 2x24 jam dan mungkin akan menghubungi Anda untuk verifikasi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/"
                className="w-full sm:w-auto px-6 py-3 flex items-center justify-center rounded-lg border border-[#E5E2DC] hover:bg-gray-50 transition-colors"
              >
                <span className="text-[#1A1A1A] text-center font-bold text-base leading-6">
                  Kembali ke Beranda
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
