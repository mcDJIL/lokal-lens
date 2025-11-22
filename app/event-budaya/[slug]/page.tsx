'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  date: string;
  time: string;
  dateStart: string;
  dateEnd: string;
  locationName: string;
  locationCity: string;
  locationProvince: string;
  locationAddress: string;
  latitude: number | null;
  longitude: number | null;
  mapImageUrl: string;
  mapEmbedUrl: string | null;
  price: number | null;
  priceDisplay: string;
  status: string;
  category: string | null;
  organizer: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  websiteUrl: string | null;
  views: number;
  performers: Array<{
    id: number;
    name: string;
    title: string;
    description: string;
    image: string;
  }>;
  galleryImages: Array<{
    id: number;
    url: string;
    alt: string;
  }>;
}

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEventDetail();
  }, [slug]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${slug}`);
      const data = await response.json();

      if (data.success) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Error fetching event detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForCalendar = (date: string) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const addToGoogleCalendar = () => {
    if (!event) return;
    
    const startDate = formatDateForCalendar(event.dateStart);
    const endDate = formatDateForCalendar(event.dateEnd);
    const location = encodeURIComponent(`${event.locationName}, ${event.locationAddress}`);
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
    window.open(url, '_blank');
  };

  const addToOutlookCalendar = () => {
    if (!event) return;
    
    const startDate = new Date(event.dateStart).toISOString();
    const endDate = new Date(event.dateEnd).toISOString();
    const location = encodeURIComponent(`${event.locationName}, ${event.locationAddress}`);
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description);
    
    const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${description}&location=${location}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToTwitter = () => {
    if (!event) return;
    const text = encodeURIComponent(`${event.title} - ${event.date}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToWhatsApp = () => {
    if (!event) return;
    const text = encodeURIComponent(`${event.title}\n${event.date}\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-4xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="h-screen bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event tidak ditemukan</h1>
          <Link href="/event-budaya" className="text-[#D4A017] hover:underline">
            Kembali ke daftar event
          </Link>
        </div>
      </div>
    );
  }

  const performers = event.performers;
  const galleryImages = event.galleryImages;

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 py-4 flex-wrap text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 font-medium">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/event-budaya" className="text-gray-500 hover:text-gray-700 font-medium">
              Events
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#333] font-medium">
              {event.title}
            </span>
          </nav>

          {/* Hero Image */}
          <div className="relative w-full h-[300px] sm:h-[384px] rounded-4xl overflow-hidden mb-8">
            <div className="absolute inset-0">
              <Image
                src={event.thumbnail}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3 sm:mb-4">
                {event.title}
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-3xl leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 sm:space-y-12">
              {/* About Section */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-[#333] tracking-tight">
                  Mengenai Acara
                </h2>
                <div className="space-y-4 text-[#333] text-base leading-relaxed whitespace-pre-line">
                  {event.longDescription}
                </div>
              </section>

              {/* Performers Section */}
              {performers.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#333] tracking-tight">
                    Pengisi Acara
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {performers.map((performer, index) => (
                      <div
                        key={performer.id}
                        className="p-4 sm:p-5 rounded-4xl border border-gray-200 bg-white/50 hover:shadow-lg transition-shadow duration-300"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                            <Image
                              src={performer.image}
                              alt={performer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-[#333] leading-tight mb-1">
                              {performer.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {performer.title}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {performer.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery Section */}
              {galleryImages.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#333] tracking-tight">
                      Galeri
                    </h2>
                    {galleryImages.length > 6 && (
                      <Link
                        href="#"
                        className="text-sm font-bold text-[#036] hover:text-[#024] transition-colors"
                      >
                        Lihat lebih banyak
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {galleryImages.slice(0, 5).map((image, index) => (
                      <div
                        key={image.id}
                        className="relative aspect-video rounded-4xl overflow-hidden bg-gray-200 hover:scale-105 transition-transform duration-300 cursor-pointer"
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {galleryImages.length > 5 && (
                      <div className="relative aspect-video rounded-4xl overflow-hidden bg-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                        <svg
                          width="24"
                          height="28"
                          viewBox="0 0 25 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mb-2"
                        >
                          <path
                            d="M5.2023 22.7403C4.6678 22.7403 4.21024 22.55 3.82961 22.1694C3.44898 21.7887 3.25867 21.3312 3.25867 20.7967V7.19122C3.25867 6.65672 3.44898 6.19915 3.82961 5.81852C4.21024 5.43789 4.6678 5.24758 5.2023 5.24758H12.9768C12.9768 5.52293 12.9768 5.82257 12.9768 6.14651C12.9768 6.47045 12.9768 6.81869 12.9768 7.19122H5.2023V20.7967H18.8077V13.0221C19.1803 13.0221 19.5285 13.0221 19.8524 13.0221C20.1764 13.0221 20.476 13.0221 20.7514 13.0221V20.7967C20.7514 21.3312 20.5611 21.7887 20.1804 22.1694C19.7998 22.55 19.3422 22.7403 18.8077 22.7403H5.2023ZM6.17412 18.853H17.8359L14.1916 13.9939L11.2762 17.8812L9.08957 14.9658L6.17412 18.853ZM16.8641 11.0785V9.13485H14.9205V7.19122H16.8641V5.24758H18.8077V7.19122H20.7514V9.13485H18.8077V11.0785H16.8641Z"
                            fill="#003366"
                          />
                        </svg>
                        <p className="text-sm font-bold text-[#036] text-center">
                          See {galleryImages.length - 5}+ more
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Event Info Card */}
                <div className="p-6 sm:p-8 rounded-4xl border border-gray-200 bg-white shadow-lg space-y-6">
                  {/* Date & Time */}
                  <div className="flex items-start gap-4">
                    <div className="pt-0.5">
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 25 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M5.20445 23.7222C4.66973 23.7222 4.21198 23.5318 3.83119 23.151C3.4504 22.7702 3.26001 22.3124 3.26001 21.7777V8.16661C3.26001 7.63189 3.4504 7.17414 3.83119 6.79335C4.21198 6.41256 4.66973 6.22217 5.20445 6.22217H6.17668V4.27772H8.12112V6.22217H15.8989V4.27772H17.8433V6.22217H18.8156C19.3503 6.22217 19.808 6.41256 20.1888 6.79335C20.5696 7.17414 20.76 7.63189 20.76 8.16661V21.7777C20.76 22.3124 20.5696 22.7702 20.1888 23.151C19.808 23.5318 19.3503 23.7222 18.8156 23.7222H5.20445ZM5.20445 21.7777H18.8156V12.0555H5.20445V21.7777ZM5.20445 10.1111H18.8156V8.16661H5.20445V10.1111ZM12.01 15.9444C11.7345 15.9444 11.5036 15.8512 11.3173 15.6649C11.131 15.4785 11.0378 15.2476 11.0378 14.9722C11.0378 14.6967 11.131 14.4658 11.3173 14.2795C11.5036 14.0931 11.7345 13.9999 12.01 13.9999C12.2855 13.9999 12.5164 14.0931 12.7027 14.2795C12.8891 14.4658 12.9822 14.6967 12.9822 14.9722C12.9822 15.2476 12.8891 15.4785 12.7027 15.6649C12.5164 15.8512 12.2855 15.9444 12.01 15.9444ZM8.12112 15.9444C7.84566 15.9444 7.61476 15.8512 7.42841 15.6649C7.24207 15.4785 7.1489 15.2476 7.1489 14.9722C7.1489 14.6967 7.24207 14.4658 7.42841 14.2795C7.61476 14.0931 7.84566 13.9999 8.12112 13.9999C8.39658 13.9999 8.62749 14.0931 8.81383 14.2795C9.00017 14.4658 9.09334 14.6967 9.09334 14.9722C9.09334 15.2476 9.00017 15.4785 8.81383 15.6649C8.62749 15.8512 8.39658 15.9444 8.12112 15.9444ZM15.8989 15.9444C15.6234 15.9444 15.3925 15.8512 15.2062 15.6649C15.0198 15.4785 14.9267 15.2476 14.9267 14.9722C14.9267 14.6967 15.0198 14.4658 15.2062 14.2795C15.3925 14.0931 15.6234 13.9999 15.8989 13.9999C16.1744 13.9999 16.4053 14.0931 16.5916 14.2795C16.7779 14.4658 16.8711 14.6967 16.8711 14.9722C16.8711 15.2476 16.7779 15.4785 16.5916 15.6649C16.4053 15.8512 16.1744 15.9444 15.8989 15.9444ZM12.01 19.8333C11.7345 19.8333 11.5036 19.7401 11.3173 19.5538C11.131 19.3674 11.0378 19.1365 11.0378 18.8611C11.0378 18.5856 11.131 18.3547 11.3173 18.1683C11.5036 17.982 11.7345 17.8888 12.01 17.8888C12.2855 17.8888 12.5164 17.982 12.7027 18.1683C12.8891 18.3547 12.9822 18.5856 12.9822 18.8611C12.9822 19.1365 12.8891 19.3674 12.7027 19.5538C12.5164 19.7401 12.2855 19.8333 12.01 19.8333ZM8.12112 19.8333C7.84566 19.8333 7.61476 19.7401 7.42841 19.5538C7.24207 19.3674 7.1489 19.1365 7.1489 18.8611C7.1489 18.5856 7.24207 18.3547 7.42841 18.1683C7.61476 17.982 7.84566 17.8888 8.12112 17.8888C8.39658 17.8888 8.62749 17.982 8.81383 18.1683C9.00017 18.3547 9.09334 18.5856 9.09334 18.8611C9.09334 19.1365 9.00017 19.3674 8.81383 19.5538C8.62749 19.7401 8.39658 19.8333 8.12112 19.8333ZM15.8989 19.8333C15.6234 19.8333 15.3925 19.7401 15.2062 19.5538C15.0198 19.3674 14.9267 19.1365 14.9267 18.8611C14.9267 18.5856 15.0198 18.3547 15.2062 18.1683C15.3925 17.982 15.6234 17.8888 15.8989 17.8888C16.1744 17.8888 16.4053 17.982 16.5916 18.1683C16.7779 18.3547 16.8711 18.5856 16.8711 18.8611C16.8711 19.1365 16.7779 19.3674 16.5916 19.5538C16.4053 19.7401 16.1744 19.8333 15.8989 19.8333Z"
                          fill="#003366"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-base font-bold text-[#333]">Tanggal & Waktu</h3>
                      <p className="text-base text-gray-600">{event.date}</p>
                      {event.time && <p className="text-base text-gray-600">{event.time}</p>}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="pt-0.5">
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 25 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M12.01 13.9999C12.5447 13.9999 13.0024 13.8096 13.3832 13.4288C13.764 13.048 13.9544 12.5902 13.9544 12.0555C13.9544 11.5208 13.764 11.063 13.3832 10.6822C13.0024 10.3014 12.5447 10.1111 12.01 10.1111C11.4752 10.1111 11.0175 10.3014 10.6367 10.6822C10.2559 11.063 10.0655 11.5208 10.0655 12.0555C10.0655 12.5902 10.2559 13.048 10.6367 13.4288C11.0175 13.8096 11.4752 13.9999 12.01 13.9999ZM12.01 21.1458C13.9868 19.331 15.4532 17.6822 16.4093 16.1996C17.3653 14.717 17.8433 13.4004 17.8433 12.2499C17.8433 10.4837 17.2802 9.03756 16.1541 7.9114C15.0279 6.78525 13.6465 6.22217 12.01 6.22217C10.3734 6.22217 8.99202 6.78525 7.86586 7.9114C6.7397 9.03756 6.17662 10.4837 6.17662 12.2499C6.17662 13.4004 6.65463 14.717 7.61065 16.1996C8.56667 17.6822 10.0331 19.331 12.01 21.1458ZM12.01 23.7222C9.40116 21.5023 7.45266 19.4403 6.16447 17.5364C4.87627 15.6325 4.23218 13.8703 4.23218 12.2499C4.23218 9.81939 5.01401 7.88305 6.57766 6.44092C8.14132 4.99879 9.95209 4.27772 12.01 4.27772C14.0678 4.27772 15.8786 4.99879 17.4422 6.44092C19.0059 7.88305 19.7877 9.81939 19.7877 12.2499C19.7877 13.8703 19.1436 15.6325 17.8554 17.5364C16.5672 19.4403 14.6188 21.5023 12.01 23.7222Z"
                          fill="#003366"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-base font-bold text-[#333]">Lokasi</h3>
                      <p className="text-base text-gray-600">
                        {event.locationName}
                      </p>
                      <p className="text-sm text-gray-500">{event.locationAddress}</p>
                    </div>
                  </div>

                  {/* Map */}
                  {(event.mapEmbedUrl || (event.latitude && event.longitude)) && (
                    <div className="rounded-4xl overflow-hidden border border-gray-200">
                      {event.mapEmbedUrl ? (
                        <iframe
                          src={event.mapEmbedUrl}
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      ) : (
                        <iframe
                          src={`https://www.google.com/maps?q=${event.latitude},${event.longitude}&hl=id&z=15&output=embed`}
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Add to Calendar */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#333] text-center">
                      Add to Calendar
                    </h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={addToGoogleCalendar}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm3.5 13.5h-7v-7h7v7z"
                            fill="#4285F4"
                          />
                        </svg>
                        <span className="text-sm font-bold text-[#333]">Google</span>
                      </button>
                      <button 
                        onClick={addToOutlookCalendar}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                            fill="#0078D4"
                          />
                        </svg>
                        <span className="text-sm font-bold text-[#333]">Outlook</span>
                      </button>
                    </div>
                  </div>

                  {/* Share Event */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#333] text-center">
                      Share Event
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={shareToWhatsApp}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20BA5A] transition-colors"
                        title="Share to WhatsApp"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 0C4.477 0 0 4.477 0 10c0 1.89.525 3.66 1.438 5.168L0 20l5.035-1.32A9.95 9.95 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm5.023 14.228c-.208.586-1.227 1.145-1.668 1.188-.441.043-.848.198-2.863-.596-2.441-1.02-3.996-3.547-4.117-3.71-.121-.163-.984-1.309-.984-2.496 0-1.188.621-1.773.84-2.016.22-.242.48-.305.64-.305.16 0 .32.002.46.008.148.008.348-.056.543.414.199.48.68 1.66.738 1.78.059.121.098.262.02.426-.078.163-.117.262-.234.402-.117.14-.246.312-.351.418-.117.117-.238.243-.102.477.136.234.605.996 1.3 1.613.895.793 1.648 1.04 1.883 1.156.234.117.371.098.508-.059.137-.156.586-.684.742-.918.156-.234.313-.195.528-.117.215.078 1.367.645 1.602.762.234.117.39.176.449.274.059.098.059.566-.149 1.152z"
                            fill="white"
                          />
                        </svg>
                      </button>
                      <button 
                        onClick={shareToFacebook}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#145DBF] transition-colors"
                        title="Share to Facebook"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.1667 18.0832C11.1667 18.0832 10 16.9998 10 15.7498V11.6665H8.25V8.74984H10V6.9165C10 5.1665 11 3.9165 13.25 3.9165C14.1667 3.9165 14.9167 3.99984 15.1667 3.99984V6.6665H13.5C12.6667 6.6665 12.5 7.08317 12.5 7.6665V9.08317H15.5L15.0833 11.9998H12.5V15.9998C12.5 17.3332 11.1667 18.4165 11.1667 18.4165V18.0832Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                      <button 
                        onClick={shareToTwitter}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-[#1DA1F2] hover:bg-[#1A8CD8] transition-colors"
                        title="Share to Twitter"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.75 4.8335C18.0833 5.16683 17.3333 5.3335 16.5833 5.41683C17.3333 5.00016 17.9166 4.25016 18.25 3.3335C17.5 3.75016 16.75 4.0835 15.9166 4.25016C15.25 3.50016 14.25 3.0835 13.25 3.0835C11.1666 3.0835 9.49996 4.75016 9.49996 6.8335C9.49996 7.16683 9.49996 7.41683 9.58329 7.75016C6.49996 7.5835 3.74996 6.0835 1.91663 3.8335C1.58329 4.3335 1.41663 5.00016 1.41663 5.66683C1.41663 7.00016 2.08329 8.0835 3.08329 8.8335C2.49996 8.8335 1.91663 8.66683 1.41663 8.3335V8.41683C1.41663 10.2502 2.66663 11.7502 4.41663 12.0835C4.08329 12.1668 3.74996 12.2502 3.41663 12.2502C3.16663 12.2502 2.91663 12.2502 2.74996 12.1668C3.24996 13.6668 4.66663 14.7502 6.24996 14.7502C4.99996 15.7502 3.33329 16.3335 1.58329 16.3335C1.24996 16.3335 0.999959 16.3335 0.666626 16.2502C2.33329 17.3335 4.24996 17.9168 6.41663 17.9168C13.3333 17.9168 17.0833 12.1668 17.0833 7.25016C17.0833 7.0835 17.0833 6.91683 17.0833 6.75016C17.75 6.25016 18.4166 5.5835 18.9166 4.8335H18.75Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                      <button 
                        onClick={copyLink}
                        className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors ${
                          copied ? 'bg-green-500' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        title={copied ? 'Link copied!' : 'Copy link'}
                      >
                        {copied ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.5 10L9.5 12L12.5 8M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18Z"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="24"
                            viewBox="0 0 20 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.16663 16.1665H5.83329C4.68052 16.1665 3.69788 15.7603 2.88538 14.9478C2.07288 14.1353 1.66663 13.1526 1.66663 11.9998C1.66663 10.8471 2.07288 9.86442 2.88538 9.05192C3.69788 8.23942 4.68052 7.83317 5.83329 7.83317H9.16663V9.49984H5.83329C5.13885 9.49984 4.54857 9.74289 4.06246 10.229C3.57635 10.7151 3.33329 11.3054 3.33329 11.9998C3.33329 12.6943 3.57635 13.2846 4.06246 13.7707C4.54857 14.2568 5.13885 14.4998 5.83329 14.4998H9.16663V16.1665ZM6.66663 12.8332V11.1665H13.3333V12.8332H6.66663ZM10.8333 16.1665V14.4998H14.1666C14.8611 14.4998 15.4514 14.2568 15.9375 13.7707C16.4236 13.2846 16.6666 12.6943 16.6666 11.9998C16.6666 11.3054 16.4236 10.7151 15.9375 10.229C15.4514 9.74289 14.8611 9.49984 14.1666 9.49984H10.8333V7.83317H14.1666C15.3194 7.83317 16.302 8.23942 17.1145 9.05192C17.927 9.86442 18.3333 10.8471 18.3333 11.9998C18.3333 13.1526 17.927 14.1353 17.1145 14.9478C16.302 15.7603 15.3194 16.1665 14.1666 16.1665H10.8333Z"
                              fill="#333333"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
