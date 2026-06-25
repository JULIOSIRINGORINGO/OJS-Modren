"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchArticle, trackArticleView, trackArticleDownload, getCurrentUser, updateArticle, updateArticleStatus, fetchBookmarks, addBookmark, removeBookmark } from "@/lib/api-client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { Eye, Download, Calendar, ExternalLink, ArrowLeft, BookOpen, Loader2, UserCheck, Clock, FileText, CheckCircle, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";

export default function ArticleDetailPage() {
  const { id } = useParams() as { id: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadCount, setDownloadCount] = useState(0);
  
  // Current user role & identity check
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const isEditor = currentUser && ["editor", "admin", "Editor", "Admin"].includes(currentUser.role);
  const showWorkflow = currentUser && (isAuthor || isEditor || currentUser.role?.toLowerCase() === "reviewer");

  // Error state for API requests
  const [error, setError] = useState("");

  // Revision Form States
  const [revisionNotes, setRevisionNotes] = useState("");
  const [revisedFile, setRevisedFile] = useState<File | null>(null);
  const [submittingRevision, setSubmittingRevision] = useState(false);
  const [revisionSuccess, setRevisionSuccess] = useState(false);
  const [revisionError, setRevisionError] = useState("");

  // Bookmark States
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [bookmarking, setBookmarking] = useState(false);
  const [showAuthNotice, setShowAuthNotice] = useState(false);

  const backLink = currentUser
    ? (["editor", "admin", "Editor", "Admin"].includes(currentUser.role)
      ? "/admin/submissions"
      : "/dashboard/submissions")
    : "/issues";

  const backText = currentUser
    ? (["editor", "admin", "Editor", "Admin"].includes(currentUser.role)
      ? "Kembali ke Panel Editor"
      : "Kembali ke Naskah Saya")
    : "Kembali ke Terbitan";

  const reviewAssignments = article?.review_assignments || [];
  const completedReviews = reviewAssignments.filter((ra: any) => ra.status === 'completed');
  const rounds = Array.from(new Set(completedReviews.map((ra: any) => Number(ra.round || 1)))).sort((a, b) => b - a);

  // OJS 4 Tabs states
  const [activeTab, setActiveTab] = useState("naskah");
  const [activeRoundTab, setActiveRoundTab] = useState<number>(1);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [selectedLetterRound, setSelectedLetterRound] = useState<number>(1);
  const [letterType, setLetterType] = useState<"ulasan" | "copyedit" | "diterbitkan">("ulasan");

  const [hasSetDefaultTab, setHasSetDefaultTab] = useState(false);
  const [prevStatus, setPrevStatus] = useState<string | null>(null);
  const [prevRound, setPrevRound] = useState<number | null>(null);

  // Set default active tab based on status
  useEffect(() => {
    if (article) {
      const currentRound = article.round || 1;
      if (prevRound === null || prevRound !== currentRound) {
        setActiveRoundTab(currentRound);
        setPrevRound(currentRound);
      }

      if (!hasSetDefaultTab || (prevStatus && prevStatus !== article.status)) {
        if (!showWorkflow) {
          setActiveTab("naskah");
        } else if (article.status === "Published" || article.status === "Production") {
          setActiveTab("diterbitkan");
        } else if (article.status === "Copyediting") {
          setActiveTab("copyedit");
        } else if (["Under Review", "Revision Required", "Awaiting Decision", "Reviewer Assigned"].includes(article.status)) {
          setActiveTab("ulasan");
        } else {
          setActiveTab("naskah");
        }
        setHasSetDefaultTab(true);
        setPrevStatus(article.status);
      }
    }
  }, [article, hasSetDefaultTab, prevStatus, prevRound, showWorkflow]);

  useEffect(() => {
    if (!id) return;
    
    // Fetch user info
    const user = getCurrentUser();
    setCurrentUser(user);

    // Fetch article and track view
    fetchArticle(id)
      .then((data) => {
        setArticle(data);
        setDownloadCount(data.downloads || 0);
        setLoading(false);
        trackArticleView(id);

        if (user && String(user.id) === String(data.user_id)) {
          setIsAuthor(true);
        }

        if (user) {
          fetchBookmarks()
            .then((bookmarksList) => {
              const found = bookmarksList.find((b: any) => String(b.article?.id) === String(id));
              if (found) {
                setIsBookmarked(true);
                setBookmarkId(found.id);
              }
            })
            .catch((err) => console.error("Gagal memuat data penanda:", err));
        }
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message || "Gagal memuat naskah.");
        setLoading(false);
      });

    // Set polling for real-time updates
    const interval = setInterval(() => {
      fetchArticle(id)
        .then((data) => {
          setArticle(data);
        })
        .catch(console.error);
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  const BACKEND_URL = "http://localhost:3001";

  const handleToggleBookmark = async () => {
    if (!currentUser) {
      setShowAuthNotice(true);
      return;
    }

    setBookmarking(true);
    try {
      if (isBookmarked) {
        await removeBookmark(bookmarkId || id);
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        const res = await addBookmark(id);
        setIsBookmarked(true);
        setBookmarkId(res.id);
      }
    } catch (err) {
      console.error("Gagal memperbarui penanda:", err);
    } finally {
      setBookmarking(false);
    }
  };

  const handleDownload = (format: string) => {
    if (!article) return;

    if (format === "pdf") {
      // If a real PDF file was uploaded, open it from the backend
      if (article.file_url && article.file_name?.toLowerCase().endsWith('.pdf')) {
        window.open(`${BACKEND_URL}${article.file_url}`, "_blank");
      } else {
        // Fall back to the generated PDF galley page
        window.open(`/articles/${article.id}/pdf`, "_blank");
      }
      
      trackArticleDownload(article.id)
        .then((res) => {
          if (res.success) {
            setDownloadCount(res.downloads);
          }
        })
        .catch((err) => console.error(err));
    } else {
      trackArticleDownload(article.id)
        .then((res) => {
          if (res.success) {
            setDownloadCount(res.downloads);
          }
        })
        .catch((err) => console.error(err));

      // If a real file exists on the server, download from there
      if (format === "original" && article.file_url) {
        window.open(`${BACKEND_URL}${article.file_url}`, "_blank");
        return;
      }

      const fileName = format === "original" ? (article.file_name || "naskah_asli.docx") : `Article_${article.id}_UNPRI.tex`;
      const blob = new Blob([`Mock article file download for ${article.title} (${format})`], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleDownloadLoa = () => {
    if (!article) return;

    // If a real LoA file was uploaded, open/download from server
    if (article.loa_file_url) {
      // If PDF, open inline; otherwise download
      if (article.loa_file?.toLowerCase().endsWith('.pdf')) {
        window.open(`${BACKEND_URL}${article.loa_file_url}`, "_blank");
      } else {
        window.open(`${BACKEND_URL}${article.loa_file_url}`, "_blank");
      }
      return;
    }

    // Fallback: generate a text-based LoA
    const loaContent = `FAST-JOURNAL - UNIVERSITAS PRIMA INDONESIA
===================================================
SURAT KETERANGAN PENERIMAAN NASKAH
LETTER OF ACCEPTANCE (LoA)

Nomor: ${article.id}/LoA/FAST-JOURNAL/${new Date().getFullYear()}

Dengan ini Redaksi FAST-Journal menerangkan bahwa naskah:
Judul: ${article.title}
Penulis: ${article.authors.join(", ")}
Kategori: ${article.category}

Telah melalui proses evaluasi peer review dan DINYATAKAN DITERIMA untuk diterbitkan pada FAST-Journal.

Ditetapkan pada tanggal: ${article.publishedAt || new Date().toLocaleDateString("id-ID")}

Editor in Chief,

Hendra Wijaya, M.Kom.`;
    const blob = new Blob([loaContent], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LoA_${article.title.substring(0, 15).replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPublishedFile = () => {
    if (!article) return;
    
    trackArticleDownload(article.id)
      .then((res) => {
        if (res.success) {
          setDownloadCount(res.downloads);
        }
      })
      .catch((err) => console.error(err));

    // If a real file exists on the server, open/download from there
    if (article.file_url) {
      if (article.file_name?.toLowerCase().endsWith('.pdf')) {
        // Open PDF inline in browser
        window.open(`${BACKEND_URL}${article.file_url}`, "_blank");
      } else {
        // Download non-PDF files
        window.open(`${BACKEND_URL}${article.file_url}`, "_blank");
      }
      return;
    }

    // Fallback: dummy blob download
    const finalName = article.file_name || `${article.title.substring(0, 20).replace(/\s+/g, "_")}_final.pdf`;
    const blob = new Blob([`Mock file download for published article final: ${finalName}`], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSendRevision = async () => {
    if (!revisedFile) {
      setRevisionError("Silakan pilih berkas revisi naskah terlebih dahulu.");
      return;
    }
    if (!revisionNotes.trim()) {
      setRevisionError("Keterangan revisi (perbaikan) wajib diisi.");
      return;
    }
    setSubmittingRevision(true);
    setRevisionError("");
    try {
      await updateArticleStatus(
        article!.id,
        "Under Review",
        undefined,
        revisionNotes,
        revisedFile.name
      );

      setRevisionSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setRevisionError(err?.message || "Gagal mengirimkan revisi.");
    } finally {
      setSubmittingRevision(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Memuat Naskah...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl border-[3px] border-black bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_#000000] font-black">
          !
        </div>
        <h2 className="text-2xl font-black text-black mb-2 uppercase">Akses Terbatas</h2>
        <p className="text-sm font-bold text-zinc-650 mb-6 uppercase tracking-wide">
          {error}
        </p>
        <Link href={backLink} className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all">
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]" /> {backText}
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-black mb-4">Naskah Tidak Ditemukan</h2>
        <Link href={backLink} className="inline-flex items-center gap-1.5 text-sm font-black text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> {backText}
        </Link>
      </div>
    );
  }

  const currentRound = article.round || 1;

  return (
    <div className="pb-24">
      {/* Neubrutalist Header Section */}
      <div className="bg-purple-50 border-b-[3px] border-black py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href={backLink}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]" /> {backText}
          </Link>

          <div className="flex flex-wrap items-center gap-3.5 mb-5">
            <span className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded bg-yellow-200 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              {article.category}
            </span>
            {article.volume && (
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
                {article.volume} · {article.issue}
              </span>
            )}
            <StatusBadge status={article.status} round={article.round} />
            <button
              onClick={() => handleDownload("pdf")}
              className="inline-flex h-7 items-center gap-1.5 px-3.5 rounded-full border-2 border-black bg-red-400 hover:bg-red-500 text-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
              PDF (Full Text)
            </button>
            <button
              onClick={() => handleDownload("original")}
              className="inline-flex h-7 items-center gap-1.5 px-3.5 rounded-full border-2 border-black bg-cyan-300 hover:bg-cyan-400 text-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
              File Asli ({article.file_name ? (article.file_name.length > 18 ? article.file_name.substring(0, 15) + "..." : article.file_name) : "naskah_asli.docx"})
            </button>
            <button
              onClick={handleToggleBookmark}
              disabled={bookmarking}
              className={`inline-flex h-7 items-center gap-1.5 px-3.5 rounded-full border-2 border-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer ${
                isBookmarked 
                  ? "bg-purple-600 text-white hover:bg-purple-700" 
                  : "bg-purple-200 text-black hover:bg-purple-300"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 stroke-[2.5px] ${isBookmarked ? "fill-white" : ""}`} />
              {isBookmarked ? "Ditandai" : "Tandai Naskah"}
            </button>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-black leading-tight mb-6 uppercase tracking-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base font-black text-purple-700 uppercase tracking-wide">
            Oleh: <span className="text-black font-extrabold">{article.authors.join(" · ")}</span>
          </p>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="border-b-[3px] border-black bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-5">
            {article.publishedAt && (
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-500">
                <Calendar className="w-4 h-4 text-black stroke-[2.5px]" />
                <span>
                  Diterbitkan:{" "}
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-500">
              <Eye className="w-4 h-4 text-black stroke-[2.5px]" />
              <span>{(article.views || 0).toLocaleString("id-ID")} tampilan</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-500">
              <Download className="w-4 h-4 text-black stroke-[2.5px]" />
              <span>{downloadCount.toLocaleString("id-ID")} unduhan</span>
            </div>
            {article.pages && (
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-500">
                <BookOpen className="w-4 h-4 text-black stroke-[2.5px]" />
                <span>Halaman: {article.pages}</span>
              </div>
            )}
            {article.doi && (
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-purple-650">
                <ExternalLink className="w-4 h-4 text-black stroke-[2.5px]" />
                <span>DOI: {article.doi}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Neubrutalist Tab Navigation */}
        {showWorkflow && (
          <div className="flex border-3 border-black mb-8 overflow-x-auto bg-white rounded-xl shadow-[4px_4px_0px_0px_#000]">
            {[
              { id: "naskah", label: "Naskah" },
              { id: "ulasan", label: "Ulasan" },
              { id: "copyedit", label: "Copyediting" },
              { id: "diterbitkan", label: "Diterbitkan" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 text-xs font-black uppercase tracking-wider border-r-3 border-black transition-all ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-white text-black hover:bg-purple-50"
                  } last:border-r-0 shrink-0`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TABS CONTENT */}

            {/* TAB 1: NASKAH */}
            {activeTab === "naskah" && (
              <div className="space-y-8">
                {/* Dokumen Naskah Masuk */}
                <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-wider text-black border-b-2 border-dashed border-black/10 pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    {article.status === "Published" ? "DOKUMEN NASKAH FINAL" : "DOKUMEN NASKAH MASUK"}
                  </h2>
                  <div className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-purple-50/10">
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                      <div className={`w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 ${(article.status === "Published" && (article.file_name || "").endsWith(".pdf")) ? "bg-red-400" : "bg-cyan-200"}`}>
                        {article.status === "Published" && (article.file_name || "").endsWith(".pdf") ? "PDF" : "DOCX"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-black truncate">
                          {article.file_name || (article.status === "Published" ? `${article.title.substring(0, 20).replace(/\s+/g, "_")}_final.pdf` : "naskah_asli.docx")}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">
                          {article.status === "Published" ? "File Utama Naskah (Terbit)" : "File Utama Naskah · Dokumen Asli"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={article.status === "Published" ? handleDownloadPublishedFile : () => handleDownload("original")}
                      className="flex items-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-300 text-black hover:bg-cyan-400 shadow-[1.5px_1.5px_0px_0px_#000] shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                      Unduh
                    </Button>
                  </div>
                </div>

                {/* Abstrak */}
                <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000]">
                  <h2 className="text-xl font-black uppercase tracking-tight text-black mb-5 flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 stroke-[2.5px] text-purple-600" />
                    ABSTRAK NASKAH
                  </h2>
                  <p className="text-sm font-bold leading-relaxed text-zinc-700 uppercase tracking-wide">
                    {article.abstract}
                  </p>
                </div>

                {/* Keywords */}
                {article.keywords && article.keywords.length > 0 && (
                  <div className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-black mb-4">
                      KATA KUNCI / KEYWORDS
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {article.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black bg-purple-50 text-purple-700 shadow-[2px_2px_0px_0px_#000]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ULASAN */}
            {activeTab === "ulasan" && (
              <div className="space-y-6">
                
                {/* Sub-tab Ronde */}
                <div className="flex border-2 border-black rounded-lg overflow-hidden bg-white w-fit shadow-[2px_2px_0px_0px_#000]">
                  {Array.from({ length: currentRound }).map((_, i) => {
                    const roundNum = i + 1;
                    const isRoundActive = activeRoundTab === roundNum;
                    return (
                      <button
                        key={roundNum}
                        onClick={() => setActiveRoundTab(roundNum)}
                        className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider border-r-2 border-black transition-all ${
                          isRoundActive ? "bg-yellow-200 text-black font-extrabold" : "bg-white text-black hover:bg-yellow-50"
                        } last:border-r-0`}
                      >
                        Ronde {roundNum}
                      </button>
                    );
                  })}
                </div>

                {/* Ulasan Content per Ronde */}
                <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
                  <h2 className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2.5 border-b-2 border-dashed border-black/10 pb-3">
                    <UserCheck className="w-5 h-5 stroke-[2.5px] text-purple-600" />
                    CATATAN REVIEW & EVALUASI (RONDE {activeRoundTab})
                  </h2>

                  {/* Status Ronde */}
                  <div className="p-4 border-2 border-black rounded-xl bg-purple-50/20 text-xs font-bold leading-relaxed space-y-1">
                    <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Status Ronde {activeRoundTab}</p>
                    <p className="text-sm font-extrabold text-black uppercase tracking-wide">
                      {activeRoundTab < currentRound ? (
                        "Naskah memerlukan revisi (Revisions Required)"
                      ) : article.status === "Revision Required" ? (
                        "Perlu Revisi (Revisions Required)"
                      ) : article.status === "Published" ? (
                        "Naskah diterima untuk diterbitkan (Accept Submission)"
                      ) : article.status === "Copyediting" ? (
                        "Naskah diterima untuk copyediting (Accept Submission)"
                      ) : article.status === "Awaiting Decision" ? (
                        "Menunggu Keputusan Editor (Awaiting Decision)"
                      ) : (
                        "Naskah sedang dalam peninjauan (Under Review)"
                      )}
                    </p>
                  </div>

                  {/* Reviewer Comments - Restricted to Editor/Admin only */}
                  {isEditor ? (
                    <div className="space-y-4">
                      {completedReviews.filter((ra: any) => Number(ra.round || 1) === activeRoundTab).length === 0 ? (
                        <p className="text-xs text-zinc-555 italic font-bold uppercase tracking-wide py-2">
                          Belum ada ulasan peninjau yang selesai dikirimkan untuk ronde ini.
                        </p>
                      ) : (
                        <div className="space-y-6 divide-y-2 divide-black/10">
                          {([...completedReviews.filter((ra: any) => Number(ra.round || 1) === activeRoundTab)].sort((a: any, b: any) => a.id.localeCompare(b.id))).map((ra: any, idx: number) => (
                            <div key={ra.id} className="pt-6 first:pt-0 space-y-2.5">
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-xs text-foreground uppercase tracking-wide">Reviewer {idx + 1}</span>
                                <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 border-2 border-black rounded-lg ${
                                  ra.recommendation === 'accept' ? 'bg-emerald-300 text-black' :
                                  ra.recommendation === 'revision' ? 'bg-amber-300 text-black' :
                                  ra.recommendation === 'reject' ? 'bg-rose-300 text-black' :
                                  'bg-zinc-200 text-black'
                                }`}>
                                  {ra.recommendation === 'accept' ? 'Terima & Terbitkan' :
                                   ra.recommendation === 'revision' ? 'Perlu Revisi' :
                                   ra.recommendation === 'reject' ? 'Tolak Naskah' :
                                   ra.recommendation.toUpperCase()}
                                </span>
                              </div>
                              {ra.comments && (
                                <p className="text-xs text-zinc-700 italic bg-white p-3.5 border-2 border-black rounded-xl">
                                  "{ra.comments}"
                                </p>
                              )}
                              {ra.review_file && (
                                <div className="pt-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const blob = new Blob([`Mock file download for reviewer comments: ${ra.review_file}`], { type: "application/octet-stream" });
                                      const url = window.URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = ra.review_file;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      window.URL.revokeObjectURL(url);
                                    }}
                                    className="flex items-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-300 text-black hover:bg-cyan-400 transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
                                  >
                                    <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                                    Unduh Berkas Review Berkomentar ({ra.review_file})
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Author/Guest view: Display Editor's Decision Notes instead if a decision has been made */
                    <div className="space-y-4">
                      {activeRoundTab < currentRound || ["Revision Required", "Copyediting", "Production", "Accepted", "Published", "Rejected"].includes(article.status) ? (
                        <div className="p-4 border-2 border-black rounded-xl bg-purple-50/10 space-y-2">
                          <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Catatan Evaluasi / Keputusan Editor</p>
                          {article.editor_notes ? (
                            <p className="text-xs text-zinc-700 font-bold whitespace-pre-line leading-relaxed font-sans">
                              {article.editor_notes.replace(/\s*\[Reviewer ditugaskan:[^\]]*\]/gi, "").trim()}
                            </p>
                          ) : (
                            <p className="text-xs text-zinc-500 italic font-bold uppercase tracking-wide">
                              Belum ada catatan evaluasi tertulis dari editor untuk ronde ini.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-dashed border-black/20 rounded-xl bg-zinc-50 text-center py-6">
                          <p className="text-xs font-black text-zinc-600 uppercase tracking-wider">
                            Status: Naskah Sedang Dalam Peninjauan (Under Review)
                          </p>
                          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide mt-1.5 leading-relaxed">
                            Catatan evaluasi resmi dari editor akan ditampilkan di sini setelah proses review dan penilaian selesai dilakukan.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pemberitahuan Keputusan Editor (Hanya tampil jika sudah ada keputusan atau pengguna adalah Editor/Admin) */}
                  {(activeRoundTab < currentRound || ["Revision Required", "Copyediting", "Production", "Accepted", "Published", "Rejected"].includes(article.status) || isEditor) && (
                    <div className="pt-4 border-t-2 border-dashed border-black/20 space-y-2.5">
                      <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Pemberitahuan / Pengumuman Editor</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLetterRound(activeRoundTab);
                          setLetterType("ulasan");
                          setShowLetterModal(true);
                        }}
                        className="text-xs font-black text-purple-700 hover:text-purple-900 transition-colors underline uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        [Keputusan] Surat Pemberitahuan Keputusan Editor (Ronde {activeRoundTab})
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Kirim Revisi (Hanya tampil di tab Ulasan Ronde Terkini/Aktif, jika status Perlu Revisi, dan pengguna adalah Penulis) */}
                {isAuthor && article.status === "Revision Required" && activeRoundTab === currentRound && (
                  <div className="bg-yellow-50/50 border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black bg-yellow-200 text-yellow-800 shadow-[2px_2px_0px_0px_#000] font-black">
                        !
                      </div>
                      <div>
                        <h3 className="text-[13px] font-black uppercase tracking-wider text-black">Kirim Revisi Naskah</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                          Unggah naskah yang telah direvisi beserta keterangan perbaikan Anda.
                        </p>
                      </div>
                    </div>

                    {revisionSuccess && (
                      <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                        Revisi berhasil dikirimkan! Halaman akan dimuat ulang...
                      </div>
                    )}

                    {revisionError && (
                      <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold uppercase tracking-wider">
                        {revisionError}
                      </div>
                    )}

                    {!revisionSuccess && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-wider text-black">Unggah File Naskah Baru (PDF/DOCX)</Label>
                          <div className="border-3 border-black border-dashed rounded-xl p-6 bg-white dark:bg-zinc-900 text-center relative hover:bg-purple-50/10 transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.docx"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setRevisedFile(e.target.files[0]);
                                    }
                              }}
                            />
                            <div className="flex flex-col items-center gap-1.5">
                              <BookOpen className="w-6 h-6 text-primary shrink-0" />
                              {revisedFile ? (
                                <div>
                                  <p className="text-xs font-black text-foreground">{revisedFile.name}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {(revisedFile.size / 1024 / 1024).toFixed(2)} MB · Klik untuk mengganti
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-xs font-black text-foreground">Pilih berkas PDF atau DOCX revisi</p>
                                  <p className="text-[10px] text-muted-foreground">atau seret file Anda ke sini</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-wider text-black">Keterangan Revisi / Tanggapan untuk Peninjau</Label>
                          <Textarea
                            value={revisionNotes}
                            onChange={(e) => setRevisionNotes(e.target.value)}
                            placeholder="Jelaskan poin-poin perbaikan yang telah Anda lakukan..."
                            className="bg-white text-sm min-h-[120px] resize-y border-2 border-black"
                            required
                          />
                        </div>

                        <div className="pt-4 border-t-2 border-dashed border-black/20 flex justify-end">
                          <Button
                            onClick={handleSendRevision}
                            disabled={submittingRevision}
                            className="neo-btn text-xs font-black uppercase tracking-wider px-6 text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-primary"
                          >
                            {submittingRevision ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin text-white" /> Mengirim...</>
                            ) : (
                              "Kirim Revisi"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: COPYEDITING */}
            {activeTab === "copyedit" && (
              <div className="space-y-8">
                {["Copyediting", "Published"].includes(article.status) ? (
                  <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
                    <h2 className="text-sm font-black uppercase tracking-wider text-black border-b-2 border-dashed border-black/10 pb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      BERKAS NASKAH HASIL COPYEDIT
                    </h2>
                    
                    <div className="p-4 border-2 border-emerald-300 rounded-xl bg-emerald-50/20 text-xs font-bold leading-relaxed space-y-1">
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Status Tahap</p>
                      <p className="text-sm font-extrabold text-black uppercase tracking-wide">
                        Naskah telah selesai melalui proses Copyediting oleh Editor.
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-purple-50/10">
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                        <div className="w-10 h-10 border-2 border-black bg-cyan-200 rounded-lg flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_#000] shrink-0">
                          DOCX
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-black truncate">
                            {article.file_name || "naskah_copyedit.docx"}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">
                            File Utama Naskah (Copyedit)
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload("original")}
                        className="flex items-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-300 text-black hover:bg-cyan-400 shadow-[1.5px_1.5px_0px_0px_#000] shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                        Unduh
                      </Button>
                    </div>

                    {/* Surat Keputusan Editor */}
                    <div className="pt-4 border-t-2 border-dashed border-black/10 space-y-2.5">
                      <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Pemberitahuan / Pengumuman Editor</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLetterRound(article.round || 1);
                          setLetterType("copyedit");
                          setShowLetterModal(true);
                        }}
                        className="text-xs font-black text-purple-700 hover:text-purple-900 transition-colors underline uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        [Keputusan] Surat Pemberitahuan Keputusan Copyediting
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] text-center py-16">
                    <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-black">Naskah Belum Masuk Tahap Copyediting</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      Naskah harus diterima oleh editor dan melewati tahap ulasan peer review terlebih dahulu.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DITERBITKAN */}
            {activeTab === "diterbitkan" && (
              <div className="space-y-8">
                {article.status === "Published" || article.status === "Production" ? (
                  <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
                    <h2 className="text-sm font-black uppercase tracking-wider text-black border-b-2 border-dashed border-black/10 pb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      {article.status === "Published" ? "BERKAS & DOKUMEN TERBITAN FINAL" : "BERKAS & DOKUMEN PERSIAPAN PRODUKSI"}
                    </h2>
                    
                    <div className="p-4 border-2 border-emerald-300 rounded-xl bg-emerald-50/20 text-xs font-bold leading-relaxed space-y-1">
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Status Tahap</p>
                      <p className="text-sm font-extrabold text-black uppercase tracking-wide">
                        {article.status === "Published" 
                          ? "Naskah ini telah resmi diterbitkan di FAST-Journal." 
                          : "Naskah ini telah diterima & masuk tahap persiapan produksi untuk terbitan mendatang."}
                      </p>
                    </div>

                    {/* File Siap Terbit */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Berkas Naskah Terbit</p>
                      <div className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-purple-50/10">
                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                          <div className={`w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_#000] ${(article.file_name || "").endsWith(".pdf") ? "bg-red-400" : "bg-cyan-200"} shrink-0`}>
                            {(article.file_name || "").endsWith(".pdf") ? "PDF" : "DOCX"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-black truncate font-sans">
                              {article.file_name || `${article.title.substring(0, 20).replace(/\s+/g, "_")}_final.pdf`}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">
                              File Utama Naskah (Terbit)
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadPublishedFile}
                          className="flex items-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-300 text-black hover:bg-cyan-400 shadow-[1.5px_1.5px_0px_0px_#000] shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                          Unduh
                        </Button>
                      </div>
                    </div>

                    {/* File LoA */}
                    <div className="space-y-3 pt-4 border-t-2 border-dashed border-black/10">
                      <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Surat Keterangan Penerimaan (LoA)</p>
                      <div className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-yellow-50/10">
                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                          <div className={`w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_#000] ${(article.loa_file || "").endsWith(".pdf") ? "bg-red-400" : "bg-yellow-250"} shrink-0`}>
                            {(article.loa_file || "").endsWith(".pdf") ? "PDF" : "TXT"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-black truncate font-sans">
                              {article.loa_file || `LoA_${article.title.substring(0, 15).replace(/\s+/g, "_")}.txt`}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">
                              Letter of Acceptance (LoA) · FAST-Journal
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadLoa}
                          className="flex items-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-yellow-200 text-black hover:bg-yellow-300 shadow-[1.5px_1.5px_0px_0px_#000] shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                          Unduh LoA
                        </Button>
                      </div>
                    </div>

                    {/* Surat Keputusan Editor */}
                    <div className="space-y-3 pt-4 border-t-2 border-dashed border-black/10">
                      <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Pemberitahuan / Pengumuman Editor</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLetterRound(article.round || 1);
                          setLetterType("diterbitkan");
                          setShowLetterModal(true);
                        }}
                        className="text-xs font-black text-purple-700 hover:text-purple-900 transition-colors underline uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        [Keputusan] Surat Keterangan & Ucapan Selamat Penerbitan
                      </button>
                    </div>

                    {/* Tautan Halaman Publik */}
                    <div className="space-y-3 pt-4 border-t-2 border-dashed border-black/10">
                      <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Tautan Publik Jurnal</p>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 items-center gap-1.5 px-4 rounded-xl border-2 border-black bg-emerald-250 text-black hover:bg-emerald-300 font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer font-sans"
                          style={{ backgroundColor: "#34D399" }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5px]" />
                          Kunjungi Halaman Utama (Publik)
                        </Link>
                        <Link
                          href={`/articles/${article.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 items-center gap-1.5 px-4 rounded-xl border-2 border-black bg-cyan-200 text-black hover:bg-cyan-300 font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer font-sans"
                        >
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5px]" />
                          Lihat Tampilan Publik Naskah
                        </Link>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] text-center py-16">
                    <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-black">Naskah Belum Diterbitkan</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      Naskah Anda belum masuk ke tahap penerbitan (produksi final).
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Sidebar Downloads & Metadata */}
          <div className="space-y-6">
            {/* Download Panel */}
            <div className="bg-yellow-50 border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="text-sm font-black uppercase tracking-tight text-black mb-4">
                UNDUH DRAF DOKUMEN
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleDownload("pdf")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-[3px] border-black bg-primary text-primary-foreground font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5px]" />
                  LIHAT PDF (FULL TEXT)
                </button>
                <button
                  onClick={() => handleDownload("original")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-[3px] border-black bg-cyan-300 text-black font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5px]" />
                  UNDUH FILE ASLI
                </button>
                {article.file_name && (
                  <p className="text-[10px] font-black text-center text-muted-foreground uppercase tracking-widest truncate">
                    Berkas: {article.file_name}
                  </p>
                )}
                <button
                  onClick={() => handleDownload("tex")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-[3px] border-black bg-white text-black font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5px]" />
                  UNDUH LATEX (TEX)
                </button>
              </div>
            </div>

            {/* Meta Info Panel */}
            <div className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-tight text-black border-b-2 border-black pb-2">
                INFORMASI ARSIP
              </h3>
              <div className="space-y-3.5 text-xs font-black uppercase tracking-wide text-zinc-600">
                <div>
                  <p className="text-[10px] text-zinc-400">Rumpun Ilmu</p>
                  <p className="mt-1 text-black">{article.category}</p>
                </div>
                {article.doi && (
                  <div>
                    <p className="text-[10px] text-zinc-400">Digital Object Identifier (DOI)</p>
                    <p className="mt-1 text-purple-600 truncate">{article.doi}</p>
                  </div>
                )}
                {article.submittedAt && (
                  <div>
                    <p className="text-[10px] text-zinc-400">Tanggal Pengajuan</p>
                    <p className="mt-1 text-black">
                      {new Date(article.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Editor Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full p-6 space-y-4 relative font-sans">
            <button
              onClick={() => setShowLetterModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg border-2 border-black bg-rose-200 text-black font-black flex items-center justify-center hover:bg-rose-300 transition-colors shadow-[2px_2px_0px_0px_#000]"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 pb-2 border-b-2 border-black">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-black">
                {letterType === "copyedit" 
                  ? "Surat Keputusan Editor - Tahap Copyediting" 
                  : letterType === "diterbitkan" 
                  ? "Surat Keputusan Editor - Penerbitan Naskah" 
                  : "Surat Keputusan Editor - Tahap Evaluasi"}
              </h3>
            </div>
            
            <div className="space-y-4 text-xs font-semibold text-zinc-700 leading-relaxed max-h-[350px] overflow-y-auto pr-1">
              <p><strong>Kepada Yth. Penulis {article.authors[0]},</strong></p>
              
              {letterType === "copyedit" ? (
                <>
                  <p>Kami mengabarkan bahwa naskah Anda telah selesai dievaluasi dan dinyatakan diterima untuk masuk ke tahap **Copyediting**:</p>
                  <div className="p-3 border-2 border-black bg-purple-50/20 rounded-xl font-sans">
                    <p><strong>Judul:</strong> {article.title}</p>
                    <p><strong>Status Tahap:</strong> Copyediting (Penyuntingan Tata Letak)</p>
                  </div>
                  <p>
                    Keputusan resmi editor terhadap naskah Anda adalah:
                  </p>
                  <p className="font-bold text-center text-sm py-2 px-4 border-2 border-black rounded-xl bg-cyan-155 text-cyan-800 uppercase tracking-wider w-fit mx-auto shadow-[2px_2px_0px_0px_#000]" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                    TERIMA UNTUK COPYEDITING (ACCEPT FOR COPYEDITING)
                  </p>
                  <p>
                    Pada tahap ini, tim editor akan melakukan penyuntingan tata bahasa, format, dan penataan gaya selingkung naskah agar sesuai dengan standar publikasi FAST-Journal. Kami akan menghubungi Anda kembali jika ada bagian teks yang memerlukan konfirmasi lebih lanjut.
                  </p>
                </>
              ) : letterType === "diterbitkan" ? (
                <>
                  <p>Selamat! Naskah Anda yang diajukan ke FAST-Journal telah **resmi diterbitkan**:</p>
                  <div className="p-3 border-2 border-black bg-emerald-50/20 rounded-xl font-sans">
                    <p><strong>Judul:</strong> {article.title}</p>
                    <p><strong>Status Tahap:</strong> Terbit (Published)</p>
                  </div>
                  <p>
                    Keputusan resmi editor terhadap naskah Anda adalah:
                  </p>
                  <p className="font-bold text-center text-sm py-2 px-4 border-2 border-black rounded-xl bg-emerald-150 text-emerald-800 uppercase tracking-wider w-fit mx-auto shadow-[2px_2px_0px_0px_#000]" style={{ backgroundColor: "#D1FAE5", color: "#047857" }}>
                    NASKAH RESMI DITERBITKAN (ARTICLE PUBLISHED)
                  </p>
                  <p>
                    Kami mengucapkan selamat atas publikasi artikel ilmiah Anda. Karya Anda kini telah tersedia secara luas di portal jurnal kami untuk diakses oleh komunitas ilmiah global. Kami sangat menghargai kontribusi ilmiah yang Anda berikan dan berharap Anda berkenan untuk kembali mengirimkan karya ilmiah terbaik Anda ke FAST-Journal di masa mendatang.
                  </p>
                  <p className="italic font-bold text-purple-700 uppercase tracking-wide">Selamat atas pencapaian Anda!</p>
                </>
              ) : (
                <>
                  <p>Kami telah selesai melakukan evaluasi editorial untuk naskah Anda yang diajukan ke FAST-Journal:</p>
                  <div className="p-3 border-2 border-black bg-purple-50/20 rounded-xl font-sans">
                    <p><strong>Judul:</strong> {article.title}</p>
                    <p><strong>Ronde Evaluasi:</strong> Ronde {selectedLetterRound}</p>
                  </div>
                  <p>
                    Berdasarkan hasil ulasan sejawat (peer review) dari para pakar yang ditugaskan, keputusan editor terhadap naskah Anda adalah:
                  </p>
                  <p className="font-bold text-center text-sm py-2 px-4 border-2 border-black rounded-xl bg-yellow-100 text-yellow-800 uppercase tracking-wider w-fit mx-auto">
                    {selectedLetterRound < currentRound || article.status === "Revision Required" 
                      ? "MINTA REVISI (REVISIONS REQUIRED)" 
                      : article.status === "Published" 
                      ? "TERIMA & TERBITKAN (ACCEPT SUBMISSION)" 
                      : article.status === "Copyediting"
                      ? "TERIMA UNTUK COPYEDITING (ACCEPT FOR COPYEDITING)"
                      : "SEDANG DITINJAU (UNDER REVIEW)"}
                  </p>
                  <p>
                    {selectedLetterRound < currentRound || article.status === "Revision Required" ? (
                      <span>
                        Silakan lakukan perbaikan naskah sesuai dengan catatan ulasan reviewer yang tertera pada tab **Ulasan**. Setelah perbaikan selesai dilakukan secara menyeluruh, mohon kirimkan naskah revisi terbaru Anda melalui tombol pengiriman revisi yang disediakan di halaman ini.
                      </span>
                    ) : article.status === "Published" || article.status === "Copyediting" ? (
                      <span>
                        Naskah Anda dinilai memiliki kualitas akademis yang baik dan kontribusi ilmiah yang memadai untuk dipublikasikan di FAST-Journal. Kami mengucapkan terima kasih atas kerja keras Anda dan partisipasi berharga Anda pada jurnal kami.
                      </span>
                    ) : (
                      <span>
                        Naskah Anda saat ini sedang berada dalam antrean peninjauan oleh tim editor. Kami akan mengabari Anda segera setelah keputusan final diambil.
                      </span>
                    )}
                  </p>
                </>
              )}
              <p>Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>
              <div className="pt-4 border-t border-dashed border-black/20">
                <p className="font-bold">Salam hangat,</p>
                <p className="font-extrabold text-black mt-2 font-sans">Redaksi FAST-Journal</p>
                <p className="text-[10px] text-zinc-400">Universitas Prima Indonesia (UNPRI)</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setShowLetterModal(false)}
                className="neo-btn text-xs font-black uppercase tracking-wider text-white bg-purple-650 border-2 border-black px-4 py-2"
                style={{ backgroundColor: "#7C3AED" }}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Notice Modal for Bookmark */}
      {showAuthNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6 space-y-4 relative font-sans">
            <button
              onClick={() => setShowAuthNotice(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg border-2 border-black bg-rose-200 text-black font-black flex items-center justify-center hover:bg-rose-300 transition-colors shadow-[2px_2px_0px_0px_#000]"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2.5 pb-2 border-b-2 border-black">
              <Bookmark className="w-5 h-5 text-purple-600 stroke-[2.5px]" />
              <h3 className="text-sm font-black uppercase tracking-wider text-black">
                Pemberitahuan Penanda
              </h3>
            </div>
            
            <div className="space-y-3 text-xs font-semibold text-zinc-700 leading-relaxed">
              <p>
                Untuk menandai naskah ini dan menyimpannya ke dalam menu **Penanda**, Anda harus masuk atau membuat akun terlebih dahulu.
              </p>
              <p>
                Dengan memiliki akun, Anda dapat menyimpan naskah-naskah favorit dan memantaunya langsung dari dasbor Anda.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/masuk"
                className="flex-1 inline-flex h-9 items-center justify-center rounded-xl border-2 border-black bg-purple-600 text-white font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all text-center items-center"
              >
                Masuk Sekarang
              </Link>
              <Link
                href="/daftar"
                className="flex-1 inline-flex h-9 items-center justify-center rounded-xl border-2 border-black bg-yellow-200 text-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all text-center items-center"
              >
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
