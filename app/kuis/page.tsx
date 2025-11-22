'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/sections/ListKuis/HeroSection';
import QuizGridSection from '@/components/sections/ListKuis/QuizGridSection';

interface Quiz {
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

export default function KuisPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchQuizzes();
  }, [selectedCategory, selectedDifficulty]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);

      const response = await fetch(`/api/quizzes?${params}`);
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.data);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <QuizGridSection 
        quizzes={quizzes}
        loading={loading}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />
    </div>
  );
}
