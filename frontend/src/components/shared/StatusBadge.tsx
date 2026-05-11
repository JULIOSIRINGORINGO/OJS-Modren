import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  Draft: { label: "Draf", className: "bg-gray-100 text-gray-600 border-gray-200" },
  "Under Review": { label: "Sedang Ditinjau", className: "bg-blue-50 text-blue-700 border-blue-200" },
  "Revision Required": { label: "Perlu Revisi", className: "bg-amber-50 text-amber-700 border-amber-200" },
  Accepted: { label: "Diterima", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Published: { label: "Diterbitkan", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  Rejected: { label: "Ditolak", className: "bg-red-50 text-red-600 border-red-200" },
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium font-sans", config.className)}
    >
      {config.label}
    </Badge>
  );
}
