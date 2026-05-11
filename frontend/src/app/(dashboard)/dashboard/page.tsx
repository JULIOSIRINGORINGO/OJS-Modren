import { FileText, BookmarkCheck, Eye, Clock, UploadCloud, BookOpen, Download } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { mockArticles } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export const metadata = { title: "Dasbor" };

export default function DashboardPage() {
  // Hanya ambil 3 naskah terbaru untuk ringkasan dasbor
  const recentSubmissions = mockArticles.slice(0, 3);

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Selamat pagi, Andi 👋"
        subtitle="Berikut ringkasan aktivitas Anda di Modern OJS."
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatsCard title="Total Naskah" value="6" subtitle="Sepanjang waktu" icon={FileText} color="indigo" />
            <StatsCard title="Diterbitkan" value="3" subtitle="3 sedang ditinjau" icon={Eye} trend="+1 bulan ini" color="emerald" />
            <StatsCard title="Disimpan" value="12" subtitle="Tersimpan untuk dibaca" icon={BookmarkCheck} color="violet" />
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
              href="#"
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

            <a
              href="#"
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
            </a>
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
            <div className="divide-y-2 divide-sidebar-border">
              {recentSubmissions.map((article) => (
                <div key={article.id} className="p-4 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-extrabold text-foreground truncate mb-1">
                      {article.title}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                      Dikirim pada {new Date(article.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-extrabold px-2.5 py-0.5 border-2 border-black rounded-lg uppercase tracking-wider",
                        article.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : article.status === "Under Review"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-rose-100 text-rose-800"
                      )}
                    >
                      {article.status === "Published"
                        ? "Diterbitkan"
                        : article.status === "Under Review"
                        ? "Sedang Ditinjau"
                        : "Ditolak"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
