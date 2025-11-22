'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isAuthPage = pathname === '/masuk' || pathname === '/daftar' || pathname === '/lupa-kata-sandi' || pathname === '/bergabung';
  const isDashboardPage = pathname.startsWith('/dashboard');

  if (isAuthPage || isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <main className="max-w-screen min-h-screen bg-white">
      <Navbar isHomePage={isHomePage} />
      <section className="overflow-hidden">{children}</section>
      <Footer />
    </main>
  );
}

export default MainLayout;
