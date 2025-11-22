'use client';

import { useState, useEffect } from 'react';
import Toast from '@/components/ui/Toast';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export default function LaporBudayaTerancamPage() {
  const [formData, setFormData] = useState({
    namaBudaya: '',
    jenisAncaman: '',
    deskripsi: '',
    lokasi: '',
    nama: '',
    email: '',
    isAnonim: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.074847874595!2d106.82715!3d-6.1750999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTAnMzAuNCJTIDEwNsKwNDknMzcuNyJF!5e0!3m2!1sen!2sid!4v1234567890');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  // Update map when location changes
  useEffect(() => {
    if (formData.lokasi && formData.lokasi.length > 3) {
      const encodedLocation = encodeURIComponent(formData.lokasi);
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedLocation}&zoom=14`);
    }
  }, [formData.lokasi]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({ 
      ...prev, 
      isAnonim: isChecked,
      // Clear nama and email if anonymous
      ...(isChecked ? { nama: '', email: '' } : {})
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      if (file.size <= 10 * 1024 * 1024) { // 10MB max
        setSelectedFile(file);
        setErrors(prev => ({ ...prev, file: '' }));
      } else {
        setErrors(prev => ({ ...prev, file: 'Ukuran file maksimal 10MB' }));
      }
    } else {
      setErrors(prev => ({ ...prev, file: 'Format file tidak didukung' }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) { // 10MB max
        setSelectedFile(file);
        setErrors(prev => ({ ...prev, file: '' }));
      } else {
        setErrors(prev => ({ ...prev, file: 'Ukuran file maksimal 10MB' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaBudaya.trim()) {
      newErrors.namaBudaya = 'Nama budaya wajib diisi';
    }

    if (!formData.jenisAncaman) {
      newErrors.jenisAncaman = 'Jenis ancaman wajib dipilih';
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi wajib diisi';
    } else if (formData.deskripsi.trim().length < 20) {
      newErrors.deskripsi = 'Deskripsi minimal 20 karakter';
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi wajib diisi';
    }

    if (!formData.isAnonim) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Format email tidak valid';
      }
    }

    setErrors(newErrors);
    
    // Show validation toast if there are errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors);
      showToast(`❌ ${errorMessages[0]}`, 'error');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted!');
    console.log('Form data:', formData);

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setIsSubmitting(true);
    console.log('Starting submission...');

    try {
      let imageUrl = null;

      // Upload file if exists
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        showToast('📤 Mengunggah file...', 'info');
        
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/endangered-reports/upload', {
          method: 'POST',
          body: fileFormData,
        });

        console.log('Upload response status:', uploadResponse.status);
        const uploadData = await uploadResponse.json();
        console.log('Upload response data:', uploadData);
        
        if (uploadData.success) {
          imageUrl = uploadData.fileUrl;
          console.log('File uploaded successfully:', imageUrl);
          showToast('✅ File berhasil diunggah!', 'success');
        } else {
          console.error('File upload failed:', uploadData);
          showToast(`❌ Upload file gagal: ${uploadData.message}`, 'error');
        }
      }

      // Extract province and city from location
      const locationParts = formData.lokasi.split(',').map(s => s.trim());
      const city = locationParts.length > 0 ? locationParts[0] : formData.lokasi;
      const province = locationParts.length > 1 ? locationParts[1] : null;

      const reportPayload = {
        culture_name: formData.namaBudaya,
        threat_type: formData.jenisAncaman,
        description: formData.deskripsi,
        location: formData.lokasi,
        province,
        city,
        image_url: imageUrl,
        reporter_name: formData.isAnonim ? null : (formData.nama || null),
        reporter_email: formData.isAnonim ? null : (formData.email || null),
        is_anonymous: formData.isAnonim,
        user_id: null,
      };

      console.log('Submitting report:', reportPayload);

      // Submit report
      const reportResponse = await fetch('/api/endangered-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportPayload),
      });

      console.log('Report response status:', reportResponse.status);
      const reportData = await reportResponse.json();
      console.log('Report response data:', reportData);

      if (reportData.success) {
        console.log('Report submitted successfully!');
        showToast('✅ Laporan berhasil dikirim! Redirecting...', 'success');
        
        // Redirect to success page after showing toast
        setTimeout(() => {
          window.location.href = '/budaya-terancam/sukses';
        }, 1500);
      } else {
        console.error('Report submission failed:', reportData);
        showToast(`❌ Gagal mengirim laporan: ${reportData.message || 'Silakan coba lagi.'}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showToast(`❌ Terjadi kesalahan: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`, 'error');
    } finally {
      setIsSubmitting(false);
      console.log('Submission process completed');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <main className="w-full bg-white min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      {/* Hero Section */}
      <section className="w-full bg-white pt-8 md:pt-16 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
            <h1 className="text-[#1A1A1A] text-center font-black text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-[-1.584px] transition-all duration-300 hover:scale-105">
              Lapor Ancaman Budaya
            </h1>
            <div className="max-w-3xl mx-auto px-4 md:px-56">
              <p className="text-[#887D63] text-center text-base sm:text-lg leading-7 transition-opacity duration-300 hover:opacity-80">
                Bantu kami melestarikan warisan budaya dengan melaporkan ancaman yang Anda temukan.
                Partisipasi Anda sangat berarti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Form Section */}
            <div className="flex-1 w-full lg:max-w-[795px] animate-in slide-in-from-bottom-3 duration-500">
              <form onSubmit={handleSubmit} className="bg-white border border-[#E5E2DC] rounded-xl p-6 md:p-8 space-y-6 transition-all duration-300 hover:shadow-lg hover:border-[#D4A017]/30">
                {/* Nama Budaya & Jenis Ancaman */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label htmlFor="namaBudaya" className="block text-[#1A1A1A] font-medium text-base leading-6 transition-colors duration-200 group-focus-within:text-[#D4A017]">
                      Nama Budaya <span className="text-primary-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="namaBudaya"
                      name="namaBudaya"
                      value={formData.namaBudaya}
                      onChange={handleInputChange}
                      placeholder="Contoh: Tari Topeng Cirebon"
                      className={`w-full px-4 py-3 border rounded-lg text-base placeholder:text-[#887D63] focus:outline-none transition-all duration-200 ${
                        errors.namaBudaya 
                          ? 'border-primary-red focus:border-primary-red focus:ring-2 focus:ring-primary-red/20' 
                          : 'border-[#E5E2DC] focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20'
                      }`}
                    />
                    {errors.namaBudaya && (
                      <p className="text-primary-red text-sm mt-1 animate-in slide-in-from-top duration-300">{errors.namaBudaya}</p>
                    )}
                  </div>

                  <div className="space-y-2 group">
                    <label htmlFor="jenisAncaman" className="block text-[#1A1A1A] font-medium text-base leading-6 transition-colors duration-200 group-focus-within:text-[#D4A017]">
                      Jenis Ancaman <span className="text-primary-red">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="jenisAncaman"
                        name="jenisAncaman"
                        value={formData.jenisAncaman}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg text-base appearance-none bg-white focus:outline-none transition-all duration-200 cursor-pointer ${
                          errors.jenisAncaman 
                            ? 'border-primary-red focus:border-primary-red focus:ring-2 focus:ring-primary-red/20' 
                            : 'border-[#E5E2DC] focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20'
                        }`}
                      >
                        <option value="">Pilih jenis ancaman</option>
                        <option value="kerusakan-fisik">Kerusakan Fisik</option>
                        <option value="modernisasi">Modernisasi</option>
                        <option value="kelalaian">Kelalaian</option>
                        <option value="komersialisasi">Komersialisasi</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.20001 9.59961L12 14.3996L16.8 9.59961" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {errors.jenisAncaman && (
                      <p className="text-primary-red text-sm mt-1 animate-in slide-in-from-top duration-300">{errors.jenisAncaman}</p>
                    )}
                  </div>
                </div>

                {/* Deskripsi Detail Ancaman */}
                <div className="space-y-2 group">
                  <label htmlFor="deskripsi" className="block text-[#1A1A1A] font-medium text-base leading-6 transition-colors duration-200 group-focus-within:text-[#D4A017]">
                    Deskripsi Detail Ancaman <span className="text-primary-red">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Jelaskan secara rinci mengenai ancaman yang terjadi, termasuk waktu, pihak yang terlibat, dan dampaknya."
                    className={`w-full px-4 py-4 border rounded-lg text-base placeholder:text-[#887D63] focus:outline-none transition-all duration-200 resize-none ${
                      errors.deskripsi 
                        ? 'border-primary-red focus:border-primary-red focus:ring-2 focus:ring-primary-red/20' 
                        : 'border-[#E5E2DC] focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20'
                    }`}
                  />
                  <div className="flex justify-between items-center">
                    {errors.deskripsi && (
                      <p className="text-primary-red text-sm animate-in slide-in-from-top duration-300">{errors.deskripsi}</p>
                    )}
                    <p className={`text-sm ml-auto ${formData.deskripsi.length < 20 ? 'text-gray-400' : 'text-primary-green'}`}>
                      {formData.deskripsi.length} karakter
                    </p>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="space-y-2 group">
                  <label htmlFor="lokasi" className="block text-[#1A1A1A] font-medium text-base leading-6 transition-colors duration-200 group-focus-within:text-[#D4A017]">
                    Lokasi <span className="text-primary-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lokasi"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleInputChange}
                      placeholder="Masukkan kota atau alamat"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg text-base placeholder:text-[#887D63] focus:outline-none transition-all duration-200 ${
                        errors.lokasi 
                          ? 'border-primary-red focus:border-primary-red focus:ring-2 focus:ring-primary-red/20' 
                          : 'border-[#E5E2DC] focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20'
                      }`}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-transform duration-200 group-focus-within:scale-110">
                      <svg width="24" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.01 14.0004C12.5447 14.0004 13.0025 13.81 13.3833 13.4293C13.764 13.0485 13.9544 12.5907 13.9544 12.056C13.9544 11.5213 13.764 11.0635 13.3833 10.6827C13.0025 10.3019 12.5447 10.1115 12.01 10.1115C11.4753 10.1115 11.0175 10.3019 10.6367 10.6827C10.2559 11.0635 10.0655 11.5213 10.0655 12.056C10.0655 12.5907 10.2559 13.0485 10.6367 13.4293C11.0175 13.81 11.4753 14.0004 12.01 14.0004ZM12.01 21.1463C13.9868 19.3315 15.4533 17.6827 16.4093 16.2001C17.3653 14.7174 17.8433 13.4009 17.8433 12.2504C17.8433 10.4842 17.2802 9.03805 16.1541 7.91189C15.0279 6.78573 13.6466 6.22266 12.01 6.22266C10.3734 6.22266 8.99205 6.78573 7.86589 7.91189C6.73973 9.03805 6.17665 10.4842 6.17665 12.2504C6.17665 13.4009 6.65466 14.7174 7.61068 16.2001C8.5667 17.6827 10.0331 19.3315 12.01 21.1463ZM12.01 23.7227C9.40119 21.5027 7.45269 19.4408 6.1645 17.5369C4.87631 15.633 4.23221 13.8708 4.23221 12.2504C4.23221 9.81988 5.01404 7.88354 6.57769 6.44141C8.14135 4.99928 9.95212 4.27821 12.01 4.27821C14.0679 4.27821 15.8786 4.99928 17.4423 6.44141C19.0059 7.88354 19.7878 9.81988 19.7878 12.2504C19.7878 13.8708 19.1437 15.633 17.8555 17.5369C16.5673 19.4408 14.6188 21.5027 12.01 23.7227Z" fill="#887D63"/>
                      </svg>
                    </div>
                  </div>
                  {errors.lokasi && (
                    <p className="text-primary-red text-sm mt-1 animate-in slide-in-from-top duration-300">{errors.lokasi}</p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-[#1A1A1A] font-medium text-base leading-6">
                    Unggah Bukti (Foto/Video)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg bg-[#F9FAFB] transition-all duration-300 ${
                      isDragging 
                        ? 'border-[#D4A017] bg-[#D4A017]/5 scale-[1.02]' 
                        : selectedFile
                        ? 'border-primary-green bg-primary-green/5'
                        : 'border-[#E5E2DC] hover:border-[#D4A017]/50 hover:bg-[#F9FAFB]/80'
                    }`}
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <div className={`mb-3 transition-all duration-300 ${selectedFile ? 'scale-110 text-primary-green' : 'hover:scale-110'}`}>
                        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.75 34C7.475 34 5.53125 33.2125 3.91875 31.6375C2.30625 30.0625 1.5 28.1375 1.5 25.8625C1.5 23.9125 2.0875 22.175 3.2625 20.65C4.4375 19.125 5.975 18.15 7.875 17.725C8.5 15.425 9.75 13.5625 11.625 12.1375C13.5 10.7125 15.625 10 18 10C20.925 10 23.4062 11.0187 25.4438 13.0562C27.4813 15.0938 28.5 17.575 28.5 20.5C30.225 20.7 31.6563 21.4437 32.7938 22.7312C33.9313 24.0187 34.5 25.525 34.5 27.25C34.5 29.125 33.8438 30.7187 32.5313 32.0312C31.2188 33.3438 29.625 34 27.75 34H19.5C18.675 34 17.9688 33.7063 17.3813 33.1187C16.7938 32.5312 16.5 31.825 16.5 31V23.275L14.1 25.6L12 23.5L18 17.5L24 23.5L21.9 25.6L19.5 23.275V31H27.75C28.8 31 29.6875 30.6375 30.4125 29.9125C31.1375 29.1875 31.5 28.3 31.5 27.25C31.5 26.2 31.1375 25.3125 30.4125 24.5875C29.6875 23.8625 28.8 23.5 27.75 23.5H25.5V20.5C25.5 18.425 24.7688 16.6562 23.3063 15.1937C21.8438 13.7312 20.075 13 18 13C15.925 13 14.1563 13.7312 12.6938 15.1937C11.2313 16.6562 10.5 18.425 10.5 20.5H9.75C8.3 20.5 7.0625 21.0125 6.0375 22.0375C5.0125 23.0625 4.5 24.3 4.5 25.75C4.5 27.2 5.0125 28.4375 6.0375 29.4625C7.0625 30.4875 8.3 31 9.75 31H13.5V34H9.75Z" fill={selectedFile ? '#13EC5B' : '#887D63'}/>
                        </svg>
                      </div>
                      {!selectedFile ? (
                        <>
                          <p className="mb-2 text-[#887D63] text-sm leading-5 text-center">
                            <span className="font-semibold">Klik untuk mengunggah</span> atau seret dan lepas
                          </p>
                          <p className="text-[#887D63] text-xs leading-4">
                            PNG, JPG, MP4 (MAX. 10MB)
                          </p>
                        </>
                      ) : (
                        <div className="w-full max-w-md">
                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-primary-green shadow-sm animate-in scale-in duration-300">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                {selectedFile.type.startsWith('image/') ? (
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#13EC5B"/>
                                  </svg>
                                ) : (
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="#13EC5B"/>
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1A1A1A] truncate">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-[#887D63]">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                              }}
                              className="ml-3 flex-shrink-0 p-1 rounded-full hover:bg-red-50 transition-colors"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.file && (
                    <p className="text-primary-red text-sm mt-1 animate-in slide-in-from-top duration-300">{errors.file}</p>
                  )}
                </div>

                {/* Informasi Kontak */}
                <div className="pt-6 border-t border-[#E5E2DC] space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-[#1A1A1A] font-bold text-lg leading-7">
                      Informasi Kontak Anda (Opsional)
                    </h3>
                    <p className="text-[#887D63] text-sm leading-5">
                      Informasi ini hanya akan digunakan untuk verifikasi laporan jika diperlukan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                    <div className="space-y-2 group">
                      <label htmlFor="nama" className="block text-[#1A1A1A] font-medium text-base leading-6 transition-colors duration-200 group-focus-within:text-[#D4A017]">
                        Nama
                      </label>
                      <input
                        type="text"
                        id="nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        placeholder="Nama Anda"
                        disabled={formData.isAnonim}
                        className="w-full px-4 py-2.5 border border-[#E5E2DC] rounded-lg text-base placeholder:text-[#887D63] focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2 group">
                      <label htmlFor="email" className="block text-[#1A1A1A] font-medium text-base leading-6 transition-colors duration-200 group-focus-within:text-[#D4A017]">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@anda.com"
                        disabled={formData.isAnonim}
                        className={`w-full px-4 py-2.5 border rounded-lg text-base placeholder:text-[#887D63] focus:outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.email 
                            ? 'border-primary-red focus:border-primary-red focus:ring-2 focus:ring-primary-red/20' 
                            : 'border-[#E5E2DC] focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-primary-red text-sm mt-1 animate-in slide-in-from-top duration-300">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 group">
                    <input
                      type="checkbox"
                      id="isAnonim"
                      checked={formData.isAnonim}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 border border-[#E5E2DC] rounded bg-white focus:ring-2 focus:ring-[#D4A017]/20 transition-all duration-200 cursor-pointer text-[#D4A017]"
                    />
                    <label htmlFor="isAnonim" className="text-[#1A1A1A] text-sm leading-5 cursor-pointer select-none transition-colors duration-200 group-hover:text-[#D4A017]">
                      Kirim laporan ini secara anonim.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-10 py-4 bg-[#006C84] hover:bg-[#005566] text-white font-bold text-lg leading-7 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </span>
                    ) : (
                      'Kirim Laporan'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-[373px] space-y-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
              {/* Panduan Pelaporan */}
              <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 space-y-4 transition-all duration-300 hover:shadow-md hover:border-[#D4A017] hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path d="M11.9564 19.8247C12.2966 19.8247 12.5841 19.7073 12.8189 19.4724C13.0538 19.2376 13.1712 18.9501 13.1712 18.6099C13.1712 18.2698 13.0538 17.9823 12.8189 17.7474C12.5841 17.5126 12.2966 17.3952 11.9564 17.3952C11.6163 17.3952 11.3288 17.5126 11.094 17.7474C10.8591 17.9823 10.7417 18.2698 10.7417 18.6099C10.7417 18.9501 10.8591 19.2376 11.094 19.4724C11.3288 19.7073 11.6163 19.8247 11.9564 19.8247ZM11.0818 16.0832H12.8797C12.8797 15.5487 12.9404 15.1276 13.0619 14.8198C13.1834 14.5121 13.5276 14.091 14.0944 13.5565C14.5156 13.1354 14.8476 12.7345 15.0906 12.3539C15.3335 11.9732 15.455 11.5157 15.455 10.9812C15.455 10.0741 15.123 9.37767 14.4589 8.89176C13.7948 8.40585 13.0093 8.1629 12.1022 8.1629C11.179 8.1629 10.4299 8.40585 9.85489 8.89176C9.2799 9.37767 8.87903 9.96076 8.65227 10.641L10.2558 11.2727C10.3368 10.9812 10.519 10.6653 10.8024 10.3252C11.0859 9.98505 11.5191 9.81498 12.1022 9.81498C12.6205 9.81498 13.0093 9.95671 13.2684 10.2402C13.5276 10.5236 13.6571 10.8354 13.6571 11.1755C13.6571 11.4995 13.5599 11.8032 13.3656 12.0866C13.1712 12.3701 12.9283 12.6333 12.6367 12.8762C11.9241 13.5079 11.4867 13.9857 11.3248 14.3096C11.1628 14.6336 11.0818 15.2248 11.0818 16.0832ZM12.005 23.712C10.6607 23.712 9.39733 23.4569 8.21495 22.9467C7.03257 22.4365 6.00407 21.744 5.12943 20.8694C4.2548 19.9948 3.56238 18.9663 3.05217 17.7839C2.54197 16.6015 2.28687 15.3381 2.28687 13.9938C2.28687 12.6495 2.54197 11.3861 3.05217 10.2037C3.56238 9.02133 4.2548 7.99283 5.12943 7.11819C6.00407 6.24356 7.03257 5.55114 8.21495 5.04093C9.39733 4.53073 10.6607 4.27563 12.005 4.27563C13.3494 4.27563 14.6128 4.53073 15.7951 5.04093C16.9775 5.55114 18.006 6.24356 18.8806 7.11819C19.7553 7.99283 20.4477 9.02133 20.9579 10.2037C21.4681 11.3861 21.7232 12.6495 21.7232 13.9938C21.7232 15.3381 21.4681 16.6015 20.9579 17.7839C20.4477 18.9663 19.7553 19.9948 18.8806 20.8694C18.006 21.744 16.9775 22.4365 15.7951 22.9467C14.6128 23.4569 13.3494 23.712 12.005 23.712ZM12.005 21.7683C14.1754 21.7683 16.0138 21.0152 17.5201 19.5089C19.0264 18.0025 19.7796 16.1642 19.7796 13.9938C19.7796 11.8234 19.0264 9.98505 17.5201 8.47873C16.0138 6.97242 14.1754 6.21926 12.005 6.21926C9.83465 6.21926 7.99629 6.97242 6.48998 8.47873C4.98366 9.98505 4.2305 11.8234 4.2305 13.9938C4.2305 16.1642 4.98366 18.0025 6.48998 19.5089C7.99629 21.0152 9.83465 21.7683 12.005 21.7683Z" fill="#D4A017"/>
                  </svg>
                  <h3 className="text-[#1A1A1A] font-bold text-lg leading-7">
                    Panduan Pelaporan
                  </h3>
                </div>

                <ul className="space-y-3">
                  {[
                    'Pastikan laporan Anda berisi informasi yang faktual dan dapat diverifikasi.',
                    'Jelaskan ancaman secara spesifik, termasuk siapa, apa, kapan, dan di mana.',
                    'Sertakan bukti foto atau video yang relevan untuk memperkuat laporan Anda.',
                    'Hindari penggunaan bahasa yang bersifat opini atau provokatif.'
                  ].map((item, index) => (
                    <li 
                      key={index} 
                      className="flex gap-3 text-[#887D63] text-sm leading-5 transition-all duration-300 hover:translate-x-1 hover:text-[#1A1A1A]"
                    >
                      <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4A017] transition-all duration-300 group-hover:scale-150"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Peta Lokasi */}
              <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 space-y-4 transition-all duration-300 hover:shadow-md hover:border-[#D4A017] hover:-translate-y-1">
                <h3 className="text-[#1A1A1A] font-bold text-lg leading-7">
                  Peta Lokasi Ancaman
                </h3>
                <div className="w-full aspect-video bg-[#E5E7EB] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] relative group">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-gray-700 shadow-md">
                    📍 {formData.lokasi || 'Masukkan lokasi di form'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
