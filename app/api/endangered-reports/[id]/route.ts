import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get single report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reportId = parseInt(id);

    const report = await prisma.endangeredReport.findUnique({
      where: { id: reportId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, message: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch report' + error },
      { status: 500 }
    );
  }
}

// PATCH - Update report status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reportId = parseInt(id);
    const body = await request.json();
    
    const { status, admin_notes, reviewed_by } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const report = await prisma.endangeredReport.update({
      where: { id: reportId },
      data: {
        status,
        admin_notes,
        reviewed_by: reviewed_by ? parseInt(reviewed_by) : null,
        reviewed_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Report status updated successfully',
      data: report,
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update report' },
      { status: 500 }
    );
  }
}

// DELETE - Delete report (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reportId = parseInt(id);

    await prisma.endangeredReport.delete({
      where: { id: reportId },
    });

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
