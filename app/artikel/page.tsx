'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import HeroSection from "@/components/sections/Artikel/HeroSection";
import SearchSection from "@/components/sections/Artikel/SearchSection";
import ArticleGridSection from "@/components/sections/Artikel/ArticleGridSection";
import PaginationSection from "@/components/sections/Artikel/PaginationSection";

export default function ArtikelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || 'semua';
  const currentSearch = searchParams.get('search') || '';

  // Update URL with new params
  const updateUrlParams = useCallback((updates: { page?: number; category?: string; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (updates.page !== undefined) {
      if (updates.page === 1) {
        params.delete('page');
      } else {
        params.set('page', updates.page.toString());
      }
    }
    
    if (updates.category !== undefined) {
      if (updates.category === 'semua') {
        params.delete('category');
      } else {
        params.set('category', updates.category);
      }
      // Reset to page 1 when changing filters
      params.delete('page');
    }
    
    if (updates.search !== undefined) {
      if (updates.search === '') {
        params.delete('search');
      } else {
        params.set('search', updates.search);
      }
      // Reset to page 1 when searching
      params.delete('page');
    }

    const queryString = params.toString();
    router.push(`/artikel${queryString ? '?' + queryString : ''}`, { scroll: false });
  }, [searchParams, router]);

  return (
      <main className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <SearchSection 
            currentCategory={currentCategory}
            currentSearch={currentSearch}
            onCategoryChange={(category) => updateUrlParams({ category })}
            onSearchChange={(search) => updateUrlParams({ search })}
          />
          <ArticleGridSection 
            page={currentPage}
            category={currentCategory}
            search={currentSearch}
          />
          <PaginationSection 
            currentPage={currentPage}
            onPageChange={(page) => updateUrlParams({ page })}
          />
        </div>
      </main>
  );
}
