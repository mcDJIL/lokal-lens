import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth/utils';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('user_role')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token) as any;
    if (!decoded || (role !== 'admin' && role !== 'officer')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get current date and 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Total Users
    const totalUsers = await prisma.user.count();
    const usersLastMonth = await prisma.user.count({
      where: { created_at: { gte: thirtyDaysAgo } }
    });
    const usersPreviousMonth = await prisma.user.count({
      where: { 
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // User by Role
    const userByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    // Total Content (Cultures + Articles + Quizzes)
    const totalCultures = await prisma.culture.count();
    const totalArticles = await prisma.article.count();
    const totalQuizzes = await prisma.quiz.count();
    const totalContent = totalCultures + totalArticles + totalQuizzes;

    const culturesLastMonth = await prisma.culture.count({
      where: { created_at: { gte: thirtyDaysAgo } }
    });
    const articlesLastMonth = await prisma.article.count({
      where: { created_at: { gte: thirtyDaysAgo } }
    });
    const quizzesLastMonth = await prisma.quiz.count({
      where: { created_at: { gte: thirtyDaysAgo } }
    });
    const contentLastMonth = culturesLastMonth + articlesLastMonth + quizzesLastMonth;

    const culturesPreviousMonth = await prisma.culture.count({
      where: { 
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });
    const articlesPreviousMonth = await prisma.article.count({
      where: { 
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });
    const quizzesPreviousMonth = await prisma.quiz.count({
      where: { 
        created_at: { 
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });
    const contentPreviousMonth = culturesPreviousMonth + articlesPreviousMonth + quizzesPreviousMonth;

    // Pending Review
    const pendingCultures = await prisma.culture.count({
      where: { status: 'draft' }
    });
    const pendingArticles = await prisma.article.count({
      where: { status: 'draft' }
    });
    const pendingQuizzes = await prisma.quiz.count({
      where: { status: 'draft' }
    });
    const pendingReview = pendingCultures + pendingArticles + pendingQuizzes;

    // Reports
    const totalReports = await prisma.endangeredReport.count();
    const pendingReports = await prisma.endangeredReport.count({
      where: { status: 'pending' }
    });

    // Content by Status
    const publishedContent = await Promise.all([
      prisma.culture.count({ where: { status: 'published' } }),
      prisma.article.count({ where: { status: 'published' } }),
      prisma.quiz.count({ where: { status: 'published' } })
    ]);
    const draftContent = await Promise.all([
      prisma.culture.count({ where: { status: 'draft' } }),
      prisma.article.count({ where: { status: 'draft' } }),
      prisma.quiz.count({ where: { status: 'draft' } })
    ]);
    const archivedContent = await Promise.all([
      prisma.culture.count({ where: { status: 'archive' } }),
      prisma.article.count({ where: { status: 'archive' } }),
      prisma.quiz.count({ where: { status: 'archive' } })
    ]);

    // Quiz Attempts Stats
    const totalQuizAttempts = await prisma.quizAttempt.count();
    const avgQuizScore = await prisma.quizAttempt.aggregate({
      _avg: { score: true }
    });

    // Recent Activities (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentActivities = {
      newUsers: await prisma.user.count({
        where: { created_at: { gte: sevenDaysAgo } }
      }),
      newCultures: await prisma.culture.count({
        where: { created_at: { gte: sevenDaysAgo } }
      }),
      newArticles: await prisma.article.count({
        where: { created_at: { gte: sevenDaysAgo } }
      }),
      newQuizzes: await prisma.quiz.count({
        where: { created_at: { gte: sevenDaysAgo } }
      }),
      quizAttempts: await prisma.quizAttempt.count({
        where: { created_at: { gte: sevenDaysAgo } }
      })
    };

    // Top Contributors
    const topContributors = await prisma.user.findMany({
      where: { role: 'contributor' },
      include: {
        articles: { where: { status: 'published' } },
        _count: {
          select: {
            articles: { where: { status: 'published' } }
          }
        }
      },
      orderBy: {
        articles: { _count: 'desc' }
      },
      take: 5
    });

    // Monthly Growth Data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      const users = await prisma.user.count({
        where: {
          created_at: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });

      const content = await Promise.all([
        prisma.culture.count({
          where: { created_at: { gte: monthStart, lte: monthEnd } }
        }),
        prisma.article.count({
          where: { created_at: { gte: monthStart, lte: monthEnd } }
        }),
        prisma.quiz.count({
          where: { created_at: { gte: monthStart, lte: monthEnd } }
        })
      ]);

      monthlyData.push({
        month: monthStart.toLocaleString('id-ID', { month: 'short' }),
        users,
        content: content.reduce((a, b) => a + b, 0)
      });
    }

    // Calculate growth percentages
    const userGrowth = usersPreviousMonth === 0 ? 100 : 
      Math.round(((usersLastMonth - usersPreviousMonth) / usersPreviousMonth) * 100);
    
    const contentGrowth = contentPreviousMonth === 0 ? 100 :
      Math.round(((contentLastMonth - contentPreviousMonth) / contentPreviousMonth) * 100);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalContent,
        pendingReview,
        totalReports,
        pendingReports,
        userGrowth,
        contentGrowth,
        userByRole: userByRole.reduce((acc: any, item: any) => {
          acc[item.role] = item._count;
          return acc;
        }, {} as Record<string, number>),
        contentByStatus: {
          published: publishedContent.reduce((a, b) => a + b, 0),
          draft: draftContent.reduce((a, b) => a + b, 0),
          archive: archivedContent.reduce((a, b) => a + b, 0)
        },
        contentByType: {
          cultures: totalCultures,
          articles: totalArticles,
          quizzes: totalQuizzes
        },
        quizStats: {
          totalAttempts: totalQuizAttempts,
          averageScore: Math.round(avgQuizScore._avg.score || 0)
        },
        recentActivities,
        topContributors: topContributors.map(user => ({
          id: user.id,
          name: user.full_name,
          email: user.email,
          articlesCount: user._count.articles
        })),
        monthlyGrowth: monthlyData
      }
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
