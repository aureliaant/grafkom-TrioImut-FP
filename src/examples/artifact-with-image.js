// ==========================================
// 📸 QUICK REFERENCE - Menambahkan Foto
// ==========================================

// TEMPLATE DASAR
const namaArtifact = createArtifact(
    'tipe',           // 'statue', 'inscription', 'treasure', 'pillar'
    0xWARNA,          // Hex color (contoh: 0xFFD700)
    'Judul',          // Nama artifact
    'Deskripsi...',   // Penjelasan artifact
    'PATH_FOTO'       // ← PARAMETER BARU (opsional)
);

// ==========================================
// CONTOH PENGGUNAAN
// ==========================================

// 1️⃣ DENGAN FOTO LOKAL
const prasasti = createArtifact(
    'pillar',
    0x8B4513,
    'Prasasti Yupa',
    'Prasasti tertua di Indonesia yang ditulis dalam bahasa Sanskerta.',
    '/images/artifacts/prasasti-yupa.jpg'  // Foto dari folder public
);

// 2️⃣ DENGAN FOTO DARI INTERNET
const manuscript = createArtifact(
    'inscription',
    0xFFD700,
    'Kitab Bharatayuddha',
    'Karya sastra klasik dari Kerajaan Kediri.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bharatayuddha_manuscript.jpg/800px-Bharatayuddha_manuscript.jpg'
);

// 3️⃣ TANPA FOTO (seperti biasa)
const treasure = createArtifact(
    'treasure',
    0xFFD700,
    'Peti Rempah',
    'Kediri terkenal sebagai penghasil rempah-rempah.'
    // Tidak ada parameter foto - masih berfungsi normal
);

// ==========================================
// LOKASI FILE FOTO
// ==========================================

/*
✅ BENAR:
public/
  └── images/
      └── artifacts/
          ├── prasasti-yupa.jpg
          ├── bharatayuddha.jpg
          ├── borobudur.png
          └── buddha-statue.jpg

❌ SALAH:
src/images/artifacts/  ← Tidak bisa diakses dari browser
*/

// ==========================================
// PATH YANG BENAR
// ==========================================

// ✅ BENAR
'/images/artifacts/foto.jpg'

// ❌ SALAH
'images/artifacts/foto.jpg'           // Missing /
'../public/images/artifacts/foto.jpg' // Path relatif
'C:/Users/foto.jpg'                   // Path absolut

// ==========================================
// TIPS
// ==========================================

// Nama file:
// - Huruf kecil semua
// - Tidak ada spasi (gunakan - atau _)
// - Contoh: prasasti-yupa.jpg ✅
// - Hindari: Prasasti Yupa.JPG ❌

// Format yang didukung:
// - .jpg / .jpeg
// - .png
// - .webp

// Ukuran ideal:
// - Lebar: 800px - 1200px
// - Rasio: 16:9 atau 4:3
