"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchArticles, trackArticleDownload, fetchIssues } from "@/lib/api-client";
import type { Article } from "@/types";
import { Eye, Download, BookOpen, Calendar, ArrowUpRight, FolderOpen, Loader2, FileText } from "lucide-react";

export default function IssuesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchArticles(), fetchIssues()])
      .then(([articlesData, issuesData]) => {
        setArticles(articlesData);
        const publishedIssues = issuesData.filter((i: any) => i.status === "published" || i.status === "Published");
        setIssues(publishedIssues);
      })
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        fetchArticles().then(setArticles);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = (article: Article, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (article.file_url && article.file_name?.toLowerCase().endsWith('.pdf')) {
      window.open(`http://localhost:3001${article.file_url}`, "_blank");
    } else {
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

  // Get latest issue
  const latestIssue = issues && issues.length > 0 ? issues[0] : null;
  const currentIssueTitle = latestIssue 
    ? `${latestIssue.volume}, ${latestIssue.number} — ${latestIssue.title}`
    : "Vol. 12, Edisi 1 (April 2025)";
  
  const currentIssueDateText = latestIssue && latestIssue.published_at
    ? new Date(latestIssue.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "1 April 2025";

  const currentIssueArticles = latestIssue
    ? publishedArticles.filter((a) => 
        String(a.issue_id) === String(latestIssue.id) || 
        (a.volume === latestIssue.volume && a.issue === latestIssue.number)
      )
    : publishedArticles.filter((a) => a.volume === "Vol. 12" && a.issue === "Edisi 1");

  // Build volumes dynamically from published issues/articles
  const volumeMap = new Map<string, Map<string, { id: string, label: string, articles: Article[], year: string }>>();

  if (issues && issues.length > 0) {
    issues.forEach((issue) => {
      const vol = issue.volume || "Vol. 12";
      const issueNum = issue.number || "Edisi 1";
      const year = String(issue.year || new Date().getFullYear());
      
      if (!volumeMap.has(vol)) {
        volumeMap.set(vol, new Map());
      }
      const issueMap = volumeMap.get(vol)!;
      
      const issueArticles = publishedArticles.filter((a) => 
        String(a.issue_id) === String(issue.id) || 
        (a.volume === issue.volume && a.issue === issue.number)
      );

      issueMap.set(issueNum, {
        id: issue.id,
        label: `${issueNum} (${year})`,
        articles: issueArticles,
        year
      });
    });
  } else {
    publishedArticles.forEach((a) => {
      const vol = a.volume || "";
      const issue = a.issue || "";
      const year = String(a.year || new Date().getFullYear());
      
      if (!volumeMap.has(vol)) {
        volumeMap.set(vol, new Map());
      }
      const issueMap = volumeMap.get(vol)!;
      if (!issueMap.has(issue)) {
        issueMap.set(issue, { id: issue, label: `${issue} (${year})`, articles: [], year });
      }
      issueMap.get(issue)!.articles.push(a);
    });
  }

  const volumes = Array.from(volumeMap.entries()).map(([volumeName, issueMap]) => {
    const firstIssueData = Array.from(issueMap.values())[0];
    const year = firstIssueData ? firstIssueData.year : new Date().getFullYear().toString();
    
    return {
      volume: volumeName,
      year,
      issues: Array.from(issueMap.values()).map((data) => ({
        label: data.label,
        articles: data.articles,
      })),
    };
  });

  volumes.sort((a, b) => b.volume.localeCompare(a.volume));

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
            <details className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] mb-16 group/latest overflow-hidden block">
              <summary className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-10 cursor-pointer hover:bg-purple-50/20 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-black bg-yellow-200 text-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] mb-3">
                    <Calendar className="w-3.5 h-3.5 stroke-[2.5px]" />
                    TERBITAN TERKINI
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
                    {currentIssueTitle}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-500 mt-1">
                    Diterbitkan secara resmi: {currentIssueDateText} · Total {currentIssueArticles.length} Karya Ilmiah
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <span className="inline-flex items-center justify-center px-4 py-1.5 border-[3px] border-black bg-emerald-300 text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000]">
                    AKTIF / TERBARU
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider border-2 border-black bg-white px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] group-open/latest:rotate-90 transition-transform inline-block">
                    &rarr;
                  </span>
                </div>
              </summary>

              {/* Published Articles List */}
              <div className="p-6 sm:p-10 border-t-[3px] border-black bg-zinc-50/30 space-y-6">
                {currentIssueArticles.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic font-bold uppercase tracking-wider py-12 text-center border-2 border-dashed border-black/10 rounded-xl bg-zinc-50/50">
                    Belum ada karya ilmiah yang diterbitkan pada edisi ini.
                  </p>
                ) : (
                  currentIssueArticles.map((article) => (
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
                          {article.pages && (
                            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 border border-black px-2 py-0.5">
                              Halaman: {article.pages}
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
                )))}
              </div>
            </details>

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
                        <details
                          key={issue.label}
                          className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] group/issue overflow-hidden block mb-4 last:mb-0"
                        >
                          <summary className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
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
                                  <span className="group-open/issue:rotate-90 transition-transform inline-block">&rarr;</span>
                                </span>
                              ) : (
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                  Belum Ada Artikel (Segera Hadir)
                                </span>
                              )}
                            </div>
                          </summary>
                          
                          {issue.articles.length > 0 && (
                            <div className="p-4 sm:p-6 border-t-2 border-black bg-zinc-50/50 space-y-4">
                              {issue.articles.map((article) => (
                                <div
                                  key={article.id}
                                  className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl"
                                >
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <Link href={`/articles/${article.id}`}>
                                      <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-black hover:text-purple-650 transition-colors leading-snug">
                                        {article.title}
                                      </h4>
                                    </Link>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase">
                                      Oleh: <span className="text-black font-extrabold">{article.authors.join(", ")}</span>
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={(e) => handleDownload(article, e)}
                                      className="inline-flex h-8 items-center gap-1.5 px-3.5 rounded-xl border-2 border-black bg-red-100 hover:bg-red-200 text-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-red-700 stroke-[2.5px]" />
                                      PDF
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </details>
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
