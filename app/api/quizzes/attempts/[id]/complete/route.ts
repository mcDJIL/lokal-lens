import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/quizzes/attempts/[id]/complete - Complete quiz attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attemptId = parseInt(id);
    const body = await request.json();
    const { timeTaken } = body; // in seconds

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          select: {
            title: true,
            slug: true,
            total_questions: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    // Update attempt as completed
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        completed_at: new Date(),
        time_taken: timeTaken,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        attemptId: updatedAttempt.id,
        score: updatedAttempt.score,
        totalPoints: updatedAttempt.total_points,
        correctAnswers: updatedAttempt.correct_answers,
        wrongAnswers: updatedAttempt.wrong_answers,
        percentage: updatedAttempt.percentage,
        timeTaken: updatedAttempt.time_taken,
        quizTitle: attempt.quiz.title,
        quizSlug: attempt.quiz.slug,
        totalQuestions: attempt.quiz.total_questions,
      },
    });
  } catch (error) {
    console.error('Error completing quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete quiz' },
      { status: 500 }
    );
  }
}

// GET /api/quizzes/attempts/[id]/complete - Get quiz result
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attemptId = parseInt(id);

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          select: {
            title: true,
            slug: true,
            thumbnail: true,
            total_questions: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                question: true,
                explanation: true,
                image_url: true,
                order_number: true,
              },
            },
            option: {
              select: {
                option_text: true,
                is_correct: true,
              },
            },
          },
          orderBy: {
            question: {
              order_number: 'asc',
            },
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    // Get correct options for each question
    const answersWithCorrectOption = await Promise.all(
      attempt.answers.map(async (answer) => {
        const correctOption = await prisma.quizOption.findFirst({
          where: {
            question_id: answer.question_id,
            is_correct: true,
          },
          select: {
            option_text: true,
          },
        });

        return {
          questionNumber: answer.question.order_number,
          question: answer.question.question,
          imageUrl: answer.question.image_url,
          isCorrect: answer.is_correct,
          userAnswer: answer.option.option_text,
          correctAnswer: correctOption?.option_text,
          explanation: answer.question.explanation,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        quizTitle: attempt.quiz.title,
        quizSlug: attempt.quiz.slug,
        quizThumbnail: attempt.quiz.thumbnail,
        score: attempt.score,
        totalPoints: attempt.total_points,
        correctAnswers: attempt.correct_answers,
        wrongAnswers: attempt.wrong_answers,
        percentage: attempt.percentage,
        timeTaken: attempt.time_taken,
        totalQuestions: attempt.quiz.total_questions,
        completedAt: attempt.completed_at,
        answers: answersWithCorrectOption,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz result' },
      { status: 500 }
    );
  }
}
