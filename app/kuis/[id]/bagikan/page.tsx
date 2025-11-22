'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ShareAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params);
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');

  const [quizData, setQuizData] = useState({
    score: 0,
    percentage: 0,
    quizTitle: '',
    correctAnswers: 0,
    totalQuestions: 0,
  });
  const [shareMessage, setShareMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/kuis/${slug}/skor?attemptId=${attemptId}`
    : '';

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
        
        setQuizData({
          score: result.score || 0,
          percentage: percentage,
          quizTitle: result.quizTitle || '',
          correctAnswers: result.correctAnswers || 0,
          totalQuestions: result.totalQuestions || 0,
        });

        // Generate default share message
        const defaultMessage = `Saya baru saja menyelesaikan ${result.quizTitle} di Lokallens dan mendapat skor ${percentage}%! Ternyata budaya Indonesia sangat menakjubkan. Ayo coba juga!`;
        setShareMessage(defaultMessage);
      }
    } catch (error) {
      console.error('Error fetching quiz result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
        break;
      case 'instagram':
        alert('Instagram tidak mendukung sharing langsung via web. Silakan salin link dan bagikan manual di Instagram.');
        return;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <>
        <main className="min-h-screen bg-white">
          <div className="max-w-[672px] mx-auto px-4 py-12 sm:py-20">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
                <div className="h-32 bg-gray-200 rounded mb-6"></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white">
        <motion.div 
          className="max-w-[672px] mx-auto px-4 py-12 sm:py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="flex flex-col items-center gap-2 mb-8"
            variants={itemVariants}
          >
            <h1 className="text-3xl sm:text-4xl font-bold leading-10 tracking-[-0.9px] text-[#1A1A1A] text-center">
              Bagikan Pencapaian Anda!
            </h1>
            <p className="text-base font-normal leading-6 text-center text-[#4B5563]">
              Anda meraih skor{' '}
              <span className="font-bold text-[#006C84]">{quizData.percentage}% ({quizData.correctAnswers}/{quizData.totalQuestions})</span>
              {' '}dalam {quizData.quizTitle}. Sebarkan semangatmu!
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-3xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] p-6 sm:p-8"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-6">
              <motion.div 
                className="flex flex-col gap-2"
                variants={itemVariants}
              >
                <label htmlFor="shareMessage" className="text-sm font-medium leading-5 text-[#374151]">
                  Pesan Berbagi
                </label>
                <motion.textarea
                  id="shareMessage"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  className="w-full px-[13px] py-[9px] pb-[49px] rounded-2xl border border-[#D1D5DB] bg-[#F7F7F7] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] text-sm font-normal leading-5 text-[#1A1A1A] resize-none focus:outline-none focus:ring-2 focus:ring-[#006C84] focus:border-transparent transition-all"
                  rows={4}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </motion.div>

              <motion.div 
                className="flex flex-col gap-4"
                variants={itemVariants}
              >
                <p className="text-sm font-medium leading-5 text-[#374151]">
                  Bagikan melalui
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      name: 'Facebook',
                      platform: 'facebook',
                      icon: (
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_facebook)">
                            <path d="M32 16C32 7.1635 24.8365 0 16 0C7.1635 0 0 7.1635 0 16C0 23.986 5.851 30.6054 13.5 31.8056V20.625H9.4375V16H13.5V12.475C13.5 8.465 15.8888 6.25 19.5435 6.25C21.294 6.25 23.125 6.5625 23.125 6.5625V10.5H21.1075C19.1199 10.5 18.5 11.7334 18.5 12.9987V16H22.9375L22.2281 20.625H18.5V31.8056C26.149 30.6054 32 23.9861 32 16Z" fill="#1877F2"/>
                            <path d="M22.2281 20.625L22.9375 16H18.5V12.9987C18.5 11.7332 19.1199 10.5 21.1075 10.5H23.125V6.5625C23.125 6.5625 21.294 6.25 19.5434 6.25C15.8888 6.25 13.5 8.465 13.5 12.475V16H9.4375V20.625H13.5V31.8056C14.327 31.9352 15.1629 32.0002 16 32C16.8371 32.0002 17.673 31.9352 18.5 31.8056V20.625H22.2281Z" fill="white"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_facebook">
                              <rect width="32" height="32" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      )
                    },
                    {
                      name: 'X (Twitter)',
                      platform: 'twitter',
                      icon: (
                        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M6.875 1.375C5.41631 1.375 4.01736 1.95446 2.98591 2.98591C1.95446 4.01736 1.375 5.41631 1.375 6.875V26.125C1.375 27.5837 1.95446 28.9826 2.98591 30.0141C4.01736 31.0455 5.41631 31.625 6.875 31.625H26.125C27.5837 31.625 28.9826 31.0455 30.0141 30.0141C31.0455 28.9826 31.625 27.5837 31.625 26.125V6.875C31.625 5.41631 31.0455 4.01736 30.0141 2.98591C28.9826 1.95446 27.5837 1.375 26.125 1.375H6.875ZM6.41575 6.1875C6.26523 6.24344 6.12985 6.33375 6.0204 6.45125C5.91095 6.56875 5.83045 6.71018 5.78532 6.86429C5.74018 7.01839 5.73166 7.1809 5.76042 7.33888C5.78918 7.49686 5.85444 7.64594 5.951 7.77425L13.6702 18.018L5.53712 26.7424L5.47662 26.8125H8.29125L14.9325 19.6914L20.0365 26.4674C20.1549 26.6242 20.3157 26.744 20.4999 26.8125H26.5801C26.7304 26.7563 26.8655 26.6657 26.9747 26.5481C27.0838 26.4305 27.164 26.289 27.2089 26.1349C27.2537 25.9809 27.262 25.8184 27.2331 25.6606C27.2041 25.5028 27.1387 25.3539 27.0421 25.2257L19.3229 14.982L27.5234 6.1875H24.7046L18.0634 13.31L12.9566 6.534C12.8384 6.37665 12.6776 6.25641 12.4932 6.1875H6.41575ZM21.3757 24.816L8.84262 8.184H11.6187L24.1505 24.8146L21.3757 24.816Z" fill="black"/>
                        </svg>
                      )
                    },
                    {
                      name: 'WhatsApp',
                      platform: 'whatsapp',
                      icon: (
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_whatsapp)">
                            <path d="M0.640234 14.8204C0.639531 17.341 1.30328 19.8021 2.56539 21.9714L0.519531 29.3833L8.16391 27.3944C10.2782 28.5365 12.6472 29.135 15.0545 29.1351H15.0609C23.0079 29.1351 29.477 22.7185 29.4804 14.8316C29.482 11.0099 27.9834 7.41618 25.2606 4.71246C22.5384 2.00897 18.9179 0.519322 15.0603 0.517578C7.11227 0.517578 0.643633 6.93386 0.640352 14.8204" fill="url(#paint0_linear_whatsapp)"/>
                            <path d="M0.125391 14.8158C0.12457 17.4271 0.812109 19.9763 2.11922 22.2233L0 29.9008L7.91848 27.8407C10.1003 29.021 12.5568 29.6434 15.0564 29.6443H15.0628C23.295 29.6443 29.9965 22.9969 30 14.8277C30.0014 10.8686 28.4489 7.1457 25.6289 4.34512C22.8086 1.54488 19.0586 0.00162791 15.0628 0C6.82922 0 0.128672 6.64651 0.125391 14.8158ZM4.84113 21.8363L4.54547 21.3706C3.30258 19.4097 2.64656 17.1436 2.6475 14.8167C2.65008 8.02663 8.2193 2.50233 15.0675 2.50233C18.3839 2.50372 21.5006 3.78651 23.8448 6.11395C26.1889 8.44163 27.4788 11.5358 27.478 14.8267C27.475 21.6169 21.9056 27.1419 15.0628 27.1419H15.0579C12.8298 27.1407 10.6446 26.547 8.73891 25.425L8.28539 25.1581L3.58641 26.3806L4.84113 21.8363Z" fill="url(#paint1_linear_whatsapp)"/>
                            <path d="M11.3295 8.62213C11.0499 8.00551 10.7557 7.99306 10.4898 7.98225C10.272 7.97295 10.0231 7.97364 9.77446 7.97364C9.52556 7.97364 9.12114 8.06655 8.77931 8.4369C8.43712 8.8076 7.4729 9.70341 7.4729 11.5254C7.4729 13.3474 8.81036 15.1083 8.99681 15.3556C9.18349 15.6025 11.5788 19.4611 15.3724 20.9455C18.5252 22.1791 19.1668 21.9338 19.8511 21.8719C20.5354 21.8103 22.0593 20.9763 22.3702 20.1116C22.6814 19.2469 22.6814 18.5057 22.5881 18.3509C22.4948 18.1966 22.2459 18.1039 21.8727 17.9188C21.4994 17.7336 19.6644 16.8376 19.3223 16.714C18.9801 16.5905 18.7313 16.5289 18.4824 16.8997C18.2335 17.2699 17.5188 18.1039 17.3009 18.3509C17.0833 18.5984 16.8655 18.6292 16.4924 18.444C16.1189 18.2582 14.9169 17.8676 13.4908 16.6061C12.3813 15.6245 11.6322 14.4122 11.4145 14.0414C11.1968 13.6712 11.3912 13.4705 11.5783 13.286C11.746 13.12 11.9517 12.8535 12.1385 12.6374C12.3246 12.4211 12.3867 12.2668 12.5111 12.0198C12.6357 11.7726 12.5734 11.5563 12.4802 11.3711C12.3867 11.1859 11.6614 9.35434 11.3295 8.62213Z" fill="white"/>
                          </g>
                          <defs>
                            <linearGradient id="paint0_linear_whatsapp" x1="1448.56" y1="2887.09" x2="1448.56" y2="0.517578" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#1FAF38"/>
                              <stop offset="1" stopColor="#60D669"/>
                            </linearGradient>
                            <linearGradient id="paint1_linear_whatsapp" x1="1500" y1="2990.08" x2="1500" y2="0" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#F9F9F9"/>
                              <stop offset="1" stopColor="white"/>
                            </linearGradient>
                            <clipPath id="clip0_whatsapp">
                              <rect width="30" height="30" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      )
                    },
                    {
                      name: 'Instagram',
                      platform: 'instagram',
                      icon: (
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_instagram)">
                            <path d="M24.5 0H7.5C3.35786 0 0 3.35786 0 7.5V24.5C0 28.6421 3.35786 32 7.5 32H24.5C28.6421 32 32 28.6421 32 24.5V7.5C32 3.35786 28.6421 0 24.5 0Z" fill="url(#paint0_radial_instagram)"/>
                            <path d="M24.5 0H7.5C3.35786 0 0 3.35786 0 7.5V24.5C0 28.6421 3.35786 32 7.5 32H24.5C28.6421 32 32 28.6421 32 24.5V7.5C32 3.35786 28.6421 0 24.5 0Z" fill="url(#paint1_radial_instagram)"/>
                            <path d="M16.0011 3.5C12.6064 3.5 12.1803 3.51488 10.847 3.5755C9.51625 3.6365 8.60787 3.84712 7.81313 4.15625C6.99088 4.4755 6.2935 4.90262 5.59875 5.59762C4.90338 6.2925 4.47625 6.98987 4.156 7.81175C3.846 8.60675 3.63512 9.5155 3.57525 10.8456C3.51562 12.179 3.5 12.6053 3.5 16.0001C3.5 19.395 3.515 19.8197 3.5755 21.153C3.63675 22.4837 3.84738 23.3921 4.15625 24.1869C4.47575 25.0091 4.90288 25.7065 5.59788 26.4013C6.2925 27.0966 6.98988 27.5247 7.8115 27.844C8.60687 28.1531 9.51537 28.3637 10.8459 28.4247C12.1792 28.4854 12.605 28.5002 15.9996 28.5002C19.3948 28.5002 19.8195 28.4854 21.1528 28.4247C22.4835 28.3637 23.3929 28.1531 24.1882 27.844C25.0101 27.5247 25.7065 27.0966 26.401 26.4013C27.0964 25.7065 27.5234 25.0091 27.8438 24.1873C28.151 23.3921 28.362 22.4835 28.4245 21.1532C28.4844 19.82 28.5 19.395 28.5 16.0001C28.5 12.6053 28.4844 12.1792 28.4245 10.8459C28.362 9.51512 28.151 8.60688 27.8438 7.81213C27.5234 6.98988 27.0964 6.2925 26.401 5.59762C25.7057 4.90237 25.0104 4.47525 24.1875 4.15637C23.3906 3.84712 22.4817 3.63638 21.151 3.5755C19.8176 3.51488 19.3931 3.5 15.9972 3.5H16.0011ZM14.8798 5.75262C15.2126 5.75213 15.584 5.75262 16.0011 5.75262C19.3388 5.75262 19.7342 5.76463 21.0522 5.8245C22.271 5.88025 22.9325 6.08388 23.3731 6.255C23.9565 6.4815 24.3724 6.75238 24.8096 7.19C25.2471 7.6275 25.5179 8.04412 25.745 8.6275C25.9161 9.0675 26.12 9.729 26.1755 10.9478C26.2354 12.2655 26.2484 12.6612 26.2484 15.9972C26.2484 19.3333 26.2354 19.7291 26.1755 21.0467C26.1198 22.2655 25.9161 22.927 25.745 23.3671C25.5185 23.9505 25.2471 24.3659 24.8096 24.8031C24.3721 25.2406 23.9568 25.5114 23.3731 25.738C22.933 25.9099 22.271 26.113 21.0522 26.1688C19.7345 26.2286 19.3388 26.2416 16.0011 26.2416C12.6634 26.2416 12.2677 26.2286 10.9501 26.1688C9.73137 26.1125 9.06987 25.9089 8.62887 25.7377C8.04562 25.5111 7.62887 25.2404 7.19137 24.8029C6.75387 24.3654 6.48312 23.9498 6.256 23.3661C6.08488 22.926 5.881 22.2645 5.8255 21.0457C5.76562 19.728 5.75362 19.3323 5.75362 15.9941C5.75362 12.656 5.76562 12.2624 5.8255 10.9446C5.88125 9.72587 6.08488 9.06437 6.256 8.62375C6.48263 8.04037 6.75388 7.62375 7.1915 7.18625C7.62913 6.74875 8.04562 6.47787 8.629 6.25087C9.06962 6.079 9.73137 5.87587 10.9501 5.81987C12.1032 5.76775 12.5501 5.75212 14.8798 5.7495V5.75262ZM22.6736 7.82812C21.8455 7.82812 21.1736 8.49938 21.1736 9.32763C21.1736 10.1558 21.8455 10.8276 22.6736 10.8276C23.5018 10.8276 24.1736 10.1558 24.1736 9.32763C24.1736 8.4995 23.5018 7.82762 22.6736 7.82762V7.82812ZM16.0011 9.58075C12.4561 9.58075 9.58187 12.455 9.58187 16.0001C9.58187 19.5452 12.4561 22.4181 16.0011 22.4181C19.5462 22.4181 22.4195 19.5452 22.4195 16.0001C22.4195 12.4551 19.546 9.58075 16.0009 9.58075H16.0011ZM16.0011 11.8334C18.3022 11.8334 20.1679 13.6988 20.1679 16.0001C20.1679 18.3013 18.3022 20.1669 16.0011 20.1669C13.7 20.1669 11.8345 18.3013 11.8345 16.0001C11.8345 13.6988 13.6999 11.8334 16.0011 11.8334Z" fill="white"/>
                          </g>
                          <defs>
                            <radialGradient id="paint0_radial_instagram" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.5 34.4646) rotate(-90) scale(31.7144 29.4969)">
                              <stop stopColor="#FFDD55"/>
                              <stop offset="0.1" stopColor="#FFDD55"/>
                              <stop offset="0.5" stopColor="#FF543E"/>
                              <stop offset="1" stopColor="#C837AB"/>
                            </radialGradient>
                            <radialGradient id="paint1_radial_instagram" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-5.36012 2.30512) rotate(78.681) scale(14.1765 58.436)">
                              <stop stopColor="#3771C8"/>
                              <stop offset="0.128" stopColor="#3771C8"/>
                              <stop offset="1" stopColor="#6600FF" stopOpacity="0"/>
                            </radialGradient>
                            <clipPath id="clip0_instagram">
                              <rect width="32" height="32" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      )
                    }
                  ].map((social, index) => (
                    <motion.button
                      key={social.platform}
                      onClick={() => handleShare(social.platform)}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      custom={index}
                    >
                      {social.icon}
                      <span className="text-sm font-medium leading-5 text-[#1A1A1A] text-center">
                        {social.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4"
                variants={itemVariants}
              >
                <div className="h-px flex-1 border-t border-[#D1D5DB]" />
                <span className="text-sm font-normal leading-5 text-[#6B7280]">
                  atau
                </span>
                <div className="h-px flex-1 border-t border-[#D1D5DB]" />
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                variants={itemVariants}
              >
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-[17px] py-[15px] rounded-2xl border border-[#D1D5DB] bg-[#F7F7F7] text-sm font-normal leading-normal text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#006C84] transition-all"
                />
                <motion.button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 px-6 py-3 min-w-[150px] rounded-2xl bg-[#006C84] hover:bg-[#005566] transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.09334 19.8338C8.55862 19.8338 8.10087 19.6434 7.72008 19.2626C7.33929 18.8818 7.1489 18.424 7.1489 17.8893V6.22266C7.1489 5.68793 7.33929 5.23018 7.72008 4.84939C8.10087 4.46861 8.55862 4.27821 9.09334 4.27821H17.8433C18.3781 4.27821 18.8358 4.46861 19.2166 4.84939C19.5974 5.23018 19.7878 5.68793 19.7878 6.22266V17.8893C19.7878 18.424 19.5974 18.8818 19.2166 19.2626C18.8358 19.6434 18.3781 19.8338 17.8433 19.8338H9.09334ZM9.09334 17.8893H17.8433V6.22266H9.09334V17.8893ZM5.20445 23.7227C4.66973 23.7227 4.21198 23.5323 3.83119 23.1515C3.4504 22.7707 3.26001 22.3129 3.26001 21.7782V8.1671H5.20445V21.7782H15.8989V23.7227H5.20445Z" fill="white"/>
                  </svg>
                  <span className="text-base font-bold leading-6 tracking-[0.24px] text-white">
                    {copied ? 'Tersalin!' : 'Salin'}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 mt-6 sm:mt-8"
            variants={itemVariants}
          >
            <motion.a
              href={`/kuis/${slug}/skor?attemptId=${attemptId}`}
              className="text-base font-normal leading-6 text-[#006C84] hover:underline transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Kembali ke Hasil Kuis
            </motion.a>
            <span className="text-base font-normal leading-6 text-[#9CA3AF]">
              |
            </span>
            <motion.a
              href="/"
              className="text-base font-normal leading-6 text-[#006C84] hover:underline transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Selesaikan & Kembali ke Beranda
            </motion.a>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
