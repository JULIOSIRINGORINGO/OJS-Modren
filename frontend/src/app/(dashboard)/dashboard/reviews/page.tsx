"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Filter, Loader2 } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchReviewAssignments, getCurrentUser } from "@/lib/api-client";
import type { Article } from "@/types";

export default function MyReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // No dialog states needed anymore

  const loadReviews = useCallback(() => {
    fetchReviewAssignments()
      .then((assignments) => {
        const reviewItems = assignments.map((ra) => ({
          id: `REV-ASSIGN-${ra.id}`,
          assignmentId: ra.id,
          articleId: ra.article_id,
          title: ra.article_title,
          category: ra.article_category,
          assignedDate: ra.created_at,
          dueDate: ra.due_date,
          status: ra.status === "completed" ? "Completed" : "Pending",
          articleFileName: ra.article_file_name,
          articleFileUrl: ra.article_file_url,
        }));
        setReviews(reviewItems);
      })
      .catch((err) => {
        console.error("Gagal memuat tinjauan:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    const allowedRoles = ["reviewer", "editor", "admin", "Reviewer", "Editor", "Admin"];
    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
      return;
    }

    loadReviews();

    // Set polling for real-time reviews list updates
    const interval = setInterval(() => {
      loadReviews();
    }, 3000);

    return () => clearInterval(interval);
  }, [router, loadReviews]);

  const handleReviewAction = (review: any) => {
    router.push(`/dashboard/reviews/${review.assignmentId}`);
  };

  const handleReviewSuccess = () => {
    setLoading(true);
    loadReviews();
  };

  const filtered = reviews.filter(
    (r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Tinjauan Saya"
        subtitle="Kelola naskah yang ditugaskan kepada Anda untuk ditinjau (Peer Review)."
        icon={BookOpen}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat tinjauan...</span>
            </div>
          ) : (
            <div
              className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow"
            >
              {/* Toolbar */}
              <div className="p-4 border-b-[3px] border-sidebar-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-purple-50 dark:bg-purple-950/20">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari naskah tinjauan..."
                    className="pl-9 h-9 text-[13px]"
                  />
                </div>
                <Button variant="outline" className="h-9 w-full sm:w-auto text-[11px] font-black uppercase tracking-wider neo-btn">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Status
                </Button>
              </div>

              {/* List */}
              <div className="divide-y-2 divide-sidebar-border">
                {filtered.length === 0 ? (
                  <div className="py-16 text-center">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm font-black text-foreground">Tidak ada tinjauan ditemukan</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      Belum ada naskah yang ditugaskan untuk ditinjau.
                    </p>
                  </div>
                ) : (
                  filtered.map((review) => (
                    <div key={review.id} className="p-5 hover:bg-purple-50/30 dark:hover:bg-purple-950/5 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
                            {review.id}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-sidebar-border"></span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                            {review.category}
                          </span>
                        </div>
                        <h3 className="text-[14px] font-black text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                          {review.title}
                        </h3>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span>Ditugaskan: {new Date(review.assignedDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span>Tenggat: <strong className={review.status === "Pending" ? "text-rose-500" : ""}>{new Date(review.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto shrink-0 justify-between md:justify-center mt-2 md:mt-0">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-extrabold px-2.5 py-0.5 border-2 border-black rounded-lg uppercase tracking-wider",
                            review.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : review.status === "In Progress"
                              ? "bg-amber-100 text-amber-850"
                              : "bg-purple-100 text-purple-800"
                          )}
                        >
                          {review.status === "Completed" ? "Selesai" : review.status === "In Progress" ? "Sedang Ditinjau" : "Menunggu Tinjauan"}
                        </Badge>
                        <Button
                          variant="outline"
                          className="h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-yellow-250 text-black hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_#000]"
                          onClick={() => {
                            if (review.articleFileUrl && review.articleFileName?.toLowerCase().endsWith('.pdf')) {
                              window.open(`http://localhost:3001${review.articleFileUrl}`, "_blank");
                            } else {
                              window.open(`/articles/${review.articleId}/pdf`, "_blank");
                            }
                          }}
                        >
                          Baca Naskah
                        </Button>
                        <Button
                          variant="outline"
                          className="h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-300 text-black hover:bg-cyan-400 transition-colors shadow-[2px_2px_0px_0px_#000]"
                          onClick={() => {
                            if (review.articleFileUrl) {
                              window.open(`http://localhost:3001${review.articleFileUrl}`, "_blank");
                            } else {
                              const blob = new Blob([`Mock article file download for ${review.title} (original)`], { type: "application/octet-stream" });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "naskah_asli.docx";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              window.URL.revokeObjectURL(url);
                            }
                          }}
                        >
                          Unduh File Asli
                        </Button>
                        <Button
                          variant={review.status === "Completed" ? "outline" : "default"}
                          className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn rounded-lg"
                          onClick={() => handleReviewAction(review)}
                        >
                          {review.status === "Completed" ? "Lihat Hasil" : "Mulai Meninjau"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
