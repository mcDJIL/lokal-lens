'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizHeader from '@/components/sections/KuisMulai/QuizHeader';
import QuizProgress from '@/components/sections/KuisMulai/QuizProgress';
import QuestionCard from '@/components/sections/KuisMulai/QuestionCard';
import AnswerOptions from '@/components/sections/KuisMulai/AnswerOptions';
import FeedbackCard from '@/components/sections/KuisMulai/FeedbackCard';
import ContinueButton from '@/components/sections/KuisMulai/ContinueButton';

interface Question {
  id: number;
  question: string;
  image_url: string | null;
  order_number: number;
  points: number;
  options: {
    id: number;
    option_text: string;
    order_number: number;
  }[];
}

export default function QuizMulaiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);
  const router = useRouter();
  
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    startQuiz();
  }, [slug]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      
      // Get quiz detail first
      const detailResponse = await fetch(`/api/quizzes/${slug}`);
      const detailData = await detailResponse.json();
      
      if (!detailData.success) {
        router.push('/kuis');
        return;
      }
      
      setQuizTitle(detailData.data.title);

      // Start quiz attempt
      const startResponse = await fetch(`/api/quizzes/${slug}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: null, // TODO: Get from auth context
        }),
      });

      const startData = await startResponse.json();

      if (startData.success) {
        setAttemptId(startData.data.attemptId);
        setQuestions(startData.data.questions);
        setTotalPoints(startData.data.totalPoints);
        setStartTime(Date.now());
      } else {
        router.push('/kuis');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      router.push('/kuis');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (optionId: number) => {
    if (showFeedback || !attemptId) return;

    setSelectedAnswer(optionId);

    try {
      const response = await fetch(`/api/quizzes/attempts/${attemptId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          optionId: optionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedbackData(data.data);
        setScore(data.data.currentScore);
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleContinue = async () => {
    if (currentQuestionIndex >= questions.length - 1) {
      // Quiz selesai, hitung waktu dan redirect ke hasil
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      try {
        await fetch(`/api/quizzes/attempts/${attemptId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timeTaken: timeTaken,
          }),
        });

        router.push(`/kuis/${slug}/skor?attemptId=${attemptId}`);
      } catch (error) {
        console.error('Error completing quiz:', error);
      }
      return;
    }

    // Next question
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFeedbackData(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-[85px]">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-[85px]">
        <QuizHeader title={quizTitle} />
        
        <div className="mt-6 sm:mt-8">
          <QuizProgress 
            score={score}
            current={currentQuestionIndex + 1}
            total={questions.length}
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            question={currentQuestion.question}
            imageUrl={currentQuestion.image_url || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'}
            instruction="Pilih salah satu jawaban yang paling tepat di bawah ini."
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <AnswerOptions
            options={currentQuestion.options.map(opt => opt.option_text)}
            selectedAnswer={selectedAnswer !== null ? currentQuestion.options.findIndex(opt => opt.id === selectedAnswer) : null}
            correctAnswer={feedbackData ? currentQuestion.options.findIndex(opt => opt.id === feedbackData.correctOptionId) : null}
            showFeedback={showFeedback}
            onSelect={(index) => handleAnswerSelect(currentQuestion.options[index].id)}
          />
        </div>

        {showFeedback && feedbackData && (
          <div className="mt-6 sm:mt-8">
            <FeedbackCard
              isCorrect={feedbackData.isCorrect}
              explanation={feedbackData.explanation || 'Penjelasan tidak tersedia.'}
            />
            
            <div className="flex justify-center mt-6">
              <ContinueButton onClick={handleContinue} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
