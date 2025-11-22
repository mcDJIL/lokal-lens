"use client";

import { Suspense, use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import HeroSection from '@/components/sections/KuisPembahasan/HeroSection';
import QuestionCard from '@/components/sections/KuisPembahasan/QuestionCard';
import ActionButtons from '@/components/sections/KuisPembahasan/ActionButtons';

export default function PembahasanKuisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');

  const [quizData, setQuizData] = useState({
    title: '',
    questions: [] as Array<{
      questionNumber: number;
      question: string;
      imageUrl: string | null;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
    }>,
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
        setQuizData({
          title: data.data.quizTitle,
          questions: data.data.answers,
        });
      }
    } catch (error) {
      console.error('Error fetching quiz result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    router.push(`/kuis/${slug}/detail`);
  };

  const handleBackToQuizList = () => {
    router.push('/kuis');
  };

  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </main>
    }>
      {loading ? (
        <main className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-white">
          <div className="w-full max-w-[896px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <HeroSection title={quizData.title} />

            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {quizData.questions.map((question, index) => (
                <QuestionCard
                  key={index}
                  question={question}
                  index={index}
                />
              ))}
            </motion.div>

            <ActionButtons
              onRetakeQuiz={handleRetakeQuiz}
              onBackToQuizList={handleBackToQuizList}
            />
          </div>
        </main>
      )}
    </Suspense>
  );
}
