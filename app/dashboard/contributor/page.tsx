'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  rejectedArticles: number;
  totalViews: number;
  acceptanceRate: number;
  recentActivity: {
    created: number;
    published: number;
  };
  weeklyStats: {
    thisWeek: number;
    lastWeek: number;
    change: number;
  };
  monthlyTrend: Array<{
    month: string;
    articles: number;
    published: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    label: string;
    count: number;
  }>;
  topArticles: Array<{
    id: number;
    title: string;
    views: number;
    published_at: string;
    category_rel?: {
      name: string;
    };
  }>;
  recentArticles: Array<{
    id: number;
    title: string;
    status: string;
    views: number;
    created_at: string;
    published_at: string | null;
  }>;
}

export default function ContributorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/contributor/dashboard-stats', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'published': { bg: 'bg-green-100', text: 'text-green-700', label: 'Diterima' },
      'draft': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Review' },
      'archive': { bg: 'bg-red-100', text: 'text-red-700', label: 'Ditolak' }
    };
    return badges[status] || badges['draft'];
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat datang, {user?.name || 'Contributor'}!
        </h1>
        <p className="text-gray-600 mt-2">Pantau performa konten Anda</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardCard
          title="Total Artikel"
          value={stats.totalArticles.toString()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
            </svg>
          }
          trend={{ value: stats.weeklyStats.change, isPositive: stats.weeklyStats.change >= 0 }}
          color="blue"
        />
        
        <DashboardCard
          title="Diterima"
          value={stats.publishedArticles.toString()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg>
          }
          color="green"
        />
        
        <DashboardCard
          title="Menunggu Review"
          value={stats.draftArticles.toString()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          }
          color="yellow"
        />
        
        <DashboardCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
            </svg>
          }
          color="purple"
        />
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Acceptance Rate</h3>
            <svg className="w-6 h-6 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-primary-green mb-2">{stats.acceptanceRate}%</div>
          <p className="text-sm text-gray-500">Artikel yang diterima</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Minggu Ini</h3>
            <svg className="w-6 h-6 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-gray-800">{stats.weeklyStats.thisWeek}</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              stats.weeklyStats.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {stats.weeklyStats.change >= 0 ? '+' : ''}{stats.weeklyStats.change}%
            </span>
          </div>
          <p className="text-sm text-gray-500">Artikel dibuat</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">7 Hari Terakhir</h3>
            <svg className="w-6 h-6 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.recentActivity.created}</div>
              <p className="text-xs text-gray-500">Dibuat</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.recentActivity.published}</div>
              <p className="text-xs text-gray-500">Published</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Status Artikel</h2>
        <div className="space-y-4">
          {stats.statusBreakdown.map((item, index) => {
            const total = stats.totalArticles;
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            const colors = {
              published: { bg: 'bg-green-500', icon: '✓' },
              draft: { bg: 'bg-yellow-500', icon: '⏱' },
              archive: { bg: 'bg-red-500', icon: '✕' }
            };
            const color = colors[item.status as keyof typeof colors] || colors.draft;
            
            return (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${color.bg} rounded-full flex items-center justify-center text-white font-bold`}>
                      {color.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.count} artikel</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className={`h-full ${color.bg}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Monthly Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tren 6 Bulan Terakhir</h2>
        <div className="space-y-4">
          {stats.monthlyTrend.map((month, index) => {
            const maxValue = Math.max(...stats.monthlyTrend.map(m => m.articles));
            const percentage = maxValue > 0 ? (month.articles / maxValue) * 100 : 0;
            const publishedPercentage = month.articles > 0 ? (month.published / month.articles) * 100 : 0;
            
            return (
              <motion.div
                key={month.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-semibold text-gray-700 w-12">{month.month}</span>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${publishedPercentage}%` }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.05 }}
                        className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                        title={`${month.published} published`}
                      >
                        {month.published > 0 && month.published}
                      </motion.div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - publishedPercentage}%` }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.05 }}
                        className="bg-gray-300 flex items-center justify-center text-xs text-gray-700 font-semibold"
                        title={`${month.articles - month.published} draft/ditolak`}
                      >
                        {month.articles - month.published > 0 && (month.articles - month.published)}
                      </motion.div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-800 w-12 text-right">{month.articles}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Published</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-600">Draft/Ditolak</span>
          </div>
        </div>
      </motion.div>

      {/* Two Columns: Top Articles & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Top Artikel</h2>
          <div className="space-y-3">
            {stats.topArticles.slice(0, 5).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 + index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-green/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-green">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{article.title}</p>
                  <p className="text-xs text-gray-500">
                    {article.category_rel?.name || 'Uncategorized'} • {article.views.toLocaleString()} views
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Artikel Terbaru</h2>
          <div className="space-y-3">
            {stats.recentArticles.map((article, index) => {
              const badge = getStatusBadge(article.status);
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{article.title}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(article.created_at)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.a
          href="/dashboard/contributor/artikel"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-primary-green to-green-600 hover:from-primary-green/90 hover:to-green-600/90 text-white rounded-xl p-6 flex flex-col items-center gap-3 transition-all shadow-md hover:shadow-lg"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white"/>
          </svg>
          <span className="font-bold">Tulis Artikel Baru</span>
        </motion.a>

        <motion.a
          href="/dashboard/contributor/artikel"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 transition-all shadow-sm hover:shadow-md"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" fill="#1A1A1A"/>
          </svg>
          <span className="font-bold text-[#1A1A1A]">Kelola Artikel</span>
        </motion.a>

        <motion.a
          href="/profil"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 transition-all shadow-sm hover:shadow-md"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#1A1A1A"/>
          </svg>
          <span className="font-bold text-[#1A1A1A]">Profil Saya</span>
        </motion.a>
      </motion.div>
    </div>
  );
}
