'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

interface NavbarProps {
  isHomePage?: boolean;
}

const Navbar = ({ isHomePage = false }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileDropdownOpenSimplified, setIsProfileDropdownOpenSimplified] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownSimplifiedRef = useRef<HTMLDivElement>(null);

  // Handle logout with loading state and error handling
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      await logout();
      // Close all dropdowns
      setIsProfileDropdownOpen(false);
      setIsProfileDropdownOpenSimplified(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Gagal logout. Silakan coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (profileDropdownSimplifiedRef.current && !profileDropdownSimplifiedRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpenSimplified(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between min-h-[56px]">
          {/* Logo */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <a href="/" className="flex gap-1.5 items-center text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight tracking-[-0.27px] text-[#111813] whitespace-nowrap">
              <Image src="/assets/img/logo.png" alt="LokalLens Logo" width={40} height={40} />
              LokalLens
            </a>
            
            {/* Desktop Navigation (lg and above) */}
            <div className="hidden md:flex items-center gap-5 ml-8 2xl:ml-[98px]">
              <div 
                ref={dropdownRef}
                className="relative"
              >
                <button 
                  className="flex items-center gap-2.5 whitespace-nowrap hover:text-primary-green transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-base font-medium text-[#111813]">Jelajahi</span>
                  <svg 
                    width="12" 
                    height="8" 
                    viewBox="0 0 12 8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1L6 6L11 1" stroke="#111813" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50"
                  >
                    <a 
                      href="/artikel" 
                      className="block px-4 py-2.5 text-sm font-medium text-[#111813] hover:bg-gray-50 hover:text-primary-green transition-colors"
                    >
                      Artikel
                    </a>
                    <a 
                      href="/jelajahi" 
                      className="block px-4 py-2.5 text-sm font-medium text-[#111813] hover:bg-gray-50 hover:text-primary-green transition-colors"
                    >
                      Kekayaan Budaya
                    </a>
                    <a 
                      href="/peta-budaya" 
                      className="block px-4 py-2.5 text-sm font-medium text-[#111813] hover:bg-gray-50 hover:text-primary-green transition-colors"
                    >
                      Map Budaya
                    </a>
                    <a 
                      href="/kuis" 
                      className="block px-4 py-2.5 text-sm font-medium text-[#111813] hover:bg-gray-50 hover:text-primary-green transition-colors"
                    >
                      Kuis
                    </a>
                    <a 
                      href="/event-budaya" 
                      className="block px-4 py-2.5 text-sm font-medium text-[#111813] hover:bg-gray-50 hover:text-primary-green transition-colors"
                    >
                      Event Budaya
                    </a>
                  </div>
                )}
              </div>
              <a href="/scan-budaya" className="text-base font-medium text-[#111813] hover:text-primary-green transition-colors whitespace-nowrap">
                Scan Budaya
              </a>
              <a href="/tentang-kami" className="text-base font-medium text-[#111813] hover:text-primary-green transition-colors whitespace-nowrap">
                Tentang Kami
              </a>
            </div>
          </div>

          {/* Desktop Action Buttons (>= 1120px) */}
          <div className="hidden lg:flex items-center gap-2 2xl:gap-4 flex-shrink-0">
          {isHomePage && (
            <>
            <a href="/budaya-terancam" className="flex items-center gap-1.5 px-2.5 py-1.5 2xl:px-3 2xl:py-2 rounded-full bg-[rgba(192,57,43,0.1)] hover:bg-[rgba(192,57,43,0.15)] transition-colors whitespace-nowrap">
              <svg width="16" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5 flex-shrink-0">
                <path d="M0.833313 19.5L9.99998 3.66667L19.1666 19.5H0.833313ZM3.70831 17.8333H16.2916L9.99998 7L3.70831 17.8333ZM9.99998 17C10.2361 17 10.434 16.9201 10.5937 16.7604C10.7535 16.6007 10.8333 16.4028 10.8333 16.1667C10.8333 15.9306 10.7535 15.7326 10.5937 15.5729C10.434 15.4132 10.2361 15.3333 9.99998 15.3333C9.76387 15.3333 9.56595 15.4132 9.40623 15.5729C9.24651 15.7326 9.16665 15.9306 9.16665 16.1667C9.16665 16.4028 9.24651 16.6007 9.40623 16.7604C9.56595 16.9201 9.76387 17 9.99998 17ZM9.16665 14.5H10.8333V10.3333H9.16665V14.5Z" fill="#C0392B"/>
              </svg>
              <span className="text-sm font-bold text-[#C0392B]">
                Laporan Budaya Terancam
              </span>
            </a>

            <a href="/ai-asisten" className="flex items-center gap-1.5 px-2.5 py-1.5 2xl:px-4 2xl:py-2 rounded-full bg-gradient-to-r from-[#D4A017] to-[#C0392B] hover:shadow-lg transition-shadow whitespace-nowrap">
              <svg width="16" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5 flex-shrink-0">
                <path d="M15.8333 9.5L14.7916 7.20833L12.5 6.16667L14.7916 5.125L15.8333 2.83333L16.875 5.125L19.1666 6.16667L16.875 7.20833L15.8333 9.5ZM15.8333 21.1667L14.7916 18.875L12.5 17.8333L14.7916 16.7917L15.8333 14.5L16.875 16.7917L19.1666 17.8333L16.875 18.875L15.8333 21.1667ZM7.49998 18.6667L5.41665 14.0833L0.833313 12L5.41665 9.91667L7.49998 5.33333L9.58331 9.91667L14.1666 12L9.58331 14.0833L7.49998 18.6667ZM7.49998 14.625L8.33331 12.8333L10.125 12L8.33331 11.1667L7.49998 9.375L6.66665 11.1667L4.87498 12L6.66665 12.8333L7.49998 14.625Z" fill="white"/>
              </svg>
              <span className="text-sm font-bold text-white">
                AI Assistant Budaya
              </span>
            </a>
            </>
            )}

            {/* Auth Section */}
            {user ? (
            <div
              ref={profileDropdownRef}
              className="relative"
            >
              <div
                className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <span className="text-sm font-medium text-[#111813] whitespace-nowrap hidden xl:block">
                  Hi! {user.name}
                </span>
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={user.avatar || "/assets/img/default-avatar.png"}
                    alt={`${user.name} Profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111813"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-[180px] bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                  <a
                    href="/profil"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#111813] hover:bg-gray-50 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#111813"/>
                    </svg>
                    Profil
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#C0392B] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#C0392B"/>
                    </svg>
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
            ) : (
              <div className="flex items-center gap-3">{/* Desktop Sign In/Sign Up */}
                <a
                  href="/masuk"
                  className="px-4 py-2 text-sm font-semibold text-[#111813] bg-[#E5E7EB] rounded-full transition-colors whitespace-nowrap"
                >
                  Sign In
                </a>
                <a
                  href="/masuk"
                  className="px-5 py-2 text-sm font-semibold text-[#111813] bg-primary-green bg-[#0FD94F] rounded-full transition-colors whitespace-nowrap"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Simplified Buttons (md to < 1120px) */}
          <div className="hidden md:flex lg:hidden items-center gap-2 flex-shrink-0">
          {isHomePage && (
            <>
            <a href="/budaya-terancam" className="p-2 rounded-full bg-[rgba(192,57,43,0.1)] hover:bg-[rgba(192,57,43,0.15)] transition-colors" title="Laporan Budaya Terancam">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6">
                <path d="M0.833313 19.5L9.99998 3.66667L19.1666 19.5H0.833313ZM3.70831 17.8333H16.2916L9.99998 7L3.70831 17.8333ZM9.99998 17C10.2361 17 10.434 16.9201 10.5937 16.7604C10.7535 16.6007 10.8333 16.4028 10.8333 16.1667C10.8333 15.9306 10.7535 15.7326 10.5937 15.5729C10.434 15.4132 10.2361 15.3333 9.99998 15.3333C9.76387 15.3333 9.56595 15.4132 9.40623 15.5729C9.24651 15.7326 9.16665 15.9306 9.16665 16.1667C9.16665 16.4028 9.24651 16.6007 9.40623 16.7604C9.56595 16.9201 9.76387 17 9.99998 17ZM9.16665 14.5H10.8333V10.3333H9.16665V14.5Z" fill="#C0392B"/>
              </svg>
            </a>

            <a href="/ai-asisten" className="p-2 rounded-full bg-gradient-to-r from-[#D4A017] to-[#C0392B] hover:shadow-lg transition-shadow" title="AI Assistant Budaya">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-6">
                <path d="M15.8333 9.5L14.7916 7.20833L12.5 6.16667L14.7916 5.125L15.8333 2.83333L16.875 5.125L19.1666 6.16667L16.875 7.20833L15.8333 9.5ZM15.8333 21.1667L14.7916 18.875L12.5 17.8333L14.7916 16.7917L15.8333 14.5L16.875 16.7917L19.1666 17.8333L16.875 18.875L15.8333 21.1667ZM7.49998 18.6667L5.41665 14.0833L0.833313 12L5.41665 9.91667L7.49998 5.33333L9.58331 9.91667L14.1666 12L9.58331 14.0833L7.49998 18.6667ZM7.49998 14.625L8.33331 12.8333L10.125 12L8.33331 11.1667L7.49998 9.375L6.66665 11.1667L4.87498 12L6.66665 12.8333L7.49998 14.625Z" fill="white"/>
              </svg>
            </a>
            </>
            )}

            {/* Auth Section - Simplified */}
            {user ? (
            <div
              ref={profileDropdownSimplifiedRef}
              className="relative"
            >
              <div
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                onClick={() => setIsProfileDropdownOpenSimplified(!isProfileDropdownOpenSimplified)}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={user.avatar || "/assets/img/default-avatar.png"}
                    alt={`${user.name} Profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111813"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-[#111813] whitespace-nowrap">
                  {/* {user.name.split(' ')[0]} {user.name.split(' ')[1]?.charAt(0) || ''} */}
                </span>
              </div>

              {/* Profile Dropdown - Simplified */}
              {isProfileDropdownOpenSimplified && (
                <div className="absolute top-full right-0 mt-2 w-[180px] bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                  <a
                    href="/profil"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#111813] hover:bg-gray-50 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#111813"/>
                    </svg>
                    Profil
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#C0392B] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#C0392B"/>
                    </svg>
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
            ) : (
              <div className="flex items-center gap-2">{/* Tablet Sign In/Sign Up */}
                <a
                  href="/masuk"
                  className="px-3 py-1.5 text-sm font-semibold text-[#111813] bg-[#E5E7EB] rounded-full transition-colors whitespace-nowrap"
                >
                  Sign In
                </a>
                <a
                  href="/masuk"
                  className="px-4 py-1.5 text-sm font-semibold text-[#111813] bg-primary-green bg-[#0FD94F] rounded-full transition-colors whitespace-nowrap"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (< md) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6L18 18" stroke="#111813" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M3 12H21M3 6H21M3 18H21" stroke="#111813" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu (< md) */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-4 animate-in slide-in-from-top duration-200">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              <div>
                <button 
                  className="cursor-pointer w-full flex items-center justify-between text-base font-medium text-[#111813] text-left px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                >
                  <span className='cursor-pointer'>Jelajahi</span>
                  <svg 
                    width="12" 
                    height="8" 
                    viewBox="0 0 12 8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1L6 6L11 1" stroke="#111813" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Mobile Dropdown Menu */}
                {isMobileDropdownOpen && (
                  <div className="mt-2 ml-4 space-y-2 animate-in slide-in-from-top duration-200">
                    <a href="/artikel" className="block px-2 py-2 text-sm font-medium text-[#111813] hover:bg-gray-50 rounded-lg transition-colors">
                      Artikel
                    </a>
                    <a href="/jelajahi" className="block px-2 py-2 text-sm font-medium text-[#111813] hover:bg-gray-50 rounded-lg transition-colors">
                      Kekayaan Budaya
                    </a>
                    <a href="/peta-budaya" className="block px-2 py-2 text-sm font-medium text-[#111813] hover:bg-gray-50 rounded-lg transition-colors">
                      Map Budaya
                    </a>
                    <a href="/kuis" className="block px-2 py-2 text-sm font-medium text-[#111813] hover:bg-gray-50 rounded-lg transition-colors">
                      Kuis
                    </a>
                    <a href="/event-budaya" className="block px-2 py-2 text-sm font-medium text-[#111813] hover:bg-gray-50 rounded-lg transition-colors">
                      Event Budaya
                    </a>
                  </div>
                )}
              </div>
              <a href="scan-budaya" className="text-base font-medium text-[#111813] px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                Scan Budaya
              </a>
              <a href="/tentang-kami" className="text-base font-medium text-[#111813] px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                Tentang Kami
              </a>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
              <a href="/budaya-terancam" className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[rgba(192,57,43,0.1)]">
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5">
                  <path d="M0.833313 19.5L9.99998 3.66667L19.1666 19.5H0.833313ZM3.70831 17.8333H16.2916L9.99998 7L3.70831 17.8333ZM9.99998 17C10.2361 17 10.434 16.9201 10.5937 16.7604C10.7535 16.6007 10.8333 16.4028 10.8333 16.1667C10.8333 15.9306 10.7535 15.7326 10.5937 15.5729C10.434 15.4132 10.2361 15.3333 9.99998 15.3333C9.76387 15.3333 9.56595 15.4132 9.40623 15.5729C9.24651 15.7326 9.16665 15.9306 9.16665 16.1667C9.16665 16.4028 9.24651 16.6007 9.40623 16.7604C9.56595 16.9201 9.76387 17 9.99998 17ZM9.16665 14.5H10.8333V10.3333H9.16665V14.5Z" fill="#C0392B"/>
                </svg>
                <span className="text-sm font-bold text-[#C0392B]">
                  Laporan Budaya Terancam
                </span>
              </a>

              <a href="/ai-asisten" className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#D4A017] to-[#C0392B]">
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5">
                  <path d="M15.8333 9.5L14.7916 7.20833L12.5 6.16667L14.7916 5.125L15.8333 2.83333L16.875 5.125L19.1666 6.16667L16.875 7.20833L15.8333 9.5ZM15.8333 21.1667L14.7916 18.875L12.5 17.8333L14.7916 16.7917L15.8333 14.5L16.875 16.7917L19.1666 17.8333L16.875 18.875L15.8333 21.1667ZM7.49998 18.6667L5.41665 14.0833L0.833313 12L5.41665 9.91667L7.49998 5.33333L9.58331 9.91667L14.1666 12L9.58331 14.0833L7.49998 18.6667ZM7.49998 14.625L8.33331 12.8333L10.125 12L8.33331 11.1667L7.49998 9.375L6.66665 11.1667L4.87498 12L6.66665 12.8333L7.49998 14.625Z" fill="white"/>
                </svg>
                <span className="text-sm font-bold text-white">
                  AI Assistant Budaya
                </span>
              </a>

              {/* Auth Section - Mobile */}
              {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={user.avatar || "/assets/img/default-avatar.png"}
                      alt={`${user.name} Profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111813"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#111813]">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Mobile Profile Actions */}
                <div className="flex gap-2">
                  <a
                    href="/profil"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#111813"/>
                    </svg>
                    <span className="text-sm font-bold text-[#111813]">Profil</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#C0392B"/>
                    </svg>
                    <span className="text-sm font-bold text-[#C0392B]">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </div>
              </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <a
                    href="/masuk"
                    className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg bg-[#E5E7EB] border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-[#111813]">Sign In</span>
                  </a>
                  <a
                    href="/masuk"
                    className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg bg-primary-green bg-[#0FD94F] transition-colors"
                  >
                    <span className="text-sm font-bold text-[#111813]">Sign Up</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
