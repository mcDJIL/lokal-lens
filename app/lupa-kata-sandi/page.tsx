'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // If email not found, show friendly message. For production reset flows
        // consider returning 200 regardless to avoid user enumeration.
        setError(data.error || 'Email tidak ditemukan.');
        return;
      }

      setSubmitted(true);
    }catch (err) {
      setError('Pengiriman tautan reset gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row" style={{background: '#F8F5F1'}}>
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-[448px]">
          <div className="mb-[72px]">
            <Link href="/" className="text-2xl font-bold leading-8 text-[#333333] hover:text-[#5E5E5E]">
              Lokallens
            </Link>
          </div>

          {!submitted ? (
            <>
              <div className="mb-8 space-y-2">
                <h2 className="text-4xl font-bold leading-10 tracking-[-0.9px] text-[#333333]">
                  Lupa Kata Sandi
                </h2>
                <p className="text-base leading-6 text-[#5E5E5E]">
                  Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    required
                  />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}


                <button
                  type="submit"
                  disabled = {loading}
                  className="w-full rounded-full bg-[#A94438] px-5 py-3 text-center text-base font-bold leading-6 tracking-[0.24px] text-white transition-colors hover:bg-[#8B3529] focus:outline-none focus:ring-2 focus:ring-[#A94438] focus:ring-offset-2"
                >
                  Kirim Tautan Reset
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link 
                  href="/masuk" 
                  className="text-sm font-bold text-[#A94438] underline hover:text-[#8B3529]"
                >
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg 
                    className="h-8 w-8 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold leading-10 tracking-[-0.9px] text-[#333333]">
                  Email Terkirim
                </h2>
                <p className="text-base leading-6 text-[#5E5E5E]">
                  Kami telah mengirimkan tautan untuk mereset kata sandi ke <strong>{email}</strong>. Silakan cek email Anda.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/masuk"
                  className="block w-full rounded-full bg-[#A94438] px-5 py-3 text-center text-base font-bold leading-6 tracking-[0.24px] text-white transition-colors hover:bg-[#8B3529] focus:outline-none focus:ring-2 focus:ring-[#A94438] focus:ring-offset-2"
                >
                  Kembali ke Halaman Masuk
                </Link>
                
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full text-center text-sm text-[#5E5E5E] underline hover:text-[#333333]"
                >
                  Tidak menerima email? Kirim ulang
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative hidden flex-1 lg:flex">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2062&auto=format&fit=crop')",
          }}
        />
        <div 
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background: 'linear-gradient(0deg, rgba(169, 68, 56, 0.50) 0%, rgba(243, 185, 95, 0.30) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative flex flex-1 flex-col justify-end p-12">
          <blockquote className="text-2xl font-semibold italic leading-8 text-white">
            "Budaya adalah jembatan yang menghubungkan masa lalu, masa kini, dan masa depan."
          </blockquote>
        </div>
      </div>
    </div>
  );
}
