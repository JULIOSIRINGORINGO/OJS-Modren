import { BookOpen, Users, Globe, Award } from "lucide-react";

export const metadata = { title: "Tentang Kami" };

const stats = [
  { value: "1.200+", label: "Artikel Diterbitkan" },
  { value: "48", label: "Kategori Ilmu" },
  { value: "320+", label: "Penulis Aktif" },
  { value: "12", label: "Volume Terbit" },
];

const editors = [
  {
    name: "Prof. Hendra Wijaya, Ph.D.",
    role: "Pemimpin Redaksi",
    institution: "Universitas Gadjah Mada",
    initials: "HW",
  },
  {
    name: "Dr. Siti Rahayu, M.Kom.",
    role: "Editor Pelaksana",
    institution: "Universitas Indonesia",
    initials: "SR",
  },
  {
    name: "Dr. Budi Santoso, M.T.",
    role: "Editor Bidang AI",
    institution: "Institut Teknologi Bandung",
    initials: "BS",
  },
  {
    name: "Dr. Lina Marlina, M.Sc.",
    role: "Editor Bidang Data",
    institution: "Universitas Padjadjaran",
    initials: "LM",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Page Header */}
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}
          >
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-medium font-sans text-white">Tentang Modern OJS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Platform Jurnal Akademik<br />untuk Era Modern
          </h1>
          <p className="text-lg font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            Modern OJS hadir untuk menjembatani para peneliti, penulis, dan pembaca dalam satu platform publikasi ilmiah yang terbuka, cepat, dan terpercaya.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b" style={{ borderColor: "#E4E4E7", backgroundColor: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-4xl font-bold" style={{ color: "#6366F1" }}>
                  {s.value}
                </p>
                <p className="text-sm font-sans mt-1" style={{ color: "#71717A" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Misi & Visi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div
            className="p-8 rounded-2xl border"
            style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(45,58,140,0.08)" }}
            >
              <Globe className="w-5 h-5" style={{ color: "#6366F1" }} />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-3" style={{ color: "#09090B" }}>
              Visi
            </h2>
            <p className="font-sans leading-relaxed" style={{ color: "#71717A" }}>
              Menjadi platform jurnal akademik terdepan di Indonesia yang mendorong penyebaran ilmu pengetahuan secara terbuka, inklusif, dan berkelanjutan untuk kemajuan bangsa.
            </p>
          </div>
          <div
            className="p-8 rounded-2xl border"
            style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
            >
              <Award className="w-5 h-5" style={{ color: "#F59E0B" }} />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-3" style={{ color: "#09090B" }}>
              Misi
            </h2>
            <p className="font-sans leading-relaxed" style={{ color: "#71717A" }}>
              Menyediakan infrastruktur digital berkualitas tinggi untuk penerbitan, tinjauan sejawat, dan aksesibilitas karya ilmiah dengan standar internasional yang ketat namun ramah pengguna.
            </p>
          </div>
        </div>

        {/* Dewan Editorial */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5" style={{ color: "#6366F1" }} />
            <h2 className="font-serif text-2xl font-semibold" style={{ color: "#09090B" }}>
              Dewan Editorial
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {editors.map((editor) => (
              <div
                key={editor.name}
                className="p-6 rounded-xl border text-center"
                style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-semibold text-lg font-serif"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                >
                  {editor.initials}
                </div>
                <p className="font-serif text-sm font-semibold" style={{ color: "#09090B" }}>
                  {editor.name}
                </p>
                <p className="text-xs font-sans mt-1" style={{ color: "#6366F1" }}>
                  {editor.role}
                </p>
                <p className="text-xs font-sans mt-0.5" style={{ color: "#71717A" }}>
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
