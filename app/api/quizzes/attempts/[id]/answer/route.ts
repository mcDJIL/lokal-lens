import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/quizzes/attempts/[id]/answer - Submit an answer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attemptId = parseInt(id);
    const body = await request.json();
    const { questionId, optionId } = body;

    // Verify attempt exists
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    // Get the selected option and check if it's correct
    const option = await prisma.quizOption.findUnique({
      where: { id: optionId },
      select: {
        id: true,
        is_correct: true,
        question_id: true,
      },
    });

    if (!option) {
      return NextResponse.json(
        { success: false, error: 'Option not found' },
        { status: 404 }
      );
    }

    // Get correct option and explanation
    const correctOption = await prisma.quizOption.findFirst({
      where: {
        question_id: questionId,
        is_correct: true,
      },
      select: {
        id: true,
        option_text: true,
      },
    });

    const question = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      select: {
        explanation: true,
        points: true,
      },
    });

    // Save answer
    await prisma.quizAnswer.create({
      data: {
        attempt_id: attemptId,
        question_id: questionId,
        option_id: optionId,
        is_correct: option.is_correct,
      },
    });

    // Update attempt statistics
    const answers = await prisma.quizAnswer.findMany({
      where: { attempt_id: attemptId },
      select: {
        is_correct: true,
        question: {
          select: {
            points: true,
          },
        },
      },
    });

    const correctAnswers = answers.filter((a) => a.is_correct).length;
    const wrongAnswers = answers.filter((a) => !a.is_correct).length;
    const score = answers
      .filter((a) => a.is_correct)
      .reduce((sum, a) => sum + a.question.points, 0);

    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score: score,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
        percentage: (score / attempt.total_points) * 100,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        isCorrect: option.is_correct,
        correctOptionId: correctOption?.id,
        correctOptionText: correctOption?.option_text,
        explanation: question?.explanation,
        pointsEarned: option.is_correct ? question?.points : 0,
        currentScore: score,
      },
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
