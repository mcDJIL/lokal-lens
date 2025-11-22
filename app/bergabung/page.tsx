'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import ContributorSuccessModal from '@/components/ui/ContributorSuccessModal';

export default function BergabungPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    expertise: [] as string[],
    reason: ''
  });

  // Auto-fill form if user is logged in but not a contributor
  useEffect(() => {
    if (user && user.role !== 'contributor') {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      }));
    }
  }, [user]);

  const expertiseOptions = [
    'Seni Tari',
    'Musik Tradisional',
    'Bahasa Daerah',
    'Kuliner',
    'Kerajinan',
    'Upacara Adat',
    'Arsitektur',
    'Pakaian Adat',
    'Sastra'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleExpertiseChange = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Skip password validation if user is already logged in
    const isExistingUser = user && user.role !== 'contributor';
    
    if (!isExistingUser) {
      if (formData.password !== formData.confirmPassword) {
        setError('Kata sandi dan konfirmasi kata sandi tidak cocok');
        return;
      }
      
      if (!formData.password || formData.password.length < 8) {
        setError('Kata sandi minimal 8 karakter');
        return;
      }
    }

    if (formData.expertise.length === 0) {
      setError('Pilih minimal satu bidang keahlian');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody: any = {
        fullName: formData.fullName,
        email: formData.email,
        culturalInterest: formData.expertise.join(', '),
        reason: formData.reason
      };

      // Only include password for new user registration (not for existing logged-in users)
      if (!isExistingUser) {
        requestBody.password = formData.password;
      }

      const response = await fetch('/api/bergabung', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Pendaftaran gagal. Silakan coba lagi.');
        return;
      }

      // Show verification pending modal instead of redirecting
      setShowVerificationModal(true);

    } catch (err) {
      setError('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.85) 50%, rgba(254, 243, 232, 0.95) 100%), url('https://images.unsplash.com/photo-1555400082-1b6c609eaf98?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Main Container */}
        <div className="relative min-h-screen flex flex-col">
          {/* Content */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-7xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            >
              <div className="grid lg:grid-cols-2 min-h-[868px]">
                {/* Left Side - Benefits */}
                <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 p-8 lg:p-16 lg:rounded-l-2xl overflow-hidden">
                  {/* Gradient Overlays */}
                  <div 
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      background: `
                        radial-gradient(141.42% 141.42% at 100% 100%, rgba(212, 160, 23, 0.00) 20%, rgba(212, 160, 23, 0.15) 20%, rgba(212, 160, 23, 0.15) 30%, rgba(212, 160, 23, 0.00) 30%),
                        radial-gradient(141.42% 141.42% at 0% 0%, rgba(212, 160, 23, 0.00) 20%, rgba(212, 160, 23, 0.15) 20%, rgba(212, 160, 23, 0.15) 30%, rgba(212, 160, 23, 0.00) 30%),
                        radial-gradient(141.42% 141.42% at 100% 0%, rgba(0, 108, 132, 0.00) 20%, rgba(0, 108, 132, 0.12) 20%, rgba(0, 108, 132, 0.12) 30%, rgba(0, 108, 132, 0.00) 30%),
                        radial-gradient(141.42% 141.42% at 0% 100%, rgba(0, 108, 132, 0.00) 20%, rgba(0, 108, 132, 0.12) 20%, rgba(0, 108, 132, 0.12) 30%, rgba(0, 108, 132, 0.00) 30%),
                        linear-gradient(45deg, rgba(192, 57, 43, 0.00) 48%, rgba(192, 57, 43, 0.12) 48%, rgba(192, 57, 43, 0.12) 52%, rgba(192, 57, 43, 0.00) 52%),
                        linear-gradient(135deg, rgba(192, 57, 43, 0.00) 48%, rgba(192, 57, 43, 0.12) 48%, rgba(192, 57, 43, 0.12) 52%, rgba(192, 57, 43, 0.00) 52%)
                      `
                    }}
                  />

                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <h2 className="text-gray-900 font-bold text-[30px] leading-9 tracking-[-0.75px]">
                        Bergabung dalam Misi<br />Pelestarian Budaya
                      </h2>
                      <p className="text-gray-600 text-base leading-[26px]">
                        Setiap cerita, foto, dan karya Anda adalah bagian dari mozaik kekayaan Nusantara yang tak ternilai.
                      </p>
                    </motion.div>

                    {/* Benefits Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4 mt-10"
                    >
                      <h3 className="text-gray-900 font-bold text-xl leading-7">
                        Manfaat Menjadi Kontributor
                      </h3>
                      <div className="space-y-5">
                        {/* Benefit 1 */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-md">
                            <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.0101 23.7222C10.6652 23.7222 9.40127 23.467 8.2184 22.9565C7.03553 22.4461 6.00659 21.7534 5.13159 20.8784C4.25659 20.0034 3.56388 18.9745 3.05347 17.7916C2.54305 16.6087 2.28784 15.3449 2.28784 13.9999C2.28784 12.655 2.54305 11.3911 3.05347 10.2083C3.56388 9.02541 4.25659 7.99647 5.13159 7.12147C6.00659 6.24647 7.03553 5.55376 8.2184 5.04335C9.40127 4.53293 10.6652 4.27772 12.0101 4.27772C13.355 4.27772 14.6189 4.53293 15.8017 5.04335C16.9846 5.55376 18.0135 6.24647 18.8885 7.12147C19.7635 7.99647 20.4562 9.02541 20.9667 10.2083C21.4771 11.3911 21.7323 12.655 21.7323 13.9999C21.7323 15.3449 21.4771 16.6087 20.9667 17.7916C20.4562 18.9745 19.7635 20.0034 18.8885 20.8784C18.0135 21.7534 16.9846 22.4461 15.8017 22.9565C14.6189 23.467 13.355 23.7222 12.0101 23.7222ZM11.0378 21.7291V19.8333C10.5031 19.8333 10.0454 19.6429 9.66458 19.2621C9.28379 18.8813 9.0934 18.4236 9.0934 17.8888V16.9166L4.42673 12.2499C4.37812 12.5416 4.33356 12.8333 4.29305 13.1249C4.25254 13.4166 4.23229 13.7083 4.23229 13.9999C4.23229 15.9606 4.87638 17.6782 6.16458 19.1527C7.45277 20.6273 9.07719 21.4861 11.0378 21.7291ZM17.7462 19.2499C18.4105 18.5208 18.9169 17.7065 19.2653 16.8072C19.6137 15.9079 19.7878 14.9722 19.7878 13.9999C19.7878 12.412 19.3463 10.9618 18.4632 9.64925C17.5801 8.33675 16.4013 7.38883 14.9267 6.8055V7.19439C14.9267 7.72911 14.7363 8.18687 14.3556 8.56765C13.9748 8.94844 13.517 9.13883 12.9823 9.13883H11.0378V11.0833C11.0378 11.3587 10.9447 11.5896 10.7583 11.776C10.572 11.9623 10.3411 12.0555 10.0656 12.0555H8.12118V13.9999H13.9545C14.23 13.9999 14.4609 14.0931 14.6472 14.2795C14.8336 14.4658 14.9267 14.6967 14.9267 14.9722V17.8888H15.899C16.3202 17.8888 16.701 18.0144 17.0413 18.2656C17.3816 18.5167 17.6165 18.8449 17.7462 19.2499Z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-gray-900 font-semibold text-base leading-6">
                              Eksposur Global
                            </h4>
                            <p className="text-gray-600 text-sm leading-5">
                              Karyamu akan dilihat oleh ribuan pencinta budaya di seluruh dunia.
                            </p>
                          </div>
                        </motion.div>

                        {/* Benefit 2 */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-md">
                            <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.3328 14.0002C9.87914 14.0002 9.50646 13.83 9.21479 13.4897C8.92312 13.1495 8.8178 12.7525 8.89882 12.2988L9.19048 10.5488C9.32011 9.85201 9.64824 9.28083 10.1749 8.83523C10.7015 8.38963 11.3132 8.16683 12.0099 8.16683C12.7229 8.16683 13.3427 8.38963 13.8693 8.83523C14.3959 9.28083 14.724 9.85201 14.8537 10.5488L15.1453 12.2988C15.2264 12.7525 15.121 13.1495 14.8294 13.4897C14.5377 13.83 14.165 14.0002 13.7113 14.0002H10.3328ZM10.9162 12.0557H13.128L12.9335 10.8647C12.9011 10.6379 12.7958 10.4556 12.6176 10.3179C12.4393 10.1801 12.2368 10.1113 12.0099 10.1113C11.7831 10.1113 11.5846 10.1801 11.4144 10.3179C11.2443 10.4556 11.143 10.6379 11.1106 10.8647L10.9162 12.0557ZM3.35715 14.9481C2.98447 14.9643 2.66444 14.8914 2.39708 14.7293C2.12972 14.5673 1.95553 14.3161 1.87451 13.9759C1.8421 13.83 1.834 13.6842 1.85021 13.5384C1.86641 13.3925 1.90692 13.2548 1.97173 13.1252C1.97173 13.1414 1.96363 13.109 1.94743 13.0279C1.91502 12.9955 1.834 12.8011 1.70437 12.4446C1.67197 12.2502 1.69627 12.0638 1.77729 11.8856C1.85831 11.7073 1.96363 11.5534 2.09326 11.4238C2.09326 11.4238 2.10947 11.4076 2.14187 11.3752C2.17428 11.0673 2.29986 10.808 2.51861 10.5974C2.73736 10.3867 3.00877 10.2814 3.33285 10.2814C3.38146 10.2814 3.53539 10.3138 3.79465 10.3786C3.79465 10.3786 3.81896 10.3705 3.86757 10.3543C3.94859 10.2733 4.05391 10.2125 4.18354 10.172C4.31317 10.1315 4.4509 10.1113 4.59673 10.1113C4.77497 10.1113 4.93296 10.1396 5.07069 10.1963C5.20842 10.2531 5.3178 10.3381 5.39882 10.4516C5.41502 10.4516 5.42717 10.4556 5.43528 10.4637C5.44338 10.4718 5.45553 10.4759 5.47173 10.4759C5.69859 10.4921 5.89708 10.5609 6.06722 10.6825C6.23736 10.804 6.36294 10.9701 6.44396 11.1807C6.47636 11.2941 6.48852 11.4035 6.48041 11.5088C6.47231 11.6142 6.45206 11.7154 6.41965 11.8127C6.41965 11.8289 6.42775 11.8613 6.44396 11.9099C6.55738 12.0233 6.6465 12.1489 6.71132 12.2866C6.77613 12.4244 6.80854 12.5661 6.80854 12.712C6.80854 12.7768 6.75993 12.9469 6.66271 13.2224C6.6465 13.2548 6.6465 13.2872 6.66271 13.3196C6.66271 13.3196 6.67891 13.4492 6.71132 13.7085C6.71132 14.0488 6.56953 14.3404 6.28597 14.5835C6.00241 14.8266 5.65808 14.9481 5.25298 14.9481H3.35715ZM19.7877 14.9724C19.253 14.9724 18.7952 14.782 18.4144 14.4012C18.0337 14.0204 17.8433 13.5627 17.8433 13.0279C17.8433 12.8335 17.8716 12.6512 17.9283 12.4811C17.985 12.3109 18.062 12.1448 18.1592 11.9828L17.4787 11.3752C17.3166 11.2455 17.2883 11.0835 17.3936 10.8891C17.4989 10.6946 17.6488 10.5974 17.8433 10.5974H19.7877C20.3224 10.5974 20.7802 10.7878 21.161 11.1686C21.5418 11.5494 21.7322 12.0071 21.7322 12.5418V13.0279C21.7322 13.5627 21.5418 14.0204 21.161 14.4012C20.7802 14.782 20.3224 14.9724 19.7877 14.9724ZM0.343262 19.8335V18.3022C0.343262 17.5893 0.703794 17.0181 1.42486 16.5887C2.14592 16.1593 3.08169 15.9446 4.23215 15.9446C4.4428 15.9446 4.64535 15.9487 4.83979 15.9568C5.03423 15.9649 5.22058 15.9851 5.39882 16.0175C5.17197 16.3416 5.00183 16.69 4.8884 17.0627C4.77497 17.4353 4.71826 17.8323 4.71826 18.2536V19.8335H0.343262ZM6.1766 19.8335V18.2536C6.1766 17.2004 6.71537 16.3497 7.79291 15.7016C8.87046 15.0534 10.2761 14.7293 12.0099 14.7293C13.7599 14.7293 15.1697 15.0534 16.2391 15.7016C17.3085 16.3497 17.8433 17.2004 17.8433 18.2536V19.8335H6.1766ZM19.7877 15.9446C20.9544 15.9446 21.8942 16.1593 22.6072 16.5887C23.3201 17.0181 23.6766 17.5893 23.6766 18.3022V19.8335H19.3016V18.2536C19.3016 17.8323 19.2489 17.4353 19.1436 17.0627C19.0383 16.69 18.8803 16.3416 18.6697 16.0175C18.8479 15.9851 19.0302 15.9649 19.2165 15.9568C19.4029 15.9487 19.5933 15.9446 19.7877 15.9446ZM12.0099 16.6738C11.0863 16.6738 10.2599 16.7953 9.53076 17.0384C8.80159 17.2814 8.3722 17.565 8.24257 17.8891H15.8016C15.6558 17.565 15.2223 17.2814 14.5012 17.0384C13.7802 16.7953 12.9497 16.6738 12.0099 16.6738Z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-gray-900 font-semibold text-base leading-6">
                              Jaringan Komunitas
                            </h4>
                            <p className="text-gray-600 text-sm leading-5">
                              Terhubung dengan sesama pegiat budaya, sejarawan, dan seniman.
                            </p>
                          </div>
                        </motion.div>

                        {/* Benefit 3 */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0 shadow-md">
                            <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.8157 11.0832L17.6004 8.40961L14.9268 7.19434L17.6004 5.97906L18.8157 3.30545L20.031 5.97906L22.7046 7.19434L20.031 8.40961L18.8157 11.0832ZM18.8157 24.6943L17.6004 22.0207L14.9268 20.8054L17.6004 19.5902L18.8157 16.9166L20.031 19.5902L22.7046 20.8054L20.031 22.0207L18.8157 24.6943ZM9.09345 21.7777L6.6629 16.4304L1.31567 13.9999L6.6629 11.5693L9.09345 6.22211L11.524 11.5693L16.8712 13.9999L11.524 16.4304L9.09345 21.7777ZM9.09345 17.0624L10.0657 14.9721L12.156 13.9999L10.0657 13.0277L9.09345 10.9374L8.12123 13.0277L6.03095 13.9999L8.12123 14.9721L9.09345 17.0624Z" fill="white"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-gray-900 font-semibold text-base leading-6">
                              Akses Eksklusif
                            </h4>
                            <p className="text-gray-600 text-sm leading-5">
                              Dapatkan undangan ke acara, pameran, dan workshop khusus.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="bg-white p-8 lg:p-16 lg:rounded-r-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-lg mx-auto"
                  >
                    <div className="space-y-2 mb-8">
                      {user && user.role !== 'contributor' && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            ✨ Lengkapi pendaftaran kontributor Anda
                          </p>
                        </div>
                      )}
                      <h1 className="text-gray-900 font-bold text-4xl leading-10 tracking-[-0.9px]">
                        Daftar Kontributor
                      </h1>
                      <p className="text-gray-500 text-base leading-[26px]">
                        Isi detail di bawah untuk memulai perjalanan Anda.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name and Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block text-gray-700 text-sm font-medium leading-5 mb-2">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nama Anda"
                            required
                            className="w-full h-[50px] px-[13px] bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block text-gray-700 text-sm font-medium leading-5 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@anda.com"
                            required
                            className="w-full h-[50px] px-[13px] bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                          />
                        </motion.div>
                      </div>

                      {/* Password Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <label className="block text-gray-700 text-sm font-medium leading-5 mb-2">
                            Kata Sandi
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="••••••••"
                              required={!(user && user.role !== 'contributor')}
                              disabled={!!(user && user.role !== 'contributor')}
                              className="w-full h-[50px] px-[13px] pr-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <label className="block text-gray-700 text-sm font-medium leading-5 mb-2">
                            Konfirmasi Kata Sandi
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="••••••••"
                              required={!(user && user.role !== 'contributor')}
                              disabled={!!(user && user.role !== 'contributor')}
                              className="w-full h-[50px] px-[13px] pr-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </div>

                      {/* Expertise */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-1"
                      >
                        <label className="block text-gray-700 text-sm font-medium leading-5">
                          Keahlian / Bidang Minat Budaya
                        </label>
                        <p className="text-gray-500 text-xs leading-4">
                          Pilih minimal satu bidang keahlian.
                        </p>
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          {expertiseOptions.map((option, index) => (
                            <motion.label
                              key={option}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 + index * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center gap-3 p-[13px] bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={formData.expertise.includes(option)}
                                onChange={() => handleExpertiseChange(option)}
                                className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 focus:ring-2"
                              />
                              <span className="text-gray-700 text-sm leading-5">
                                {option}
                              </span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>

                      {/* Reason */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="pb-2"
                      >
                        <label className="block text-gray-700 text-sm font-medium leading-5 mb-2">
                          Alasan ingin menjadi kontributor
                        </label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          placeholder="Ceritakan motivasi dan semangat Anda dalam melestarikan budaya..."
                          required
                          rows={5}
                          className="w-full px-[13px] py-[13px] bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"
                        />
                      </motion.div>

                      {/* Error/Success Messages */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <p className="text-sm text-red-600">{error}</p>
                          </motion.div>
                        )}
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <p className="text-sm text-green-600">{success}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        className="w-full h-14 bg-[#C0392B] rounded-lg text-white font-bold text-lg leading-7 shadow-lg hover:bg-[#A63527] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
                      </motion.button>

                      {/* Terms */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex justify-center items-center flex-wrap gap-1 text-xs leading-4 text-center"
                      >
                        <span className="text-gray-500">Dengan mendaftar, Anda menyetujui</span>
                        <Link href="#" className="text-amber-600 font-semibold hover:underline">
                          Syarat & Ketentuan
                        </Link>
                        <span className="text-gray-500">dan</span>
                        <Link href="#" className="text-amber-600 font-semibold hover:underline">
                          Kebijakan Privasi
                        </Link>
                        <span className="text-gray-500">kami.</span>
                      </motion.div>

                      {/* Sign In Link */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="flex justify-center items-center gap-1 text-sm leading-5"
                      >
                        <span className="text-gray-500">Sudah punya akun?</span>
                        <Link href="/masuk" className="text-gray-900 font-bold hover:underline">
                          Masuk di sini
                        </Link>
                      </motion.div>
                    </form>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Verification Pending Modal */}
      <ContributorSuccessModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
}
