'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerIsLoading, setRegisterIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Login gagal. Periksa email dan password Anda.');
        return;
      }

      const { user, token } = await response.json();

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      document.cookie = `user_role=${user.role}; path=/`;
      document.cookie = `auth_token=${token}; path=/`;

      if (user.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (user.role === 'petugas') {
        window.location.href = '/dashboard/petugas';
      } else if (user.role === 'contributor') {
        window.location.href = '/dashboard/contributor';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError('Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setRegisterError(data.error || 'Pendaftaran gagal. Silakan coba lagi.');
        return;
      }

      const { user, token } = await response.json();

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      document.cookie = `user_role=${user.role}; path=/`;
      document.cookie = `user_full_name=${user.full_name}; path=/`;
      document.cookie = `auth_token=${token}; path=/`;

      setFullName('');
      setRegisterEmail('');
      setRegisterPassword('');

      if (user.role === 'admin') {
        router.push('/masuk');
      } else if (user.role === 'officer') {
        router.push('/masuk');
      } else if (user.role === 'contributor') {
        router.push('/masuk');
      } else {
        router.push('/masuk');
      }

      setIsLogin(true);
    } catch (err) {
      setRegisterError('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setRegisterIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setRegisterError('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const formVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { x: -100, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }
  };

  const imageVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { x: 100, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row overflow-hidden" style={{background: '#F8F5F1'}}>
      {/* Image Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? 'login-image' : 'register-image'}
          className="relative hidden flex-1 lg:flex"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: isLogin 
                ? "url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2070&auto=format&fit=crop')"
                : "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2064&auto=format&fit=crop')",
            }}
          />
          <div 
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: isLogin
                ? 'linear-gradient(0deg, rgba(169, 68, 56, 0.50) 0%, rgba(243, 185, 95, 0.30) 100%)'
                : 'linear-gradient(0deg, rgba(0, 108, 132, 0.50) 0%, rgba(212, 160, 23, 0.30) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="relative flex flex-1 flex-col justify-end p-12">
            <blockquote className="text-2xl font-semibold italic leading-8 text-white">
              {isLogin 
                ? '"Budaya adalah jembatan yang menghubungkan masa lalu, masa kini, dan masa depan."'
                : '"Nusantara adalah mozaik budaya yang tak ternilai, setiap kepingnya adalah warisan yang harus kita jaga."'
              }
            </blockquote>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login-form' : 'register-form'}
            className="w-full max-w-[448px]"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mb-[72px]">
              <h1 className="text-2xl font-bold leading-8 text-[#333333]">
                Lokallens
              </h1>
            </div>

            {isLogin ? (
              // Login Form
              <>
                <div className="mb-8 space-y-2">
                  <h2 className="text-4xl font-bold leading-10 tracking-[-0.9px] text-[#333333]">
                    Selamat Datang Kembali
                  </h2>
                  <p className="text-base leading-6 text-[#5E5E5E]">
                    Masuk ke akun Anda untuk melanjutkan perjalanan budaya.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium leading-[21px] text-[#333333]">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-[17px] py-[9px] text-base text-gray-900 placeholder:text-[#9CA3AF] focus:border-[#A94438] focus:outline-none focus:ring-1 focus:ring-[#A94438]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="password" className="text-sm font-medium leading-[21px] text-[#333333]">
                        Kata Sandi
                      </label>
                      <Link 
                        href="/lupa-kata-sandi" 
                        className="text-sm leading-[21px] text-[#5E5E5E] underline hover:text-[#333333]"
                      >
                        Lupa Kata Sandi?
                      </Link>
                    </div>
                    <div className="relative flex items-stretch">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi"
                        className="flex-1 rounded-l-2xl border border-[#D1D5DB] bg-white px-[13px] py-[14px] text-base text-gray-900 placeholder:text-[#9CA3AF] focus:border-[#A94438] focus:outline-none focus:ring-1 focus:ring-[#A94438] focus:z-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center justify-center rounded-r-2xl border border-l-0 border-[#D1D5DB] bg-white px-[13px] hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#A94438]"
                      >
                        {showPassword ? <svg
                          width="25"
                          height="28"
                          viewBox="0 0 25 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-6"
                        >
                          <path
                            d="M15.9961 15.264L14.5864 13.8543C14.7322 13.0927 14.5135 12.3797 13.9301 11.7154C13.3468 11.051 12.5933 10.7918 11.6697 10.9376L10.26 9.52789C10.5355 9.39826 10.815 9.30103 11.0985 9.23622C11.3821 9.1714 11.6859 9.139 12.01 9.139C13.2253 9.139 14.2583 9.56434 15.109 10.415C15.9596 11.2657 16.385 12.2987 16.385 13.514C16.385 13.8381 16.3526 14.1419 16.2878 14.4255C16.223 14.709 16.1257 14.9885 15.9961 15.264ZM19.1072 18.3265L17.6975 16.9654C18.3132 16.4955 18.8601 15.981 19.3381 15.422C19.8161 14.863 20.2253 14.227 20.5656 13.514C19.7554 11.8774 18.5928 10.5771 17.0777 9.61296C15.5627 8.64884 13.8734 8.16677 12.01 8.16677C11.5401 8.16677 11.0783 8.19918 10.6246 8.264C10.1709 8.32881 9.72527 8.42603 9.28777 8.55566L7.78083 7.04872C8.44518 6.77326 9.12574 6.56666 9.8225 6.42893C10.5193 6.2912 11.2484 6.22233 12.01 6.22233C14.4568 6.22233 16.6362 6.89883 18.5482 8.25184C20.4602 9.60485 21.8456 11.3589 22.7044 13.514C22.3318 14.47 21.8416 15.3572 21.234 16.1755C20.6263 16.9937 19.9174 17.7108 19.1072 18.3265ZM19.5933 24.3057L15.51 20.2709C14.9429 20.4492 14.3717 20.5829 13.7965 20.672C13.2212 20.7611 12.6257 20.8057 12.01 20.8057C9.56324 20.8057 7.38384 20.1292 5.4718 18.7762C3.55976 17.4231 2.17435 15.6691 1.31555 13.514C1.65583 12.6552 2.08523 11.8572 2.60375 11.1199C3.12226 10.3826 3.7137 9.72233 4.37805 9.139L1.70444 6.41677L3.06555 5.05566L20.9544 22.9446L19.5933 24.3057ZM5.73916 10.5001C5.26926 10.9214 4.83986 11.3832 4.45097 11.8855C4.06208 12.3878 3.76126 12.9251 3.54145 13.4972C4.35162 15.1337 5.51419 16.434 7.02915 17.3982C8.5441 18.3623 10.2334 18.8443 12.1461 18.8443C12.616 18.8443 13.0778 18.8119 13.5315 18.7471C13.9852 18.6823 14.4308 18.585 14.8683 18.4554L13.3614 17.0486C12.9565 17.1223 12.5444 17.1591 12.1251 17.1591C10.9099 17.1591 9.87685 16.7338 9.02608 15.883C8.1753 15.0323 7.74991 14.0005 7.74991 12.7873C7.74991 12.3849 7.78231 11.9979 7.84713 11.6263C7.91194 11.2548 8.00916 10.9004 8.13887 10.5631C7.49452 10.5178 6.87383 10.5296 6.27679 10.5984C5.67975 10.6671 5.11243 10.8038 4.57485 11.0084C4.85032 10.5719 5.1536 10.1314 5.48468 9.68688C5.81577 9.24232 6.17433 8.8375 6.56023 8.47244C6.36377 8.39879 6.17158 8.33865 5.98366 8.29203C5.79575 8.24541 5.6014 8.21706 5.40064 8.20699C5.29674 8.30422 5.13693 8.52575 4.9212 8.87257C4.70546 9.21938 4.49306 9.60906 4.28402 10.0416C4.07498 10.4741 3.89723 10.8654 3.76079 11.2156C3.62436 11.5658 3.54138 11.8408 3.5119 12.0402C3.48241 12.2397 3.46766 12.3939 3.46766 12.503C3.46766 12.7024 3.49215 12.9216 3.54138 13.1606C3.5906 13.3995 3.65376 13.6451 3.73083 13.8973Z"
                            fill="#5E5E5E"
                          />
                        </svg> : <svg className="h-7 w-6 text-[#5E5E5E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" role="img">
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-[#A94438] px-5 py-3 text-center text-base font-bold leading-6 tracking-[0.24px] text-white transition-colors hover:bg-[#8B3529] focus:outline-none focus:ring-2 focus:ring-[#A94438] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-0 text-center text-sm leading-5">
                  <span className="text-[#5E5E5E]">Belum punya akun? </span>
                  <button 
                    onClick={toggleAuthMode}
                    className="ms-1 font-bold text-[#A94438] underline hover:text-[#8B3529]"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </>
            ) : (
              // Register Form
              <>
                <div className="mb-8 space-y-2">
                  <h2 className="text-4xl font-bold leading-10 tracking-[-0.9px] text-[#1A1A1A]">
                    Daftarkan Akun Anda
                  </h2>
                  <p className="text-base leading-6 text-[#5E5E5E]">
                    Bergabunglah dengan kami untuk melestarikan kekayaan Nusantara.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium leading-[21px] text-[#1A1A1A]">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-[17px] py-[9px] text-base text-gray-900 placeholder:text-[#9CA3AF] focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="registerEmail" className="block text-sm font-medium leading-[21px] text-[#1A1A1A]">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      id="registerEmail"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-[17px] py-[9px] text-base text-gray-900 placeholder:text-[#9CA3AF] focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <label htmlFor="registerPassword" className="flex-1 text-sm font-medium leading-[21px] text-[#1A1A1A]">
                        Buat Kata Sandi
                      </label>
                    </div>
                    <div className="relative flex items-stretch">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        id="registerPassword"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="flex-1 rounded-l-2xl border border-[#D1D5DB] bg-white px-[13px] py-[14px] text-base text-gray-900 placeholder:text-[#9CA3AF] focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red focus:z-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="flex items-center justify-center rounded-r-2xl border border-l-0 border-[#D1D5DB] bg-white px-[13px] hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-red"
                      >
                        {showPassword ? <svg
                          width="25"
                          height="28"
                          viewBox="0 0 25 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-6"
                        >
                          <path
                            d="M15.9961 15.264L14.5864 13.8543C14.7322 13.0927 14.5135 12.3797 13.9301 11.7154C13.3468 11.051 12.5933 10.7918 11.6697 10.9376L10.26 9.52789C10.5355 9.39826 10.815 9.30103 11.0985 9.23622C11.3821 9.1714 11.6859 9.139 12.01 9.139C13.2253 9.139 14.2583 9.56434 15.109 10.415C15.9596 11.2657 16.385 12.2987 16.385 13.514C16.385 13.8381 16.3526 14.1419 16.2878 14.4255C16.223 14.709 16.1257 14.9885 15.9961 15.264ZM19.1072 18.3265L17.6975 16.9654C18.3132 16.4955 18.8601 15.981 19.3381 15.422C19.8161 14.863 20.2253 14.227 20.5656 13.514C19.7554 11.8774 18.5928 10.5771 17.0777 9.61296C15.5627 8.64884 13.8734 8.16677 12.01 8.16677C11.5401 8.16677 11.0783 8.19918 10.6246 8.264C10.1709 8.32881 9.72527 8.42603 9.28777 8.55566L7.78083 7.04872C8.44518 6.77326 9.12574 6.56666 9.8225 6.42893C10.5193 6.2912 11.2484 6.22233 12.01 6.22233C14.4568 6.22233 16.6362 6.89883 18.5482 8.25184C20.4602 9.60485 21.8456 11.3589 22.7044 13.514C22.3318 14.47 21.8416 15.3572 21.234 16.1755C20.6263 16.9937 19.9174 17.7108 19.1072 18.3265ZM19.5933 24.3057L15.51 20.2709C14.9429 20.4492 14.3717 20.5829 13.7965 20.672C13.2212 20.7611 12.6257 20.8057 12.01 20.8057C9.56324 20.8057 7.38384 20.1292 5.4718 18.7762C3.55976 17.4231 2.17435 15.6691 1.31555 13.514C1.65583 12.6552 2.08523 11.8572 2.60375 11.1199C3.12226 10.3826 3.7137 9.72233 4.37805 9.139L1.70444 6.41677L3.06555 5.05566L20.9544 22.9446L19.5933 24.3057ZM5.73916 10.5001C5.26926 10.9214 4.83986 11.3832 4.45097 11.8855C4.06208 12.3878 3.76126 12.9251 3.54145 13.4972C4.35162 15.1337 5.51419 16.434 7.02915 17.3982C8.5441 18.3623 10.2334 18.8443 12.1461 18.8443C12.616 18.8443 13.0778 18.8119 13.5315 18.7471C13.9852 18.6823 14.4308 18.585 14.8683 18.4554L13.3614 17.0486C12.9565 17.1223 12.5444 17.1591 12.1251 17.1591C10.9099 17.1591 9.87685 16.7338 9.02608 15.883C8.1753 15.0323 7.74991 14.0005 7.74991 12.7873C7.74991 12.3849 7.78231 11.9979 7.84713 11.6263C7.91194 11.2548 8.00916 10.9004 8.13887 10.5631C7.49452 10.5178 6.87383 10.5296 6.27679 10.5984C5.67975 10.6671 5.11243 10.8038 4.57485 11.0084C4.85032 10.5719 5.1536 10.1314 5.48468 9.68688C5.81577 9.24232 6.17433 8.8375 6.56023 8.47244C6.36377 8.39879 6.17158 8.33865 5.98366 8.29203C5.79575 8.24541 5.6014 8.21706 5.40064 8.20699C5.29674 8.30422 5.13693 8.52575 4.9212 8.87257C4.70546 9.21938 4.49306 9.60906 4.28402 10.0416C4.07498 10.4741 3.89723 10.8654 3.76079 11.2156C3.62436 11.5658 3.54138 11.8408 3.5119 12.0402C3.48241 12.2397 3.46766 12.3939 3.46766 12.503C3.46766 12.7024 3.49215 12.9216 3.54138 13.1606C3.5906 13.3995 3.65376 13.6451 3.73083 13.8973Z"
                            fill="#5E5E5E"
                          />
                        </svg> : <svg className="h-7 w-6 text-[#5E5E5E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" role="img">
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>}
                      </button>
                    </div>
                  </div>

                  {registerError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{registerError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={registerIsLoading}
                    className="w-full rounded-full bg-[#A94438] px-5 py-3 text-center text-base font-bold leading-6 tracking-[0.24px] text-white transition-colors hover:bg-[#8B3529] focus:outline-none focus:ring-2 focus:ring-[#A94438] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerIsLoading ? 'Memproses...' : 'Daftar'}
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-0 text-center text-sm leading-5">
                  <span className="text-[#5E5E5E]">Sudah punya akun? </span>
                  <button 
                    onClick={toggleAuthMode}
                    className="ms-1 font-bold text-[#A94438] underline hover:text-[#8B3529]"
                  >
                    Masuk Sekarang
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
