'use client';

import { useState } from "react";
import HeroSection from "@/components/sections/ScanBudaya/HeroSection";
import ScannerSection from "@/components/sections/ScanBudaya/ScannerSection";
import WhatCanYouScanSection from "@/components/sections/ScanBudaya/WhatCanYouScanSection";
import TipsSection from "@/components/sections/ScanBudaya/TipsSection";
import CTASection from "@/components/sections/ScanBudaya/CTASection";
import ResultsSection from "@/components/sections/ScanBudaya/ResultsSection";
import SpotlightSection from "@/components/sections/ScanBudaya/SpotlightSection";
import TrendingScansSection from "@/components/sections/ScanBudaya/TrendingScansSection";
import RecommendationsSection from "@/components/sections/ScanBudaya/RecommendationsSection";
import { motion, AnimatePresence } from "framer-motion";

export default function ScanBudayaPage() {
  const [scanState, setScanState] = useState<'BEFORE_SCAN' | 'SCANNING' | 'AFTER_SCAN'>('BEFORE_SCAN');
  const [scanResult, setScanResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScanComplete = (result: any) => {
    setScanResult(result);
    setScanState('AFTER_SCAN');
    setIsLoading(false);
  };

  const handleBackToScanner = () => {
    setScanState('BEFORE_SCAN');
    setScanResult(null);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white min-h-screen"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
        <HeroSection />
        
        <AnimatePresence mode="wait">
          {scanState === 'BEFORE_SCAN' && (
            <motion.div
              key="before-scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-16 lg:pb-24"
            >
              <div className="space-y-8">
                <ScannerSection onScanComplete={handleScanComplete} />
                <TipsSection />
              </div>
              <div className="space-y-8">
                <WhatCanYouScanSection />
                <CTASection />
              </div>
            </motion.div>
          )}

          {scanState === 'SCANNING' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center py-32 pb-16 lg:pb-24"
            >
              <div className="text-center space-y-6">
                <motion.div
                  className="w-24 h-24 mx-auto border-8 border-primary-green border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#111818]">
                    Memindai Objek Budaya...
                  </h3>
                  <p className="text-[#618989]">
                    Mohon tunggu, AI sedang menganalisis objek
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {scanState === 'AFTER_SCAN' && (
            <motion.div
              key="after-scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back to Scanner Button */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <button
                  onClick={handleBackToScanner}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="#111818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm font-semibold text-[#111818]">
                    Pindai Lagi
                  </span>
                </button>
              </motion.div>

              {/* Results Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-16 lg:pb-24">
                <div className="space-y-8">
                  <ScannerSection onScanComplete={handleScanComplete} />
                  <TipsSection />
                  <RecommendationsSection scanResult={scanResult} />
                </div>
                <div className="space-y-8">
                  <ResultsSection data={scanResult} isLoading={isLoading} />
                  <SpotlightSection location={scanResult?.location} />
                  <TrendingScansSection />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
