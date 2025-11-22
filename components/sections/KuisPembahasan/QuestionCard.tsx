'use client';

import { motion } from 'framer-motion';

interface Question {
  questionNumber: number;
  question: string;
  imageUrl: string | null;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

const QuestionCard = ({ question, index }: QuestionCardProps) => {
  const { questionNumber, question: questionText, imageUrl, isCorrect, correctAnswer, userAnswer, explanation } = question;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      className={`rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col gap-4 transition-all duration-300 ${
        isCorrect
          ? 'border border-[rgba(39,174,96,0.3)] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_0_rgba(39,174,96,0.15)]'
          : 'border border-[#C0392B] bg-[rgba(192,57,43,0.05)] shadow-[0_10px_15px_-3px_rgba(192,57,43,0.1),0_4px_6px_-4px_rgba(192,57,43,0.1)] hover:shadow-[0_12px_20px_-3px_rgba(192,57,43,0.15)]'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isCorrect ? 'bg-[#27AE60]' : 'bg-[#C0392B]'
          }`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
        >
          {isCorrect ? (
            <svg width="24" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.62809 19.833L4.08643 14.2913L5.47184 12.9059L9.62809 17.0622L18.5482 8.14204L19.9336 9.52745L9.62809 19.833Z" fill="white"/>
            </svg>
          ) : (
            <svg width="24" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.56546 20.8057L5.20435 19.4446L10.6488 14.0001L5.20435 8.55566L6.56546 7.19455L12.0099 12.639L17.4543 7.19455L18.8155 8.55566L13.371 14.0001L18.8155 19.4446L17.4543 20.8057L12.0099 15.3612L6.56546 20.8057Z" fill="white"/>
            </svg>
          )}
        </motion.div>

        <div className="flex-1 flex flex-col gap-4">
          <motion.h3
            className="text-base sm:text-lg font-bold leading-7 text-[#1A1A1A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {questionNumber}. {questionText}
          </motion.h3>

          {imageUrl && (
            <motion.div
              className="w-full rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.35 }}
            >
              <img
                src={imageUrl}
                alt={`Gambar pertanyaan ${questionNumber}`}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          )}

          <div className="flex flex-col gap-3">
            {!isCorrect && userAnswer && (
              <motion.div
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[rgba(192,57,43,0.1)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <svg width="24" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.51006 18.8615L12.0101 15.3615L15.5101 18.8615L16.8712 17.5004L13.3712 14.0004L16.8712 10.5004L15.5101 9.13932L12.0101 12.6393L8.51006 9.13932L7.14895 10.5004L10.649 14.0004L7.14895 17.5004L8.51006 18.8615ZM12.0101 23.7227C10.6652 23.7227 9.40127 23.4674 8.2184 22.957C7.03553 22.4466 6.00659 21.7539 5.13159 20.8789C4.25659 20.0039 3.56388 18.975 3.05347 17.7921C2.54305 16.6092 2.28784 15.3453 2.28784 14.0004C2.28784 12.6555 2.54305 11.3916 3.05347 10.2088C3.56388 9.0259 4.25659 7.99696 5.13159 7.12196C6.00659 6.24696 7.03553 5.55425 8.2184 5.04384C9.40127 4.53342 10.6652 4.27821 12.0101 4.27821C13.355 4.27821 14.6189 4.53342 15.8017 5.04384C16.9846 5.55425 18.0135 6.24696 18.8885 7.12196C19.7635 7.99696 20.4562 9.0259 20.9667 10.2088C21.4771 11.3916 21.7323 12.6555 21.7323 14.0004C21.7323 15.3453 21.4771 16.6092 20.9667 17.7921C20.4562 18.975 19.7635 20.0039 18.8885 20.8789C18.0135 21.7539 16.9846 22.4466 15.8017 22.957C14.6189 23.4674 13.355 23.7227 12.0101 23.7227ZM12.0101 21.7782C14.1814 21.7782 16.0205 21.0247 17.5274 19.5178C19.0344 18.0109 19.7878 16.1717 19.7878 14.0004C19.7878 11.8291 19.0344 9.99002 17.5274 8.48307C16.0205 6.97613 14.1814 6.22266 12.0101 6.22266C9.83877 6.22266 7.99965 6.97613 6.4927 8.48307C4.98576 9.99002 4.23229 11.8291 4.23229 14.0004C4.23229 16.1717 4.98576 18.0109 6.4927 19.5178C7.99965 21.0247 9.83877 21.7782 12.0101 21.7782Z" fill="#C0392B"/>
                </svg>
                <p className="text-sm sm:text-base font-medium leading-6 text-[#1A1A1A]">
                  Jawaban Anda: {userAnswer}
                </p>
              </motion.div>
            )}

            <motion.div
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[rgba(39,174,96,0.1)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <svg width="24" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.70456 24.208L6.85734 21.0969L3.35734 20.3191L3.69762 16.7219L1.31567 13.9997L3.69762 11.2775L3.35734 7.68023L6.85734 6.90245L8.70456 3.79134L12.0101 5.20106L15.3157 3.79134L17.1629 6.90245L20.6629 7.68023L20.3226 11.2775L22.7046 13.9997L20.3226 16.7219L20.6629 20.3191L17.1629 21.0969L15.3157 24.208L12.0101 22.7983L8.70456 24.208ZM9.53095 21.7288L12.0101 20.6594L14.5379 21.7288L15.899 19.3955L18.5726 18.7636L18.3296 16.0413L20.1282 13.9997L18.3296 11.9094L18.5726 9.18717L15.899 8.60384L14.4893 6.27051L12.0101 7.33995L9.48234 6.27051L8.12123 8.60384L5.44762 9.18717L5.69067 11.9094L3.89206 13.9997L5.69067 16.0413L5.44762 18.8122L8.12123 19.3955L9.53095 21.7288ZM10.9893 17.4511L16.4823 11.958L15.1212 10.5483L10.9893 14.6802L8.89901 12.6386L7.5379 13.9997L10.9893 17.4511Z" fill="#27AE60"/>
              </svg>
              <p className="text-sm sm:text-base font-medium leading-6 text-[#1A1A1A]">
                Jawaban Benar: {correctAnswer}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="border-t border-[#E5E7EB] pt-4 flex flex-col gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.6 }}
      >
        <h4 className="text-sm sm:text-base font-bold leading-6 text-[#D4A017]">
          Penjelasan:
        </h4>
        <p className="text-sm sm:text-base font-normal leading-6 text-[#4B5563]">
          {explanation}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default QuestionCard;
