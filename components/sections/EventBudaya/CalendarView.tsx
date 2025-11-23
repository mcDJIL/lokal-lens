'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Event {
  id: number;
  slug: string;
  title: string;
  date: string;
  location: string;
  price: string | null;
  image: string;
  status: string;
  statusColor: string;
}

interface CalendarViewProps {
  events: Event[];
}

const CalendarView = ({ events }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (date: Date) => {
    // Simple mock logic - in real app, parse event.date and match
    // For demo, show events on specific days
    const day = date.getDate();
    if (day === 15 || day === 20 || day === 5 || day === 10) {
      return events.filter((_, idx) => {
        if (day === 15) return idx === 0;
        if (day === 20) return idx === 1;
        if (day === 5) return idx === 2;
        if (day === 10) return idx === 3;
        return false;
      });
    }
    return [];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDate = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#1A1A1A]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
                aria-label="Previous month"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
                aria-label="Next month"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center py-2">
                <span className="text-sm font-semibold text-[#6B7280]">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;
              const isSelected = isSameDate(selectedDate, day);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-lg border transition-all relative group ${
                    isSelected
                      ? 'border-[#D4A017] bg-[#D4A017] text-white'
                      : isTodayDate
                      ? 'border-[#D4A017] bg-[#FFF9E6] text-[#1A1A1A]'
                      : hasEvents
                      ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#1A1A1A] hover:border-[#D4A017]'
                      : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
                    {day.getDate()}
                  </span>
                  {hasEvents && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-[#D4A017]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-[#D4A017] bg-[#FFF9E6]" />
              <span className="text-sm text-[#6B7280]">Hari ini</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#D4A017]" />
              </div>
              <span className="text-sm text-[#6B7280]">Ada event</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#D4A017]" />
              <span className="text-sm text-[#6B7280]">Tanggal dipilih</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events List for Selected Date */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm sticky top-6">
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
            {selectedDate
              ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
              : 'Pilih Tanggal'}
          </h3>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div 
                  key={event.id}
                  className="border border-[#E5E7EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="relative h-32">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      event.statusColor === 'green'
                        ? 'bg-[#10B981] text-white'
                        : event.statusColor === 'red'
                        ? 'bg-[#EF4444] text-white'
                        : 'bg-[#6B7280] text-white'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-[#1A1A1A] mb-2 line-clamp-2">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-1">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.10051 9.8995 1.75 7 1.75C4.10051 1.75 1.75 4.10051 1.75 7C1.75 9.8995 4.10051 12.25 7 12.25Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 3.5V7L9.625 8.3125" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-2">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 7.4375C7.96599 7.4375 8.75 6.65349 8.75 5.6875C8.75 4.72151 7.96599 3.9375 7 3.9375C6.03401 3.9375 5.25 4.72151 5.25 5.6875C5.25 6.65349 6.03401 7.4375 7 7.4375Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 12.25C8.75 10.5 11.375 8.44977 11.375 6.125C11.375 3.70876 9.41624 1.75 7 1.75C4.58376 1.75 2.625 3.70876 2.625 6.125C2.625 8.44977 5.25 10.5 7 12.25Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <p className="text-sm font-bold text-[#D4A017]">{event?.price ?? 'Gratis'}</p>
                      <Link href={`/event-budaya/${event.slug}`} className='flex items-center gap-2 px-4 py-1 rounded-full border transition-all duration-300 border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white hover:shadow-md'>Detail</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 5.33334H6C4.52724 5.33334 3.33334 6.52724 3.33334 8V26.6667C3.33334 28.1394 4.52724 29.3333 6 29.3333H26C27.4728 29.3333 28.6667 28.1394 28.6667 26.6667V8C28.6667 6.52724 27.4728 5.33334 26 5.33334Z" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.3333 2.66666V7.99999" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.6667 2.66666V7.99999" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.33334 13.3333H28.6667" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm text-[#6B7280]">
                {selectedDate
                  ? 'Tidak ada event pada tanggal ini'
                  : 'Pilih tanggal untuk melihat event'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
