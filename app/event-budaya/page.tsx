'use client';

import { useState, useEffect } from 'react';
import EventCard from '@/components/sections/EventBudaya/EventCard';
import SearchBar from '@/components/sections/EventBudaya/SearchBar';
import FilterSection from '@/components/sections/EventBudaya/FilterSection';
import Pagination from '@/components/sections/EventBudaya/Pagination';
import CalendarView from '@/components/sections/EventBudaya/CalendarView';

interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  location: string;
  price: string | null;
  image: string;
  status: 'TERSEDIA' | 'GRATIS' | 'HABIS' | 'DIBATALKAN' | 'SELESAI';
  statusColor: 'red' | 'green' | 'gray';
  category: string | null;
  views: number;
}

export default function EventBudayaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events?page=${currentPage}&limit=12`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[rgba(25,42,81,0.5)] to-[rgba(25,42,81,0.8)]"
          style={{
            backgroundImage: "linear-gradient(180deg, rgba(25, 42, 81, 0.50) 0%, rgba(25, 42, 81, 0.80) 100%), url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                Kalender Budaya Nusantara
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200">
                Jelajahi dan ikuti beragam festival, pameran, dan acara budaya yang
                mempesona di seluruh penjuru Indonesia.
              </p>
            </div>
            <a href="#events" className="px-8 sm:px-10 py-3 sm:py-4 bg-[#D4A017] hover:bg-[#B8860B] text-white font-bold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
              Lihat Acara Unggulan
            </a>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <SearchBar />
        <FilterSection viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Events Section - Grid or Calendar */}
      <section id='events' className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {viewMode === 'grid' ? (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-[400px]"></div>
                  </div>
                ))}
              </div>
            ) : events.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'backwards',
                      }}
                    >
                      <EventCard {...event} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 sm:mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada event yang ditemukan.</p>
              </div>
            )}
          </>
        ) : (
          <CalendarView events={events} />
        )}
      </section>
    </div>
  );
}
