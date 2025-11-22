import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil semua scan history dan group secara manual
    const allScans = await prisma.$queryRaw<Array<{
      object_name: string;
      object_type: string;
      scan_count: number;
    }>>`
      SELECT 
        object_name,
        object_type,
        COUNT(*) as scan_count
      FROM scan_history
      GROUP BY object_name, object_type
      ORDER BY scan_count DESC
      LIMIT 10
    `;

    // Ambil detail lengkap untuk setiap trending scan
    const detailedTrendingScans = await Promise.all(
      allScans.map(async (scan) => {
        // Ambil salah satu record untuk mendapatkan detail lengkap
        const scanDetail = await prisma.$queryRaw<Array<{
          id: number;
          culture_id: number | null;
          scan_result: string | null;
        }>>`
          SELECT id, culture_id, scan_result
          FROM scan_history
          WHERE object_name = ${scan.object_name}
          ORDER BY created_at DESC
          LIMIT 1
        `;

        const firstScan = scanDetail[0];
        let cultureSlug = null;
        let thumbnail = null;

        // Jika ada culture_id, ambil data culture
        if (firstScan?.culture_id) {
          const culture = await prisma.culture.findUnique({
            where: { id: firstScan.culture_id },
            select: { slug: true, thumbnail: true }
          });
          cultureSlug = culture?.slug;
          thumbnail = culture?.thumbnail;
        }

        // Jika tidak ada thumbnail, coba ambil dari scan_result
        if (!thumbnail && firstScan?.scan_result) {
          try {
            const scanResultData = JSON.parse(firstScan.scan_result);
            thumbnail = scanResultData.image || null;
          } catch (e) {
            // Ignore JSON parse errors
          }
        }

        return {
          title: scan.object_name,
          type: scan.object_type,
          scans: Number(scan.scan_count),
          image: thumbnail,
          cultureSlug: cultureSlug,
        };
      })
    );

    return NextResponse.json(detailedTrendingScans);
  } catch (error) {
    console.error("Error fetching trending scans:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
