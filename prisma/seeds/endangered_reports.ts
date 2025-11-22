import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedEndangeredReports() {
  console.log('Seeding endangered reports...');

  const reports = [
    {
      culture_name: 'Tari Topeng Cirebon',
      threat_type: 'Kurangnya Minat',
      description: 'Tari Topeng Cirebon mengalami penurunan minat dari generasi muda. Hanya tersisa beberapa sanggar yang masih aktif mengajarkan tarian ini. Regenerasi penari sangat minim dan pertunjukan semakin jarang dilakukan. Perlu upaya pelestarian segera untuk menyelamatkan warisan budaya ini.',
      location: 'Cirebon, Jawa Barat',
      province: 'Jawa Barat',
      city: 'Cirebon',
      image_url: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800',
      reporter_name: 'Budi Santoso',
      reporter_email: 'budi@example.com',
      is_anonymous: false,
      user_id: null,
      status: 'approved' as const,
      reviewed_at: new Date('2024-11-15'),
      created_at: new Date('2024-11-10'),
    },
    {
      culture_name: 'Wayang Golek',
      threat_type: 'Modernisasi',
      description: 'Seni wayang golek mulai tergantikan oleh hiburan modern seperti film dan musik populer. Anak-anak muda lebih tertarik pada gadget daripada seni tradisional. Jumlah dalang muda semakin berkurang dan pertunjukan wayang golek hanya dilakukan pada acara-acara tertentu saja.',
      location: 'Bandung, Jawa Barat',
      province: 'Jawa Barat',
      city: 'Bandung',
      image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      is_anonymous: true,
      user_id: null,
      status: 'approved' as const,
      reviewed_at: new Date('2024-11-18'),
      created_at: new Date('2024-11-12'),
    },
    {
      culture_name: 'Reog Ponorogo',
      threat_type: 'Tekanan Ekonomi',
      description: 'Grup Reog Ponorogo kesulitan mendapatkan dana untuk latihan dan pertunjukan. Kostum dan properti memerlukan biaya perawatan yang tinggi. Banyak pemain yang beralih profesi karena tidak bisa menghidupi keluarga dari seni reog. Perlu dukungan pemerintah dan sponsor untuk keberlanjutan seni ini.',
      location: 'Ponorogo, Jawa Timur',
      province: 'Jawa Timur',
      city: 'Ponorogo',
      image_url: 'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=800',
      reporter_name: 'Siti Aminah',
      reporter_email: 'siti@example.com',
      is_anonymous: false,
      user_id: null,
      status: 'approved' as const,
      reviewed_at: new Date('2024-11-19'),
      created_at: new Date('2024-11-14'),
    },
    {
      culture_name: 'Songket Palembang',
      threat_type: 'Modernisasi',
      description: 'Tenun songket tradisional Palembang terancam oleh masuknya kain songket imitasi dari luar negeri yang lebih murah. Pengrajin songket tradisional semakin berkurang karena proses pembuatan yang lama dan harga jual yang tidak kompetitif. Regenerasi pengrajin sangat minim.',
      location: 'Palembang, Sumatera Selatan',
      province: 'Sumatera Selatan',
      city: 'Palembang',
      image_url: 'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=800',
      reporter_name: 'Ahmad Hidayat',
      reporter_email: 'ahmad@example.com',
      is_anonymous: false,
      user_id: null,
      status: 'pending' as const,
      created_at: new Date('2024-11-20'),
    },
    {
      culture_name: 'Tari Tor Tor',
      threat_type: 'Urbanisasi',
      description: 'Tari Tor Tor dari Sumatera Utara mengalami ancaman karena urbanisasi masyarakat Batak ke kota-kota besar. Anak muda lebih memilih bekerja di kota dan meninggalkan kampung halaman beserta budayanya. Pertunjukan Tor Tor hanya dilakukan pada acara adat tertentu dan semakin jarang dipelajari.',
      location: 'Samosir, Sumatera Utara',
      province: 'Sumatera Utara',
      city: 'Samosir',
      image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      is_anonymous: true,
      user_id: null,
      status: 'pending' as const,
      created_at: new Date('2024-11-21'),
    },
    {
      culture_name: 'Batik Pekalongan',
      threat_type: 'Tekanan Ekonomi',
      description: 'Pengrajin batik tulis Pekalongan mengalami kesulitan bersaing dengan batik printing yang lebih cepat dan murah. Proses pembuatan batik tulis yang memakan waktu hingga berbulan-bulan membuat harga jual tinggi dan kurang diminati pasar. Banyak pengrajin yang beralih ke batik printing atau bahkan menutup usaha.',
      location: 'Pekalongan, Jawa Tengah',
      province: 'Jawa Tengah',
      city: 'Pekalongan',
      image_url: 'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=800',
      reporter_name: 'Dewi Lestari',
      reporter_email: 'dewi@example.com',
      is_anonymous: false,
      user_id: null,
      status: 'rejected' as const,
      admin_notes: 'Laporan kurang detail dan bukti pendukung tidak mencukupi. Mohon lengkapi dengan data lebih spesifik.',
      reviewed_at: new Date('2024-11-19'),
      created_at: new Date('2024-11-16'),
    },
  ];

  for (const report of reports) {
    await prisma.endangeredReport.upsert({
      where: { id: reports.indexOf(report) + 1 },
      update: {},
      create: report,
    });
  }

  console.log(`✓ Seeded ${reports.length} endangered reports`);
}
