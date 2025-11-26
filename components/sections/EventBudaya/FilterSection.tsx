'use client';

import { useState, useRef, useEffect } from 'react';

interface FilterSectionProps {
  viewMode: 'grid' | 'calendar';
  setViewMode: (mode: 'grid' | 'calendar') => void;
  filters: {
    province: string;
    month: string;
    category: string;
    sort: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export default function FilterSection({ viewMode, setViewMode, filters, onFilterChange }: FilterSectionProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?type=event');
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Data untuk dropdown
  const provinces = [
    'Semua Provinsi',
    'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Sumatera Selatan',
    'Bengkulu', 'Lampung', 'Kepulauan Bangka Belitung', 'Kepulauan Riau',
    'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten',
    'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
    'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
    'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat',
    'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua',
  ];

  const months = [
    { label: 'Semua Bulan', value: '' },
    { label: 'Januari 2025', value: '2025-01' },
    { label: 'Februari 2025', value: '2025-02' },
    { label: 'Maret 2025', value: '2025-03' },
    { label: 'April 2025', value: '2025-04' },
    { label: 'Mei 2025', value: '2025-05' },
    { label: 'Juni 2025', value: '2025-06' },
    { label: 'Juli 2025', value: '2025-07' },
    { label: 'Agustus 2025', value: '2025-08' },
    { label: 'September 2025', value: '2025-09' },
    { label: 'Oktober 2025', value: '2025-10' },
    { label: 'November 2025', value: '2025-11' },
    { label: 'Desember 2025', value: '2025-12' },
  ];

  const sortOptions = [
    { label: 'Tanggal Terdekat', value: 'nearest' },
    { label: 'Tanggal Terjauh', value: 'farthest' },
  ];

  const getDisplayLabel = (key: string) => {
    switch (key) {
      case 'province':
        return filters.province || 'Semua Provinsi';
      case 'month':
        const month = months.find(m => m.value === filters.month);
        return month?.label || 'Semua Bulan';
      case 'category':
        if (!filters.category) return 'Semua Kategori';
        const category = categories.find(c => c.slug === filters.category);
        return category ? `${category.icon || ''} ${category.name}`.trim() : filters.category;
      case 'sort':
        const sort = sortOptions.find(s => s.value === filters.sort);
        return `Urutkan: ${sort?.label || 'Tanggal Terdekat'}`;
      default:
        return '';
    }
  };

  const FilterButton = ({ 
    id,
    options,
    onSelect
  }: { 
    id: string;
    options: string[] | { label: string; value: string }[] | Category[];
    onSelect: (value: string) => void;
  }) => {
    const isOpen = openDropdown === id;
    const label = getDisplayLabel(id);
    const hasActiveFilter = (id === 'province' && filters.province) ||
                           (id === 'month' && filters.month) ||
                           (id === 'category' && filters.category);

    console.log(`FilterButton ${id} - isOpen:`, isOpen, 'openDropdown:', openDropdown);

    return (
      <div className="relative">
        <button
          id={`btn-${id}`}
          type="button"
          onClick={() => {
            console.log('Clicked button:', id);
            console.log('Current openDropdown:', openDropdown);
            console.log('Will set to:', isOpen ? null : id);
            setOpenDropdown(isOpen ? null : id);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            hasActiveFilter 
              ? 'border-[#D4A017] bg-[#FFF9F0] text-[#D4A017]'
              : 'border-[#EAE3D9] text-[#192A51] hover:border-[#D4A017] hover:bg-[#FFF9F0]'
          }`}
        >
          <span>{label}</span>
          <svg 
            width="24" 
            height="28" 
            viewBox="0 0 25 28" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-5 h-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M12.01 17.2812L6.17667 11.4479L7.53778 10.0868L12.01 14.559L16.4822 10.0868L17.8433 11.4479L12.01 17.2812Z" fill="currentColor"/>
          </svg>
        </button>

        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-2 bg-white border border-[#EAE3D9] rounded-lg shadow-xl z-9999 min-w-[200px] max-w-[280px] max-h-80 overflow-y-auto"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              maxHeight: '50vh', // Ensure dropdown doesn't exceed half the viewport height
              overflowY: 'auto', // Enable scrolling when content exceeds maxHeight
            }}
          >
            {id === 'category' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onSelect('');
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#192A51] hover:bg-[#FFF9F0] transition-colors"
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      onSelect(cat.slug);
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#192A51] hover:bg-[#FFF9F0] transition-colors"
                  >
                    {cat.icon && <span className="mr-2">{cat.icon}</span>}
                    {cat.name}
                  </button>
                ))}
              </>
            ) : Array.isArray(options) && typeof options[0] === 'string' ? (
              (options as string[]).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => {
                    const value = option.includes('Semua') ? '' : option;
                    onSelect(value);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#192A51] hover:bg-[#FFF9F0] transition-colors"
                >
                  {option}
                </button>
              ))
            ) : (
              (options as { label: string; value: string }[]).map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#192A51] hover:bg-[#FFF9F0] transition-colors"
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      {/* Filter Buttons */}
      <div ref={dropdownRef} className="overflow-auto flex items-center gap-3 pb-2 sm:pb-0 w-full sm:w-auto overflow-x-auto" style={{ overflow: 'visible' }}>
        <FilterButton 
          id="province" 
          options={provinces}
          onSelect={(value) => onFilterChange('province', value)}
        />
        <FilterButton 
          id="month" 
          options={months}
          onSelect={(value) => onFilterChange('month', value)}
        />
        <FilterButton 
          id="category" 
          options={categories}
          onSelect={(value) => onFilterChange('category', value)}
        />
        <FilterButton 
          id="sort" 
          options={sortOptions}
          onSelect={(value) => onFilterChange('sort', value)}
        />
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-0.5 bg-[#F8F5F1] border border-[#EAE3D9] rounded-lg p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
            viewMode === 'grid'
              ? 'bg-white shadow-sm text-[#192A51]'
              : 'text-[#5C6B8A] hover:text-[#192A51]'
          }`}
        >
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6">
            <path d="M2.5 11.1667V4.5H9.16667V11.1667H2.5ZM2.5 19.5V12.8333H9.16667V19.5H2.5ZM10.8333 11.1667V4.5H17.5V11.1667H10.8333ZM10.8333 19.5V12.8333H17.5V19.5H10.8333ZM4.16667 9.5H7.5V6.16667H4.16667V9.5ZM12.5 9.5H15.8333V6.16667H12.5V9.5ZM12.5 17.8333H15.8333V14.5H12.5V17.8333ZM4.16667 17.8333H7.5V14.5H4.16667V17.8333Z" fill="currentColor"/>
          </svg>
          <span className="text-sm font-medium hidden sm:inline">Grid</span>
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
            viewMode === 'calendar'
              ? 'bg-white shadow-sm text-[#192A51]'
              : 'text-[#5C6B8A] hover:text-[#192A51]'
          }`}
        >
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6">
            <path d="M4.16667 20.3335C3.70833 20.3335 3.31597 20.1703 2.98958 19.8439C2.66319 19.5175 2.5 19.1252 2.5 18.6668V7.00016C2.5 6.54183 2.66319 6.14947 2.98958 5.82308C3.31597 5.49669 3.70833 5.33349 4.16667 5.33349H5V3.66683H6.66667V5.33349H13.3333V3.66683H15V5.33349H15.8333C16.2917 5.33349 16.684 5.49669 17.0104 5.82308C17.3368 6.14947 17.5 6.54183 17.5 7.00016V18.6668C17.5 19.1252 17.3368 19.5175 17.0104 19.8439C16.684 20.1703 16.2917 20.3335 15.8333 20.3335H4.16667ZM4.16667 18.6668H15.8333V10.3335H4.16667V18.6668ZM4.16667 8.66683H15.8333V7.00016H4.16667V8.66683Z" fill="currentColor"/>
          </svg>
          <span className="text-sm font-medium hidden sm:inline">Kalender</span>
        </button>
      </div>
    </div>
  );
}