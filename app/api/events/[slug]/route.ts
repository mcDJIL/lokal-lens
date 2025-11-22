import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch event with relations
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        category_rel: {
          select: {
            name: true,
          },
        },
        performers: {
          orderBy: {
            order_number: 'asc',
          },
        },
        galleries: {
          orderBy: {
            order_number: 'asc',
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.event.update({
      where: { id: event.id },
      data: { views: { increment: 1 } },
    });

    // Format dates
    const startDate = new Date(event.date_start);
    const endDate = new Date(event.date_end);
    
    const formattedStartDate = startDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const formattedEndDate = endDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const dateDisplay = startDate.toDateString() === endDate.toDateString()
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedEndDate}`;

    const timeDisplay = event.time_start && event.time_end
      ? `${event.time_start} - ${event.time_end} WIB`
      : '';

    // Format performers
    const performers = event.performers.map((performer) => ({
      id: performer.id,
      name: performer.name,
      title: performer.title,
      description: performer.description,
      image: performer.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    }));

    // Format galleries
    const galleryImages = event.galleries.map((gallery) => ({
      id: gallery.id,
      url: gallery.image_url,
      alt: gallery.alt_text,
    }));

    // Format map URL
    let mapImageUrl = '';
    if (event.latitude && event.longitude) {
      mapImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${event.longitude},${event.latitude},13,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
    }

    const formattedEvent = {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      longDescription: event.long_description || event.description,
      thumbnail: event.thumbnail || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop&q=80',
      date: dateDisplay,
      time: timeDisplay,
      dateStart: event.date_start,
      dateEnd: event.date_end,
      locationName: event.location_name,
      locationCity: event.location_city,
      locationProvince: event.location_province,
      locationAddress: event.location_address || `${event.location_city}, Indonesia`,
      latitude: event.latitude,
      longitude: event.longitude,
      mapImageUrl,
      mapEmbedUrl: event.map_embed_url,
      price: event.price,
      priceDisplay: event.price ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Gratis',
      status: event.status,
      category: event.category_rel?.name || null,
      organizer: event.organizer,
      contactEmail: event.contact_email,
      contactPhone: event.contact_phone,
      websiteUrl: event.website_url,
      views: event.views,
      performers,
      galleryImages,
    };

    return NextResponse.json({
      success: true,
      data: formattedEvent,
    });
  } catch (error) {
    console.error('Error fetching event detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event detail' },
      { status: 500 }
    );
  }
}
