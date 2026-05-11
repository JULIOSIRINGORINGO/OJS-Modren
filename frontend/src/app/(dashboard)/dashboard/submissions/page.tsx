import { FileText } from "lucide-react";
import { SubmissionTable } from "@/components/dashboard/SubmissionTable";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export const metadata = { title: "Naskah Saya" };

export default function MySubmissionsPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Naskah Saya"
        subtitle="Pantau semua naskah yang telah Anda kirimkan beserta statusnya."
        icon={FileText}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <SubmissionTable />
        </div>
      </div>
    </div>
  );
}
