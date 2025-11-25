import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { appendFile } from "fs/promises";
import { put } from "@vercel/blob";

// Helper function to extract object type from name
function extractObjectType(name: string): string {
  const lowerName = name.toLowerCase();
  
  const objectTypes: { [key: string]: string[] } = {
    'batik': ['batik'],
    'wayang': ['wayang'],
    'keris': ['keris', 'tosan aji'],
    'tari': ['tari', 'tarian'],
    'gamelan': ['gamelan'],
    'angklung': ['angklung'],
    'alat musik': ['alat musik', 'musik', 'sasando', 'kolintang', 'salung'],
    'rumah adat': ['rumah adat', 'rumah', 'tongkonan', 'gadang'],
    'pakaian adat': ['pakaian adat', 'kebaya', 'ulos', 'songket'],
    'makanan': ['makanan', 'kuliner', 'rendang', 'gudeg', 'soto'],
    'senjata': ['senjata', 'mandau', 'badik', 'kujang'],
    'kain': ['kain', 'tenun', 'ikat'],
    'ukiran': ['ukiran', 'patung'],
  };

  for (const [type, keywords] of Object.entries(objectTypes)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return type;
      }
    }
  }

  return name.split(' ')[0];
}

// Helper function to get category from object type
function getCategoryFromObjectType(objectType: string): string | undefined {
  const categoryMap: { [key: string]: string } = {
    'tari': 'tarian',
    'tarian': 'tarian',
    'gamelan': 'musik',
    'angklung': 'musik',
    'alat musik': 'musik',
    'musik': 'musik',
    'pakaian adat': 'pakaian',
    'kebaya': 'pakaian',
    'rumah adat': 'arsitektur',
    'rumah': 'arsitektur',
    'makanan': 'kuliner',
    'kuliner': 'kuliner',
    'batik': 'kerajinan',
    'kain': 'kerajinan',
    'tenun': 'kerajinan',
    'ukiran': 'kerajinan',
    'keris': 'senjata',
    'senjata': 'senjata',
    'wayang': 'kerajinan',
  };

  return categoryMap[objectType.toLowerCase()];
}

