export const metadata = { title: "Kebijakan" };

const sections = [
  {
    title: "Kebijakan Privasi",
    content:
      "Modern OJS berkomitmen untuk melindungi privasi pengguna. Data pribadi yang Anda berikan hanya digunakan untuk keperluan pengelolaan akun, proses submission, dan komunikasi editorial. Kami tidak membagikan data kepada pihak ketiga tanpa persetujuan Anda, kecuali jika diwajibkan oleh hukum.",
  },
  {
    title: "Kebijakan Akses Terbuka",
    content:
      "Seluruh artikel yang diterbitkan oleh Modern OJS tersedia secara gratis untuk dibaca, diunduh, dan disebarluaskan. Kami menerapkan lisensi Creative Commons Attribution (CC BY 4.0) yang memungkinkan penggunaan bebas dengan tetap mencantumkan atribusi kepada penulis asli.",
  },
  {
    title: "Kebijakan Tinjauan Sejawat",
    content:
      "Modern OJS menerapkan proses tinjauan sejawat double-blind (kedua pihak anonim). Setiap naskah dinilai oleh minimal dua orang peninjau independen yang ahli di bidangnya. Proses tinjauan berlangsung maksimal 45 hari kerja. Keputusan editorial bersifat final dan tidak dapat diganggu gugat.",
  },
  {
    title: "Kebijakan Plagiarisme",
    content:
      "Seluruh naskah yang masuk akan diproses melalui perangkat deteksi kemiripan teks. Naskah dengan kemiripan di atas 20% akan dikembalikan kepada penulis untuk direvisi. Plagiarisme yang terbukti akan mengakibatkan penolakan permanen dan pelaporan ke institusi asal penulis.",
  },
  {
    title: "Kebijakan Retraksi",
    content:
      "Jika ditemukan kesalahan serius, pelanggaran etika, atau ketidakakuratan data pada artikel yang telah diterbitkan, Modern OJS berhak menerbitkan retraksi setelah melalui proses investigasi yang adil dan transparan sesuai panduan COPE.",
  },
];

export default function KebijakanPage() {
  return (
    <div>
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Kebijakan Jurnal</h1>
          <p className="font-sans" style={{ color: "rgba(255,255,255,0.75)" }}>
            Ketentuan dan kebijakan resmi yang mengatur penerbitan di Modern OJS
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border p-8"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: "#09090B" }}>
                {s.title}
              </h2>
              <p className="font-sans leading-relaxed" style={{ color: "#71717A" }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
