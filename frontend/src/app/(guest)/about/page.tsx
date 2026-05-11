import { BookOpen, Users, Globe, Award, TrendingUp, ShieldCheck } from "lucide-react";

export const metadata = { title: "Tentang Kami — FAST-Journal" };

const stats = [
  { value: "1.200+", label: "Artikel Terbit", color: "bg-purple-100 text-purple-700" },
  { value: "48", label: "Kategori Ilmu", color: "bg-yellow-100 text-yellow-700" },
  { value: "320+", label: "Penulis Aktif", color: "bg-blue-100 text-blue-700" },
  { value: "12", label: "Volume Terbit", color: "bg-emerald-100 text-emerald-700" },
];

const editors = [
  {
    name: "Prof. Hendra Wijaya, Ph.D.",
    role: "Pemimpin Redaksi",
    institution: "Universitas Gadjah Mada",
    initials: "HW",
    bgColor: "bg-purple-200",
  },
  {
    name: "Dr. Siti Rahayu, M.Kom.",
    role: "Editor Pelaksana",
    institution: "Universitas Indonesia",
    initials: "SR",
    bgColor: "bg-yellow-200",
  },
  {
    name: "Dr. Budi Santoso, M.T.",
    role: "Editor Bidang AI",
    institution: "Institut Teknologi Bandung",
    initials: "BS",
    bgColor: "bg-blue-200",
  },
  {
    name: "Dr. Lina Marlina, M.Sc.",
    role: "Editor Bidang Data",
    institution: "Universitas Padjadjaran",
    initials: "LM",
    bgColor: "bg-emerald-200",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
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
          <div
            className="inline-flex items-center gap-2 rounded-full px-4.5 py-1.5 mb-6 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]"
          >
            <BookOpen className="w-4 h-4 text-purple-600 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Tentang Modern OJS
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-6">
            PLATFORM JURNAL AKADEMIK <br className="hidden sm:inline" />
            <span className="bg-purple-300 px-3 border-2 border-black inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_#000] mt-2">
              UNTUK ERA MODERN
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold leading-relaxed text-zinc-700 max-w-2xl mx-auto uppercase tracking-wide">
            FAST-Journal hadir untuk menjembatani para peneliti, penulis, dan pembaca dalam satu platform publikasi ilmiah yang terbuka, berkinerja tinggi, dan terpercaya.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-32px] relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div 
              key={s.label} 
              className="bg-white border-[3px] border-black p-6 text-center shadow-[4px_4px_0px_0px_#000] transition-transform hover:-translate-y-1"
            >
              <div className={`inline-block px-3 py-1 text-2xl sm:text-3xl font-black border-2 border-black rounded-lg ${s.color} shadow-[2px_2px_0px_0px_#000] mb-3`}>
                {s.value}
              </div>
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-black">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Visi */}
          <div
            className="bg-yellow-50 border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all"
          >
            <div className="w-12 h-12 rounded-lg border-2 border-black bg-yellow-200 flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_#000]">
              <Globe className="w-6 h-6 text-black stroke-[2.5px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-4">
              VISI UTAMA
            </h2>
            <p className="text-sm font-bold leading-relaxed text-zinc-700 uppercase tracking-wide">
              Menjadi platform jurnal akademik terdepan di Indonesia yang mendorong penyebaran ilmu pengetahuan secara terbuka, inklusif, dan berkelanjutan untuk kemajuan bangsa dan dedikasi penuh terhadap dunia akademis.
            </p>
          </div>

          {/* Misi */}
          <div
            className="bg-blue-50 border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all"
          >
            <div className="w-12 h-12 rounded-lg border-2 border-black bg-blue-200 flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_#000]">
              <Award className="w-6 h-6 text-black stroke-[2.5px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-4">
              MISI STRATEGIS
            </h2>
            <p className="text-sm font-bold leading-relaxed text-zinc-700 uppercase tracking-wide">
              Menyediakan infrastruktur digital berkualitas tinggi untuk penerbitan, tinjauan sejawat (peer review), dan aksesibilitas karya ilmiah dengan standar internasional yang ketat, modern, namun tetap ramah pengguna.
            </p>
          </div>
        </div>

        {/* Kenapa Memilih Kami */}
        <div className="bg-white border-[3px] border-black p-8 mb-16 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 border-l-2 border-b-2 border-black rounded-bl-3xl opacity-50" />
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-6">
            MENGAPA MEMILIH FAST-JOURNAL?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg border-2 border-black bg-purple-200 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <ShieldCheck className="w-5 h-5 text-black stroke-[2.5px]" />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-wide text-black mb-1">Peer Review yang Ketat</h4>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Menjamin kualitas artikel yang diterbitkan melalui tim reviewer ahli di bidangnya.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg border-2 border-black bg-emerald-200 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <TrendingUp className="w-5 h-5 text-black stroke-[2.5px]" />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-wide text-black mb-1">Diseminasi Terbuka</h4>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Mendukung penuh open-access untuk penyebaran ilmu tanpa batas di tingkat global.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dewan Editorial */}
        <div>
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-lg border-2 border-black bg-purple-200 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <Users className="w-5 h-5 text-black stroke-[2.5px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              DEWAN EDITORIAL
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {editors.map((editor) => (
              <div
                key={editor.name}
                className="bg-white border-[3px] border-black p-6 text-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
              >
                <div
                  className={`w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4 text-black font-black text-xl font-serif shadow-[2px_2px_0px_0px_#000] ${editor.bgColor}`}
                >
                  {editor.initials}
                </div>
                <p className="text-sm font-black uppercase tracking-wider text-black">
                  {editor.name}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mt-2 bg-purple-50 border border-black rounded px-2 py-0.5 inline-block">
                  {editor.role}
                </p>
                <p className="text-xs font-bold text-zinc-500 mt-3 uppercase tracking-wide">
                  {editor.institution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
