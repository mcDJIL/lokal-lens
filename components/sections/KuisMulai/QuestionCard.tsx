'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  imageUrl?: string | null;
  instruction: string;
}

export default function QuestionCard({ questionNumber, question, imageUrl, instruction }: QuestionCardProps) {
  return (
    <motion.div 
      className="rounded-3xl bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.05)] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col lg:flex-row">
        {imageUrl && (
          <motion.div 
            className="relative w-full lg:w-[448px] aspect-video lg:aspect-auto lg:h-[252px]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={imageUrl}
              alt={`Question ${questionNumber}`}
              fill
              className="object-cover lg:rounded-l-3xl"
              sizes="(max-width: 1024px) 100vw, 448px"
            />
          </motion.div>
        )}

        <div className="flex-1 p-6 sm:p-8 lg:p-6 flex flex-col justify-center gap-2">
          <motion.p 
            className="text-sm font-bold leading-[21px] text-[#2B6CEE]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Pertanyaan {questionNumber}
          </motion.p>

          <motion.h2 
            className="text-lg sm:text-xl font-bold leading-[25px] tracking-[-0.3px] text-[#111318]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {question}
          </motion.h2>

          <motion.p 
            className="text-base font-normal leading-6 text-[#6B7280] mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {instruction}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
