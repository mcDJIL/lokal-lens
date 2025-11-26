import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth/utils';

const prisma = new PrismaClient();

// GET - List all quizzes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        include: {
          category_rel: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true
            }
          },
          questions: {
            include: {
              options: {
                orderBy: {
                  order_number: 'asc'
                }
              }
            },
            orderBy: {
              order_number: 'asc'
            }
          }
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.quiz.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: quizzes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new quiz
export async function POST(request: NextRequest) {
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
    if (!decoded || (role !== 'admin' && role !== 'contributor')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const {
      title,
      slug,
      description,
      thumbnail,
      category_id,
      difficulty,
      status,
      questions
    } = body;
    
    // Check if slug already exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { slug }
    });
    
    if (existingQuiz) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }
    
    const quiz = await prisma.quiz.create({
      data: {
        title,
        slug,
        description,
        thumbnail,
        category_id: category_id || null,
        difficulty: difficulty || 'medium',
        status: status || 'draft',
        total_questions: questions?.length || 0,
        questions: questions ? {
          create: questions.map((q: any, index: number) => ({
            question: q.question,
            image_url: q.image_url,
            explanation: q.explanation,
            order_number: q.order_number || index + 1,
            points: q.points || 100,
            options: {
              create: q.options.map((opt: any, optIndex: number) => ({
                option_text: opt.option_text,
                is_correct: opt.is_correct || false,
                order_number: opt.order_number || optIndex + 1
              }))
            }
          }))
        } : undefined
      },
      include: {
        category_rel: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        },
        questions: {
          include: {
            options: {
              orderBy: {
                order_number: 'asc'
              }
            }
          },
          orderBy: {
            order_number: 'asc'
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: quiz,
      message: 'Quiz created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
