import { BookOpen, Search, Filter } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Tinjauan Saya" };

const mockReviews = [
  {
    id: "REV-2025-001",
    title: "Analisis Sentimen Pengguna Media Sosial terhadap Kebijakan Publik Menggunakan Metode Naive Bayes",
    category: "Ilmu Komputer",
    assignedDate: "2025-05-01",
    dueDate: "2025-05-21",
    status: "Pending", // Pending, In Progress, Completed
  },
  {
    id: "REV-2025-042",
    title: "Dampak Implementasi Kebijakan Ekonomi Digital terhadap Usaha Mikro, Kecil, dan Menengah (UMKM)",
    category: "Ekonomi",
    assignedDate: "2025-04-15",
    dueDate: "2025-05-05",
    status: "In Progress",
  },
  {
    id: "REV-2025-118",
    title: "Evaluasi Kinerja Algoritma Kriptografi Ringan untuk Keamanan Perangkat Internet of Things (IoT)",
    category: "Ilmu Komputer",
    assignedDate: "2025-03-10",
    dueDate: "2025-03-30",
    status: "Completed",
  },
];

export default function MyReviewsPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Tinjauan Saya"
        subtitle="Kelola naskah yang ditugaskan kepada Anda untuk ditinjau (Peer Review)."
        icon={BookOpen}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <div
            className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow"
          >
            {/* Toolbar */}
            <div className="p-4 border-b-[3px] border-sidebar-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-purple-50 dark:bg-purple-950/20">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
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
              {mockReviews.map((review) => (
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
                      variant={review.status === "Completed" ? "outline" : "default"}
                      className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn rounded-lg"
                    >
                      {review.status === "Completed" ? "Lihat Hasil" : "Mulai Meninjau"}
                    </Button>
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
