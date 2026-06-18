import { BookOpen } from "lucide-react";

export const metadata = { title: "Kebijakan Jurnal — FAST-Journal" };

const sections = [
  {
    title: "Kebijakan Privasi",
    bgColor: "bg-purple-50",
    content:
      "FAST-Journal berkomitmen untuk melindungi privasi pengguna. Data pribadi yang Anda berikan hanya digunakan untuk keperluan pengelolaan akun, proses submission, dan komunikasi editorial. Kami tidak membagikan data kepada pihak ketiga tanpa persetujuan Anda, kecuali jika diwajibkan oleh hukum.",
  },
  {
    title: "Kebijakan Akses Terbuka",
    bgColor: "bg-yellow-50",
    content:
      "Seluruh artikel yang diterbitkan oleh FAST-Journal tersedia secara gratis untuk dibaca, diunduh, dan disebarluaskan. Kami menerapkan lisensi Creative Commons Attribution (CC BY 4.0) yang memungkinkan penggunaan bebas dengan tetap mencantumkan atribusi kepada penulis asli.",
  },
  {
    title: "Kebijakan Tinjauan Sejawat",
    bgColor: "bg-blue-50",
    content:
      "FAST-Journal menerapkan proses tinjauan sejawat double-blind (kedua pihak anonim). Setiap naskah dinilai oleh minimal dua orang peninjau independen yang ahli di bidangnya. Proses tinjauan berlangsung maksimal 45 hari kerja. Keputusan editorial bersifat final dan tidak dapat diganggu gugat.",
  },
  {
    title: "Kebijakan Plagiarisme",
    bgColor: "bg-emerald-50",
    content:
      "Seluruh naskah yang masuk akan diproses melalui perangkat deteksi kemiripan teks. Naskah dengan kemiripan di atas 20% akan dikembalikan kepada penulis untuk direvisi. Plagiarisme yang terbukti akan mengakibatkan penolakan permanen dan pelaporan ke institusi asal penulis.",
  },
  {
    title: "Kebijakan Retraksi",
    bgColor: "bg-rose-50",
    content:
      "Jika ditemukan kesalahan serius, pelanggaran etika, atau ketidakakuratan data pada artikel yang telah diterbitkan, FAST-Journal berhak menerbitkan retraksi setelah melalui proses investigasi yang adil dan transparan sesuai panduan COPE.",
  },
];

export default function KebijakanPage() {
  return (
    <div className="pb-24">
      {/* Neubrutalist Header Section */}
      <div className="bg-purple-50 border-b-[3px] border-black py-20 relative overflow-hidden">
        {/* Decorative Grid Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4.5 py-1.5 mb-6 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
            <BookOpen className="w-4 h-4 text-purple-600 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Regulasi & Etika
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-6">
            KEBIJAKAN RESMI <br className="hidden sm:inline" />
            <span className="bg-purple-300 px-3 border-2 border-black inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_#000] mt-2">
              PUBLIKASI JURNAL
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold leading-relaxed text-zinc-700 max-w-2xl mx-auto uppercase tracking-wide">
            Ketentuan hukum, lisensi akses terbuka, dan standar etik akademik yang berlaku di platform FAST-Journal.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[7px_7px_0px_0px_#000] transition-all ${s.bgColor}`}
            >
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mb-4 flex items-center gap-3">
                <span className="w-2.5 h-6 bg-black border border-black inline-block" />
                {s.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold leading-relaxed text-zinc-700 uppercase tracking-wide">
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
