import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth/utils';

const prisma = new PrismaClient();

// POST - Toggle article highlight (unset other highlights)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params;
    const articleId = parseInt(id);
    const body = await request.json();
    const { is_highlight } = body;
    
    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // If setting as highlight, unset all other highlights first
    if (is_highlight) {
      await prisma.article.updateMany({
        where: {
          is_highlight: true,
          id: { not: articleId }
        },
        data: {
          is_highlight: false
        }
      });
    }
    
    // Update this article's highlight status
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        is_highlight: is_highlight
      },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        category_rel: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: is_highlight 
        ? 'Article set as highlight successfully' 
        : 'Article highlight removed successfully'
    });
  } catch (error: any) {
    console.error('Error toggling article highlight:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
