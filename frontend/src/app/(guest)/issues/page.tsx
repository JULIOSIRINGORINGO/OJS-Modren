import Link from "next/link";
import { mockArticles } from "@/lib/mock-data";
import { Eye, Download, BookOpen, Calendar, ArrowUpRight, FolderOpen } from "lucide-react";

export const metadata = { title: "Terbitan Jurnal — FAST-Journal" };

const volumes = [
  {
    volume: "Vol. 12",
    year: "2025",
    issues: [
      { label: "Edisi 2 (April 2025)", articles: mockArticles.filter((a) => a.volume === "Vol. 12" && a.issue === "Edisi 2") },
      { label: "Edisi 1 (Januari 2025)", articles: mockArticles.filter((a) => a.volume === "Vol. 12" && a.issue === "Edisi 1") },
    ],
  },
  {
    volume: "Vol. 11",
    year: "2024",
    issues: [
      { label: "Edisi 2 (Oktober 2024)", articles: [] },
      { label: "Edisi 1 (Juli 2024)", articles: [] },
    ],
  },
];

export default function IssuesPage() {
  const publishedArticles = mockArticles.filter((a) => a.status === "Published");

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
              Arsip & Terbitan Jurnal
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-6">
            JELAJAHI ARSIP <br className="hidden sm:inline" />
            <span className="bg-purple-300 px-3 border-2 border-black inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_#000] mt-2">
              KARYA ILMIAH
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold leading-relaxed text-zinc-700 max-w-2xl mx-auto uppercase tracking-wide">
            Akses publikasi, volume, dan edisi berkala yang diterbitkan secara resmi oleh FAST-Journal UNPRI.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Current Issue Card (Terbitan Terkini) */}
        <div className="bg-white border-[3px] border-black p-6 sm:p-10 mb-16 shadow-[8px_8px_0px_0px_#000]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[3px] border-black pb-6 mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-black bg-yellow-200 text-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] mb-3">
                <Calendar className="w-3.5 h-3.5 stroke-[2.5px]" />
                TERBITAN TERKINI
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
                Vol. 12, Edisi 2 (April 2025)
              </h2>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-500 mt-1">
                Diterbitkan secara resmi: 1 April 2025 · Total {publishedArticles.length} Karya Ilmiah
              </p>
            </div>
            
            <div>
              <span className="inline-flex items-center justify-center px-4 py-1.5 border-[3px] border-black bg-emerald-300 text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000]">
                AKTIF / TERBARU
              </span>
            </div>
          </div>

          {/* Published Articles List */}
          <div className="space-y-6">
            {publishedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="block bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black leading-snug group-hover:text-purple-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm font-bold text-zinc-600 uppercase tracking-wide">
                      Oleh: <span className="text-black font-extrabold">{article.authors.join(", ")}</span>
                    </p>
                    
                    {article.doi && (
                      <span className="inline-block text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 border border-black px-2 py-0.5">
                        DOI: {article.doi}
                      </span>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-4 shrink-0">
                    {/* Status Badge */}
                    <span className="px-3.5 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-black bg-purple-200 text-black shadow-[2px_2px_0px_0px_#000]">
                      DITERBITKAN
                    </span>
                    
                    {/* Views & Downloads statistics */}
                    <div className="flex items-center gap-3.5 text-[11px] font-black uppercase tracking-wider text-zinc-500 bg-zinc-50 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-black stroke-[2.5px]" /> 
                        {article.views?.toLocaleString() || 0}
                      </span>
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-black stroke-[2.5px]" /> 
                        {article.downloads?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Archives Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-lg border-2 border-black bg-yellow-200 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <FolderOpen className="w-6 h-6 text-black stroke-[2.5px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              ARSIP SELURUH VOLUME
            </h2>
          </div>

          <div className="space-y-6">
            {volumes.map((vol) => (
              <details
                key={vol.volume}
                className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all group overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer bg-purple-50 hover:bg-purple-100 border-b-[3px] border-black transition-colors select-none">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                      {vol.volume} ({vol.year})
                    </h3>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider border-2 border-black bg-white px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
                    {vol.issues.length} Edisi Terbit
                  </span>
                </summary>
                
                <div className="p-6 sm:p-8 space-y-4 bg-zinc-50">
                  {vol.issues.map((issue) => (
                    <div
                      key={issue.label}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 bg-purple-500 border border-black rounded-full" />
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-black">
                          {issue.label}
                        </span>
                      </div>
                      
                      <div>
                        {issue.articles.length > 0 ? (
                          <Link
                            href="/issues"
                            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-600 hover:text-purple-800 hover:underline"
                          >
                            Lihat {issue.articles.length} Artikel
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                          </Link>
                        ) : (
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Belum Ada Artikel (Segera Hadir)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
