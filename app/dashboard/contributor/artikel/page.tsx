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

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  category_id?: number;
  category_rel?: {
    id: number;
    name: string;
    slug: string;
  };
  author_id: number;
  author?: {
    id: number;
    name?: string;
    full_name?: string;
    email?: string;
  };
  status: string;
  rejection_reason?: string;
  published_at?: string;
  created_at: string;
  reading_time?: number;
  tags?: string;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  status: string;
  published_at: string;
  tags: string;
  reading_time: string;
}

export default function ArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    status: 'draft',
    published_at: '',
    tags: '',
    reading_time: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchArticles();
    }
  }, [page, search, user?.id]);

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

  const fetchArticles = async () => {
    if (!user?.id) {
      console.log('User ID not available yet');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(
        `/api/articles?page=${page}&limit=10&search=${search}&author_id=${user.id}`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      
      // API mengembalikan { articles, pagination } bukan { success, data }
      if (data.articles) {
        setArticles(data.articles);
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (data.success && data.data) {
        // Fallback untuk format lama
        setArticles(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category_id: '',
      status: 'draft',
      published_at: '',
      tags: '',
      reading_time: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleAdd = () => {
    resetForm();
    setIsEditMode(false);
    setSelectedArticle(null);
    setShowFormModal(true);
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      featured_image: article.featured_image || '',
      category_id: article.category_id?.toString() || '',
      status: article.status || 'draft',
      published_at: article.published_at || '',
      tags: article.tags || '',
      reading_time: article.reading_time?.toString() || ''
    });
    setImagePreview(article.featured_image || '');
    setSelectedArticle(article);
    setIsEditMode(true);
    setShowFormModal(true);
  };

  const handleDetail = (article: Article) => {
    setSelectedArticle(article);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (article: Article) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    
    if (!user?.id) {
      alert('User tidak ditemukan. Silakan login kembali.');
      return;
    }
    
    setFormLoading(true);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
      
      // Upload image if new file selected
      let imageUrl = formData.featured_image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: imageUrl,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        tags: formData.tags,
        read_time: formData.reading_time ? parseInt(formData.reading_time) : null,
        status: isEditMode ? formData.status : 'draft',
        author_id: user.id
      };
      
      const url = isEditMode 
        ? `/api/admin/articles/${selectedArticle?.id}`
        : '/api/admin/articles';
      
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
        alert(isEditMode ? 'Artikel berhasil diupdate' : 'Artikel berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchArticles();
      } else {
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    
    setFormLoading(true);
    try {
      const response = await fetch(`/api/admin/articles/${selectedArticle.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Artikel berhasil dihapus');
        setShowDeleteDialog(false);
        setSelectedArticle(null);
        fetchArticles();
      } else {
        alert(data.error || 'Gagal menghapus artikel');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Terjadi kesalahan saat menghapus artikel');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Kelola Artikel</h1>
          <p className="text-gray-600 mt-1">Manage artikel dan konten edukatif</p>
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
          Tulis Artikel
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
            placeholder="Cari artikel..."
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
                  Judul
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Penulis
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="inline-block w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada artikel
                  </td>
                </tr>
              ) : (
                articles.map((article, index) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {article.featured_image && (
                          <img src={article.featured_image} alt={article.title} className="w-16 h-12 object-cover rounded-lg" />
                        )}
                        <div className="flex-1 max-w-sm">
                          <p className="font-semibold text-[#1A1A1A] line-clamp-1">{article.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{article.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-lg">
                        {article.category_rel?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {article.author?.full_name || article.author?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-lg font-medium ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : article.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {article.status === 'published' ? 'Diterima' : article.status === 'draft' ? 'Menunggu' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDetail(article)}
                        className="inline-block px-4 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Detail
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(article)}
                        className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        Edit
                      </motion.button>
                      {(user?.role === 'admin' || article.author_id === user?.id) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(article)}
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
        title={isEditMode ? 'Edit Artikel' : 'Tulis Artikel Baru'}
        size="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Featured Image Upload */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📷</span>
              Featured Image
            </h3>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, featured_image: '' }));
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">📝</span>
              Informasi Artikel
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Contoh: Mengenal Lebih Dekat Tari Saman"
                />
              </div>

              <div>
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
                  placeholder="mengenal-lebih-dekat-tari-saman"
                />
              </div>

              <div className="grid grid-cols-1">
                <div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Baca (menit)
                  </label>
                  <input
                    type="number"
                    name="reading_time"
                    value={formData.reading_time}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                    placeholder="5"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                    placeholder="budaya, tari, saman (pisahkan dengan koma)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Ringkasan) *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Ringkasan singkat artikel (maksimal 200 karakter)"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/200 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten Artikel *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  required
                  rows={12}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all font-mono text-sm"
                  placeholder="Tulis konten artikel di sini... (Markdown supported)"
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
                <>{isEditMode ? '💾 Update Artikel' : '✨ Publish Artikel'}</>
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
          setSelectedArticle(null);
        }}
        title="Detail Artikel"
        size="3xl"
      >
        {selectedArticle && (
          <div className="space-y-6">
            {selectedArticle.featured_image && (
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={selectedArticle.featured_image} 
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-bold">{selectedArticle.title}</h3>
                  {selectedArticle.reading_time && (
                    <p className="text-sm mt-1 opacity-90">⏱️ {selectedArticle.reading_time} menit baca</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-600 font-medium mb-1">Excerpt</p>
                <p className="text-gray-900">{selectedArticle.excerpt}</p>
              </div>

              <div className="col-span-2 bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-green-600 font-medium mb-2">Konten</p>
                <div className="text-gray-900 prose prose-sm max-w-none whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Kategori</p>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                  {selectedArticle.category_rel?.name || '-'}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 text-sm rounded-lg font-medium ${
                  selectedArticle.status === 'published' ? 'bg-green-100 text-green-700' :
                  selectedArticle.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedArticle.status === 'published' ? 'Diterima' : selectedArticle.status === 'draft' ? 'Menunggu' : 'Ditolak'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Penulis</p>
                <p className="font-semibold text-gray-900">✍️ {selectedArticle.author?.full_name || selectedArticle.author?.name || '-'}</p>
              </div>

              {selectedArticle.tags && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Dibuat</p>
                <p className="text-gray-900">{new Date(selectedArticle.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>

              {selectedArticle.published_at && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dipublish</p>
                  <p className="text-gray-900">{new Date(selectedArticle.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </div>
              )}
            </div>

            {/* Rejection Reason */}
            {selectedArticle.status === 'archive' && selectedArticle.rejection_reason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#DC2626"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 mb-1">Alasan Penolakan</p>
                    <p className="text-red-800 text-sm">{selectedArticle.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-6 border-t">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedArticle(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Tutup
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedArticle);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                ✏️ Edit Artikel
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
          setSelectedArticle(null);
        }}
        title="⚠️ Hapus Artikel"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hapus "{selectedArticle?.title}"?
            </h3>
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          {selectedArticle && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                {selectedArticle.featured_image && (
                  <img 
                    src={selectedArticle.featured_image} 
                    alt={selectedArticle.title} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{selectedArticle.title}</p>
                  <p className="text-sm text-gray-600">{selectedArticle.category_rel?.name || 'No category'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedArticle(null);
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
