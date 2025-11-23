import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

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

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analisis objek dalam gambar ini dan tentukan apakah ini adalah OBJEK BUDAYA INDONESIA yang ASLI dan SPESIFIK.

PENTING - KRITERIA OBJEK BUDAYA INDONESIA YANG VALID:
1. Harus merupakan objek fisik budaya tradisional Indonesia (batik, wayang, keris, alat musik tradisional, rumah adat, pakaian adat, tarian, dll)
2. Memiliki asal daerah spesifik di Indonesia
3. Bukan objek modern, bukan benda sehari-hari biasa, bukan makhluk hidup (kecuali dalam konteks budaya seperti wayang)
4. Bukan objek budaya dari negara lain

JIKA OBJEK BUKAN BUDAYA INDONESIA ATAU TIDAK JELAS:
Berikan response dengan format:
{
  "name": "Objek Tidak Dikenali",
  "location": "Tidak Diketahui",
  "accuracy": "0%",
  "description": "Objek dalam gambar bukan merupakan objek budaya Indonesia atau tidak dapat diidentifikasi dengan jelas. [Jelaskan singkat apa yang terlihat]",
  "rarity": "Tidak Diketahui",
  "unesco": "Tidak Terdaftar",
  "image": ""
}

JIKA OBJEK ADALAH BUDAYA INDONESIA YANG VALID:
Identifikasi JENIS atau VARIAN SPESIFIK dari objek budaya tersebut, jangan hanya kategori umumnya.

CONTOH ANALISIS YANG BENAR:
- Untuk batik: Identifikasi motifnya seperti "Batik Parang Rusak", "Batik Kawung", "Batik Mega Mendung", "Batik Truntum", dll.
- Untuk wayang: Identifikasi karakternya seperti "Wayang Kulit Arjuna", "Wayang Golek Cepot", dll.
- Untuk keris: Identifikasi jenisnya seperti "Keris Luk 5 Jawa Tengah", "Keris Bali Pamor Ngulit Semangka", dll.
- Untuk tari: Identifikasi tariannya seperti "Tari Kecak Bali", "Tari Saman Aceh", "Tari Jaipong Jawa Barat", dll.
- Untuk alat musik: Identifikasi spesifiknya seperti "Gamelan Jawa Gong Ageng", "Angklung Buhun", "Sasando Rote", dll.
- Untuk senjata tradisional: Identifikasi jenisnya seperti "Mandau Dayak Kalimantan", "Badik Bugis Makassar", dll.
- Untuk rumah adat: Identifikasi spesifiknya seperti "Rumah Gadang Minangkabau", "Tongkonan Toraja", dll.
- Untuk pakaian adat: Identifikasi lengkapnya seperti "Kebaya Encim Betawi", "Ulos Batak Toba Ragi Hotang", dll.

Berikan informasi dalam format JSON berikut (WAJIB menggunakan format ini):

{
  "name": "Nama SPESIFIK objek budaya dengan jenis/motif/varian yang jelas NOTE TOLONG NAMANYA JANGAN TERLALU PANJANG SINGKAT SAJA TAPI MEWAKILI BIAR DESCRIPTION YANG LEBIH DETAIL",
  "location": "Daerah/Provinsi asal spesifik, Indonesia",
  "accuracy": "Persentase akurasi (contoh: 92%)",
  "description": "Deskripsi detail tentang objek budaya ini, termasuk ciri khas, makna filosofis, dan keunikan dari jenis/motif spesifik ini (minimal 3-4 kalimat yang informatif)",
  "rarity": "Sangat Langka / Langka / Umum",
  "unesco": "Terdaftar / Tidak Terdaftar",
  "image": "Gambar referensi objek budaya ini dalam format URL string, TOLONG GAMBAR REFERENSI JANGAN SAMPAI NOT FOUND"
}

