"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, BookmarkCheck, Eye, Clock, UploadCloud, BookOpen, Download, Sun, ClipboardCheck, CheckCircle2, Timer, User } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { getCurrentUser, fetchArticles, fetchBookmarks } from "@/lib/api-client";
import type { Article } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewItems, setReviewItems] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      const role = currentUser.role?.toLowerCase();
      if (role === "admin" || role === "editor") {
        router.push("/admin");
        return;
      }
    }
    
    setUser(currentUser);

    const role = currentUser?.role?.toLowerCase();
    const isReviewer = role === "reviewer";

    if (isReviewer) {
      // Fetch reviewer-related data
      fetchArticles({ scope: "admin" })
        .then((articlesData) => {
          const items = articlesData
            .filter((a) => a.status === "Under Review" || a.status === "Published")
            .map((a, idx) => ({
              id: `REV-2025-${String(idx + 1).padStart(3, "0")}`,
              articleId: a.id,
              title: a.title,
              category: a.category,
              assignedDate: a.submittedAt,
              status: a.status === "Published" ? "Completed" : "Pending",
            }));
          setReviewItems(items);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      // Fetch author-specific data
      Promise.all([
        fetchArticles({ scope: "dashboard" }),
        fetchBookmarks()
      ]).then(([articlesData, bookmarksData]) => {
        setArticles(articlesData);
        setBookmarksCount(bookmarksData.length);
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Memuat Dasbor...</p>
      </div>
    );
  }

  const welcomeName = user ? `${user.first_name} ${user.last_name || ""}` : "User";
  const isReviewer = user?.role?.toLowerCase() === "reviewer";

  if (isReviewer) {
    return <ReviewerDashboard welcomeName={welcomeName} reviewItems={reviewItems} />;
  }

  // ---- Author Dashboard ----
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === "Published").length;
  const recentSubmissions = articles.slice(0, 3);

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title={`Selamat pagi, ${welcomeName}`}
        subtitle="Berikut ringkasan aktivitas Anda di FAST-Journal."
        icon={Sun}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatsCard title="Total Naskah" value={totalArticles.toString()} subtitle="Sepanjang waktu" icon={FileText} color="indigo" />
            <StatsCard title="Diterbitkan" value={publishedArticles.toString()} subtitle={`${totalArticles - publishedArticles} sedang ditinjau`} icon={Eye} trend="+1 bulan ini" color="emerald" />
            <StatsCard title="Disimpan" value={bookmarksCount.toString()} subtitle="Tersimpan untuk dibaca" icon={BookmarkCheck} color="violet" />
            <StatsCard title="Rata-rata Tinjauan" value="18h" subtitle="Dari semua naskah" icon={Clock} color="cyan" />
          </div>

          {/* Quick Actions (Author Focused) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            <Link
              href="/dashboard/submissions/new"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black bg-purple-100 text-purple-700 shadow-[2px_2px_0px_0px_#000000] font-black"
                >
                  <UploadCloud className="w-4 h-4 stroke-[2.5px]" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Kirim Naskah Baru</h3>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                Mulai proses pengiriman naskah publikasi Anda ke jurnal ini.
              </p>
            </Link>

            <Link
              href="/panduan-penulis"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black bg-emerald-100 text-emerald-700 shadow-[2px_2px_0px_0px_#000000] font-black"
                >
                  <BookOpen className="w-4 h-4 stroke-[2.5px]" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Panduan Penulisan</h3>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                Pelajari pedoman gaya selingkung dan syarat pengiriman.
              </p>
            </Link>

            <Link
              href="/template"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black bg-amber-100 text-amber-700 shadow-[2px_2px_0px_0px_#000000] font-black"
                >
                  <Download className="w-4 h-4 stroke-[2.5px]" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Unduh Template</h3>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                Unduh format .DOCX standar untuk mempermudah penulisan.
              </p>
            </Link>
          </div>

          {/* Recent Submissions Snippet */}
          <div
            className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow"
          >
            <div className="px-6 py-4 border-b-[3px] border-sidebar-border flex items-center justify-between bg-purple-50 dark:bg-purple-950/20">
              <div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">
                  Aktivitas Naskah Terkini
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  Status terbaru dari naskah yang Anda kirimkan.
                </p>
              </div>
              <Link
                href="/dashboard/submissions"
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
            
            {recentSubmissions.length > 0 ? (
              <div className="divide-y-2 divide-sidebar-border">
                {recentSubmissions.map((article) => (
                  <div key={article.id} className="p-4 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-extrabold text-foreground truncate mb-1">
                        {article.title}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                        {article.submittedAt ? `Dikirim pada ${new Date(article.submittedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}` : "Baru dikirim"}
                      </p>
                    </div>
                    <StatusBadge status={article.status} round={article.round} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 font-bold uppercase text-xs">
                Belum ada naskah yang diajukan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== REVIEWER DASHBOARD COMPONENT ==========
function ReviewerDashboard({ welcomeName, reviewItems }: { welcomeName: string; reviewItems: any[] }) {
  const totalReviews = reviewItems.length;
  const pendingReviews = reviewItems.filter(r => r.status === "Pending").length;
  const completedReviews = reviewItems.filter(r => r.status === "Completed").length;
  const recentReviews = reviewItems.slice(0, 5);

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title={`Selamat datang, ${welcomeName}`}
        subtitle="Berikut ringkasan tugas tinjauan Anda di FAST-Journal."
        icon={ClipboardCheck}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {/* Reviewer Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatsCard title="Total Tinjauan" value={totalReviews.toString()} subtitle="Ditugaskan kepada Anda" icon={ClipboardCheck} color="indigo" />
            <StatsCard title="Menunggu Tinjauan" value={pendingReviews.toString()} subtitle="Perlu segera ditinjau" icon={Timer} color="amber" />
            <StatsCard title="Selesai Ditinjau" value={completedReviews.toString()} subtitle="Tinjauan terkirim" icon={CheckCircle2} color="emerald" />
            <StatsCard title="Rata-rata Waktu" value="3h" subtitle="Per tinjauan" icon={Clock} color="cyan" />
          </div>

          {/* Reviewer Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            <Link
              href="/dashboard/reviews"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black bg-purple-100 text-purple-700 shadow-[2px_2px_0px_0px_#000000] font-black">
                  <ClipboardCheck className="w-4 h-4 stroke-[2.5px]" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Mulai Meninjau</h3>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                Lihat dan mulai meninjau naskah yang ditugaskan kepada Anda.
              </p>
            </Link>

            <Link
              href="/panduan-penulis"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black bg-emerald-100 text-emerald-700 shadow-[2px_2px_0px_0px_#000000] font-black">
                  <BookOpen className="w-4 h-4 stroke-[2.5px]" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Panduan Reviewer</h3>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                Pelajari pedoman dan kriteria penilaian peer review jurnal ini.
              </p>
            </Link>

            <Link
              href="/dashboard/profile"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black bg-amber-100 text-amber-700 shadow-[2px_2px_0px_0px_#000000] font-black">
                  <User className="w-4 h-4 stroke-[2.5px]" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Profil Saya</h3>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                Perbarui informasi profil dan keahlian bidang Anda.
              </p>
            </Link>
          </div>

          {/* Recent Review Assignments */}
          <div className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow">
            <div className="px-6 py-4 border-b-[3px] border-sidebar-border flex items-center justify-between bg-purple-50 dark:bg-purple-950/20">
              <div>
                <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">
                  Tugas Tinjauan Terkini
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  Naskah yang ditugaskan untuk Anda tinjau.
                </p>
              </div>
              <Link
                href="/dashboard/reviews"
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            {recentReviews.length > 0 ? (
              <div className="divide-y-2 divide-sidebar-border">
                {recentReviews.map((review) => (
                  <div key={review.id} className="p-4 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">{review.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-sidebar-border"></span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider">{review.category}</span>
                      </div>
                      <p className="text-[13px] font-extrabold text-foreground truncate mb-1">
                        {review.title}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                        {review.assignedDate ? `Ditugaskan pada ${new Date(review.assignedDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}` : "Baru ditugaskan"}
                      </p>
                    </div>
                    <span className={cn(
                      "text-[9px] font-extrabold px-2.5 py-1 border-2 border-black rounded-lg uppercase tracking-wider shrink-0",
                      review.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    )}>
                      {review.status === "Completed" ? "Selesai" : "Menunggu"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 font-bold uppercase text-xs">
                Belum ada tinjauan yang ditugaskan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

