import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all endangered reports with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const threatType = searchParams.get('threat_type') || '';
    const province = searchParams.get('province') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const userId = searchParams.get('user_id');

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { culture_name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    // Status filter
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status;
    }

    // Threat type filter
    if (threatType) {
      where.threat_type = { contains: threatType };
    }

    // Province filter
    if (province) {
      where.province = province;
    }

    // User filter (for checking own reports)
    if (userId) {
      where.user_id = parseInt(userId);
    }

    const [reports, totalCount] = await Promise.all([
      prisma.endangeredReport.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.endangeredReport.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching endangered reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST - Create new endangered report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      culture_name,
      threat_type,
      description,
      location,
      province,
      city,
      image_url,
      reporter_name,
      reporter_email,
      is_anonymous,
      user_id,
    } = body;

    // Validation
    if (!culture_name || !threat_type || !description || !location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const report = await prisma.endangeredReport.create({
      data: {
        culture_name,
        threat_type,
        description,
        location,
        province,
        city,
        image_url,
        reporter_name: is_anonymous ? null : reporter_name,
        reporter_email: is_anonymous ? null : reporter_email,
        is_anonymous,
        user_id: user_id ? parseInt(user_id) : null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating endangered report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create report' },
      { status: 500 }
    );
  }
}
