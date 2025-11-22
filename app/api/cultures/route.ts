import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const search = searchParams.get('search') || '';
    const province = searchParams.get('province') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || 'published';
    const random = searchParams.get('random') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: status as any,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { province: { contains: search } },
        { city: { contains: search } },
      ];
    }

    if (province) {
      where.province = province;
    }

    // Lookup category by slug if provided
    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });
      if (categoryRecord) {
        where.category_id = categoryRecord.id;
      }
    }

    // Get cultures with pagination
    let cultures;
    let total;

    if (random) {
      // For random selection, get all matching records first
      const allCultures = await prisma.culture.findMany({
        where,
        include: {
          images: {
            where: { is_primary: true },
            take: 1,
          },
          category_rel: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });
      
      // Shuffle and take limit
      const shuffled = allCultures.sort(() => Math.random() - 0.5);
      cultures = shuffled.slice(0, limit);
      total = allCultures.length;
    } else {
      // Normal pagination
      [cultures, total] = await Promise.all([
        prisma.culture.findMany({
          where,
          include: {
            images: {
              where: { is_primary: true },
              take: 1,
            },
            category_rel: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.culture.count({ where }),
      ]);
    }

    // Format response
    const formattedCultures = cultures.map((culture: any) => ({
      id: culture.id,
      name: culture.name,
      slug: culture.slug,
      location: culture.location,
      province: culture.province,
      city: culture.city,
      thumbnail: culture.images[0]?.image_url || culture.thumbnail,
      is_endangered: culture.is_endangered,
      subtitle: culture.subtitle,
      category: culture.category_rel?.name || null,
      categorySlug: culture.category_rel?.slug,
      categoryIcon: culture.category_rel?.icon,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCultures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching cultures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cultures', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
