'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/lib/auth/AuthContext';

interface User {
  id: number;
  full_name: string;
  profile: {
    avatar: string | null;
  } | null;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
  replies?: Comment[];
}

interface ArticleDiscussionProps {
  article: {
    id: number;
    comments: Comment[];
    _count: {
      comments: number;
    };
  };
}

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 30) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID');
};

export default function ArticleDiscussion({ article }: ArticleDiscussionProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(article.comments);
  const [commentCount, setCommentCount] = useState(article._count.comments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || isSubmitting) return;

    // If user is not logged in, show login modal
    if (!isLoading && !user) {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/articles/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: article.id,
          content: commentText.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentCount(commentCount + 1);
        setCommentText('');
      } else if (response.status === 401) {
        // Server says unauthenticated — show login modal
        setShowLoginModal(true);
      } else {
        alert('Gagal mengirim komentar. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // If user is not logged in, show login modal
    if (!isLoading && !user) {
      setIsSubmitting(false);
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch('/api/articles/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: article.id,
          content: replyText.trim(),
          parent_id: parentId,
        }),
      });

      if (response.ok) {
        const newReply = await response.json();
        // Update comments to include the new reply
        setComments(comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        }));
        setCommentCount(commentCount + 1);
        setReplyText('');
        setReplyToId(null);
      } else if (response.status === 401) {
        setShowLoginModal(true);
      } else {
        alert('Gagal mengirim balasan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-[896px] mx-auto px-4 py-8 border-t border-[#EAEAEA]">
      {/* Section Title */}
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-[#333] font-[family-name:var(--font-newsreader)] text-2xl sm:text-[30px] font-bold leading-9 mb-6"
      >
        Diskusi ({commentCount} Komentar)
      </motion.h2>

      {/* Comments List */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="flex flex-col gap-6 mb-8"
      >
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div 
              key={comment.id} 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-4"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {comment.user.profile?.avatar ? (
                  <Image
                    src={comment.user.profile.avatar}
                    alt={comment.user.full_name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#C1A36F] text-white font-bold">
                    {comment.user.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
                {/* Comment Header */}
                <div className="flex justify-between items-center">
                  <h4 className="text-[#333] font-[family-name:var(--font-newsreader)] text-base font-bold leading-6">
                    {comment.user.full_name}
                  </h4>
                  <span className="text-[#6B7280] font-[family-name:var(--font-noto-sans)] text-xs leading-4">
                    {getTimeAgo(comment.created_at)}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-[#374151] font-[family-name:var(--font-noto-sans)] text-sm leading-5">
                  {comment.content}
                </p>

                {/* Reply Button */}
                <button
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                  className="self-start text-[#C1A36F] hover:text-[#a08d5f] font-[family-name:var(--font-noto-sans)] text-sm font-semibold transition-colors"
                >
                  {replyToId === comment.id ? 'Batal' : 'Balas'}
                </button>

                {/* Reply Form */}
                {replyToId === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex gap-2"
                  >
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tulis balasan Anda..."
                      disabled={isSubmitting}
                      className="flex-1 min-h-[80px] px-3 py-2 rounded-lg border border-[#EAEAEA] bg-white text-[#374151] font-[family-name:var(--font-noto-sans)] text-sm placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C1A36F] focus:border-transparent resize-none disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyText.trim() || isSubmitting}
                      className="self-end px-4 py-2 rounded-lg bg-[#C1A36F] hover:bg-[#a08d5f] text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '...' : 'Kirim'}
                    </button>
                  </motion.div>
                )}

                {/* Replies (if any) */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                          {reply.user.profile?.avatar ? (
                            <Image
                              src={reply.user.profile.avatar}
                              alt={reply.user.full_name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#C1A36F] text-white text-xs font-bold">
                              {reply.user.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="text-[#333] font-[family-name:var(--font-noto-sans)] text-sm font-semibold">
                              {reply.user.full_name}
                            </h5>
                            <span className="text-[#6B7280] font-[family-name:var(--font-noto-sans)] text-xs">
                              {getTimeAgo(reply.created_at)}
                            </span>
                          </div>
                          <p className="text-[#374151] font-[family-name:var(--font-noto-sans)] text-sm">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Comment Form */}
      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4"
      >
        {/* Textarea */}
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Tulis komentar Anda..."
          disabled={isSubmitting}
          className="w-full min-h-[120px] px-4 py-4 rounded-lg border border-[#EAEAEA] bg-white text-[#374151] font-[family-name:var(--font-noto-sans)] text-sm leading-5 placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#E57373] focus:border-transparent resize-y disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!commentText.trim() || isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="self-start px-6 py-2.5 rounded-full bg-[#E57373] hover:bg-[#d86565] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-white text-center font-[family-name:var(--font-noto-sans)] text-sm font-bold leading-[21px] tracking-[0.21px]">
            {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
          </span>
        </motion.button>
      </motion.form>
      {/* Login required modal */}
      <ConfirmDialog
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={() => {
          const next = typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname + window.location.search) : '/artikel';
          router.push(`/masuk?next=${next}`);
        }}
        title="Perlu Login"
        message="Anda harus login untuk mengirim komentar atau balasan."
        confirmText="Login"
        cancelText="Batal"
        type="info"
        loading={false}
      />
    </section>
  );
}
