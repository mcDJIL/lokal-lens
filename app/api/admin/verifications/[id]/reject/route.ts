import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth/utils';

const prisma = new PrismaClient();

// POST - Reject verification
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
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
        { success: false, error: 'Forbidden - Admin or Officer only' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { reason } = body;
    
    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      );
    }
    
    const contributorId = parseInt(params.id);
    
    // Check if contributor request exists
    const contributor = await prisma.contributor.findUnique({
      where: { id: contributorId },
      include: { user: true }
    });
    
    if (!contributor) {
      return NextResponse.json(
        { success: false, error: 'Contributor request not found' },
        { status: 404 }
      );
    }
    
    if (contributor.verification_status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Already rejected' },
        { status: 400 }
      );
    }
    
    // Delete contributor and update user role to 'user' in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete contributor record
      await tx.contributor.delete({
        where: { id: contributorId }
      });
      
      // Update user role back to 'user'
      const updatedUser = await tx.user.update({
        where: { id: contributor.user_id },
        data: { role: 'user' }
      });
      
      return updatedUser;
    });
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Verification rejected, contributor data deleted and user role reverted to user'
    });
  } catch (error: any) {
    console.error('Error rejecting verification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
