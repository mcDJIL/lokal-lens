'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import FormModal from '@/components/ui/FormModal';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface CultureImage {
  id?: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

interface Culture {
  id: number;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  long_description?: string;
  meaning?: string;
  province: string;
  city: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category_id?: number;
  category_rel?: {
    id: number;
    name: string;
    slug: string;
  };
  status: string;
  is_endangered: boolean;
  thumbnail?: string;
  map_embed_url?: string;
  created_at: string;
  images?: CultureImage[];
}

interface FormData {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  long_description: string;
  meaning: string;
  category_id: string;
  location: string;
  province: string;
  city: string;
  latitude: string;
  longitude: string;
  status: string;
  is_endangered: boolean;
  thumbnail: string;
  map_embed_url: string;
}

export default function CulturesListPage() {
  const { user } = useAuth();
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState<Culture | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Image upload states
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<CultureImage[]>([]);
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    long_description: '',
    meaning: '',
    category_id: '',
    location: '',
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    status: 'published',
    is_endangered: false,
    thumbnail: '',
    map_embed_url: ''
  });

  useEffect(() => {
    fetchCultures();
    fetchCategories();
  }, [page, search]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?type=culture');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCultures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/cultures?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setCultures(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching cultures:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      subtitle: '',
      description: '',
      long_description: '',
      meaning: '',
      category_id: '',
      location: '',
      province: '',
      city: '',
      latitude: '',
      longitude: '',
      status: 'published',
      is_endangered: false,
      thumbnail: '',
      map_embed_url: ''
    });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  const handleAdd = () => {
    resetForm();
    setIsEditMode(false);
    setSelectedCulture(null);
    setShowFormModal(true);
  };

  const handleEdit = (culture: Culture) => {
    setFormData({
      name: culture.name || '',
      slug: culture.slug || '',
      subtitle: culture.subtitle || '',
      description: culture.description || '',
      long_description: culture.long_description || '',
      meaning: culture.meaning || '',
      category_id: culture.category_id?.toString() || '',
      location: culture.location || '',
      province: culture.province || '',
      city: culture.city || '',
      latitude: culture.latitude?.toString() || '',
      longitude: culture.longitude?.toString() || '',
      status: culture.status || 'draft',
      is_endangered: culture.is_endangered || false,
      thumbnail: culture.thumbnail || '',
      map_embed_url: culture.map_embed_url || ''
    });
    setThumbnailPreview(culture.thumbnail || '');
    setExistingImages(culture.images || []);
    setSelectedCulture(culture);
    setIsEditMode(true);
    setShowFormModal(true);
  };

  const handleDetail = (culture: Culture) => {
    setSelectedCulture(culture);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (culture: Culture) => {
    setSelectedCulture(culture);
    setShowDeleteDialog(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Auto-generate slug from name
    if (name === 'name' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Upload thumbnail if new file selected
      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile);
      }
      
      // Upload new images
      const newImageUrls = await Promise.all(
        imageFiles.map(file => uploadImage(file))
      );
      
      const submitData = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        thumbnail: thumbnailUrl,
        images: [
          ...existingImages,
          ...newImageUrls.map((url, index) => ({
            image_url: url,
            alt_text: formData.name,
            is_primary: false,
            display_order: existingImages.length + index
          }))
        ]
      };
      
      const url = isEditMode 
        ? `/api/admin/cultures/${selectedCulture?.id}`
        : '/api/admin/cultures';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditMode ? 'Budaya berhasil diupdate' : 'Budaya berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchCultures();
      } else {
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error saving culture:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCulture) return;
    
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/cultures/${selectedCulture.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Budaya berhasil dihapus');
        setShowDeleteDialog(false);
        setSelectedCulture(null);
        fetchCultures();
      } else {
        alert(data.error || 'Gagal menghapus budaya');
      }
    } catch (error) {
      console.error('Error deleting culture:', error);
      alert('Terjadi kesalahan saat menghapus budaya');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (culture: Culture, newStatus: string) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/cultures/${culture.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        const statusText = newStatus === 'published' ? 'dipublish' : newStatus === 'archive' ? 'diarsipkan' : 'diubah ke draft';
        alert(`Budaya berhasil ${statusText}`);
        setShowDetailModal(false);
        setSelectedCulture(null);
        fetchCultures();
      } else {
        alert(data.error || 'Gagal mengubah status budaya');
      }
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Terjadi kesalahan saat mengubah status');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Kelola Budaya</h1>
          <p className="text-gray-600 mt-1">Manage budaya lokal Indonesia</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="px-6 py-2.5 bg-[#D4A017] text-white rounded-xl font-semibold hover:bg-[#B38B12] transition-colors flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
          </svg>
          Tambah Budaya
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
          </svg>
          <input
            type="text"
            placeholder="Cari budaya..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="inline-block w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : cultures.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                cultures.map((culture, index) => (
                  <motion.tr
                    key={culture.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {culture.thumbnail && (
                          <img src={culture.thumbnail} alt={culture.name} className="w-12 h-12 object-cover rounded-lg" />
                        )}
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{culture.name}</p>
                          {culture.is_endangered && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                              Terancam Punah
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {culture.city}, {culture.province}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg capitalize">
                        {culture.category_rel?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-lg capitalize ${
                          culture.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : culture.status === 'draft'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {culture.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDetail(culture)}
                        className="inline-block px-4 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Detail
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(culture)}
                        className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        Edit
                      </motion.button>
                      {user?.role === 'admin' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(culture)}
                          className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          Hapus
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </motion.button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </motion.button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          resetForm();
        }}
        title={isEditMode ? 'Edit Budaya' : 'Tambah Budaya Baru'}
        size="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6" id="culture-form">
          {/* Thumbnail Upload */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📷</span>
              Thumbnail
            </h3>
            <div className="flex items-start gap-4">
              {thumbnailPreview && (
                <div className="relative">
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview('');
                      setFormData(prev => ({ ...prev, thumbnail: '' }));
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                    </svg>
                  </motion.button>
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Gallery Images Upload */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">🖼️</span>
              Galeri Gambar
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar (Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              />
            </div>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Gambar Tersimpan ({existingImages.length})</p>
                <div className="grid grid-cols-4 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.image_url} alt={img.alt_text} className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeExistingImage(img.id!)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                        </svg>
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images Preview */}
            {imagePreviews.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Gambar Baru ({imagePreviews.length})</p>
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`New ${index}`} className="w-full h-24 object-cover rounded-lg border-2 border-green-200" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                        </svg>
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Informasi Dasar */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">📝</span>
              Informasi Dasar
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Budaya *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Contoh: Tari Reog Ponorogo"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="tari-reog-ponorogo"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Tarian Mistis dari Gerbang Timur Jawa"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Singkat *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Deskripsi singkat tentang budaya ini..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Lengkap
                </label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Deskripsi lengkap dan detail..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Makna & Filosofi
                </label>
                <textarea
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Makna dan filosofi dari budaya ini..."
                />
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">📍</span>
              Lokasi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Jawa Timur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Ponorogo"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Lengkap *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Ponorogo, Jawa Timur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="-7.8753"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="111.4644"
                />
              </div>
            </div>
          </div>

          {/* Detail Lainnya */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">⚙️</span>
              Detail Lainnya
            </h3>
            
            <div className="grid grid-cols-1">
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="is_endangered"
                      checked={formData.is_endangered}
                      onChange={handleFormChange}
                      className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                    🚨 Budaya Terancam Punah
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps Embed URL
                </label>
                <textarea
                  name="map_embed_url"
                  value={formData.map_embed_url}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all font-mono text-xs"
                  placeholder="https://www.google.com/maps/embed?pb=!1m18..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowFormModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </motion.button>
            <motion.button
              type="submit"
              disabled={formLoading}
              whileHover={{ scale: formLoading ? 1 : 1.02 }}
              whileTap={{ scale: formLoading ? 1 : 0.98 }}
              className="flex-1 px-4 py-3 bg-[#D4A017] text-white rounded-xl font-semibold hover:bg-[#B38B12] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>{isEditMode ? '💾 Simpan Perubahan' : '✨ Tambah Budaya'}</>
              )}
            </motion.button>
          </div>
        </form>
      </FormModal>

      {/* Detail Modal */}
      <FormModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCulture(null);
        }}
        title="Detail Budaya"
        size="3xl"
      >
        {selectedCulture && (
          <div className="space-y-6">
            {selectedCulture.thumbnail && (
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={selectedCulture.thumbnail} 
                  alt={selectedCulture.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-bold">{selectedCulture.name}</h3>
                  {selectedCulture.subtitle && (
                    <p className="text-sm mt-1 opacity-90">{selectedCulture.subtitle}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Gallery */}
            {selectedCulture.images && selectedCulture.images.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-purple-600">🖼️</span> Galeri ({selectedCulture.images.length})
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {selectedCulture.images.map((img, idx) => (
                    <img key={idx} src={img.image_url} alt={img.alt_text} className="w-full h-24 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer" />
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-600 font-medium mb-1">Deskripsi</p>
                <p className="text-gray-900">{selectedCulture.description}</p>
              </div>

              {selectedCulture.long_description && (
                <div className="col-span-2 bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-green-600 font-medium mb-1">Deskripsi Lengkap</p>
                  <p className="text-gray-900">{selectedCulture.long_description}</p>
                </div>
              )}

              {selectedCulture.meaning && (
                <div className="col-span-2 bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-purple-600 font-medium mb-1">Makna & Filosofi</p>
                  <p className="text-gray-900">{selectedCulture.meaning}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Kategori</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                  {selectedCulture.category_rel?.name || '-'}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg font-semibold ${
                  selectedCulture.status === 'active' ? 'bg-green-100 text-green-700' :
                  selectedCulture.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedCulture.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Provinsi</p>
                <p className="font-semibold text-gray-900">📍 {selectedCulture.province}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Kota</p>
                <p className="font-semibold text-gray-900">🏙️ {selectedCulture.city}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Terancam Punah</p>
                <span className={`inline-block px-3 py-1 rounded-lg font-semibold ${
                  selectedCulture.is_endangered ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {selectedCulture.is_endangered ? '🚨 Ya' : '✅ Tidak'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Dibuat</p>
                <p className="text-gray-900">{new Date(selectedCulture.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEdit(selectedCulture)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
                Edit
              </motion.button>
              {selectedCulture.status !== 'archive' && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange(selectedCulture, 'archive')}
                  disabled={formLoading}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" fill="currentColor"/>
                  </svg>
                  Arsipkan
                </motion.button>
              )}
              {selectedCulture.status === 'archive' && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange(selectedCulture, 'published')}
                  disabled={formLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
                  </svg>
                  Publish
                </motion.button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDeleteClick(selectedCulture)}
                disabled={formLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
                Hapus
              </motion.button>
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <FormModal
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedCulture(null);
        }}
        title="⚠️ Hapus Budaya"
        size="md"
      >
        <div className="space-y-6">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hapus "{selectedCulture?.name}"?
            </h3>
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus budaya ini? Semua data termasuk gambar galeri akan terhapus. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          {/* Preview Card */}
          {selectedCulture && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                {selectedCulture.thumbnail && (
                  <img 
                    src={selectedCulture.thumbnail} 
                    alt={selectedCulture.name} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{selectedCulture.name}</p>
                  <p className="text-sm text-gray-600">{selectedCulture.city}, {selectedCulture.province}</p>
                  {selectedCulture.images && selectedCulture.images.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {selectedCulture.images.length} foto galeri akan ikut terhapus
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedCulture(null);
              }}
              disabled={formLoading}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Batal
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: formLoading ? 1 : 1.02 }}
              whileTap={{ scale: formLoading ? 1 : 0.98 }}
              onClick={handleDelete}
              disabled={formLoading}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menghapus...
                </>
              ) : (
                <>
                  🗑️ Ya, Hapus
                </>
              )}
            </motion.button>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
