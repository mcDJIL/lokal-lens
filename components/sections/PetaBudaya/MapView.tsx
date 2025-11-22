'use client';

import { useState, useEffect } from 'react';
import CulturalItemCard from './CulturalItemCard';
import dynamic from 'next/dynamic';

// Dynamic import untuk Leaflet (hanya di client-side)
const LeafletMapComponent = dynamic(
  () => import('./LeafletMapComponent'),
  { ssr: false }
);

interface Culture {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  location: string | null;
  province: string | null;
  city: string | null;
  lat: number;
  long: number;
  thumbnail: string | null;
  image: string | null;
  distance: number;
  is_endangered: boolean;
}

interface MapViewProps {
  selectedCategory?: string;
  selectedProvince?: string;
}

const categoryColors: Record<string, string> = {
  tarian: '#FD7E14',
  musik: '#4A90E2',
  pakaian: '#E91E63',
  arsitektur: '#9C27B0',
  kuliner: '#FF5722',
  upacara: '#D0021B',
  kerajinan: '#9013FE',
  senjata: '#795548',
  permainan: '#00BCD4',
  bahasa: '#4CAF50',
};

const MapView = ({ selectedCategory, selectedProvince }: MapViewProps) => {
  const [selectedCulture, setSelectedCulture] = useState<Culture | null>(null);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Ambil lokasi user dengan permission request
  useEffect(() => {
    const requestLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationPermission('granted');
            setError(null);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationPermission('denied');
            
            // Default ke Jakarta jika gagal
            setUserLocation({ lat: -6.2088, lng: 106.8456 });
            
            if (error.code === error.PERMISSION_DENIED) {
              setError('Izin lokasi ditolak. Menampilkan budaya di Jakarta. Aktifkan lokasi untuk hasil lebih akurat.');
            } else {
              setError('Tidak dapat mengakses lokasi. Menampilkan budaya di Jakarta.');
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        // Default ke Jakarta jika geolocation tidak tersedia
        setUserLocation({ lat: -6.2088, lng: 106.8456 });
        setError('Geolocation tidak didukung pada browser ini. Menampilkan budaya di Jakarta.');
      }
    };

    requestLocation();
  }, []);

  // Fetch cultures berdasarkan lokasi user
  useEffect(() => {
    if (!userLocation) return;

    const fetchCultures = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: userLocation.lat.toString(),
          lng: userLocation.lng.toString(),
          radius: '1000', // 1000km radius
        });

        if (selectedCategory && selectedCategory !== 'Semua Kategori') {
          params.append('category', selectedCategory.toLowerCase());
        }

        const response = await fetch(`/api/cultures/nearby?${params}`);
        const data = await response.json();

        if (data.success) {
          let filteredCultures = data.data;

          // Filter by province jika dipilih
          if (selectedProvince && selectedProvince !== 'Seluruh Indonesia') {
            filteredCultures = filteredCultures.filter(
              (c: Culture) => c.province === selectedProvince
            );
          }

          setCultures(filteredCultures);
          // Reset selected culture when filters change
          setSelectedCulture(null);
        }
      } catch (error) {
        console.error('Error fetching cultures:', error);
        setError('Gagal memuat data budaya');
      } finally {
        setLoading(false);
      }
    };

    fetchCultures();
  }, [userLocation, selectedCategory, selectedProvince]);

  // Filter cultures berdasarkan search query
  const filteredCultures = cultures.filter((culture) =>
    culture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    culture.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    culture.province?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkerClick = (culture: Culture) => {
    setSelectedCulture(culture);
  };

  return (
    <div className="flex-1 relative">
      <div className="rounded-[32px] overflow-hidden bg-gray-200 h-[400px] sm:h-[500px] lg:h-[600px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A99D] mx-auto mb-4"></div>
              <p className="text-sm text-[#618989]">Memuat peta budaya...</p>
            </div>
          </div>
        )}

        {/* Leaflet Map Component */}
        {!loading && userLocation && (
          <LeafletMapComponent
            userLocation={userLocation}
            cultures={filteredCultures}
            onMarkerClick={handleMarkerClick}
            selectedCulture={selectedCulture}
            onPopupClose={() => setSelectedCulture(null)}
          />
        )}

          {/* Search Bar Overlay */}
          <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-[320px] lg:max-w-[380px] z-20">
            <div className="flex items-center rounded-full bg-white shadow-lg overflow-hidden">
              <div className="flex items-center justify-center pl-4 pr-0 py-3 sm:py-3.5 bg-white rounded-l-full">
                <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6 sm:w-6 sm:h-7">
                  <path d="M19.3987 22.75L13.2737 16.625C12.7875 17.0139 12.2285 17.3218 11.5966 17.5486C10.9646 17.7755 10.2922 17.8889 9.57921 17.8889C7.81301 17.8889 6.31821 17.2772 5.09484 16.0538C3.87146 14.8304 3.25977 13.3356 3.25977 11.5694C3.25977 9.80324 3.87146 8.30845 5.09484 7.08507C6.31821 5.86169 7.81301 5.25 9.57921 5.25C11.3454 5.25 12.8402 5.86169 14.0636 7.08507C15.287 8.30845 15.8987 9.80324 15.8987 11.5694C15.8987 12.2824 15.7852 12.9549 15.5584 13.5868C15.3315 14.2188 15.0237 14.7778 14.6348 15.2639L20.7598 21.3889L19.3987 22.75ZM9.57921 15.9444C10.7945 15.9444 11.8275 15.5191 12.6782 14.6684C13.5289 13.8177 13.9542 12.7847 13.9542 11.5694C13.9542 10.3542 13.5289 9.32118 12.6782 8.47049C11.8275 7.61979 10.7945 7.19444 9.57921 7.19444C8.36393 7.19444 7.33095 7.61979 6.48025 8.47049C5.62956 9.32118 5.20421 10.3542 5.20421 11.5694C5.20421 12.7847 5.62956 13.8177 6.48025 14.6684C7.33095 15.5191 8.36393 15.9444 9.57921 15.9444Z" fill="#618989"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari budaya atau lokasi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-2 sm:px-3 py-3 sm:py-3.5 bg-white text-sm sm:text-base font-normal text-[#618989] placeholder:text-[#618989] outline-none border-none"
              />
              <div className="w-2 bg-white rounded-r-full"></div>
            </div>
          </div>

          {/* Legend Overlay */}
          <div className="absolute hidden sm:block top-4 right-4 lg:right-6 rounded-[32px] bg-white/90 backdrop-blur-sm shadow-lg p-4 w-48 z-20">
            <h3 className="text-base font-bold leading-6 text-[#333333] mb-3">
              Legenda
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FD7E14]"></div>
                <span className="text-sm font-normal leading-5 text-[#333333]">Tarian</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4A90E2]"></div>
                <span className="text-sm font-normal leading-5 text-[#333333]">Musik</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#9013FE]"></div>
                <span className="text-sm font-normal leading-5 text-[#333333]">Kerajinan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D0021B]"></div>
                <span className="text-sm font-normal leading-5 text-[#333333]">Upacara</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E91E63]"></div>
                <span className="text-sm font-normal leading-5 text-[#333333]">Pakaian</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5722]"></div>
                <span className="text-sm font-normal leading-5 text-[#333333]">Kuliner</span>
              </div>
            </div>
          </div>

          {/* Culture Card Overlay */}
          {selectedCulture && (
            <div className="hidden sm:block absolute bottom-4 left-4 z-30">
              <CulturalItemCard
                onClose={() => setSelectedCulture(null)}
                culture={selectedCulture}
              />
            </div>
          )}

          {/* Location Permission Message */}
          {locationPermission === 'denied' && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg text-xs sm:text-sm shadow-md max-w-xs sm:max-w-md text-center z-20">
              <p className="font-semibold mb-1">📍 Izin Lokasi Ditolak</p>
              <p className="text-xs">Aktifkan izin lokasi di pengaturan browser untuk hasil yang lebih akurat.</p>
            </div>
          )}

          {/* Info Message */}
          {error && locationPermission !== 'denied' && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs sm:text-sm shadow-md max-w-xs text-center z-20">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCultures.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg z-20">
              <p className="text-sm sm:text-base font-semibold text-[#333333] mb-1">
                Tidak ada budaya ditemukan
              </p>
              <p className="text-xs sm:text-sm text-[#618989]">
                Coba ubah filter atau kata kunci pencarian
              </p>
            </div>
          )}
      </div>

      {/* Mobile Card View */}
      {selectedCulture && (
        <div className="sm:hidden mt-4">
          <CulturalItemCard
            onClose={() => setSelectedCulture(null)}
            culture={selectedCulture}
          />
        </div>
      )}

      {/* Culture Count */}
      {!loading && filteredCultures.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-[#618989]">
            Menampilkan <span className="font-bold text-[#00A99D]">{filteredCultures.length}</span> budaya terdekat
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;
