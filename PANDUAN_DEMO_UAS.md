# 📚 PANDUAN DEMO UJIAN PRAKTIKUM UAS (FAST-Journal UNPRI)

Panduan ini dibuat untuk membantu Anda menjawab pertanyaan dosen penguji atau mendemokan kode program berdasarkan **7 Kriteria Praktikum UAS**. Anda cukup membuka file-file yang disebutkan di bawah ini pada text editor saat melakukan presentasi.

---

## 📂 PETA KODE BERDASARKAN KRITERIA UAS

### 1. Tampilan Halaman (UI/UX)
* **Keterangan**: Desain antarmuka neubrutalis modern yang responsif, layout tombol bebas dari *overflow/offside*, dan visualisasi **4 Tab OJS asli** dengan sistem modal kustom.
* **File yang Harus Dibuka**:
  1. 📄 Halaman 4 Tab Utama (Guest/Author) ➡️ [page.tsx (Detail Artikel)](file:///home/julio/Journal/modern-ojs/frontend/src/app/(guest)/articles/[id]/page.tsx)
  2. 📄 Halaman Keputusan Editor ➡️ [page.tsx (Admin Submissions)](file:///home/julio/Journal/modern-ojs/frontend/src/app/(admin)/admin/submissions/[id]/page.tsx)
  3. 📄 Halaman Dasbor Reviewer ➡️ [page.tsx (Reviewer Dashboard)](file:///home/julio/Journal/modern-ojs/frontend/src/app/(dashboard)/dashboard/reviews/page.tsx)
  4. 📄 File Style Utama (CSS) ➡️ [globals.css](file:///home/julio/Journal/modern-ojs/frontend/src/app/globals.css)

---

### 2. Setting API di FrontEnd
* **Keterangan**: Penggunaan fetch wrapper berotentikasi, pengiriman file fisik dengan `FormData`, dan mekanisme polling otomatis 3 detik sekali.
* **File yang Harus Dibuka**:
  1. 📄 File API Client Sentral ➡️ [api-client.ts](file:///home/julio/Journal/modern-ojs/frontend/src/lib/api-client.ts) *(Lihat fungsi `updateArticleStatus` dan `uploadArticleFile`)*
  2. 📄 Logika Polling Data Real-time ➡️ [page.tsx (Detail Artikel)](file:///home/julio/Journal/modern-ojs/frontend/src/app/(guest)/articles/[id]/page.tsx#L110-L127) *(Cari blok `useEffect` yang berisi `setInterval`)*

---

### 3. Routing Frontend
* **Keterangan**: Penggunaan fitur routing berbasis folder (*App Router*) di Next.js dengan parameter dinamis `[id]`.
* **File & Folder yang Berkaitan**:
  - `frontend/src/app/(guest)/articles/[id]/page.tsx` ➡️ Mengakses rute `/articles/:id` (Halaman utama paper).
  - `frontend/src/app/(admin)/admin/submissions/[id]/page.tsx` ➡️ Mengakses rute `/admin/submissions/:id` (Halaman editor).
  - `frontend/src/app/(dashboard)/dashboard/reviews/[id]/page.tsx` ➡️ Mengakses rute `/dashboard/reviews/:id` (Formulir reviewer).
  - `frontend/src/app/(guest)/issues/page.tsx` ➡️ Mengakses rute `/issues` (Daftar edisi terbitan).

---

### 4. Routing Backend
* **Keterangan**: Pendefinisian rute RESTful resource Rails dan rute khusus untuk penanganan berkas naskah.
* **File yang Harus Dibuka**:
  - 📄 File Konfigurasi Rute ➡️ [routes.rb](file:///home/julio/Journal/modern-ojs/backend/config/routes.rb) *(Perhatikan bagian `resources :articles` dan member action `upload_file` dan `serve_file`)*

---

### 5. Pengaturan MVC di Ruby on Rails
* **Keterangan**: Penerapan arsitektur *headless API* di mana Rails mengelola Model (ActiveRecord) dan Controller (Logic) dan mengembalikan format JSON (sebagai pengganti View HTML).
* **File yang Harus Dibuka**:
  - **M** (Model) ➡️ [article.rb](file:///home/julio/Journal/modern-ojs/backend/app/models/article.rb) *(Representasi tabel database)*
  - **C** (Controller) ➡️ [articles_controller.rb](file:///home/julio/Journal/modern-ojs/backend/app/controllers/api/articles_controller.rb) *(Mengatur alur logika naskah)*
  - **V** (View/Serializer JSON) ➡️ [articles_controller.rb](file:///home/julio/Journal/modern-ojs/backend/app/controllers/api/articles_controller.rb#L345-L388) *(Lihat metode `article_response` yang menyusun keluaran data format JSON)*

---

### 6. Struktur Database
* **Keterangan**: Definisi tabel relasional, foreign keys, tipe data berkas, dan pengisian data awal (*seeding database*).
* **File yang Harus Dibuka**:
  1. 📄 Struktur Schema Database ➡️ [schema.rb](file:///home/julio/Journal/modern-ojs/backend/db/schema.rb) *(Tunjukkan tabel `articles` dan relasinya dengan `review_assignments`)*
  2. 📄 Seed Data Akun Uji Coba ➡️ [seeds.rb](file:///home/julio/Journal/modern-ojs/backend/db/seeds.rb) *(Tunjukkan akun author, editor, dan reviewer yang sudah di-generate otomatis)*

---

### 7. Fitur-Fitur yang Dikembangkan
* **Keterangan**: Logika alur proses naskah dari ulasan bertahap hingga penerbitan naskah PDF asli.
* **File yang Harus Dibuka (Berdasarkan Fitur)**:
  - **Review Bertahap (Rounds)**: [articles_controller.rb](file:///home/julio/Journal/modern-ojs/backend/app/controllers/api/articles_controller.rb#L107-L114) *(Increment round & ubah status naskah)*
  - **Auto-Populate Reviewer Comments**: [articles_controller.rb](file:///home/julio/Journal/modern-ojs/backend/app/controllers/api/articles_controller.rb#L121-L137) *(Generator rangkuman review otomatis)*
  - **Upload & Serving File Nyata**: [articles_controller.rb](file:///home/julio/Journal/modern-ojs/backend/app/controllers/api/articles_controller.rb#L214-L248) *(Fungsi `upload_file` & `serve_file`)*
  - **Keamanan Blind Review**: [page.tsx (Detail Artikel)](file:///home/julio/Journal/modern-ojs/frontend/src/app/(guest)/articles/[id]/page.tsx#L625-L660) *(Filter data komentar agar identitas penilai tersembunyi bagi penulis)*

---

## 🚀 PANDUAN LANGKAH DEMO DI BROWSER

1. **Persiapan Akun**: Tunjukkan file `DAFTAR_AKUN.md` untuk memperlihatkan kredensial masuk akun uji coba (Andi Prasetyo - Author, Hendra Wijaya - Editor, Dewi Kusuma - Reviewer).
2. **Tab 1 (Author)**: Masuk sebagai Andi Prasetyo. Tunjukkan naskah dalam status *Under Review* dan jelaskan menu 4 Tab OJS.
3. **Tab 2 (Reviewer)**: Masuk sebagai Dewi Kusuma. Buka naskah ulasan, tekan tombol **Baca Naskah** (tunjukkan PDF asli terbuka), isi rekomendasi "Minta Revisi" dan tulis ulasan, lalu kirim.
4. **Tab 3 (Editor)**: Masuk sebagai Hendra Wijaya. Tunjukkan bahwa ulasan Dewi Kusuma masuk secara real-time. Pilih keputusan "Terima & Terbitkan", tunjukkan kolom catatan **terisi otomatis** oleh sistem, lalu unggah berkas PDF final asli dan surat LoA.
5. **Kembali ke Tab 1 (Author)**: Tunjukkan perubahan tab aktif menjadi **Diterbitkan** secara otomatis (real-time tanpa refresh). Penulis sekarang dapat mengklik tombol **PDF (Full Text)** untuk melihat naskah aslinya di browser dan mengunduh surat LoA yang sah!
