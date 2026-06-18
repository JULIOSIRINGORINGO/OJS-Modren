"use client";

import { useState, useEffect } from "react";
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubmissionManagementTable } from "@/components/admin/SubmissionManagementTable";
import { fetchArticles } from "@/lib/api-client";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import type { Article } from "@/types";

export default function AdminSubmissionsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles({ scope: "admin" })
      .then(setArticles)
      .catch((err) => console.error("Gagal memuat naskah:", err))
      .finally(() => setLoading(false));

    // Set polling for real-time submissions list updates
    const interval = setInterval(() => {
      fetchArticles({ scope: "admin" })
        .then(setArticles)
        .catch(console.error);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const underReview = articles.filter((a) => a.status === "Under Review").length;
  const published = articles.filter((a) => a.status === "Published").length;
  const rejected = articles.filter((a) => a.status === "Rejected").length;
  const total = articles.length;

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Manajemen Naskah"
        subtitle="Tinjau, setujui, dan kelola semua naskah yang masuk."
        icon={FileText}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat naskah...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatsCard title="Total Naskah" value={total} icon={FileText} color="indigo" />
                <StatsCard title="Sedang Ditinjau" value={underReview} icon={Clock} subtitle="Menunggu keputusan" color="amber" />
                <StatsCard title="Diterbitkan" value={published} icon={CheckCircle} trend={`${published} total`} color="emerald" />
                <StatsCard title="Ditolak" value={rejected} icon={XCircle} subtitle="Sepanjang waktu" color="rose" />
              </div>

              <SubmissionManagementTable articles={articles} onUpdate={setArticles} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
