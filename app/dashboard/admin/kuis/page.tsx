'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import FormModal from '@/components/ui/FormModal';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface QuizOption {
  id?: number;
  option_text: string;
  is_correct: boolean;
  order_number: number;
}

interface QuizQuestion {
  id?: number;
  question: string;
  image_url?: string;
  explanation?: string;
  display_order: number;
  options: QuizOption[];
}

interface Quiz {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  category_id?: number;
  status?: string;
  category_rel?: {
    id: number;
    name: string;
    slug: string;
  };
  difficulty: string;
  passing_score: number;
  time_limit?: number;
  is_active: boolean;
  created_at: string;
  questions?: QuizQuestion[];
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category_id: string;
  difficulty: string;
  time_limit: string;
  status: string;
}

export default function QuizzesPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Image upload states
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  // Questions state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionImages, setQuestionImages] = useState<Map<number, File>>(new Map());
  const [questionImagePreviews, setQuestionImagePreviews] = useState<Map<number, string>>(new Map());
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    category_id: '',
    difficulty: 'easy',
    time_limit: '',
    status: 'published',
  });

  useEffect(() => {
    fetchQuizzes();
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

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/quizzes?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setQuizzes(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      thumbnail: '',
      category_id: '',
      difficulty: 'easy',
      time_limit: '',
      status: 'published',
    });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setQuestions([]);
    setQuestionImages(new Map());
    setQuestionImagePreviews(new Map());
  };

  const handleAdd = () => {
    resetForm();
    // Add one default question
    addQuestion();
    setIsEditMode(false);
    setSelectedQuiz(null);
    setShowFormModal(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setFormData({
      title: quiz.title || '',
      slug: quiz.slug || '',
      description: quiz.description || '',
      thumbnail: quiz.thumbnail || '',
      category_id: quiz.category_id?.toString() || '',
      difficulty: quiz.difficulty || 'easy',
      time_limit: quiz.time_limit?.toString() || '',
      status: quiz.status || 'published',
    });
    setThumbnailPreview(quiz.thumbnail || '');
    
    // Load existing questions
    if (quiz.questions && quiz.questions.length > 0) {
      setQuestions(quiz.questions.map(q => ({
        ...q,
        options: q.options.sort((a, b) => a.order_number - b.order_number)
      })));
      
      // Load question image previews
      const previews = new Map<number, string>();
      quiz.questions.forEach((q, idx) => {
        if (q.image_url) {
          previews.set(idx, q.image_url);
        }
      });
      setQuestionImagePreviews(previews);
    } else {
      addQuestion(); // Add default question if none exist
    }
    
    setSelectedQuiz(quiz);
    setIsEditMode(true);
    setShowFormModal(true);
  };

  const handleDetail = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
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
    
    // Auto-generate slug from title
    if (name === 'title' && !isEditMode) {
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

  // Question Management
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      question: '',
      image_url: '',
      explanation: '',
      display_order: questions.length + 1,
      options: [
        { option_text: '', is_correct: false, order_number: 1 },
        { option_text: '', is_correct: false, order_number: 2 },
        { option_text: '', is_correct: false, order_number: 3 },
        { option_text: '', is_correct: false, order_number: 4 }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    // Remove associated image
    const newImages = new Map(questionImages);
    newImages.delete(index);
    setQuestionImages(newImages);
    const newPreviews = new Map(questionImagePreviews);
    newPreviews.delete(index);
    setQuestionImagePreviews(newPreviews);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, field: keyof QuizOption, value: any) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      [field]: value
    };
    
    // If marking as correct, unmark others
    if (field === 'is_correct' && value === true) {
      updated[questionIndex].options.forEach((opt, idx) => {
        if (idx !== optionIndex) {
          opt.is_correct = false;
        }
      });
    }
    
    setQuestions(updated);
  };

  const handleQuestionImageChange = (questionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = new Map(questionImages);
      newImages.set(questionIndex, file);
      setQuestionImages(newImages);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = new Map(questionImagePreviews);
        newPreviews.set(questionIndex, reader.result as string);
        setQuestionImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQuestionImage = (questionIndex: number) => {
    const newImages = new Map(questionImages);
    newImages.delete(questionIndex);
    setQuestionImages(newImages);
    
    const newPreviews = new Map(questionImagePreviews);
    newPreviews.delete(questionIndex);
    setQuestionImagePreviews(newPreviews);
    
    updateQuestion(questionIndex, 'image_url', '');
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

  const validateQuestions = (): boolean => {
    if (questions.length === 0) {
      alert('Tambahkan minimal 1 pertanyaan');
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.question.trim()) {
        alert(`Pertanyaan ${i + 1}: Teks pertanyaan tidak boleh kosong`);
        return false;
      }
      
      const hasCorrectAnswer = q.options.some(opt => opt.is_correct);
      if (!hasCorrectAnswer) {
        alert(`Pertanyaan ${i + 1}: Pilih minimal 1 jawaban yang benar`);
        return false;
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].option_text.trim()) {
          alert(`Pertanyaan ${i + 1}, Opsi ${j + 1}: Teks opsi tidak boleh kosong`);
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuestions()) {
      return;
    }
    
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Upload thumbnail if new file selected
      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile);
      }
      
      // Upload question images
      const processedQuestions = await Promise.all(
        questions.map(async (q, index) => {
          let imageUrl = q.image_url || '';
          
          if (questionImages.has(index)) {
            imageUrl = await uploadImage(questionImages.get(index)!);
          }
          
          return {
            question: q.question,
            image_url: imageUrl || null,
            explanation: q.explanation || null,
            order_number: index + 1,
            points: 100,
            options: q.options.map((opt, optIdx) => ({
              option_text: opt.option_text,
              is_correct: opt.is_correct,
              order_number: optIdx + 1
            }))
          };
        })
      );
      
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        thumbnail: thumbnailUrl,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        difficulty: formData.difficulty,
        time_limit: formData.time_limit ? parseInt(formData.time_limit) : null,
        status: formData.status,
        questions: processedQuestions
      };
      
      const url = isEditMode 
        ? `/api/admin/quizzes/${selectedQuiz?.id}`
        : '/api/admin/quizzes';
      
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
        alert(isEditMode ? 'Kuis berhasil diupdate' : 'Kuis berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchQuizzes();
      } else {
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuiz) return;
    
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/quizzes/${selectedQuiz.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Kuis berhasil dihapus');
        setShowDeleteDialog(false);
        setSelectedQuiz(null);
        fetchQuizzes();
      } else {
        alert(data.error || 'Gagal menghapus kuis');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Terjadi kesalahan saat menghapus kuis');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (quiz: Quiz, newStatus: string) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/quizzes/${quiz.id}`, {
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
        alert(`Kuis berhasil ${statusText}`);
        setShowDetailModal(false);
        setSelectedQuiz(null);
        fetchQuizzes();
      } else {
        alert(data.error || 'Gagal mengubah status kuis');
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
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Kelola Kuis</h1>
          <p className="text-gray-600 mt-1">Manage kuis interaktif budaya</p>
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
          Buat Kuis
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
            placeholder="Cari kuis..."
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
                  Tingkat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pertanyaan
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
              ) : quizzes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada kuis
                  </td>
                </tr>
              ) : (
                quizzes.map((quiz, index) => (
                  <motion.tr
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {quiz.thumbnail && (
                          <img src={quiz.thumbnail} alt={quiz.title} className="w-16 h-12 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A1A1A] line-clamp-1">{quiz.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{quiz.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg">
                        {quiz.category_rel?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-lg capitalize ${
                          quiz.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700'
                            : quiz.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="font-semibold">{quiz.questions?.length || 0}</span> soal
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-3 py-1 text-sm rounded-lg text-center capitalize ${
                            quiz.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : quiz.status === 'draft'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {quiz.status || 'draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDetail(quiz)}
                        className="inline-block px-4 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Detail
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(quiz)}
                        className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        Edit
                      </motion.button>
                      {user?.role === 'admin' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(quiz)}
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
        title={isEditMode ? 'Edit Kuis' : 'Buat Kuis Baru'}
        size="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Thumbnail Upload */}
          <div className="space-y-4 sticky top-0 bg-white z-10 pb-4 border-b">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📷</span>
              Thumbnail Kuis
            </h3>
            <div className="flex items-start gap-4">
              {thumbnailPreview && (
                <div className="relative">
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200" />
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

          {/* Informasi Kuis */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">📝</span>
              Informasi Kuis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Kuis *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Kuis: Kebudayaan Jawa Tengah"
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
                  placeholder="kuis-kebudayaan-jawa-tengah"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                  placeholder="Uji pengetahuan Anda tentang kebudayaan Jawa Tengah..."
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Kesulitan *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">❓</span>
                Pertanyaan Kuis ({questions.length})
              </h3>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addQuestion}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                </svg>
                Tambah Pertanyaan
              </motion.button>
            </div>

            <AnimatePresence>
              {questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-2 border-purple-200 rounded-xl p-6 space-y-4 bg-purple-50/30"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                      <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                        {qIndex + 1}
                      </span>
                      Pertanyaan {qIndex + 1}
                    </h4>
                    {questions.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeQuestion(qIndex)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Hapus pertanyaan"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                        </svg>
                      </motion.button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teks Pertanyaan *
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      required
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      placeholder="Apa nama tarian tradisional dari Solo?"
                    />
                  </div>

                  {/* Question Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Pertanyaan (Opsional)
                    </label>
                    {questionImagePreviews.has(qIndex) && (
                      <div className="relative inline-block mb-2">
                        <img 
                          src={questionImagePreviews.get(qIndex)} 
                          alt={`Question ${qIndex + 1}`} 
                          className="w-32 h-24 object-cover rounded-lg border-2 border-gray-200" 
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeQuestionImage(qIndex)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                          </svg>
                        </motion.button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQuestionImageChange(qIndex, e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Pilihan Jawaban * (Pilih yang benar)
                    </label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <input
                          type="radio"
                          checked={option.is_correct}
                          onChange={(e) => updateQuestionOption(qIndex, optIndex, 'is_correct', e.target.checked)}
                          className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 cursor-pointer"
                          name={`question-${qIndex}-correct`}
                        />
                        <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <input
                          type="text"
                          value={option.option_text}
                          onChange={(e) => updateQuestionOption(qIndex, optIndex, 'option_text', e.target.value)}
                          required
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                          placeholder={`Opsi ${String.fromCharCode(65 + optIndex)}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penjelasan Jawaban (Opsional)
                    </label>
                    <textarea
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                      placeholder="Jelaskan mengapa jawaban ini benar..."
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {questions.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
                <p className="mb-3">Belum ada pertanyaan</p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addQuestion}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                  </svg>
                  Tambah Pertanyaan Pertama
                </motion.button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-6 border-t sticky bottom-0 bg-white">
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
                <>{isEditMode ? '💾 Simpan Perubahan' : '✨ Buat Kuis'}</>
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
          setSelectedQuiz(null);
        }}
        title="Detail Kuis"
        size="3xl"
      >
        {selectedQuiz && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {selectedQuiz.thumbnail && (
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={selectedQuiz.thumbnail} 
                  alt={selectedQuiz.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-bold">{selectedQuiz.title}</h3>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-600 font-medium mb-1">Deskripsi</p>
                <p className="text-gray-900">{selectedQuiz.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Kategori</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                  {selectedQuiz.category_rel?.name || '-'}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Tingkat</p>
                <span className={`inline-block px-3 py-1 rounded-lg font-semibold capitalize ${
                  selectedQuiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  selectedQuiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedQuiz.difficulty}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Jumlah Pertanyaan</p>
                <p className="font-semibold text-gray-900">❓ {selectedQuiz.questions?.length || 0} soal</p>
              </div>
            </div>

            {/* Questions Preview */}
            {selectedQuiz.questions && selectedQuiz.questions.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">📋</span> Pratinjau Pertanyaan
                </h4>
                <div className="space-y-4">
                  {selectedQuiz.questions.map((q, idx) => (
                    <div key={idx} className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{q.question}</p>
                          {q.image_url && (
                            <img src={q.image_url} alt={`Question ${idx + 1}`} className="mt-2 w-40 h-28 object-cover rounded-lg" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 ml-10">
                        {q.options.sort((a, b) => a.order_number - b.order_number).map((opt, optIdx) => (
                          <div 
                            key={optIdx} 
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              opt.is_correct ? 'bg-green-100 border border-green-300' : 'bg-white border border-gray-200'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                              opt.is_correct ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-sm text-gray-900">{opt.option_text}</span>
                            {opt.is_correct && <span className="ml-auto text-green-600 text-xs font-semibold">✓ Benar</span>}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="mt-3 ml-10 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-600 font-semibold mb-1">💡 Penjelasan:</p>
                          <p className="text-sm text-gray-700">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-6 border-t">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEdit(selectedQuiz)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
                Edit
              </motion.button>
              {selectedQuiz.status !== 'archive' && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange(selectedQuiz, 'archive')}
                  disabled={formLoading}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" fill="currentColor"/>
                  </svg>
                  Arsipkan
                </motion.button>
              )}
              {selectedQuiz.status === 'archive' && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange(selectedQuiz, 'published')}
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
                onClick={() => handleDeleteClick(selectedQuiz)}
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
          setSelectedQuiz(null);
        }}
        title="⚠️ Hapus Kuis"
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
              Hapus "{selectedQuiz?.title}"?
            </h3>
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus kuis ini? Semua pertanyaan dan data terkait akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          {selectedQuiz && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                {selectedQuiz.thumbnail && (
                  <img 
                    src={selectedQuiz.thumbnail} 
                    alt={selectedQuiz.title} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{selectedQuiz.title}</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedQuiz.difficulty} • {selectedQuiz.category_rel?.name}</p>
                  {selectedQuiz.questions && selectedQuiz.questions.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {selectedQuiz.questions.length} pertanyaan akan ikut terhapus
                    </p>
                  )}
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
                setSelectedQuiz(null);
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
