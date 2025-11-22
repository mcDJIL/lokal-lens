import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/quizzes - Get all published quizzes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    const whereClause: any = {
      status: 'published',
    };

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      whereClause.difficulty = difficulty;
    }

    const quizzes = await prisma.quiz.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        category: true,
        difficulty: true,
        time_limit: true,
        total_questions: true,
        created_at: true,
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: quizzes.map((quiz) => ({
        ...quiz,
        total_attempts: quiz._count.attempts,
      })),
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
