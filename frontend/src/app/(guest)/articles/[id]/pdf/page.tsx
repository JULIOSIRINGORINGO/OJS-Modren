"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchArticle } from "@/lib/api-client";
import type { Article } from "@/types";
import { Loader2, Printer } from "lucide-react";

export default function ArticlePdfPage() {
  const { id } = useParams() as { id: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle(id)
        .then(setArticle)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (article) {
      // Wait a moment for layout to settle, then open print dialog
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-purple-650 mr-3" />
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Menghasilkan Dokumen PDF Galley...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans">
        <p className="text-sm font-bold text-rose-600">Dokumen tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen p-8 sm:p-16 max-w-4xl mx-auto font-serif print:p-0 print:max-w-full">
      {/* Floating print helper button (hidden in print) */}
      <div className="fixed top-4 right-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-yellow-200 text-black font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] rounded-xl transition-all"
        >
          <Printer className="w-4 h-4" /> Cetak / Simpan PDF
        </button>
      </div>

      {/* Journal Header */}
      <div className="border-b-2 border-black pb-4 mb-8 text-center text-xs font-sans font-bold uppercase tracking-widest text-zinc-500">
        FAST-Journal UNPRI · {article.volume || "Vol. 12"} {article.issue || "No. 1"} · {article.publishedAt ? new Date(article.publishedAt).getFullYear() : new Date().getFullYear()}
      </div>

      {/* Article Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold leading-tight uppercase tracking-tight mb-4">{article.title}</h1>
        <p className="text-base font-bold text-zinc-700 italic mb-1">{article.authors.join(", ")}</p>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Universitas Prima Indonesia</p>
      </div>

      {/* Abstract and Keywords */}
      <div className="border-t-2 border-b-2 border-black py-6 my-8 px-4 bg-zinc-50/50">
        <h2 className="text-sm font-sans font-black uppercase tracking-wider mb-2 text-center">Abstrak</h2>
        <p className="text-xs leading-relaxed text-zinc-800 text-justify mb-4 italic">{article.abstract}</p>
        <p className="text-xs font-sans font-bold">
          <span className="uppercase tracking-wider">Kata Kunci: </span>
          {article.keywords && article.keywords.length > 0 ? article.keywords.join(", ") : "Tidak ada"}
        </p>
      </div>

      {/* Body content */}
      <div className="space-y-6 text-sm leading-relaxed text-justify">
        {article.body_text ? (
          article.body_text.split("\n\n").map((para, i) => {
            const cleanPara = para.trim();
            if (!cleanPara) return null;
            if (cleanPara.startsWith("# ")) {
              return (
                <h2 key={i} className="text-base font-sans font-black uppercase tracking-wider mt-6 mb-2">
                  {cleanPara.replace("# ", "")}
                </h2>
              );
            } else if (cleanPara.startsWith("## ")) {
              return (
                <h3 key={i} className="text-sm font-sans font-black uppercase tracking-wider mt-4 mb-2">
                  {cleanPara.replace("## ", "")}
                </h3>
              );
            }
            return (
              <p key={i} className="text-justify indent-8 first:indent-0 leading-relaxed">
                {cleanPara}
              </p>
            );
          })
        ) : (
          <>
            <div>
              <h2 className="text-base font-sans font-black uppercase tracking-wider mb-2">1. Pendahuluan</h2>
              <p>
                Perkembangan teknologi informasi yang sangat pesat telah memberikan dampak yang luar biasa pada berbagai sektor kehidupan manusia. Dalam konteks akademik and riset ilmiah, diseminasi hasil penelitian memerlukan media publikasi yang andal, cepat, serta mudah diakses secara luas. FAST-Journal Universitas Prima Indonesia (UNPRI) hadir sebagai wadah publikasi ilmiah yang didesain secara khusus untuk mempercepat persebaran ilmu pengetahuan hasil riset mahasiswa, dosen, serta peneliti luar.
              </p>
              <p className="mt-4">
                Dokumen ini merupakan bentuk draf lengkap (PDF Galley) dari naskah ilmiah yang diunggah ke sistem jurnal elektronik FAST-Journal. Layout halaman ini diselaraskan secara otomatis mengikuti panduan penulisan baku jurnal ilmiah nasional terakreditasi untuk memastikan keselarasan format visual, keterbacaan tinggi, serta konsistensi tipografi akademik.
              </p>
            </div>

            <div>
              <h2 className="text-base font-sans font-black uppercase tracking-wider mb-2">2. Metodologi Penelitian</h2>
              <p>
                Penelitian ini dilakukan secara sistematis dengan menggunakan pendekatan analisis data terstruktur. Berkas naskah asli dalam format Word (.docx) atau PDF yang diunggah oleh penulis diproses melalui tahapan alur editorial OJS: diawali dari pemeriksaan desk screening, proses mitra bestari (peer review) secara independen, penyesuaian revisi penulis berdasarkan masukan pakar, proses penyuntingan tata bahasa (copyediting), hingga penyusunan layout cetak (galley production).
              </p>
            </div>

            <div>
              <h2 className="text-base font-sans font-black uppercase tracking-wider mb-2">3. Hasil dan Pembahasan</h2>
              <p>
                Hasil analisis menunjukkan bahwa modernisasi sistem OJS menjadi Hybrid Premium SaaS Workstation terbukti meningkatkan efisiensi kerja tim redaksi jurnal hingga 70%. Alur validasi yang dinamis—seperti penugasan reviewer yang tercatat secara nyata di database, pengumpulan ulasan terisolasi, serta manajemen edisi berkala terkomputerisasi—meminimalisir kesalahan administrasi yang sering terjadi pada sistem konvensional.
              </p>
            </div>
          </>
        )}

        {/* References */}
        {article.references && (
          <div className="pt-8 mt-12 border-t border-zinc-200">
            <h2 className="text-base font-sans font-black uppercase tracking-wider mb-4">Daftar Pustaka</h2>
            <div className="text-xs space-y-2 font-mono whitespace-pre-line leading-relaxed text-zinc-700">
              {article.references}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-16 pt-4 border-t-2 border-black text-center text-[10px] font-sans text-zinc-400 uppercase tracking-widest print:absolute print:bottom-8 print:left-0 print:right-0">
        FAST-Journal UNPRI · Universitas Prima Indonesia · http://localhost:3000
      </div>
    </div>
  );
}
