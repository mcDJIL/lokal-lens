'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#EAE3D9] text-[#5C6B8A] hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="24" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-7">
          <path d="M13.9544 19.8335L8.12109 14.0002L13.9544 8.16683L15.3155 9.52794L10.8433 14.0002L15.3155 18.4724L13.9544 19.8335Z" fill="currentColor"/>
        </svg>
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? 'border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.1)] text-[#D4A017]'
                : 'text-[#192A51] hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ) : (
          <div key={index} className="w-10 h-10 flex items-center justify-center text-[#192A51] text-sm">
            {page}
          </div>
        )
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#EAE3D9] text-[#5C6B8A] hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="24" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-7">
          <path d="M12.5933 14.0002L8.12109 9.52794L9.4822 8.16683L15.3155 14.0002L9.4822 19.8335L8.12109 18.4724L12.5933 14.0002Z" fill="currentColor"/>
        </svg>
      </button>
    </nav>
  );
}
