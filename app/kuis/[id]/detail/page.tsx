'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/sections/Kuis/HeroSection';

interface QuizDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  category: string | null;
  difficulty: string;
  time_limit: number | null;
  total_questions: number;
  total_attempts: number;
}

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quizzes/${id}`);
      const data = await response.json();

      if (data.success) {
        setQuiz(data.data);
      } else {
        router.push('/kuis');
      }
    } catch (error) {
      console.error('Error fetching quiz detail:', error);
      router.push('/kuis');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    router.push(`/kuis/${id}/mulai`);
  };

  if (loading) {
    return (
      <main className="w-full bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <main className="w-full bg-white">
      <HeroSection 
        quiz={quiz}
        onStartQuiz={handleStartQuiz}
      />
    </main>
  );
}
