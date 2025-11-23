import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const province = searchParams.get('province') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const month = searchParams.get('month') || '';
    const sort = searchParams.get('sort') || 'nearest'; // 'nearest' or 'farthest'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location_city: { contains: search } },
      ];
    }

    if (province) {
      where.location_province = province;
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

    if (status) {
      where.status = status;
    }

    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);
      where.date_start = {
        gte: startDate,
        lte: endDate,
      };
    } else {
      // Jika tidak ada filter bulan, hanya tampilkan event yang upcoming (belum lewat)
      // Event dianggap belum lewat jika date_end >= hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set ke awal hari
      where.date_end = {
        gte: today,
      };
    }

    // Fetch events with pagination
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          date_start: sort === 'farthest' ? 'desc' : 'asc',
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true,
          date_start: true,
          date_end: true,
          time_start: true,
          time_end: true,
          location_name: true,
          location_city: true,
          location_province: true,
          price: true,
          status: true,
          views: true,
          category_rel: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    // Format events
    const formattedEvents = events.map((event) => {
      const startDate = new Date(event.date_start);
      const endDate = new Date(event.date_end);
      
      let dateDisplay = '';
      if (startDate.toDateString() === endDate.toDateString()) {
        dateDisplay = startDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } else {
        dateDisplay = `${startDate.toLocaleDateString('id-ID', {
          day: 'numeric',
        })} - ${endDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`;
      }

      let statusText = 'TERSEDIA';
      let statusColor: 'red' | 'green' | 'gray' = 'red';
      
      if (event.status === 'free') {
        statusText = 'GRATIS';
        statusColor = 'green';
      } else if (event.status === 'sold_out') {
        statusText = 'HABIS';
        statusColor = 'gray';
      } else if (event.status === 'available') {
        statusText = 'TERSEDIA';
        statusColor = 'red';
      } else if (event.status === 'cancelled') {
        statusText = 'DIBATALKAN';
        statusColor = 'gray';
      } else if (event.status === 'completed') {
        statusText = 'SELESAI';
        statusColor = 'gray';
      }

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        date: dateDisplay,
        location: `${event.location_city}, ${event.location_province}`,
        price: event.price ? `Rp ${event.price.toLocaleString('id-ID')}` : null,
        image: event.thumbnail || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60',
        status: statusText,
        statusColor: statusColor,
        category: event.category_rel?.name,
        categorySlug: event.category_rel?.slug,
        categoryIcon: event.category_rel?.icon,
        views: event.views,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}