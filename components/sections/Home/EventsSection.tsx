'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string | null;
  image?: string;
  category: string;
  location: string;
  date: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

const EventsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=6');
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const slidesCount = events.length;
  const itemsPerView = 3;
  const maxSlide = Math.max(0, slidesCount - itemsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const formatDate = (date?: string, startDate?: string, endDate?: string) => {
    // If already formatted from API
    if (date) return date;
    
    // If we have start and end dates
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('id-ID', options);
      }
      
      return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('id-ID', options)}`;
    }
    
    return 'Tanggal belum ditentukan';
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <section className="w-full py-12 sm:py-16 lg:py-[126px]">
        <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-extrabold leading-tight lg:leading-12 tracking-tight lg:tracking-[-1.44px] text-[#1A1A1A] text-center">
              Event Budaya Nusantara
            </h2>
            <p className="text-base sm:text-lg font-normal leading-[27px] text-[#4B5563] text-center">
              Ikuti berbagai acara dan festival untuk merasakan langsung kekayaan budaya Indonesia
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-[400px] rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 sm:py-16 lg:py-[126px]">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-extrabold leading-tight lg:leading-12 tracking-tight lg:tracking-[-1.44px] text-[#1A1A1A] text-center">
            Event Budaya Nusantara
          </h2>
          <p className="text-base sm:text-lg font-normal leading-[27px] text-[#4B5563] text-center">
            Ikuti berbagai acara dan festival untuk merasakan langsung kekayaan budaya Indonesia
          </p>
        </motion.div>

        <div className="relative w-full">
          {/* Swiper Container */}
          <div className="overflow-hidden">
            <motion.div 
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="w-full sm:w-1/2 lg:w-1/3 shrink-0 flex flex-col rounded-2xl lg:rounded-4xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-xl transition-shadow"
                >
                  <Link href={`/event-budaya/${event.slug}`} className="flex flex-col h-full">
                    <div className="relative h-60">
                      <Image
                        src={event.image || event.thumbnail || '/assets/img/product.png'}
                        alt={event.title}
                        fill
                        className="object-cover rounded-t-2xl lg:rounded-t-4xl"
                      />
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#D4A017] backdrop-blur-sm"
                      >
                        <span className="text-xs font-semibold leading-4 text-white">
                          {event.category}
                        </span>
                      </motion.div>
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 flex-1">
                      <h3 className="text-base font-bold leading-5 text-[#1A1A1A] line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 4V8L10.5 9.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-sm font-medium text-[#6B7280]">
                            {formatDate(event.date, event.start_date, event.end_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 14C10 12 13 9.65685 13 7C13 4.23858 10.7614 2 8 2C5.23858 2 3 4.23858 3 7C3 9.65685 6 12 8 14Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-sm font-medium text-[#6B7280] line-clamp-1">
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-normal leading-5 text-[#6B7280] line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          {events.length > itemsPerView && (
            <>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#D4A017] hover:text-white transition-colors z-10"
                aria-label="Previous slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                disabled={currentSlide >= maxSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#D4A017] hover:text-white transition-colors z-10"
                aria-label="Next slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index ? 'w-8 bg-[#D4A017]' : 'w-2 bg-[#E5E7EB]'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link 
            href="/event-budaya" 
            className="flex items-center gap-2 px-6 sm:px-[34px] py-3 sm:py-[13px] rounded-full border-2 border-[#D4A017] hover:bg-[#D4A017] hover:text-white transition-colors mt-8 group"
          >
            <span className="text-sm sm:text-base font-bold leading-6 tracking-[0.24px] text-[#D4A017] group-hover:text-white">
              Lihat Semua Event
            </span>
            <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6">
              <path d="M16.0623 14.9659H4.23047V13.0223H16.0623L10.6202 7.58008L12.005 6.21954L19.7795 13.9941L12.005 21.7686L10.6202 20.4081L16.0623 14.9659Z" fill="currentColor"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
