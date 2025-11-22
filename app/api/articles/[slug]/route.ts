import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
              },
            },
          },
        },
        comments: {
          where: {
            parent_id: null, // Only top-level comments
          },
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    full_name: true,
                    profile: {
                      select: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                created_at: 'asc',
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.article.update({
      where: { id: article.id },
      data: { views: article.views + 1 },
    });

    // Get related articles (same category, exclude current)
    const relatedArticles = await prisma.article.findMany({
      where: {
        category_id: article.category_id,
        id: { not: article.id },
      },
      include: {
        author: {
          select: {
            full_name: true,
          },
        },
      },
      take: 3,
      orderBy: {
        views: 'desc',
      },
    });

    return NextResponse.json({
      article: {
        ...article,
        views: article.views + 1,
      },
      relatedArticles,
    });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
