# Arya Wiguna Portfolio — Agent Instructions

Baca file ini sebelum mengubah kode. Untuk panduan lengkap, baca:
`.agents/skills/arya-portfolio-redesign/SKILL.md`.

## Tujuan
Redesign `arya-wiguna.my.id` menjadi portfolio Software Engineer dengan arah **Modern Editorial + Subtle 3D**: off-white, navy, subtle blue, tipografi kuat, whitespace, project storytelling, dan interaksi yang tenang.

## Aturan wajib
1. **Audit sebelum mengubah.** Periksa framework, struktur folder, routing, konten, asset, dependency, deployment, dan fitur yang sudah berjalan.
2. Jangan menghapus atau mengganti konten, route, metadata, link, CV, sertifikat, atau fitur yang sudah ada sebelum memetakan dan memastikan penggantinya.
3. Jangan mengarang pengalaman, pencapaian, angka, klien, skill level, sertifikasi, maupun hasil proyek. Tandai informasi yang belum terverifikasi sebagai TODO untuk dikonfirmasi.
4. Gunakan Next.js App Router + TypeScript + Tailwind CSS hanya setelah memeriksa repository. Jika proyek saat ini memakai stack lain, buat rencana migrasi terlebih dahulu; jangan melakukan rewrite diam-diam.
5. Utamakan semantic HTML, aksesibilitas, responsive design, performa, SEO, dan progressive enhancement.
6. 3D hanya aksen pada hero. Website harus tetap lengkap dan usable jika WebGL tidak tersedia, gagal dimuat, atau reduced motion aktif.
7. Hindari AI-slop: jangan gunakan gradient ungu/biru generik, glassmorphism berlebihan, floating cards di semua section, blob/particle dekoratif, fake metrics, skill percentage tanpa dasar, atau animasi yang mengganggu.
8. Jangan menambahkan dependency besar sebelum menjelaskan manfaatnya dan memeriksa apakah fitur bisa dibuat dengan CSS/native API.
9. Jangan mengubah konfigurasi deployment, DNS, domain, secrets, atau environment production tanpa instruksi eksplisit.
10. Kerjakan bertahap. Setelah setiap fase, jalankan lint, typecheck, test/build yang tersedia dan laporkan hasil serta file yang berubah.

## Design direction
- Background: `#F5F4EF`
- Foreground: `#20252C`
- Navy: `#172A45`
- Navy light: `#24466F`
- Accent blue: `#4778A9`
- Soft blue: `#E6EDF5`
- Muted: `#777D85`
- Border: `#DCDDD7`
- Typography: Geist / Geist Display; Geist Mono untuk metadata teknis.
- Max content width: sekitar 1200px.
- Desktop page gutter: sekitar 64px; mobile: 20px.
- Editorial grid, strong hierarchy, whitespace, restrained borders, mostly square/soft corners.

## UX priorities
1. Selected work dan case studies harus mudah ditemukan.
2. Tampilkan kontribusi Arya secara akurat pada setiap proyek.
3. Navbar sederhana dan responsive.
4. About, expertise, experience, education, credentials, contact tetap tersedia.
5. Detail project menjelaskan context/problem, role, approach, implementation, evidence/screenshots, outcome/lessons.
6. Jangan menampilkan “available for work” kecuali dikonfirmasi.

## Working agreement
Mulai dengan audit dan laporan temuan. Jangan langsung generate seluruh website. Buat rencana migrasi dan content inventory, minta konfirmasi untuk keputusan yang berisiko, lalu implementasikan per fase.
