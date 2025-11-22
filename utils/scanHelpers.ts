/**
 * Extract object type from scan result name
 * Contoh: "Batik Parang Rusak" -> "Batik"
 *         "Wayang Kulit Arjuna" -> "Wayang"
 */
export function extractObjectType(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Daftar kata kunci untuk identifikasi tipe objek
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
    'upacara': ['upacara', 'ritual'],
    'permainan': ['permainan'],
    'bahasa': ['bahasa', 'aksara'],
  };

  for (const [type, keywords] of Object.entries(objectTypes)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return type;
      }
    }
  }

  // Jika tidak cocok dengan keyword manapun, ambil kata pertama
  return name.split(' ')[0];
}

/**
 * Map object type to Prisma CultureCategory enum
 */
export function getCategoryFromObjectType(objectType: string): string | undefined {
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
    'upacara': 'upacara',
    'ritual': 'upacara',
    'batik': 'kerajinan',
    'kain': 'kerajinan',
    'tenun': 'kerajinan',
    'ukiran': 'kerajinan',
    'keris': 'senjata',
    'senjata': 'senjata',
    'mandau': 'senjata',
    'badik': 'senjata',
    'kujang': 'senjata',
    'wayang': 'kerajinan',
    'permainan': 'permainan',
    'bahasa': 'bahasa',
    'aksara': 'bahasa',
  };

  return categoryMap[objectType.toLowerCase()];
}
