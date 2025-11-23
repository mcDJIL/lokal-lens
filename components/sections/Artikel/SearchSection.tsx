'use client';

import { useState, useEffect, useCallback } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface SearchSectionProps {
  currentCategory: string;
  currentSearch: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

const SearchSection = ({ currentCategory, currentSearch, onCategoryChange, onSearchChange }: SearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Sync with URL params
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== currentSearch) {
        onSearchChange(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, currentSearch, onSearchChange]);

  return (
    <section className="w-full mb-8 sm:mb-10 lg:mb-12">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="relative w-full sm:w-[328px]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[rgba(181,181,181,0.30)] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M16.1389 19.5224L10.0139 12.6896C9.52778 13.1234 8.96875 13.4668 8.33681 13.7199C7.70486 13.973 7.03241 14.0995 6.31944 14.0995C4.55324 14.0995 3.05845 13.4171 1.83507 12.0524C0.61169 10.6876 0 9.02007 0 7.04975C0 5.07943 0.61169 3.4119 1.83507 2.04713C3.05845 0.682375 4.55324 -5.72205e-06 6.31944 -5.72205e-06C8.08565 -5.72205e-06 9.58044 0.682375 10.8038 2.04713C12.0272 3.4119 12.6389 5.07943 12.6389 7.04975C12.6389 7.84511 12.5255 8.59528 12.2986 9.30025C12.0718 10.0052 11.7639 10.6289 11.375 11.1711L17.5 18.004L16.1389 19.5224ZM6.31944 11.9304C7.53472 11.9304 8.56771 11.4559 9.4184 10.5068C10.2691 9.55784 10.6944 8.40547 10.6944 7.04975C10.6944 5.69403 10.2691 4.54167 9.4184 3.59266C8.56771 2.64365 7.53472 2.16915 6.31944 2.16915C5.10417 2.16915 4.07118 2.64365 3.22049 3.59266C2.36979 4.54167 1.94444 5.69403 1.94444 7.04975C1.94444 8.40547 2.36979 9.55784 3.22049 10.5068C4.07118 11.4559 5.10417 11.9304 6.31944 11.9304Z" fill="#616F89"/>
            </svg>
            <input
              type="text"
              placeholder="Cari artikel berdasarkan kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                // Trigger immediate search on Enter
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (searchQuery !== currentSearch) onSearchChange(searchQuery);
                }
              }}
              className="flex-1 bg-transparent outline-none text-[#616F89] font-noto text-sm sm:text-base placeholder:text-[#616F89]"
            />
            {searchQuery && (
              <button
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery('');
                  if (currentSearch !== '') onSearchChange('');
                }}
                className="ml-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => onCategoryChange('semua')}
            className={`px-4 py-3 rounded-full font-noto text-sm leading-[21px] transition-all whitespace-nowrap ${
              currentCategory === 'semua'
                ? 'bg-[rgba(193,163,111,0.20)] text-[#C1A36F] font-bold'
                : 'bg-[rgba(181,181,181,0.30)] text-[#333] font-medium hover:bg-[rgba(181,181,181,0.40)]'
            }`}
          >
            Semua
          </button>
          {loadingCategories ? (
            <div className="px-4 py-3 text-sm text-gray-500">Memuat kategori...</div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.slug)}
                className={`px-4 py-3 rounded-full font-noto text-sm leading-[21px] transition-all whitespace-nowrap ${
                  currentCategory === category.slug
                    ? 'bg-[rgba(193,163,111,0.20)] text-[#C1A36F] font-bold'
                    : 'bg-[rgba(181,181,181,0.30)] text-[#333] font-medium hover:bg-[rgba(181,181,181,0.40)]'
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
