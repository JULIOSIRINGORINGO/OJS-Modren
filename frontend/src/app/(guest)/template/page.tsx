"use client";

import { useState } from "react";
import { BookOpen, FileSpreadsheet, FileText, FileCode, Download, CheckCircle, ArrowRight } from "lucide-react";

const templates = [
  {
    title: "Template Naskah (DOCX)",
    desc: "Format Microsoft Word resmi yang wajib digunakan oleh seluruh pengirim naskah di FAST-Journal.",
    size: "142 KB",
    version: "v2.1 (Terbaru)",
    icon: FileSpreadsheet,
    filename: "Template_Jurnal_UNPRI.docx",
    bgColor: "bg-blue-100",
    btnColor: "bg-primary text-primary-foreground",
  },
  {
    title: "Template Naskah (LaTeX)",
    desc: "Paket berkas LaTeX terkompresi lengkap untuk peneliti di bidang Ilmu Komputer atau Kecerdasan Buatan.",
    size: "1.2 MB",
    version: "v1.5",
    icon: FileCode,
    filename: "Template_Jurnal_UNPRI_LaTeX.zip",
    bgColor: "bg-purple-100",
    btnColor: "bg-yellow-300 text-black",
  },
  {
    title: "Panduan Gaya Penulisan (PDF)",
    desc: "Berkas PDF detail mengenai struktur artikel, tata cara sitasi, ukuran margin, dan ketentuan gambar.",
    size: "420 KB",
    version: "v3.0",
    icon: FileText,
    filename: "Panduan_Penulisan_UNPRI.pdf",
    bgColor: "bg-emerald-100",
    btnColor: "bg-white text-black",
  },
];

export default function TemplatePage() {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const handleDownload = (filename: string) => {
    setDownloadingFile(filename);
    
    // Create a mock download of a blank text file renamed as the requested asset
    const blob = new Blob(["Mock template file content for " + filename], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setDownloadingFile(null);
    }, 3000);
  };

  return (
    <div className="pb-24 relative">
      {/* Page Header */}
      <div className="bg-emerald-50 border-b-[3px] border-black py-20 relative overflow-hidden">
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
            <BookOpen className="w-4 h-4 text-emerald-600 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Aset Penulisan
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-6">
            UNDUH TEMPLATE <br className="hidden sm:inline" />
            <span className="bg-emerald-300 px-3 border-2 border-black inline-block transform rotate-1 shadow-[4px_4px_0px_0px_#000] mt-2">
              NASKAH JURNAL
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold leading-relaxed text-zinc-700 max-w-2xl mx-auto uppercase tracking-wide">
            Gunakan berkas acuan resmi Universitas Prima Indonesia (UNPRI) untuk mempermudah proses review dan penerbitan naskah ilmiah Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Important Warning */}
        <div className="bg-yellow-100 border-[3px] border-black p-6 mb-12 shadow-[4px_4px_0px_0px_#000] max-w-4xl mx-auto">
          <h3 className="text-base font-black uppercase tracking-tight text-black mb-1.5">
            ⚠️ PERINGATAN PENTING SEBELUM MENULIS
          </h3>
          <p className="text-xs sm:text-sm font-bold leading-relaxed text-zinc-700 uppercase tracking-wide">
            Format naskah yang tidak sesuai dengan template resmi akan **otomatis ditolak** oleh tim editor sebelum masuk ke tahap peer-review. Pastikan Anda telah menyalin artikel Anda ke dalam template Microsoft Word (.docx) di bawah ini dengan tepat.
          </p>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.title}
                className="bg-white border-[3px] border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${tpl.bgColor}`}>
                      <Icon className="w-6 h-6 text-black stroke-[2.5px]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-50 border border-black rounded px-2 py-0.5">
                      {tpl.size}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black mb-3">
                    {tpl.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm font-bold leading-relaxed text-zinc-500 uppercase tracking-wide mb-6">
                    {tpl.desc}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between border-t border-black pt-4 mb-5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    <span>Versi</span>
                    <span className="text-black">{tpl.version}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(tpl.filename)}
                    className={`w-full inline-flex h-11 items-center justify-center rounded-xl border-[3px] border-black font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all gap-2 ${tpl.btnColor}`}
                  >
                    <Download className="w-4 h-4 stroke-[2.5px]" />
                    UNDUH FILE
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to submit page */}
        <div className="mt-16 text-center">
          <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-400 mb-4">
            Sudah selesai merapikan naskah sesuai template?
          </p>
          <a
            href="/submit"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-purple-600 hover:text-purple-800 hover:underline transition-colors group"
          >
            LIHAT CARA PENGIRIMAN NASKAH
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform stroke-[2.5px]" />
          </a>
        </div>
      </div>

      {/* Floating Success Toast */}
      {downloadingFile && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-100 border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000] animate-bounce flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-black bg-emerald-300 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-black stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-black">Unduhan Berhasil!</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">{downloadingFile}</p>
          </div>
        </div>
      )}
    </div>
  );
}
