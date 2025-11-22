'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Quiz {
  id: number;
  title: string;
  slug: string;
  category: string;
  categoryColor: string;
  difficulty: 'Mudah' | 'Menengah' | 'Sulit';
  duration: string;
  description: string;
  image: string;
}

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

const QuizCard = ({ quiz, index }: QuizCardProps) => {
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah':
        return (
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.3335 15.3335V11.3335H5.3335V15.3335H3.3335Z" fill="#6B7280"/>
          </svg>
        );
      case 'Menengah':
        return (
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.3335 15.3335V11.3335H5.3335V15.3335H3.3335ZM7.3335 15.3335V8.00016H9.3335V15.3335H7.3335Z" fill="#6B7280"/>
          </svg>
        );
      case 'Sulit':
        return (
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.3335 15.3335V11.3335H5.3335V15.3335H3.3335ZM7.3335 15.3335V8.00016H9.3335V15.3335H7.3335ZM11.3335 15.3335V4.66683H13.3335V15.3335H11.3335Z" fill="#6B7280"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group flex flex-col rounded-3xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <Image
            src={quiz.image}
            alt={quiz.title}
            fill
            className="object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
        
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ backgroundColor: quiz.categoryColor }}
        >
          <svg width="14" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.95421 7.44455L7.00977 2.44455L10.0653 7.44455H3.95421ZM10.0653 13.5557C9.37088 13.5557 8.7806 13.3126 8.29449 12.8265C7.80838 12.3404 7.56532 11.7501 7.56532 11.0557C7.56532 10.3612 7.80838 9.77094 8.29449 9.28483C8.7806 8.79872 9.37088 8.55566 10.0653 8.55566C10.7598 8.55566 11.35 8.79872 11.8362 9.28483C12.3223 9.77094 12.5653 10.3612 12.5653 11.0557C12.5653 11.7501 12.3223 12.3404 11.8362 12.8265C11.35 13.3126 10.7598 13.5557 10.0653 13.5557ZM2.00977 13.2779V8.83344H6.45421V13.2779H2.00977ZM10.0653 12.4446C10.4542 12.4446 10.7829 12.3103 11.0514 12.0418C11.32 11.7733 11.4542 11.4446 11.4542 11.0557C11.4542 10.6668 11.32 10.3381 11.0514 10.0696C10.7829 9.80103 10.4542 9.66677 10.0653 9.66677C9.67643 9.66677 9.34773 9.80103 9.07921 10.0696C8.81069 10.3381 8.67643 10.6668 8.67643 11.0557C8.67643 11.4446 8.81069 11.7733 9.07921 12.0418C9.34773 12.3103 9.67643 12.4446 10.0653 12.4446ZM3.12088 12.1668H5.3431V9.94455H3.12088V12.1668ZM5.92643 6.33344H8.0931L7.00977 4.58344L5.92643 6.33344Z" fill="white"/>
          </svg>
          <span className="text-xs font-semibold leading-4 text-white">
            {quiz.category}
          </span>
        </motion.div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold leading-7 text-[#1A1A1A] mb-3">
          {quiz.title}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            {getDifficultyIcon(quiz.difficulty)}
            <span className="text-sm font-normal leading-5 text-[#6B7280]">
              {quiz.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.2002 13.1332L11.1335 12.1998L8.66683 9.73317V6.6665H7.3335V10.2665L10.2002 13.1332ZM8.00016 16.6665C7.07794 16.6665 6.21127 16.4915 5.40016 16.1415C4.58905 15.7915 3.8835 15.3165 3.2835 14.7165C2.6835 14.1165 2.2085 13.4109 1.8585 12.5998C1.5085 11.7887 1.3335 10.9221 1.3335 9.99984C1.3335 9.07761 1.5085 8.21095 1.8585 7.39984C2.2085 6.58873 2.6835 5.88317 3.2835 5.28317C3.8835 4.68317 4.58905 4.20817 5.40016 3.85817C6.21127 3.50817 7.07794 3.33317 8.00016 3.33317C8.92239 3.33317 9.78905 3.50817 10.6002 3.85817C11.4113 4.20817 12.1168 4.68317 12.7168 5.28317C13.3168 5.88317 13.7918 6.58873 14.1418 7.39984C14.4918 8.21095 14.6668 9.07761 14.6668 9.99984C14.6668 10.9221 14.4918 11.7887 14.1418 12.5998C13.7918 13.4109 13.3168 14.1165 12.7168 14.7165C12.1168 15.3165 11.4113 15.7915 10.6002 16.1415C9.78905 16.4915 8.92239 16.6665 8.00016 16.6665ZM8.00016 15.3332C9.47794 15.3332 10.7363 14.8137 11.7752 13.7748C12.8141 12.7359 13.3335 11.4776 13.3335 9.99984C13.3335 8.52206 12.8141 7.26373 11.7752 6.22484C10.7363 5.18595 9.47794 4.6665 8.00016 4.6665C6.52239 4.6665 5.26405 5.18595 4.22516 6.22484C3.18627 7.26373 2.66683 8.52206 2.66683 9.99984C2.66683 11.4776 3.18627 12.7359 4.22516 13.7748C5.26405 14.8137 6.52239 15.3332 8.00016 15.3332Z" fill="#6B7280"/>
            </svg>
            <span className="text-sm font-normal leading-5 text-[#6B7280]">
              {quiz.duration}
            </span>
          </div>
        </div>

        <p className="text-base leading-6 text-[#4B5563] mb-6 flex-1">
          {quiz.description}
        </p>

        <motion.button
          onClick={() => window.location.href = `/kuis/${quiz.slug}/detail`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-[#006C84] hover:bg-[#005266] transition-colors"
        >
          <span className="text-base font-bold leading-6 tracking-[0.24px] text-white">
            Mulai Kuis
          </span>
          <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.0692 14.9723H4.23242V13.0278H16.0692L10.6248 7.58339L12.0102 6.22228L19.788 14.0001L12.0102 21.7778L10.6248 20.4167L16.0692 14.9723Z" fill="white"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuizCard;
