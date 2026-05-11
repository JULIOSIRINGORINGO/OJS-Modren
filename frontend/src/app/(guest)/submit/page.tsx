import Link from "next/link";
import { BookOpen, FileText, UserCheck, CheckSquare, RefreshCw, LogIn, UserPlus, ArrowRight } from "lucide-react";

export const metadata = { title: "Kirim Naskah — FAST-Journal" };

const submissionSteps = [
  {
    number: "1",
    title: "Tahap 1: Persiapan Naskah & Format",
    bgColor: "bg-purple-100",
    icon: FileText,
    details: [
      "Gunakan berkas format dokumen Microsoft Word (.docx).",
      "Isi naskah harus ditulis dan diatur ketat mengikuti Template Resmi Jurnal UNPRI.",
      "Sediakan abstrak singkat antara 150-300 kata dalam Bahasa Indonesia dan Bahasa Inggris.",
      "Pastikan file naskah utama tidak mencantumkan nama penulis (untuk proses double-blind peer review)."
    ]
  },
  {
    number: "2",
    title: "Tahap 2: Registrasi & Masuk Akun",
    bgColor: "bg-yellow-100",
    icon: UserCheck,
    details: [
      "Penulis wajib memiliki akun aktif di platform FAST-Journal.",
      "Jika belum memiliki akun, silakan daftar secara gratis melalui menu Daftar Akun.",
      "Gunakan alamat email aktif yang dapat dihubungi untuk pembaruan status naskah."
    ]
  },
  {
    number: "3",
    title: "Tahap 3: Pengajuan Melalui Dashboard",
    bgColor: "bg-blue-100",
    icon: CheckSquare,
    details: [
      "Masuk ke akun Anda, lalu arahkan ke menu Dashboard Penulis.",
      "Pilih menu Submissions lalu klik tombol New Submission.",
      "Isi semua metadata penting seperti Judul, Abstrak, Kata Kunci, serta Kontributor bersama (Co-authors).",
      "Unggah berkas naskah utama Anda pada kolom pengunggahan file yang tersedia."
    ]
  },
  {
    number: "4",
    title: "Tahap 4: Proses Peer-Review & Hasil",
    bgColor: "bg-emerald-100",
    icon: RefreshCw,
    details: [
      "Tim Editor akan melakukan penyaringan awal (screening) kesesuaian topik dan format.",
      "Naskah yang lolos screening akan ditinjau secara anonim oleh minimal 2 Reviewer ahli.",
      "Anda dapat memantau perkembangan tinjauan dan mengunduh revisi langsung dari Dashboard Anda."
    ]
  }
];

export default function SubmitPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="bg-yellow-50 border-b-[3px] border-black py-20 relative overflow-hidden">
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
            <BookOpen className="w-4 h-4 text-yellow-600 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Panduan Penulis
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-6">
            PANDUAN & CARA <br className="hidden sm:inline" />
            <span className="bg-yellow-300 px-3 border-2 border-black inline-block transform rotate-1 shadow-[4px_4px_0px_0px_#000] mt-2">
              KIRIM NASKAH JURNAL
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold leading-relaxed text-zinc-700 max-w-2xl mx-auto uppercase tracking-wide">
            Pelajari alur pengiriman karya ilmiah di FAST-Journal dari persiapan format hingga tahap publikasi akhir.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Step-by-Step Guideline */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-6 flex items-center gap-2.5">
              <span className="w-3 h-8 bg-purple-500 border border-black inline-block" />
              ALUR & CARA PENGIRIMAN
            </h2>
            
            <div className="space-y-6">
              {submissionSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="bg-white border-[3px] border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all relative overflow-hidden"
                  >
                    {/* Big Step Number on background */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-7xl font-black text-zinc-100 select-none z-0">
                      #{step.number}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3.5 mb-5">
                        <div className={`w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${step.bgColor}`}>
                          <Icon className="w-6 h-6 text-black stroke-[2.5px]" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                          {step.title}
                        </h3>
                      </div>
                      
                      <ul className="space-y-3.5">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-black shrink-0 mt-2" />
                            <p className="text-xs sm:text-sm font-bold text-zinc-600 uppercase tracking-wide">
                              {detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Alert & Quick Links */}
          <div className="space-y-8">
            {/* Login Notice Box */}
            <div className="bg-purple-100 border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 border-l-2 border-b-2 border-black rounded-bl-2xl opacity-50 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-black stroke-[2.5px]" />
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-tight text-black mb-4">
                MEMERLUKAN LOGIN PENULIS
              </h3>
              
              <p className="text-xs sm:text-sm font-bold leading-relaxed text-zinc-700 uppercase tracking-wide mb-6">
                Untuk alasan keamanan dan penelusuran draf berkas secara mandiri, pengiriman naskah utama tidak dapat dilakukan secara anonim melalui halaman publik. 
                <br /><br />
                Anda harus **masuk ke akun penulis** Anda terlebih dahulu untuk mengunggah naskah.
              </p>

              <div className="space-y-3">
                <Link
                  href="/masuk"
                  className="w-full inline-flex h-11 items-center justify-center rounded-xl border-[3px] border-black bg-primary text-primary-foreground font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all gap-2"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5px]" />
                  MASUK KE AKUN
                </Link>
                
                <Link
                  href="/daftar"
                  className="w-full inline-flex h-11 items-center justify-center rounded-xl border-[3px] border-black bg-white text-black font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all gap-2"
                >
                  <UserPlus className="w-4 h-4 stroke-[2.5px]" />
                  DAFTAR AKUN BARU
                </Link>
              </div>
            </div>

            {/* Template Shortcut Box */}
            <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-lg font-black uppercase tracking-tight text-black mb-3">
                SUDAH PUNYA TEMPLATE?
              </h3>
              <p className="text-xs font-bold leading-relaxed text-zinc-500 uppercase tracking-wide mb-5">
                Pastikan tulisan naskah Anda sudah rapi dan sesuai standar jurnal UNPRI sebelum mengunggah draf final.
              </p>
              
              <Link
                href="/template"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-600 hover:text-purple-800 hover:underline transition-colors group"
              >
                UNDUH TEMPLATE RESMI SEKARANG
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform stroke-[2.5px]" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
