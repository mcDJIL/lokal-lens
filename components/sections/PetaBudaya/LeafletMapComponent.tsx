'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface LeafletMapComponentProps {
  userLocation: { lat: number; lng: number } | null;
  cultures: Culture[];
  onMarkerClick: (culture: Culture) => void;
  selectedCulture: Culture | null;
  onPopupClose?: () => void;
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

// Fix Leaflet default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LeafletMapComponent = ({
  userLocation,
  cultures,
  onMarkerClick,
  selectedCulture,
  onPopupClose,
}: LeafletMapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !userLocation) return;

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create layer group for markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapRef.current = map;

    return () => {
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
        markersLayerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
  }, [userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Remove existing user marker
    if (userMarkerRef.current && markersLayerRef.current) {
      markersLayerRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    // Create custom icon for user location
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: #4285F4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    })
      .bindPopup('📍 Lokasi Anda');

    if (markersLayerRef.current) {
      markersLayerRef.current.addLayer(marker);
    }
    userMarkerRef.current = marker;

    return () => {
      if (userMarkerRef.current && markersLayerRef.current) {
        markersLayerRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
    };
  }, [userLocation]);

  // Add culture markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Clear all existing culture markers from layer group
    markersRef.current.forEach((marker) => {
      if (marker && markersLayerRef.current) {
        marker.off(); // Remove event listeners
        markersLayerRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // If no cultures, just return
    if (cultures.length === 0) return;

    // Create bounds for fitting all markers
    const bounds = L.latLngBounds([]);
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    // Add new markers
    cultures.forEach((culture) => {
      const color = culture.category
        ? categoryColors[culture.category] || '#00A99D'
        : '#00A99D';

      // Create custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-culture-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          " 
          onmouseover="this.style.transform='scale(1.2)'" 
          onmouseout="this.style.transform='scale(1)'">
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([culture.lat, culture.long], {
        icon: customIcon,
      })
        .bindPopup(`<strong>${culture.name}</strong>`)
        .on('click', () => {
          onMarkerClick(culture);
        })
        .on('popupclose', () => {
          if (onPopupClose) {
            onPopupClose();
          }
        });

      if (markersLayerRef.current) {
        markersLayerRef.current.addLayer(marker);
      }
      markersRef.current.push(marker);
      bounds.extend([culture.lat, culture.long]);
    });

    // Fit map to show all markers with a small delay to ensure markers are rendered
    if (mapRef.current && bounds.isValid() && cultures.length > 0) {
      setTimeout(() => {
        if (mapRef.current && bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { 
            padding: [50, 50],
            animate: false // Disable animation to prevent transition errors
          });
        }
      }, 100);
    }

    return () => {
      markersRef.current.forEach((marker) => {
        if (marker && markersLayerRef.current) {
          marker.off();
          markersLayerRef.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    };
  }, [cultures, onMarkerClick, userLocation]);

  // Highlight selected culture
  useEffect(() => {
    if (!mapRef.current || !selectedCulture) return;

    // Pan to selected culture
    const targetLatLng = L.latLng(selectedCulture.lat, selectedCulture.long);
    if (mapRef.current && targetLatLng) {
      mapRef.current.setView(targetLatLng, 10, {
        animate: true,
      });
    }

    // Find and open popup for selected marker
    markersRef.current.forEach((marker) => {
      const popup = marker.getPopup();
      if (popup && popup.getContent()?.toString().includes(selectedCulture.name)) {
        marker.openPopup();
      }
    });
  }, [selectedCulture]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default LeafletMapComponent;