# 🎓 Modern OJS (Open Journal Systems) — UNPRI Edition

Platform pengelolaan dan publikasi jurnal akademik modern yang dirancang khusus dengan performa tinggi, UI/UX premium kelas dunia, serta integrasi alur kerja editorial yang mulus.

---

## ✨ Tentang Proyek

**Modern OJS** adalah inisiatif modernisasi sistem jurnal akademik tradisional menjadi sebuah platform berestetika **Hybrid Premium SaaS Workstation**. Berbeda dengan tampilan OJS klasik yang cenderung kaku, Modern OJS menyajikan antarmuka pengguna yang responsif, dinamis, serta mengutamakan kenyamanan membaca dan produktivitas penulis serta reviewer.

### 💜 Filosofi Tema Warna: UNPRI Purple

Sistem ini didesain menggunakan palet warna dominan **Ungu Deep & Vibrant** (`#4F46E5` / `#6D28D9` / `#7C3AED`). Pilihan warna ini bukanlah tanpa alasan:
* **Identitas Universitas Prima Indonesia (UNPRI)**: Warna ungu merupakan warna kebanggaan dan identitas resmi dari **UNPRI**. Desain ini dirancang sebagai bentuk dedikasi dan keselarasan visual dengan identitas institusi kampus UNPRI.
* **Asetika Editorial Premium**: Kombinasi gradasi ungu tua melambangkan profesionalisme akademis yang mewah, dipadukan dengan permukaan kerja putih bersih (*crisp white surfaces*) untuk memastikan kenyamanan membaca artikel dalam waktu lama tanpa membuat mata lelah (*Zero-Eye-Strain*).

---

## 📂 Struktur Proyek

Proyek ini menggunakan arsitektur monorepo terpisah untuk mempermudah pengembangan berskala besar di masa mendatang:

```plaintext
modern-ojs/
├── frontend/          # Aplikasi Utama (Next.js App Router, Tailwind/Vanilla CSS, TypeScript)
├── backend/           # API & Database Service (Disiapkan untuk masa mendatang)
├── .gitignore         # Konfigurasi pengabaian file Git global
├── README.md          # Dokumentasi proyek utama ini
└── PANDUAN_PRESENTASI_UTS.md # Panduan presentasi UTS
```

---

## 🛠️ Teknologi yang Digunakan

### Frontend (Next.js Application)
* **Framework**: [Next.js 15+ (App Router)](https://nextjs.org) dengan React 19
* **Bahasa**: [TypeScript](https://www.typescriptlang.org)
* **Styling**: Vanilla CSS & Custom Tailwind CSS (SOP 5.6.0 "Zero ClassName" Design System)
* **Icons**: Lucide React

---

## 🚀 Cara Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal:

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan) dan npm/yarn di komputer Anda.

### Langkah-Langkah

1. **Masuk ke folder frontend**:
   ```bash
   cd frontend
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (development server)**:
   ```bash
   npm run dev
   ```

4. **Buka di Browser**:
   Buka browser kesayangan Anda dan akses ke halaman:
   ```plaintext
   http://localhost:3000
   ```

---

## 🌟 Fitur Utama Dashboard Penulis (Author Dashboard)

* **Dasbor Utama (Dashboard Hub)**: Widget aktivitas terintegrasi, ringkasan pengajuan jurnal, serta panduan cepat penulisan.
* **Sistem Pengajuan Jurnal Baru (New Submission)**: Alur pengiriman draf jurnal interaktif langkah demi langkah.
* **Pusat Pesan (Message Center)**: Kotak masuk pesan editorial untuk mempermudah komunikasi antara Penulis, Reviewer, dan Editor.
* **Manajemen Profil (Profile Management)**: Pengaturan informasi penulis dengan layout "box-in-box" premium.
* **Pusat Markah (Bookmarks & Saved Articles)**: Menyimpan artikel eksternal atau draf referensi untuk dibaca nanti.

---

*Dibuat dengan penuh dedikasi untuk memodernisasi ekosistem akademis Universitas Prima Indonesia (UNPRI).*
