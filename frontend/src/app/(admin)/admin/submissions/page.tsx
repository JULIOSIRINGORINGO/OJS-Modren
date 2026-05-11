import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubmissionManagementTable } from "@/components/admin/SubmissionManagementTable";
import { mockArticles } from "@/lib/mock-data";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export const metadata = { title: "Manajemen Naskah" };

export default function AdminSubmissionsPage() {
  const underReview = mockArticles.filter((a) => a.status === "Under Review").length;
  const published = mockArticles.filter((a) => a.status === "Published").length;
  const rejected = mockArticles.filter((a) => a.status === "Rejected").length;
  const total = mockArticles.length;

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Manajemen Naskah"
        subtitle="Tinjau, setujui, dan kelola semua naskah yang masuk."
        icon={FileText}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatsCard title="Total Naskah" value={total} icon={FileText} color="indigo" />
            <StatsCard title="Sedang Ditinjau" value={underReview} icon={Clock} subtitle="Menunggu keputusan" color="amber" />
            <StatsCard title="Diterbitkan" value={published} icon={CheckCircle} trend="+2 bulan ini" color="emerald" />
            <StatsCard title="Ditolak" value={rejected} icon={XCircle} subtitle="Sepanjang waktu" color="rose" />
          </div>

          <SubmissionManagementTable />
        </div>
      </div>
    </div>
  );
}
