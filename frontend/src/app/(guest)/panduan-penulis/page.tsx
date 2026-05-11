export const metadata = { title: "Panduan Penulis" };

const steps = [
  {
    step: "01",
    title: "Persyaratan Umum",
    items: [
      "Naskah belum pernah diterbitkan dan tidak sedang dalam proses review di jurnal lain",
      "Ditulis dalam Bahasa Indonesia atau Bahasa Inggris yang baik dan benar",
      "Panjang naskah: 4.000–8.000 kata (termasuk referensi)",
      "Format file: Microsoft Word (.docx) atau LaTeX (.tex)",
    ],
  },
  {
    step: "02",
    title: "Struktur Naskah",
    items: [
      "Judul: ringkas, informatif, maksimal 15 kata",
      "Abstrak: 150–250 kata dalam satu paragraf",
      "Kata kunci: 4–6 kata, dipisahkan koma",
      "Pendahuluan, Metode, Hasil, Diskusi, Kesimpulan, Referensi",
    ],
  },
  {
    step: "03",
    title: "Format Penulisan",
    items: [
      "Font: Times New Roman 12pt, spasi 1,5",
      "Margin: 2,5 cm semua sisi",
      "Gambar dan tabel diberi judul dan nomor urut",
      "Persamaan matematis diberi nomor di sisi kanan",
    ],
  },
  {
    step: "04",
    title: "Gaya Sitasi",
    items: [
      "Gunakan format APA 7th Edition untuk referensi",
      "Minimal 20 referensi dari jurnal bereputasi",
      "Referensi dalam 5 tahun terakhir minimal 60%",
      "Hindari sitasi diri berlebihan (maks. 10%)",
    ],
  },
  {
    step: "05",
    title: "Proses Setelah Pengiriman",
    items: [
      "Konfirmasi penerimaan dikirim dalam 3 hari kerja",
      "Pemeriksaan awal (desk review) oleh editor: 7–14 hari",
      "Proses tinjauan sejawat: 30–45 hari",
      "Keputusan editorial disampaikan melalui email",
    ],
  },
];

export default function PanduanPenulisPage() {
  return (
    <div>
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Panduan Penulis</h1>
          <p className="font-sans" style={{ color: "rgba(255,255,255,0.75)" }}>
            Panduan lengkap untuk mempersiapkan dan mengirimkan naskah ke Modern OJS
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border p-8"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <div className="flex items-start gap-5">
                <span
                  className="font-serif text-3xl font-bold shrink-0"
                  style={{ color: "rgba(45,58,140,0.2)" }}
                >
                  {s.step}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: "#09090B" }}>
                    {s.title}
                  </h2>
                  <ul className="space-y-2">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ backgroundColor: "#6366F1" }}
                        />
                        <span className="font-sans text-sm leading-relaxed" style={{ color: "#71717A" }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl p-6 text-center"
          style={{ backgroundColor: "rgba(45,58,140,0.05)", borderRadius: "1rem" }}
        >
          <p className="font-sans text-sm" style={{ color: "#374151" }}>
            Pertanyaan lebih lanjut?{" "}
            <a href="/contact" className="font-medium" style={{ color: "#6366F1" }}>
              Hubungi tim redaksi kami
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
