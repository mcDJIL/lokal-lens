import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get culture detail with all images
    const culture = await prisma.culture.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: {
            display_order: 'asc',
          },
        },
      },
    });

    if (!culture) {
      return NextResponse.json(
        { error: 'Culture not found' },
        { status: 404 }
      );
    }

    // Get nearby cultures (same province or close by coordinates)
    let nearbyCultures = [];

    if (culture.latitude && culture.longitude) {
      // Get all cultures with coordinates
      const allCultures = await prisma.culture.findMany({
        where: {
          id: { not: culture.id },
          status: 'published',
          latitude: { not: null },
          longitude: { not: null },
        },
        include: {
          images: {
            where: { is_primary: true },
            take: 1,
          },
        },
      });

      // Calculate distances and sort
      const culturesWithDistance = allCultures
        .map((c: any) => ({
          ...c,
          distance: calculateDistance(
            culture.latitude!,
            culture.longitude!,
            c.latitude!,
            c.longitude!
          ),
        }))
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 4); // Get 4 nearest

      nearbyCultures = culturesWithDistance.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        location: c.location,
        thumbnail: c.images[0]?.image_url || c.thumbnail,
        distance: Math.round(c.distance * 10) / 10, // Round to 1 decimal
      }));
    } else {
      // Fallback: get cultures from same province
      const sameCultures = await prisma.culture.findMany({
        where: {
          id: { not: culture.id },
          province: culture.province,
          status: 'active',
        },
        include: {
          images: {
            where: { is_primary: true },
            take: 1,
          },
        },
        take: 4,
        orderBy: {
          created_at: 'desc',
        },
      });

      nearbyCultures = sameCultures.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        location: c.location,
        thumbnail: c.images[0]?.image_url || c.thumbnail,
      }));
    }

    // Format images
    const images = culture.images.map((img: any) => ({
      id: img.id,
      url: img.image_url,
      alt: img.alt_text || culture.name,
      is_primary: img.is_primary,
    }));

    // Ensure we have at least a thumbnail
    if (images.length === 0 && culture.thumbnail) {
      images.push({
        id: 0,  
        url: culture.thumbnail,
        alt: culture.name,
        is_primary: true,
      });
    }

    return NextResponse.json({
      culture: {
        id: culture.id,
        name: culture.name,
        slug: culture.slug,
        subtitle: culture.subtitle,
        description: culture.description,
        long_description: culture.long_description,
        meaning: culture.meaning,
        location: culture.location,
        province: culture.province,
        city: culture.city,
        is_endangered: culture.is_endangered,
        map_embed_url: culture.map_embed_url,
        latitude: culture.latitude,
        longitude: culture.longitude,
        images,
      },
      nearby_cultures: nearbyCultures,
    });
  } catch (error) {
    console.error('Error fetching culture detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch culture detail' },
      { status: 500 }
    );
  }
}
