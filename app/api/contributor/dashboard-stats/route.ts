import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('user_role')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || role !== 'contributor' || typeof payload === 'string') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const userId = payload.userId as number;

    // Get contributor's content statistics
    const totalArticles = await prisma.article.count({
      where: { author_id: userId }
    });

    const publishedArticles = await prisma.article.count({
      where: { author_id: userId, status: 'published' }
    });

    const draftArticles = await prisma.article.count({
      where: { author_id: userId, status: 'draft' }
    });

    const rejectedArticles = await prisma.article.count({
      where: { author_id: userId, status: 'archive' }
    });

    // Get total views for all articles
    const articlesWithViews = await prisma.article.findMany({
      where: { author_id: userId },
      select: { views: true }
    });
    const totalViews = articlesWithViews.reduce((sum: number, a: { views: number }) => sum + a.views, 0);

    // Recent articles (last 5)
    const recentArticles = await prisma.article.findMany({
      where: { author_id: userId },
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        views: true,
        created_at: true,
        published_at: true
      }
    });

    // Monthly content creation (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      const articles = await prisma.article.count({
        where: {
          author_id: userId,
          created_at: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });
      
      const published = await prisma.article.count({
        where: {
          author_id: userId,
          status: 'published',
          created_at: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });
      
      monthlyData.push({
        month: monthStart.toLocaleDateString('id-ID', { month: 'short' }),
        articles,
        published
      });
    }

    // Status breakdown
    const statusBreakdown = [
      { status: 'published', label: 'Diterima', count: publishedArticles },
      { status: 'draft', label: 'Menunggu Review', count: draftArticles },
      { status: 'archive', label: 'Ditolak', count: rejectedArticles }
    ];

    // Calculate acceptance rate
    const totalReviewed = publishedArticles + rejectedArticles;
    const acceptanceRate = totalReviewed > 0 
      ? Math.round((publishedArticles / totalReviewed) * 100) 
      : 0;

    // Get recent 7 days activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentlyCreated = await prisma.article.count({
      where: {
        author_id: userId,
        created_at: { gte: sevenDaysAgo }
      }
    });

    const recentlyPublished = await prisma.article.count({
      where: {
        author_id: userId,
        status: 'published',
        published_at: { gte: sevenDaysAgo }
      }
    });

    // Get article views by month
    const articlesWithViewsByMonth = await prisma.article.groupBy({
      by: ['created_at'],
      where: { author_id: userId },
      _sum: { views: true }
    });

    // Top performing articles (by views)
    const topArticles = await prisma.article.findMany({
      where: { 
        author_id: userId,
        status: 'published'
      },
      take: 5,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        views: true,
        published_at: true,
        category_rel: {
          select: {
            name: true
          }
        }
      }
    });

    // Weekly comparison
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const thisWeekArticles = await prisma.article.count({
      where: {
        author_id: userId,
        created_at: { gte: sevenDaysAgo }
      }
    });

    const lastWeekArticles = await prisma.article.count({
      where: {
        author_id: userId,
        created_at: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    });

    const weeklyChange = lastWeekArticles === 0 
      ? (thisWeekArticles > 0 ? 100 : 0)
      : Math.round(((thisWeekArticles - lastWeekArticles) / lastWeekArticles) * 100);

    return NextResponse.json({
      success: true,
      data: {
        // Overview stats
        totalArticles,
        publishedArticles,
        draftArticles,
        rejectedArticles,
        totalViews,
        acceptanceRate,
        
        // Recent activity
        recentActivity: {
          created: recentlyCreated,
          published: recentlyPublished
        },
        
        // Weekly comparison
        weeklyStats: {
          thisWeek: thisWeekArticles,
          lastWeek: lastWeekArticles,
          change: weeklyChange
        },
        
        // Charts data
        monthlyTrend: monthlyData,
        statusBreakdown,
        topArticles,
        recentArticles
      }
    });

  } catch (error) {
    console.error('Error fetching contributor dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
