'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ArticleContent from '@/components/sections/Artikel/ArticleContent';
import ArticleDiscussion from '@/components/sections/Artikel/ArticleDiscussion';
import RelatedArticles from '@/components/sections/Artikel/RelatedArticles';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  featured_image: string;
  read_time: number;
  views: number;
  published_at: string;
  author: {
    id: number;
    full_name: string;
    profile: {
      avatar: string | null;
      bio: string | null;
    } | null;
  };
  comments: any[];
  _count: {
    comments: number;
    bookmarks: number;
  };
}

interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featured_image: string;
  read_time: number;
  published_at: string;
  author: {
    full_name: string;
  };
}

export default function ArticleDetailPageWrapper() {
  return (
    <Suspense fallback={<div className="w-full bg-white min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1A36F]"></div></div>}>
      <ArticleDetailPage />
    </Suspense>
  );
}

function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/articles/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data.article);
          setRelatedArticles(data.relatedArticles);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1A36F]"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333] mb-2">Artikel tidak ditemukan</h1>
          <p className="text-[#6B7280]">Artikel yang Anda cari tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <ArticleContent article={article} />
      <ArticleDiscussion article={article} />
      <RelatedArticles articles={relatedArticles} />
    </div>
  );
}
