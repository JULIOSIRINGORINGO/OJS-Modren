"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchArticles, fetchBookmarks, addBookmark, removeBookmark, trackArticleDownload, fetchIssues } from "@/lib/api-client";
import { BookOpen, Loader2, Search, Bookmark, Eye, Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PublishedArticlesGallery() {
  const [articles, setArticles] = useState<any[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedVolumes, setExpandedVolumes] = useState<Record<string, boolean>>({});

  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchArticles(), fetchBookmarks(), fetchIssues()])
      .then(([articlesData, bookmarksData, issuesData]) => {
        const published = articlesData.filter((a: any) => a.status === "Published");
        setArticles(published);
        setUserBookmarks(bookmarksData);
        // Filter published issues
        const publishedIssues = issuesData.filter((i: any) => i.status === "published" || i.status === "Published");
        setIssues(publishedIssues);
        // All volumes are collapsed by default
        setExpandedVolumes({});
      })
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        fetchArticles().then((articlesData) => {
          const published = articlesData.filter((a: any) => a.status === "Published");
          setArticles(published);
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBookmark = async (article: any) => {
    const existing = userBookmarks.find((b: any) => String(b.article?.id) === String(article.id));
    try {
      if (existing) {
        // Remove bookmark
        await removeBookmark(existing.id);
        setUserBookmarks(prev => prev.filter(b => b.id !== existing.id));
      } else {
        // Add bookmark
        const res = await addBookmark(article.id);
        setUserBookmarks(prev => [...prev, { id: res.id, article }]);
      }
    } catch (err) {
      console.error("Gagal mengubah penanda:", err);
    }
  };

  const handleDownload = (article: any, e: React.MouseEvent) => {
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

  // Filter articles based on search query
  const filteredArticles = articles.filter((a: any) => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.abstract.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase()) ||
    a.authors.some((author: string) => author.toLowerCase().includes(search.toLowerCase()))
  );

  // Group articles by Issue/Edition
  const groupedIssues: { id: string; name: string; articles: any[]; year: number | string }[] = [];

  if (issues && issues.length > 0) {
    issues.forEach((issue: any) => {
      const issueArticles = filteredArticles.filter((a: any) => 
        String(a.issue_id) === String(issue.id) || 
        (a.volume === issue.volume && a.issue === issue.number)
      );
      
      groupedIssues.push({
        id: issue.id,
        name: `${issue.volume} · ${issue.number} — ${issue.title}`,
        articles: issueArticles,
        year: issue.year
      });
    });
    groupedIssues.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    const issueMap = new Map<string, any[]>();
    filteredArticles.forEach((article) => {
      const issueKey = `${article.volume || "Vol. 12"} · ${article.issue || "Edisi 1"}`;
      if (!issueMap.has(issueKey)) {
        issueMap.set(issueKey, []);
      }
      issueMap.get(issueKey)!.push(article);
    });
    Array.from(issueMap.entries()).forEach(([issueName, articlesList]) => {
      groupedIssues.push({
        id: issueName,
        name: issueName,
        articles: articlesList,
        year: articlesList[0]?.year || "2025"
      });
    });
    groupedIssues.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat artikel terbit...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          placeholder="Cari artikel berdasarkan judul, penulis, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] focus-visible:ring-0 focus-visible:border-purple-650 transition-all text-xs font-bold"
        />
      </div>

      {groupedIssues.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center neo-border neo-shadow">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm font-black text-foreground">
            Tidak ada artikel yang ditemukan
          </p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
            Coba masukkan kata kunci pencarian yang berbeda.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groupedIssues.map((group) => {
            const isExpanded = !!expandedVolumes[group.id];
            return (
              <div key={group.id} className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000] rounded-2xl overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedVolumes(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
                  className="w-full flex items-center justify-between px-6 py-4 cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors border-b-[3px] border-black text-left select-none"
                >
                  <div>
                    <h3 className="font-serif text-[14px] font-black uppercase tracking-tight text-black flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 border border-black" />
                      {group.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider border-2 border-black bg-white px-3.5 py-1.5 shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-50 shrink-0 rounded-lg">
                    {group.articles.length} Artikel Terbit
                  </span>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-5 bg-zinc-50/50 space-y-4">
                    {group.articles.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic font-bold uppercase tracking-wider py-4 text-center">
                        Belum Ada Artikel (Segera Hadir)
                      </p>
                    ) : (
                      group.articles.map((article) => {
                        const isBookmarked = userBookmarks.some((b: any) => String(b.article?.id) === String(article.id));
                        return (
                          <div
                            key={article.id}
                            className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl"
                          >
                            {/* Info Column */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                {/* Category */}
                                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-purple-50 border-2 border-black text-purple-700 shadow-[1px_1px_0px_0px_#000]">
                                  {article.category}
                                </span>
                                
                                {/* Volume, Issue & Year */}
                                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-zinc-100 border-2 border-black text-zinc-750 shadow-[1px_1px_0px_0px_#000]" style={{ backgroundColor: "#F4F4F5" }}>
                                  {article.volume} · {article.issue} · ({article.year}){article.pages ? ` · Halaman: ${article.pages}` : ""}
                                </span>

                                {/* DOI */}
                                {article.doi && (
                                  <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-yellow-50 border-2 border-black text-purple-750 shadow-[1px_1px_0px_0px_#000]" style={{ backgroundColor: "#FEF9C3" }}>
                                    DOI: {article.doi}
                                  </span>
                                )}
                              </div>
                              <Link href={`/articles/${article.id}`} className="block group">
                                <h4 className="text-[13px] font-black uppercase tracking-tight text-black hover:text-purple-650 transition-colors leading-snug">
                                  {article.title}
                                </h4>
                              </Link>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase">
                                Oleh: <span className="text-black font-extrabold">{article.authors.join(", ")}</span>
                              </p>
                            </div>

                            {/* Action Column */}
                            <div className="flex items-center gap-3.5 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-black/10">
                              {/* Stats */}
                              <div className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-400 mr-2">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5 text-black stroke-[2.5px]" />
                                  {article.views || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5 text-black stroke-[2.5px]" />
                                  {article.downloads || 0}
                                </span>
                              </div>

                              {/* PDF Button */}
                              <button
                                onClick={(e) => handleDownload(article, e)}
                                className="inline-flex h-8 items-center gap-1.5 px-3.5 rounded-xl border-2 border-black bg-red-100 hover:bg-red-200 text-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] hover:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-red-700 stroke-[2.5px]" />
                                PDF (Full Text)
                              </button>

                              {/* Bookmark Button */}
                              <button
                                onClick={() => handleToggleBookmark(article)}
                                className={`inline-flex w-8 h-8 items-center justify-center rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] hover:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer ${
                                  isBookmarked
                                    ? "bg-purple-600 text-white hover:bg-purple-700"
                                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                }`}
                                title={isBookmarked ? "Hapus Penanda" : "Tandai Naskah"}
                              >
                                <Bookmark className={`w-4 h-4 stroke-[2.5px] ${isBookmarked ? "fill-white" : ""}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
