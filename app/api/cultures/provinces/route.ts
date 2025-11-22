import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ambil semua budaya dan hitung per provinsi
    const cultures = await prisma.culture.findMany({
      where: {
        status: 'active',
        province: { not: '' },
      },
      select: {
        province: true,
        thumbnail: true,
      },
    });

    // Group by province dan hitung
    const provinceMap = new Map<string, { count: number; thumbnail: string | null }>();

    cultures.forEach((culture: { province: string | null; thumbnail: string | null }) => {
      const province = culture.province!;
      const existing = provinceMap.get(province);

      if (existing) {
        existing.count++;
        // Gunakan thumbnail pertama yang ada
        if (!existing.thumbnail && culture.thumbnail) {
          existing.thumbnail = culture.thumbnail;
        }
      } else {
        provinceMap.set(province, {
          count: 1,
          thumbnail: culture.thumbnail,
        });
      }
    });

    // Konversi ke array
    const provinces = Array.from(provinceMap.entries()).map(
      ([name, data]) => ({
        name,
        count: data.count,
        thumbnail: data.thumbnail,
      })
    );

    return NextResponse.json({
      success: true,
      data: provinces,
      total: provinces.length,
    });
  } catch (error) {
    console.error('Error fetching province data:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data provinsi' },
      { status: 500 }
    );
  }
}
