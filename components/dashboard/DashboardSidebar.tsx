'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  roles: ('admin' | 'contributor' | 'petugas')[];
  subMenu?: SubMenuItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/admin',
    roles: ['admin'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Dashboard',
    href: '/dashboard/petugas',
    roles: ['petugas'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Dashboard',
    href: '/dashboard/contributor',
    roles: ['contributor'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Konten Saya',
    roles: ['contributor'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" fill="currentColor"/>
      </svg>
    ),
    subMenu: [
      {
        name: 'Artikel',
        href: '/dashboard/contributor/artikel',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Budaya',
        href: '/dashboard/contributor/budaya',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Kuis',
        href: '/dashboard/contributor/kuis',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" fill="currentColor"/>
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Master Data',
    roles: ['admin'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" fill="currentColor"/>
      </svg>
    ),
    subMenu: [
      {
        name: 'Kategori',
        href: '/dashboard/admin/kategori',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l-5.5 9h11z M17.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm-11 0h-3v3h3v-3zm0 3h-3v3h3v-3z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Budaya',
        href: '/dashboard/admin/budaya',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Artikel',
        href: '/dashboard/admin/artikel',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Kuis',
        href: '/dashboard/admin/kuis',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Event',
        href: '/dashboard/admin/event',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Tantangan',
        href: '/dashboard/admin/tantangan',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Lencana',
        href: '/dashboard/admin/lencana',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24l-7.19-.61L12 2z" fill="currentColor"/>
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Manajemen',
    roles: ['admin'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
      </svg>
    ),
    subMenu: [
      {
        name: 'Pengguna',
        href: '/dashboard/admin/pengguna',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Laporan Budaya',
        href: '/dashboard/admin/laporan-budaya',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Sertifikat',
        href: '/dashboard/admin/sertifikat',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24l-7.19-.61L12 2z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Verifikasi',
        href: '/dashboard/admin/verifikasi',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Riwayat Scan',
        href: '/dashboard/admin/riwayat-scan',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
          </svg>
        ),
      },
    ],
  },
  {
    name: 'Verifikasi Konten',
    roles: ['admin', 'petugas'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
      </svg>
    ),
    subMenu: [
      {
        name: 'Artikel',
        href: '/dashboard/petugas/verifikasi-artikel',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Budaya',
        href: '/dashboard/petugas/verifikasi-budaya',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        name: 'Kuis',
        href: '/dashboard/petugas/verifikasi-kuis',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" fill="currentColor"/>
          </svg>
        ),
      },
    ],
  },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const filteredNavigation = navigation.filter(item => 
    user && user.role && item.roles.includes(user.role)
  );

  const toggleSubMenu = (menuName: string) => {
    setOpenSubMenu(openSubMenu === menuName ? null : menuName);
  };

  const isSubmenuActive = (subMenu?: SubMenuItem[]) => {
    if (!subMenu) return false;
    return subMenu.some(item => pathname === item.href || pathname.startsWith(item.href + '/'));
  };

  return (
    <div className="flex h-full w-64 flex-col bg-[#1A1A1A] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-primary-green flex items-center justify-center">
          <Image src="/assets/img/logo-white.png" alt="LokalLens Logo" width={32} height={32} />
        </div>
        <span className="text-xl font-bold">LokalLens</span>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || 'Guest'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;
            const isActive = item.href ? (pathname === item.href || pathname.startsWith(item.href + '/')) : false;
            const isSubActive = isSubmenuActive(item.subMenu);
            const isOpen = openSubMenu === item.name;

            return (
              <li key={item.name}>
                {hasSubMenu ? (
                  <>
                    {/* Parent Menu with Submenu */}
                    <button
                      onClick={() => toggleSubMenu(item.name)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isSubActive || isOpen
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isSubActive || isOpen ? 'text-primary-green' : 'text-gray-400'}>
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Submenu Items */}
                    {isOpen && (
                      <ul className="mt-1 ml-6 space-y-1 border-l border-gray-700 pl-3">
                        {item.subMenu?.map((subItem) => {
                          const isSubItemActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                          return (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  isSubItemActive
                                    ? 'bg-primary-green text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                              >
                                <span className={isSubItemActive ? 'text-white' : 'text-gray-400'}>
                                  {subItem.icon}
                                </span>
                                {subItem.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  /* Regular Menu Item */
                  <Link
                    href={item.href || '#'}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-green text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
          </svg>
          Keluar
        </button>
      </div>
    </div>
  );
}
