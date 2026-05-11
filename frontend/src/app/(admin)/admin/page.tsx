import { FileText, Clock, CheckCircle, XCircle, Users, Settings, Library, Tag } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { mockArticles, mockAuthors } from "@/lib/mock-data";
import Link from "next/link";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Panel Admin" };

export default function AdminOverviewPage() {
  const underReview = mockArticles.filter((a) => a.status === "Under Review").length;
  const published = mockArticles.filter((a) => a.status === "Published").length;
  const rejected = mockArticles.filter((a) => a.status === "Rejected").length;
  const total = mockArticles.length;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Panel Administrasi"
        subtitle="Ringkasan aktivitas jurnal dan manajemen naskah."
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatsCard title="Total Naskah" value={total} icon={FileText} color="indigo" />
            <StatsCard title="Sedang Ditinjau" value={underReview} icon={Clock} subtitle="Menunggu keputusan" color="amber" />
            <StatsCard title="Diterbitkan" value={published} icon={CheckCircle} trend="+2 bulan ini" color="emerald" />
            <StatsCard title="Ditolak" value={rejected} icon={XCircle} subtitle="Sepanjang waktu" color="rose" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <Link
              href="/admin/submissions"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shrink-0 bg-blue-100 text-blue-700 shadow-[2px_2px_0px_0px_#000000]">
                    <FileText className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Kelola Naskah</h3>
                </div>
                <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">
                  Tinjau, setujui, atau tolak naskah yang masuk dari penulis.
                </p>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-primary mt-4 group-hover:underline block">Buka &rarr;</span>
            </Link>

            <Link
              href="/admin/issues"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-700 shadow-[2px_2px_0px_0px_#000000]">
                    <Library className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Edisi Jurnal</h3>
                </div>
                <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">
                  Atur volume, nomor edisi berkala, serta jadwal publikasi.
                </p>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-primary mt-4 group-hover:underline block">Buka &rarr;</span>
            </Link>

            <Link
              href="/admin/categories"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shrink-0 bg-amber-100 text-amber-700 shadow-[2px_2px_0px_0px_#000000]">
                    <Tag className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Kategori Jurnal</h3>
                </div>
                <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">
                  Kelola rumpun ilmu, klasifikasi naskah, dan bidang studi.
                </p>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-primary mt-4 group-hover:underline block">Buka &rarr;</span>
            </Link>

            <Link
              href="/admin/users"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shrink-0 bg-purple-100 text-purple-700 shadow-[2px_2px_0px_0px_#000000]">
                    <Users className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">Kelola Pengguna</h3>
                </div>
                <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">
                  Kelola akun pengguna, peran, dan hak akses platform.
                </p>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-primary mt-4 group-hover:underline block">Buka &rarr;</span>
            </Link>
          </div>

          {/* Recent submissions table */}
          <div
            className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow mb-10"
          >
            <div className="px-6 py-4 border-b-[3px] border-sidebar-border flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/20">
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-wider text-foreground">
                  Naskah Terbaru
                </h3>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  {total} total naskah masuk
                </p>
              </div>
              <Link
                href="/admin/submissions"
                className="text-[11px] font-black uppercase tracking-wider text-primary hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="divide-y-2 divide-sidebar-border">
              {mockArticles.slice(0, 3).map((article) => (
                <div key={article.id} className="p-4 hover:bg-purple-50/30 dark:hover:bg-purple-950/5 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-black text-foreground truncate mb-1">
                      {article.title}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                      {article.authors.join(", ")} · <span className="text-primary">{article.category}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-extrabold px-2.5 py-0.5 border-2 border-black rounded-lg uppercase tracking-wider",
                        article.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : article.status === "Under Review"
                          ? "bg-amber-100 text-amber-850"
                          : "bg-rose-100 text-rose-800"
                      )}
                    >
                      {article.status === "Published"
                        ? "Diterbitkan"
                        : article.status === "Under Review"
                        ? "Ditinjau"
                        : "Ditolak"}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {new Date(article.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User stats */}
          <div
            className="bg-card rounded-2xl p-6 transition-all duration-300 neo-border neo-shadow"
          >
            <h3 className="text-[14px] font-black uppercase tracking-wider text-foreground mb-6">
              Statistik Pengguna Jurnal
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Pengguna", value: "24", icon: Users, bg: "bg-indigo-100 text-indigo-700" },
                { label: "Penulis", value: "18", icon: FileText, bg: "bg-blue-100 text-blue-700" },
                { label: "Peninjau", value: "4", icon: CheckCircle, bg: "bg-emerald-100 text-emerald-700" },
                { label: "Editor", value: "2", icon: Settings, bg: "bg-amber-100 text-amber-700" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 p-4 rounded-xl border-2 border-black bg-purple-50/50 dark:bg-purple-950/10 shadow-[3px_3px_0px_0px_#000000]">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-md border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000000]", stat.bg)}>
                      <stat.icon className="w-3.5 h-3.5 stroke-[2.5px]" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-[24px] font-black tracking-tight text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
