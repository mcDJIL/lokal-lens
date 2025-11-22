'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ScoreCard from '@/components/sections/Kuis/ScoreCard';
import StatCard from '@/components/sections/Kuis/StatCard';
import ActionButtons from '@/components/sections/Kuis/ActionButtons';

export default function SkorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');

  const [scoreData, setScoreData] = useState({
    score: 0,
    message: '',
    correctAnswers: 0,
    totalQuestions: 0,
    wrongAnswers: 0,
    completionTime: '00:00',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attemptId) {
      fetchQuizResult();
    }
  }, [attemptId]);

  const fetchQuizResult = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quizzes/attempts/${attemptId}/complete`);
      const data = await response.json();

      if (data.success) {
        const result = data.data;
        const percentage = Math.round(result.percentage || 0);
        
        // Format time taken (seconds to MM:SS)
        const minutes = Math.floor((result.timeTaken || 0) / 60);
        const seconds = (result.timeTaken || 0) % 60;
        const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Generate message based on score
        let message = '';
        if (percentage >= 90) {
          message = 'Luar biasa! Pengetahuan Anda tentang budaya Indonesia sangat mengagumkan. Teruslah menjelajahi kekayaan Nusantara!';
        } else if (percentage >= 70) {
          message = 'Bagus sekali! Anda memiliki pemahaman yang baik tentang budaya Indonesia. Terus tingkatkan pengetahuan Anda!';
        } else if (percentage >= 50) {
          message = 'Cukup baik! Masih ada ruang untuk belajar lebih banyak tentang budaya Indonesia yang kaya ini.';
        } else {
          message = 'Jangan menyerah! Terus belajar dan jelajahi keindahan budaya Indonesia. Anda pasti bisa lebih baik!';
        }

        setScoreData({
          score: percentage,
          message: message,
          correctAnswers: result.correctAnswers || 0,
          totalQuestions: result.totalQuestions || 0,
          wrongAnswers: result.wrongAnswers || 0,
          completionTime: timeFormatted,
        });
      }
    } catch (error) {
      console.error('Error fetching quiz result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[896px]">
          <div className="animate-pulse flex flex-col items-center gap-6">
            <div className="w-full h-64 bg-gray-200 rounded-2xl"></div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-8 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[896px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 md:gap-8"
        >
          {/* Score Card */}
          <ScoreCard 
            score={scoreData.score} 
            message={scoreData.message}
          />

          {/* Stats Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon="correct"
              label="Jawaban Benar"
              value={`${scoreData.correctAnswers} / ${scoreData.totalQuestions}`}
              index={0}
            />
            <StatCard
              icon="wrong"
              label="Jawaban Salah"
              value={`${scoreData.wrongAnswers} / ${scoreData.totalQuestions}`}
              index={1}
            />
            <StatCard
              icon="time"
              label="Waktu Selesai"
              value={scoreData.completionTime}
              index={2}
            />
          </div>

          {/* Action Buttons */}
          <ActionButtons />

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-4"
          >
            <a
              href="/kuis"
              className="text-[#006C84] text-center font-sans text-base font-normal leading-6 hover:underline transition-all"
            >
              Kembali ke Daftar Kuis
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
