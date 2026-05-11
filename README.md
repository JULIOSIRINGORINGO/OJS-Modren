# 🎓 Modern OJS (Open Journal Systems) — UNPRI Edition

Platform pengelolaan dan publikasi jurnal akademik modern yang dirancang khusus dengan performa tinggi, UI/UX premium kelas dunia, serta integrasi alur kerja editorial yang mulus.

---

## ✨ Tentang Proyek

**Modern OJS** adalah inisiatif modernisasi sistem jurnal akademik tradisional menjadi sebuah platform berestetika **Hybrid Premium SaaS Workstation**. Berbeda dengan tampilan OJS klasik yang cenderung kaku, kusam, dan usang, Modern OJS menyajikan antarmuka pengguna yang responsif, dinamis, serta sangat memanjakan mata pembaca maupun tim redaksi.

### ⚡ Gaya Estetika: Neo-Brutalisme (Neo-Brutalist Design)

Halaman utama dan seluruh halaman publik tamu (*About*, *Submit*, *Contact*, dan *Download Template*) dirancang penuh menggunakan gaya **Neo-Brutalisme**. Alasan pemilihan gaya desain mutakhir ini meliputi:

1. **Disrupsi Visual yang Berani (Visual Disruption)**: Jurnal ilmiah tradisional biasanya memiliki desain monoton yang membosankan. Gaya Neo-Brutalisme yang berciri khas **garis tepi hitam yang tebal (`border-[3px] border-black`)**, **bayangan datar yang pekat (`shadow-[4px_4px_0px_0px_#000]`)**, serta **sudut-sudut kaku** memberikan identitas visual yang kuat, berani, dan langsung menarik perhatian pada pandangan pertama.
2. **Keterbacaan Berkinerja Tinggi**: Penggunaan tipografi sans-serif berbobot sangat tebal (*heavy bold sans*) dan teks huruf besar (*uppercase tags*) memastikan setiap informasi penting, tombol, dan kategori mudah dibaca dan dinavigasi dengan cepat (*high accessibility*).
3. **Sentuhan Interaktif & Taktil**: Setiap kartu informasi dirancang seolah-olah tombol fisik yang bisa ditekan. Saat kursor diarahkan (*hover*), kartu akan bergeser secara halus (`hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]`), meningkatkan keterlibatan interaksi pengguna (*micro-interactions*).

### 💜 Filosofi Tema Warna: UNPRI Purple & Pastel Accents

Sistem ini didesain secara khusus menyelaraskan identitas resmi kampus dengan aksen warna modern:
* **Ungu Utama Universitas Prima Indonesia (UNPRI)**: Warna ungu merupakan warna kebanggaan dan identitas resmi dari **UNPRI**. Kami menggunakan palet ungu premium (`#6D28D9` / `#7C3AED`) sebagai penegas identitas kampus pada komponen utama seperti tombol pendaftaran, ikon rujukan, dan sorotan tajuk.
* **Aksen Pastel Kontras Tinggi**: Dipadukan dengan warna-warna pastel Neo-Brutalis yang lembut namun kontras (seperti kuning pastel, biru langit pastel, dan emerald/mint pastel) untuk memberikan nuansa segar, menyenangkan, namun tetap mempertahankan fungsionalitas akademis yang terstruktur rapi.


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