// Helper function to save image to disk
async function uploadToVercelBlob(base64Image: string, fileName: string): Promise<string> {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, "base64");

  const timestamp = Date.now();
  const uniqueName = `${fileName}-${timestamp}.jpg`;

  const { url } = await put(`scans/${uniqueName}`, buffer, {
    access: "public",
    contentType: "image/jpeg",
  });

  return url; // langsung URL publik
}

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key tidak ditemukan" },
        { status: 500 }
      );
    }

    // Fetch categories dari database untuk membuat prompt lebih spesifik
    let categoriesText = "";
    try {
      const categories = await prisma.category.findMany({
        select: {
          name: true,
          slug: true,
          description: true,
        }
      });
      
      
      if (categories.length > 0) {
        categoriesText = "\n\nKATEGORI BUDAYA YANG TERSEDIA:\n" + 
          categories.map(cat => `- ${cat.name} (${cat.slug}): ${cat.description || ''}`).join('\n');
      }
    } catch (catError) {
      console.error(`❌ Error fetching categories: ${catError}`);
      
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analisis objek dalam gambar ini dan tentukan apakah ini adalah OBJEK BUDAYA INDONESIA yang ASLI dan SPESIFIK.
${categoriesText}

PENTING - KRITERIA OBJEK BUDAYA INDONESIA YANG VALID:
1. Harus merupakan objek fisik budaya tradisional Indonesia (batik, wayang, keris, alat musik tradisional, rumah adat, pakaian adat, tarian, dll)
2. Memiliki asal daerah spesifik di Indonesia
3. Bukan objek modern, bukan benda sehari-hari biasa, bukan makhluk hidup (kecuali dalam konteks budaya seperti wayang)
4. Bukan objek budaya dari negara lain

JIKA OBJEK BUKAN BUDAYA INDONESIA ATAU TIDAK JELAS:
Berikan response dengan format:
{
  "name": "Objek Tidak Dikenali",
  "subtitle": "",
  "location": "Tidak Diketahui",
  "accuracy": "0%",
  "description": "Objek dalam gambar bukan merupakan objek budaya Indonesia atau tidak dapat diidentifikasi dengan jelas. [Jelaskan singkat apa yang terlihat]",
  "long_description": "",
  "meaning": "",
  "rarity": "Tidak Diketahui",
  "unesco": "Tidak Terdaftar",
  "image": "",
  "latitude": null,
  "longitude": null,
  "category_slug": ""
}

JIKA OBJEK ADALAH BUDAYA INDONESIA YANG VALID:
Identifikasi JENIS atau VARIAN SPESIFIK dari objek budaya tersebut, jangan hanya kategori umumnya.

Berikan informasi dalam format JSON berikut (WAJIB menggunakan format ini):

{
  "name": "Nama SPESIFIK objek budaya dengan jenis/motif/varian yang jelas (SINGKAT, 2-4 kata maksimal)",
  "subtitle": "Tagline/slogan menarik yang menggambarkan objek ini (contoh: 'Tarian Mistis dari Gerbang Timur Jawa', 'Kain Tenun Warisan Leluhur', max 8 kata)",
  "location": "Kota/Kabupaten, Provinsi",
  "accuracy": "Persentase akurasi (contoh: 92%)",
  "description": "Deskripsi singkat dan jelas tentang objek budaya ini (2-3 kalimat, fokus pada definisi dan asal-usul)",
  "long_description": "Penjelasan detail dan mendalam tentang sejarah, latar belakang, dan perkembangan objek budaya ini (4-6 kalimat, mencakup konteks historis, tokoh penting, atau peristiwa terkait)",
  "meaning": "Makna filosofis, simbolisme, atau nilai budaya yang terkandung dalam objek ini (3-4 kalimat, jelaskan pesan yang ingin disampaikan dan relevansinya)",
  "rarity": "Sangat Langka / Langka / Umum",
  "unesco": "Terdaftar / Tidak Terdaftar",
  "image": "",
  "latitude": koordinat lintang dalam format desimal (contoh: -7.8754, atau null jika tidak tahu),
  "longitude": koordinat bujur dalam format desimal (contoh: 111.4625, atau null jika tidak tahu),
  "category_slug": "slug kategori yang sesuai dari daftar kategori di atas (contoh: 'tarian', 'kerajinan', 'musik', dll)"
}

PENTING: 
- Jangan sampai ada field yang kosong kecuali "image" (harus "") dan latitude/longitude (boleh null jika tidak tahu)
- Pastikan "name" SINGKAT dan spesifik
- "category_slug" WAJIB diisi dengan slug kategori yang sesuai dari daftar kategori yang tersedia`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image,
              },
            },
          ],
        },
      ],
    });

    const textResponse = result.text || "";

    // Extract JSON from response
    let scanResult;
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scanResult = JSON.parse(jsonMatch[0]);
      } else {
        scanResult = {
          name: "Objek Tidak Dikenali",
          subtitle: "",
          location: "Tidak Diketahui",
          accuracy: "0%",
          description: textResponse || "Tidak dapat mengidentifikasi objek budaya.",
          long_description: "",
          meaning: "",
          rarity: "Tidak Diketahui",
          unesco: "Tidak Terdaftar",
          image: "",
          latitude: null,
          longitude: null,
          category_slug: "",
        };
      }
    } catch (parseError) {
      scanResult = {
        name: "Objek Tidak Dikenali",
        subtitle: "",
        location: "Tidak Diketahui",
        accuracy: "0%",
        description: textResponse || "Tidak dapat mengidentifikasi objek budaya.",
        long_description: "",
        meaning: "",
        rarity: "Tidak Diketahui",
        unesco: "Tidak Terdaftar",
        image: "",
        latitude: null,
        longitude: null,
        category_slug: "",
      };
    }

    // 38 Provinsi Indonesia (resmi)
    const indonesianProvinces = [
      // Sumatera (10)
      'aceh',
      'sumatera utara', 'sumatra utara',
      'sumatera barat', 'sumatra barat',
      'riau',
      'kepulauan riau',
      'jambi',
      'sumatera selatan', 'sumatra selatan',
      'kepulauan bangka belitung', 'bangka belitung',
      'bengkulu',
      'lampung',
      
      // Jawa (6)
      'banten',
      'dki jakarta', 'jakarta',
      'jawa barat',
      'jawa tengah',
      'di yogyakarta', 'yogyakarta', 'jogja',
      'jawa timur',
      
      // Bali & Nusa Tenggara (3)
      'bali',
      'nusa tenggara barat', 'ntb',
      'nusa tenggara timur', 'ntt',
      
      // Kalimantan (5)
      'kalimantan barat',
      'kalimantan tengah',
      'kalimantan selatan',
      'kalimantan timur',
      'kalimantan utara',
      
      // Sulawesi (6)
      'sulawesi utara',
      'sulawesi tengah',
      'sulawesi selatan',
      'sulawesi tenggara',
      'gorontalo',
      'sulawesi barat',
      
      // Maluku (2)
      'maluku',
      'maluku utara',
      
      // Papua (6)
      'papua',
      'papua barat',
      'papua selatan',
      'papua tengah',
      'papua pegunungan',
      'papua barat daya'
    ];
    
    const locationLower = scanResult.location.toLowerCase();
    const hasIndonesianProvince = indonesianProvinces.some(province => 
      locationLower.includes(province)
    ) || locationLower.includes('indonesia');
    
    // Validasi apakah ini objek budaya Indonesia yang valid
    const isValidCulture = scanResult.name !== "Objek Tidak Dikenali" && 
                          scanResult.accuracy !== "0%" &&
                          !scanResult.name.toLowerCase().includes("tidak dikenali") &&
                          !scanResult.name.toLowerCase().includes("tidak dapat") &&
                          !scanResult.description.toLowerCase().includes("bukan objek budaya") &&
                          !scanResult.description.toLowerCase().includes("tidak dikenali sebagai budaya") &&
                          scanResult.location !== "Tidak Diketahui" &&
                          hasIndonesianProvince;

    // Simpan gambar scan user jika valid
    let savedImagePath = null;
    if (isValidCulture) {
      try {
        const sanitizedName = scanResult.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);
        
        savedImagePath = await uploadToVercelBlob(image, sanitizedName);
      } catch (imageError) {
        console.error(`❌ Failed to save image: ${imageError}`);
      }
    } else {
      console.log("⚠️ Skipping image save - invalid culture");
    }

    // Hanya simpan ke database jika objek adalah budaya Indonesia yang valid
    if (isValidCulture) {      
      try {
        const objectType = extractObjectType(scanResult.name);

        const categorySlug = scanResult.category_slug || getCategoryFromObjectType(objectType);
        
        const province = scanResult.location?.split(',')[1]?.trim() || null;
        const city = scanResult.location?.split(',')[0]?.trim() || "";
        
        // Lookup category by slug (prioritas dari AI response)
        let categoryId: number | null = null;
        if (categorySlug) {
          const categoryRecord = await prisma.category.findFirst({
            where: { slug: categorySlug },
          });
          categoryId = categoryRecord?.id || null;
        } else {
          console.log("⚠️ No category slug provided");
        }
        
        const existingCulture = await prisma.culture.findFirst({
          where: {
            name: scanResult.name
          }
        });

        let cultureId = existingCulture?.id;
        if (!existingCulture) {
          const newCulture = await prisma.culture.create({
            data: {
              name: scanResult.name,
              slug: scanResult.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
              subtitle: scanResult.subtitle || null,
              description: scanResult.description || "Objek budaya Indonesia",
              long_description: scanResult.long_description || null,
              meaning: scanResult.meaning || null,
              category_id: categoryId,
              location: scanResult.location || "Indonesia",
              province: province || "Indonesia",
              city: city,
              latitude: scanResult.latitude || null,
              longitude: scanResult.longitude || null,
              status: 'published',
              is_endangered: scanResult.rarity === "Sangat Langka",
              thumbnail: savedImagePath,
            }
          });
          cultureId = newCulture.id;

          // Simpan gambar referensi dari internet ke culture_images
          if (scanResult.image && scanResult.image !== "") {
            try {
              await prisma.cultureImage.create({
                data: {
                  culture_id: cultureId,
                  image_url: scanResult.image,
                  alt_text: `Referensi ${scanResult.name}`,
                  is_primary: false,
                }
              });
            } catch (imageError) {
              console.error(`❌ Failed to save reference image: ${imageError}`);
            }
          }
        } else {
          await prisma.culture.update({
            where: { id: existingCulture.id },
            data: {
              subtitle: scanResult.subtitle || existingCulture.subtitle,
              long_description: scanResult.long_description || existingCulture.long_description,
              meaning: scanResult.meaning || existingCulture.meaning,
              latitude: scanResult.latitude || existingCulture.latitude,
              longitude: scanResult.longitude || existingCulture.longitude,
              thumbnail: savedImagePath || existingCulture.thumbnail,
            }
          });
        }

        // Simpan scan history
        const scanHistory = await prisma.scanHistory.create({
          data: {
            culture_id: cultureId!,
            object_name: scanResult.name,
            object_type: objectType,
            category_id: categoryId,
            location: scanResult.location,
            province: province,
            accuracy: scanResult.accuracy,
            description: scanResult.description,
            scan_result: JSON.stringify(scanResult),
          }
        });  
      } catch (dbError) {
        if ((dbError as any).code) {
          console.error(`Error code: ${(dbError as any).code}`);
        }
      }
    }

    // Tambahkan path gambar yang disimpan ke response
    const responseData = {
      ...scanResult,
      scanned_image: savedImagePath,
    };

    return NextResponse.json(responseData);
  } catch (error) {    
    return NextResponse.json(
      {
        error: "Internal Server Error: " + (error as Error).message,
        detail: String(error),
      },
      { status: 500 }
    );
  }
}