PENTING: 
- Untuk field "image", SELALU berikan string kosong (""). Jangan isi dengan teks placeholder atau deskripsi.
- Untuk field "name", WAJIB menyebutkan jenis/motif/varian spesifik, JANGAN hanya kategori umum (contoh: SALAH "Batik", BENAR "Batik Parang Rusak")
- Untuk field "description", jelaskan detail ciri khas dari jenis/motif spesifik tersebut, bukan hanya penjelasan umum
- Untuk field "location", HARUS mencantumkan "Indonesia" di akhir (contoh: "Yogyakarta, Indonesia")
- Jika tidak bisa mengidentifikasi jenis spesifik dengan pasti, gunakan format "Objek Tidak Dikenali" seperti yang dijelaskan di atas.`;

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
      // Try to find JSON in the response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scanResult = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if no JSON found
        scanResult = {
          name: "Objek Tidak Dikenali",
          location: "Tidak Diketahui",
          accuracy: "0%",
          description: textResponse || "Tidak dapat mengidentifikasi objek budaya.",
          rarity: "Tidak Diketahui",
          unesco: "Tidak Terdaftar",
          image: "",
        };
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      scanResult = {
        name: "Objek Tidak Dikenali",
        location: "Tidak Diketahui",
        accuracy: "0%",
        description: textResponse || "Tidak dapat mengidentifikasi objek budaya.",
        rarity: "Tidak Diketahui",
        unesco: "Tidak Terdaftar",
        image: "",
      };
    }

    // Validasi apakah ini objek budaya Indonesia yang valid
    const isValidCulture = scanResult.name !== "Objek Tidak Dikenali" && 
                          scanResult.accuracy !== "0%" &&
                          !scanResult.name.toLowerCase().includes("tidak dikenali") &&
                          !scanResult.name.toLowerCase().includes("tidak dapat") &&
                          !scanResult.description.toLowerCase().includes("bukan objek budaya") &&
                          !scanResult.description.toLowerCase().includes("tidak dikenali sebagai budaya") &&
                          scanResult.location !== "Tidak Diketahui" &&
                          scanResult.location.toLowerCase().includes("indonesia");

    // Hanya simpan ke database jika objek adalah budaya Indonesia yang valid
    if (isValidCulture) {
      try {
        const objectType = extractObjectType(scanResult.name);
        const categorySlug = getCategoryFromObjectType(objectType);
        const province = scanResult.location?.split(',')[1]?.trim() || null;
        
        // Lookup category by slug
        let categoryId: number | null = null;
        if (categorySlug) {
          const categoryRecord = await prisma.category.findFirst({
            where: { slug: categorySlug },
          });
          categoryId = categoryRecord?.id || null;
        }
        
        // Cek apakah culture dengan nama serupa sudah ada
        const existingCulture = await prisma.culture.findFirst({
          where: {
            OR: [
              { name: { contains: scanResult.name } },
              { name: { contains: objectType } }
            ]
          }
        });

        let cultureId = existingCulture?.id;

        // Jika culture belum ada, buat culture baru
        if (!existingCulture) {
          const newCulture = await prisma.culture.create({
            data: {
              name: scanResult.name,
              slug: scanResult.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
              description: scanResult.description || "Objek budaya Indonesia",
              category_id: categoryId,
              location: scanResult.location || "Indonesia",
              province: province || "Indonesia",
              city: scanResult.location?.split(',')[0]?.trim() || "",
              status: 'published',
              is_endangered: scanResult.rarity === "Sangat Langka",
              thumbnail: scanResult.image || null,
            }
          });
          cultureId = newCulture.id;
        }

        // Simpan scan history dengan category_id
        await prisma.scanHistory.create({
          data: {
            culture_id: cultureId,
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
        console.error("Database Error:", dbError);
        // Tetap return hasil scan meskipun gagal menyimpan ke database
      }
    } else {
      console.log("Objek bukan budaya Indonesia yang valid, tidak disimpan ke database:", scanResult.name);
    }

    return NextResponse.json(scanResult);
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
