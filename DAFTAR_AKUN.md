# Daftar Akun Uji Coba (FAST-Journal UNPRI)

Berikut adalah daftar akun yang dibuat secara otomatis oleh sistem melalui berkas `db/seeds.rb` untuk pengujian aplikasi FAST-Journal UNPRI. Anda dapat menggunakan akun-akun ini untuk masuk (login) ke dashboard masing-masing peran.

---

## 🔑 Detail Akun Masuk (Credentials)

| Nama Lengkap | Peran (Role) | Email | Kata Sandi (Password) | Institusi |
| :--- | :--- | :--- | :--- | :--- |
| **Andi Prasetyo** | Penulis (Author) | `andi.prasetyo@ui.ac.id` | `password123` | Universitas Indonesia |
| **Hendra Wijaya** | Editor / Admin | `hendra@ugm.ac.id` | `password123` | Universitas Gadjah Mada |
| **Dewi Kusuma** | Peninjau (Reviewer) | `dewi.k@itb.ac.id` | `password123` | Institut Teknologi Bandung |

---

## 📂 Hak Akses Masing-Masing Peran

### 1. ✍️ Penulis (Author) — *Andi Prasetyo*
* **Akses**: Halaman Pengajuan Naskah Baru (`/dashboard/submissions/new`) dan Naskah Saya.
* **Fitur**:
  * Mengajukan naskah baru dengan mengunggah draf (Word/PDF).
  * Melihat status naskah yang diajukan (misalnya: *Sedang Ditinjau*, *Perlu Revisi*).
  * Mengirim berkas revisi beserta keterangan perbaikan jika diminta oleh Editor.
  * Berdiskusi melalui balon chat (bubble chat) langsung dengan Editor di menu **Pesan & Diskusi**.

### 2. 📑 Editor / Admin — *Hendra Wijaya*
* **Akses**: Halaman Panel Editor (`/admin/submissions`).
* **Fitur**:
  * Melihat semua daftar naskah masuk di sistem.
  * Memberikan keputusan editor (seperti: *Reviewer Ditugaskan*, *Perlu Revisi*, *Kirim ke Copyediting*, *Kirim ke Produksi*, *Ditolak*, atau *Diterbitkan*).
  * Mengirim pesan instruksi/revisi langsung ke Penulis.
  * Mengelola data kategori, template, panduan penulisan, dan pengaturan jurnal.

### 3. 🔍 Peninjau (Reviewer) — *Dewi Kusuma*
* **Akses**: Halaman Peninjauan (`/dashboard/reviews`).
* **Fitur**:
  * Melakukan review terhadap naskah ilmiah yang ditugaskan oleh Editor.
  * Mengirimkan catatan review balik ke tim redaksi.

---

## 💡 Petunjuk Penggunaan
1. Jalankan aplikasi frontend (`npm run dev`) dan backend Rails (`rails s`).
2. Masuk ke halaman **Masuk** (`/masuk`).
3. Gunakan salah satu email di atas dengan kata sandi `password123`.
4. Anda dapat menggunakan tab samaran (incognito tab) atau browser yang berbeda untuk mensimulasikan diskusi dua arah secara real-time antara **Penulis** dan **Editor** karena sesi masuk saat ini menggunakan `sessionStorage` (otomatis logout jika tab ditutup).
