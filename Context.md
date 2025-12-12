Tentu saja BISA! Konsep ini sangat bisa diterapkan dan justru sangat efisien untuk dikerjakan sebagai Final Project.

Mengapa Karena konsep Lobby Pintu memungkinkan Anda memecah pekerjaan menjadi bagian-bagian kecil (modular). Anda tidak perlu me-load satu dunia besar sekaligus yang akan memberatkan komputer, melainkan memuat scene sesuai kebutuhan.

Karena berdasarkan percakapan sebelumnya Anda tertarik menggunakan WebGL  Three.js, berikut adalah gambaran logika teknis bagaimana mewujudkan konsep tersebut

### 1. Logika Scene Management (Inti Program)
Dalam Grafika Komputer, konsep pindah pintu sebenarnya hanyalah memanipulasi apa yang dirender oleh kamera.

 Logic Anda akan memiliki variabel status, misalnya `currentState`.
     Jika `currentState = LOBBY`, render ruangan pintu.
     Jika `currentState = MAJAPAHIT`, hapus objek lobby, load aset candi.
 Di Three.js Ini sering disebut dengan teknik Dispose & Re-add. Anda membersihkan memory dari scene lama sebelum memuat scene baru agar browser tidak crash.

### 2. Implementasi Pintu Ajaib (Interaction)
Bagaimana caranya agar masuk pintu terasa nyata

 Raycasting (Deteksi KlikTatapan)
    Gunakan `Raycaster` dari posisi kamera ke arah depan. Jika sinar menabrak objek bernama Pintu_Majapahit, lalu pemain menekan tombol (misal 'E' atau Klik Kiri), maka fungsi `loadMajapahitScene()` dijalankan.
 Transisi
    Jangan langsung pindah cut, itu kasar. Gunakan overlay hitam (`div` HTML di atas canvas) yang fade-in menjadi gelap, tunggu 1 detik (loading aset), lalu fade-out menjadi terang di scene baru.

### 3. Skema Level Majapahit (Agar Tidak Kewalahan)
Karena waktunya terbatas, jangan buat satu kerajaan Majapahit utuh. Buatlah dalam bentuk Diorama atau Courtyard (Halaman Terbuka).

 Batasi Area Gunakan tembok bata merah atau pagar tanaman sebagai batas level (Invisible Wall). Pemain hanya bisa jalan di area seluas misalnya 50x50 meter virtual.
 Aset Kunci Cukup letakkan 1 Gapura, 1 Pendopo kecil, dan beberapa gentong airartefak.
 Suasana Kuncinya ada di Pencahayaan (Lighting). Set warna cahaya matahari menjadi oranye kemerahan (sore hari) untuk memberikan kesan kuno dan dramatis.

### Rencana Pengerjaan (Step-by-Step)

Jika Anda setuju, ini urutan pengerjaannya agar selesai tepat waktu

1.  Minggu 1 The Base (Lobby)
     Buat ruang kotak sederhana.
     Buat 3 kotak berdiri sebagai Pintu.
     Implementasi First Person Controls (jalan dan lihat sekeliling).
     Implementasi Raycaster Jika kursor kena pintu, warna pintu berubah (hover effect).

2.  Minggu 2 The Logic (Scene Switching)
     Buat fungsi untuk menghapus semua objek Lobby.
     Buat fungsi kosong untuk memuat scene baru.
     Tes transisi (Lobby - Layar Hitam - Scene Kosong).

3.  Minggu 3 The Content (Majapahit)
     CariBuat model 3D Gapura Candi Bentar (banyak yang gratis di Sketchfab jika diperbolehkan, atau buat simpel di Blender).
     Load model tersebut ke scene baru.
     Tambahkan tekstur bata (Normal Map) agar terlihat realistis.
     Tambahkan UI teks penjelasan sejarah.

---
