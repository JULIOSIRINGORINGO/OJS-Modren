"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchArticles, trackArticleDownload } from "@/lib/api-client";
import type { Article } from "@/types";
import { Eye, Download, BookOpen, Calendar, ArrowUpRight, FolderOpen, Loader2, FileText } from "lucide-react";

export default function IssuesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = (article: Article, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If a real PDF file was uploaded, open from backend server
    if (article.file_url && article.file_name?.toLowerCase().endsWith('.pdf')) {
      window.open(`http://localhost:3001${article.file_url}`, "_blank");
    } else {
      // Fallback to generated PDF galley page
      window.open(`/articles/${article.id}/pdf`, "_blank");
    }

    trackArticleDownload(article.id)
      .then((res) => {
        if (res.success) {
          setArticles(prev => prev.map(a => a.id === article.id ? { ...a, downloads: res.downloads } : a));
        }
      })
      .catch((err) => console.error(err));
  };

  const publishedArticles = articles.filter((a) => a.status === "Published");

  // Build volumes dynamically from articles
  const volumeMap = new Map<string, Map<string, Article[]>>();
  articles.forEach((a) => {
    const vol = a.volume || "Vol. 12";
    const issue = a.issue || "Edisi 1";
    if (!volumeMap.has(vol)) volumeMap.set(vol, new Map());
    const issueMap = volumeMap.get(vol)!;
    if (!issueMap.has(issue)) issueMap.set(issue, []);
    issueMap.get(issue)!.push(a);
  });

  const volumes = Array.from(volumeMap.entries()).map(([volume, issueMap]) => ({
    volume,
    year: volume.includes("12") ? "2025" : volume.includes("11") ? "2024" : "2023",
    issues: Array.from(issueMap.entries()).map(([label, arts]) => ({
      label: `${label} (${volume.includes("12") ? "2025" : "2024"})`,
      articles: arts,
    })),
  }));

  // Add empty older volume if not present
  if (!volumeMap.has("Vol. 11")) {
    volumes.push({
      volume: "Vol. 11",
      year: "2024",
      issues: [
        { label: "Edisi 2 (Oktober 2024)", articles: [] },
        { label: "Edisi 1 (Juli 2024)", articles: [] },
      ],
    });
  }

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
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat terbitan...</span>
          </div>
        ) : (
          <>
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
                  <div
                    key={article.id}
                    className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      
                      <div className="flex-1 space-y-3">
                        <Link href={`/articles/${article.id}`} className="block group/title">
                          <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black leading-snug group-hover/title:text-purple-600 transition-colors">
                            {article.title}
                          </h3>
                        </Link>
                        
                        <p className="text-xs sm:text-sm font-bold text-zinc-600 uppercase tracking-wide">
                          Oleh: <span className="text-black font-extrabold">{article.authors.join(", ")}</span>
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {article.doi && (
                            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 border border-black px-2 py-0.5">
                              DOI: {article.doi}
                            </span>
                          )}
                          <button
                            onClick={(e) => handleDownload(article, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black bg-red-150 hover:bg-red-200 text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-md"
                          >
                            <FileText className="w-3.5 h-3.5 stroke-[2.5px] text-red-950" />
                            PDF (Full Text)
                          </button>
                        </div>
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
                  </div>
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
                              <span
                                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-600"
                              >
                                {issue.articles.length} Artikel
                                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                              </span>
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
          </>
        )}
      </div>
    </div>
  );
}
