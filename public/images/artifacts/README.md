# Folder Gambar Artifacts

Letakkan foto-foto artifact di folder ini.

## Format yang didukung:
- JPG/JPEG
- PNG
- WebP

## Ukuran yang disarankan:
- Lebar: 800px - 1200px
- Rasio: 16:9 atau 4:3

## Contoh penamaan file:
- `bharatayuddha.jpg`
- `prasasti-yupa.jpg`
- `candi-borobudur.png`
- `patung-ganesha.jpg`

## Cara menggunakan:
```javascript
const artifact = createArtifact(
    'inscription',
    0xFFD700,
    'Kitab Bharatayuddha',
    'Deskripsi artifact...',
    '/images/artifacts/bharatayuddha.jpg'  // ← Path lokal
);
```

## Atau gunakan URL eksternal:
```javascript
const artifact = createArtifact(
    'statue',
    0xFFD700,
    'Nama Artifact',
    'Deskripsi...',
    'https://example.com/image.jpg'  // ← URL eksternal
);
```
