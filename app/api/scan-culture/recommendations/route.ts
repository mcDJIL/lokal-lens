import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const objectName = searchParams.get('objectName') || '';
    const objectType = searchParams.get('objectType') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';

    // Ekstrak keywords dari nama objek untuk pencarian yang lebih baik
    const keywords = objectName.split(' ').filter(word => word.length > 2);
    
    // Ambil artikel terkait (berdasarkan tags, category, atau province)
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: objectType } },
          { excerpt: { contains: objectType } },
          { category_rel: { name: { contains: category } } },
          { province: { contains: location.split(',')[1]?.trim() || '' } },
          ...keywords.map(keyword => ({ title: { contains: keyword } })),
          ...keywords.map(keyword => ({ excerpt: { contains: keyword } }))
        ],
        published_at: { lte: new Date() }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image: true,
        category_rel: {
          select: {
            name: true
          }
        },
        published_at: true
      },
      orderBy: {
        views: 'desc'
      },
      take: 3
    });

    // Ambil budaya terkait (berdasarkan category, province, atau nama)
    const cultures = await prisma.culture.findMany({
      where: {
        OR: [
          { name: { contains: objectType } },
          { description: { contains: objectType } },
          { category_rel: { name: { contains: category } } },
          { province: { contains: location.split(',')[1]?.trim() || '' } },
          ...keywords.map(keyword => ({ name: { contains: keyword } })),
          ...keywords.map(keyword => ({ description: { contains: keyword } }))
        ],
        status: 'published'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        thumbnail: true,
        category_rel: {
          select: {
            name: true
          }
        },
        province: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 3
    });

    // Ambil event terkait (berdasarkan category atau lokasi)
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: objectType } },
          { description: { contains: objectType } },
          { category_rel: { name: { contains: category } } },
          { location_province: { contains: location.split(',')[1]?.trim() || '' } },
          ...keywords.map(keyword => ({ title: { contains: keyword } })),
          ...keywords.map(keyword => ({ description: { contains: keyword } }))
        ],
        status: { in: ['available', 'free'] },
        date_start: { gte: new Date() }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        date_start: true,
        location_province: true,
        category_rel: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date_start: 'asc'
      },
      take: 3
    });

    // Ambil kuis terkait (berdasarkan category)
    const quizzes = await prisma.quiz.findMany({
      where: {
        OR: [
          { title: { contains: objectType } },
          { description: { contains: objectType } },
          { category_rel: { name: { contains: category } } },
          ...keywords.map(keyword => ({ title: { contains: keyword } })),
          ...keywords.map(keyword => ({ description: { contains: keyword } }))
        ],
        status: 'published'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        category_rel: {
          select: {
            name: true
          }
        },
        difficulty: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 3
    });

    // Gabungkan semua recommendations
    const recommendations = [
      ...articles.map(item => ({
        type: 'ARTIKEL',
        categoryColor: '#006C84',
        title: item.title,
        slug: item.slug,
        image: item.featured_image,
        link: `/artikel/${item.slug}`
      })),
      ...cultures.map(item => ({
        type: 'BUDAYA',
        categoryColor: '#27AE60',
        title: item.name,
        slug: item.slug,
        image: item.thumbnail || '',
        link: `/jelajahi/${item.slug}`
      })),
      ...events.map(item => ({
        type: 'EVENT',
        categoryColor: '#C0392B',
        title: item.title,
        slug: item.slug,
        image: item.thumbnail || '',
        link: `/event-budaya/${item.slug}`
      })),
      ...quizzes.map(item => ({
        type: 'KUIS',
        categoryColor: '#D4A017',
        title: item.title,
        slug: item.slug,
        image: item.thumbnail || '',
        link: `/kuis/${item.id}`
      }))
    ];

    // Randomize dan ambil 3-6 recommendations
    const shuffled = recommendations.sort(() => 0.5 - Math.random());
    const finalRecommendations = shuffled.slice(0, Math.min(6, shuffled.length));

    return NextResponse.json(finalRecommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
