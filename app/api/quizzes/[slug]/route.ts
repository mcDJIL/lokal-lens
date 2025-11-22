import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/quizzes/[slug] - Get quiz detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const quiz = await prisma.quiz.findUnique({
      where: {
        slug: slug,
        status: 'published',
      },
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
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...quiz,
        total_attempts: quiz._count.attempts,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz detail' },
      { status: 500 }
    );
  }
}
