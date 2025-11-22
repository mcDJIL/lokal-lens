'use client';

import { useState } from 'react';

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

interface HeroSectionProps {
  quiz: QuizDetail;
  onStartQuiz: () => void;
}

const HeroSection = ({ quiz, onStartQuiz }: HeroSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-full bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start gap-6 sm:gap-8 animate-in fade-in slide-in-from-left duration-700">
            {/* Heading and Description */}
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold leading-tight lg:leading-[60px] tracking-[-1.98px] text-[#0D121B] transition-all duration-300 hover:text-[#3D3B8E]">
                {quiz.title}
              </h1>
              <p className="text-base sm:text-lg leading-7 font-normal text-[#4C669A]">
                {quiz.description || 'Uji wawasanmu tentang kekayaan budaya Indonesia!'}
              </p>
            </div>

            {/* Info Cards */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full max-w-[448px]">
              {/* Time Card */}
              <div className="flex-1 flex items-center gap-3 p-4 sm:p-[17px] border border-[#E0DDE8] rounded-2xl bg-white hover:border-[#FF7A5A] hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:rotate-12">
                  <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.25 6.75V4.25H18.75V6.75H11.25ZM13.75 20.5H16.25V13H13.75V20.5ZM15 30.5C13.4583 30.5 12.0052 30.2031 10.6406 29.6094C9.27604 29.0156 8.08333 28.2083 7.0625 27.1875C6.04167 26.1667 5.23438 24.974 4.64062 23.6094C4.04688 22.2448 3.75 20.7917 3.75 19.25C3.75 17.7083 4.04688 16.2552 4.64062 14.8906C5.23438 13.526 6.04167 12.3333 7.0625 11.3125C8.08333 10.2917 9.27604 9.48438 10.6406 8.89062C12.0052 8.29688 13.4583 8 15 8C16.2917 8 17.5312 8.20833 18.7188 8.625C19.9062 9.04167 21.0208 9.64583 22.0625 10.4375L23.8125 8.6875L25.5625 10.4375L23.8125 12.1875C24.6042 13.2292 25.2083 14.3438 25.625 15.5312C26.0417 16.7188 26.25 17.9583 26.25 19.25C26.25 20.7917 25.9531 22.2448 25.3594 23.6094C24.7656 24.974 23.9583 26.1667 22.9375 27.1875C21.9167 28.2083 20.724 29.0156 19.3594 29.6094C17.9948 30.2031 16.5417 30.5 15 30.5ZM15 28C17.4167 28 19.4792 27.1458 21.1875 25.4375C22.8958 23.7292 23.75 21.6667 23.75 19.25C23.75 16.8333 22.8958 14.7708 21.1875 13.0625C19.4792 11.3542 17.4167 10.5 15 10.5C12.5833 10.5 10.5208 11.3542 8.8125 13.0625C7.10417 14.7708 6.25 16.8333 6.25 19.25C6.25 21.6667 7.10417 23.7292 8.8125 25.4375C10.5208 27.1458 12.5833 28 15 28Z" fill="#FF7A5A"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold leading-5 text-[#0D121B]">
                    {quiz.time_limit ? `${quiz.time_limit} Menit` : 'Tanpa Batas'}
                  </h3>
                  <p className="text-sm font-normal leading-[21px] text-[#4C669A]">
                    Waktu Pengerjaan
                  </p>
                </div>
              </div>

              {/* Questions Card */}
              <div className="flex-1 flex items-center gap-3 p-4 sm:p-[17px] border border-[#E0DDE8] rounded-2xl bg-white hover:border-[#F4B400] hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:rotate-12">
                  <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 21.75C17.8542 21.75 18.1615 21.6198 18.4219 21.3594C18.6823 21.099 18.8125 20.7917 18.8125 20.4375C18.8125 20.0833 18.6823 19.776 18.4219 19.5156C18.1615 19.2552 17.8542 19.125 17.5 19.125C17.1458 19.125 16.8385 19.2552 16.5781 19.5156C16.3177 19.776 16.1875 20.0833 16.1875 20.4375C16.1875 20.7917 16.3177 21.099 16.5781 21.3594C16.8385 21.6198 17.1458 21.75 17.5 21.75ZM16.5625 17.75H18.4375C18.4375 17.1458 18.5 16.7031 18.625 16.4219C18.75 16.1406 19.0417 15.7708 19.5 15.3125C20.125 14.6875 20.5417 14.1823 20.75 13.7969C20.9583 13.4115 21.0625 12.9583 21.0625 12.4375C21.0625 11.5 20.7344 10.7344 20.0781 10.1406C19.4219 9.54688 18.5625 9.25 17.5 9.25C16.6458 9.25 15.901 9.48958 15.2656 9.96875C14.6302 10.4479 14.1875 11.0833 13.9375 11.875L15.625 12.5625C15.8125 12.0417 16.0677 11.651 16.3906 11.3906C16.7135 11.1302 17.0833 11 17.5 11C18 11 18.4062 11.1406 18.7188 11.4219C19.0312 11.7031 19.1875 12.0833 19.1875 12.5625C19.1875 12.8542 19.1042 13.1302 18.9375 13.3906C18.7708 13.651 18.4792 13.9792 18.0625 14.375C17.375 14.9792 16.9531 15.4531 16.7969 15.7969C16.6406 16.1406 16.5625 16.7917 16.5625 17.75ZM10 25.5C9.3125 25.5 8.72396 25.2552 8.23438 24.7656C7.74479 24.276 7.5 23.6875 7.5 23V8C7.5 7.3125 7.74479 6.72396 8.23438 6.23438C8.72396 5.74479 9.3125 5.5 10 5.5H25C25.6875 5.5 26.276 5.74479 26.7656 6.23438C27.2552 6.72396 27.5 7.3125 27.5 8V23C27.5 23.6875 27.2552 24.276 26.7656 24.7656C26.276 25.2552 25.6875 25.5 25 25.5H10ZM10 23H25V8H10V23ZM5 30.5C4.3125 30.5 3.72396 30.2552 3.23438 29.7656C2.74479 29.276 2.5 28.6875 2.5 28V10.5H5V28H22.5V30.5H5Z" fill="#F4B400"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold leading-5 text-[#0D121B]">
                    {quiz.total_questions} Pertanyaan
                  </h3>
                  <p className="text-sm font-normal leading-[21px] text-[#4C669A]">
                    Jumlah Soal
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onStartQuiz}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center justify-center h-14 px-8 rounded-3xl bg-[#3D3B8E] hover:bg-[#2E2B6B] shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group"
            >
              <span className="text-lg font-bold leading-[27px] tracking-[0.27px] text-white transition-all duration-300 group-hover:tracking-[0.4px]">
                Mulai Kuis
              </span>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 transition-all duration-300 ${isHovered ? 'translate-x-1 opacity-100' : 'translate-x-0 opacity-0'}`}
              >
                <path d="M8.5 5L13.5 10L8.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex items-center justify-center animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div className="relative w-full max-w-[514px] aspect-square p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3D3B8E]/10 to-[#F4B400]/10 rounded-full blur-3xl animate-pulse"></div>
              <img
                src={quiz.thumbnail || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'}
                alt="Indonesian Cultural Illustration"
                className="relative w-full h-full object-contain rounded-2xl transform transition-transform duration-700 hover:scale-105 hover:rotate-1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
