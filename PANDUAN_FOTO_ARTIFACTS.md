# 📸 Panduan Menambahkan Foto ke Artifacts

## ✅ Implementasi Sudah Selesai!

Fitur foto untuk artifact sudah diimplementasikan. Berikut cara menggunakannya:

---

## 📝 Cara Menggunakan

### 1️⃣ Siapkan Foto
Simpan foto Anda di folder: `public/images/artifacts/`

**Format yang didukung:**
- JPG/JPEG
- PNG  
- WebP

**Ukuran yang disarankan:**
- Lebar: 800px - 1200px
- Tinggi: Sesuaikan (rasio 16:9 atau 4:3 ideal)

---

### 2️⃣ Update Artifact dengan Foto

**SEBELUM (tanpa foto):**
```javascript
const manuscript = createArtifact(
    'inscription',
    0xFFD700,
    'Kitab Bharatayuddha',
    'Karya sastra klasik karya Mpu Sedah dan Mpu Panuluh yang menceritakan perang Bharata dari Mahabharata.'
);
```

**SESUDAH (dengan foto):**
```javascript
const manuscript = createArtifact(
    'inscription',
    0xFFD700,
    'Kitab Bharatayuddha',
    'Karya sastra klasik karya Mpu Sedah dan Mpu Panuluh yang menceritakan perang Bharata dari Mahabharata.',
    '/images/artifacts/bharatayuddha.jpg'  // ← Parameter ke-5: path foto
);
```

---

## 🌐 Menggunakan URL Eksternal

Anda juga bisa menggunakan foto dari internet:

```javascript
const manuscript = createArtifact(
    'inscription',
    0xFFD700,
    'Kitab Bharatayuddha',
    'Deskripsi...',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bharatayuddha_manuscript.jpg/800px-Bharatayuddha_manuscript.jpg'
);
```

---

## 📋 Contoh Lengkap per Kerajaan

### Kerajaan Kutai
```javascript
// File: src/scenes/kutai.js

const yupa = createArtifact(
    'pillar',
    0x8B4513,
    'Prasasti Yupa',
    'Prasasti tertua di Indonesia yang ditulis dalam bahasa Sanskerta...',
    '/images/artifacts/prasasti-yupa.jpg'
);
```

### Kerajaan Kediri
```javascript
// File: src/scenes/kediri.js

const manuscript = createArtifact(
    'inscription',
    0xFFD700,
    'Kitab Bharatayuddha',
    'Karya sastra klasik karya Mpu Sedah dan Mpu Panuluh...',
    '/images/artifacts/bharatayuddha.jpg'
);

const spiceChest = createArtifact(
    'treasure',
    0x8B4513,
    'Peti Rempah-Rempah',
    'Kediri terkenal sebagai penghasil rempah-rempah...',
    '/images/artifacts/rempah-kediri.jpg'
);
```

### Wangsa Sailendra
```javascript
// File: src/scenes/sailendra.js

const borobudurModel = createArtifact(
    'treasure',
    0xFFD700,
    'Miniatur Borobudur',
    'Candi Buddha terbesar di dunia...',
    '/images/artifacts/borobudur.jpg'
);

const buddhaStatue = createArtifact(
    'statue',
    0xFFA500,
    'Arca Buddha Dhyani',
    'Patung Buddha dalam posisi meditasi...',
    '/images/artifacts/buddha-dhyani.jpg'
);
```

---

## 🎨 Tips Mencari Foto

### Sumber Foto Gratis & Legal:
1. **Wikimedia Commons** (https://commons.wikimedia.org)
   - Cari: "Prasasti Yupa", "Candi Borobudur", dll
   - Foto berkualitas tinggi, legal untuk digunakan

2. **Unsplash** (https://unsplash.com)
   - Foto gratis untuk proyek apapun

3. **Pexels** (https://www.pexels.com)
   - Foto gratis berkualitas tinggi

### Kata Kunci Pencarian:
- `Prasasti Yupa`
- `Candi Borobudur`
- `Candi Prambanan`
- `Bharatayuddha manuscript`
- `Indonesian ancient artifacts`
- `Hindu-Buddhist temple Indonesia`

---

## 🔧 Troubleshooting

### ❌ Foto tidak muncul?

1. **Cek path foto:**
   ```javascript
   // ✅ BENAR
   '/images/artifacts/foto.jpg'
   
   // ❌ SALAH
   'images/artifacts/foto.jpg'  // Missing /
   'C:/ITS/SEMESTER 7/...'     // Path absolut tidak bisa
   ```

2. **Cek nama file:**
   - Gunakan huruf kecil semua
   - Tidak ada spasi (gunakan `-` atau `_`)
   - Format: `.jpg`, `.jpeg`, `.png`

3. **Cek lokasi file:**
   - Harus di: `public/images/artifacts/`
   - BUKAN di: `src/images/artifacts/` ❌

4. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   # Start lagi
   npm run dev
   ```

---

## 📸 Contoh yang Sudah Diterapkan

✅ **Kerajaan Kediri** - Kitab Bharatayuddha
- Sudah ditambahkan foto dari Wikimedia Commons
- Klik artifact untuk melihat hasilnya!

---

## 🚀 Langkah Selanjutnya

1. Download foto yang Anda inginkan
2. Simpan di `public/images/artifacts/`
3. Edit file scene (contoh: `src/scenes/kutai.js`)
4. Tambahkan parameter foto di `createArtifact()`
5. Refresh browser dan test!

---

## 💡 Catatan Penting

- **Parameter ke-5 adalah OPSIONAL**
  - Jika tidak ada foto, artifact tetap berfungsi normal
  - Panel hanya menampilkan judul + deskripsi
  
- **Foto otomatis responsive**
  - Max height: 200px
  - Width: 100% dari panel
  - Border radius: 8px
  
- **Loading foto dari internet**
  - Pastikan URL valid
  - Gunakan HTTPS untuk keamanan
  - Pertimbangkan kecepatan loading

---

**Selamat mencoba! 🎉**
