import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/quizzes/[slug]/start - Start a new quiz attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { userId } = body; // Optional, can be null for guest users

    // Find quiz
    const quiz = await prisma.quiz.findUnique({
      where: {
        slug: slug,
        status: 'published',
      },
      select: {
        id: true,
        total_questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get total points
    const questions = await prisma.quizQuestion.findMany({
      where: { quiz_id: quiz.id },
      select: { points: true },
    });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quiz_id: quiz.id,
        user_id: userId || null,
        total_points: totalPoints,
      },
    });

    // Get questions with options
    const quizQuestions = await prisma.quizQuestion.findMany({
      where: { quiz_id: quiz.id },
      select: {
        id: true,
        question: true,
        image_url: true,
        order_number: true,
        points: true,
        options: {
          select: {
            id: true,
            option_text: true,
            order_number: true,
          },
          orderBy: {
            order_number: 'asc',
          },
        },
      },
      orderBy: {
        order_number: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        questions: quizQuestions,
        totalPoints: totalPoints,
      },
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start quiz' },
      { status: 500 }
    );
  }
}
