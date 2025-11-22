import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const highlight = searchParams.get('highlight');
    const authorId = searchParams.get('author_id');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // If author_id is provided, show all statuses for that author (draft, published, archive)
    // Otherwise, only show published articles
    if (authorId) {
      where.author_id = parseInt(authorId);
    } else {
      where.status = 'published';
    }

    // Lookup category by slug if provided
    if (category && category !== 'semua') {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });
      if (categoryRecord) {
        where.category_id = categoryRecord.id;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (highlight === 'true') {
      where.is_highlight = true;
    }

    // Get articles with pagination
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              full_name: true,
              email: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
          category_rel: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          published_at: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
