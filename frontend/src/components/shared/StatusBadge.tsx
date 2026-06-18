import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  Draft: { label: "Draf", className: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700" },
  Submitted: { label: "Dikirim", className: "bg-sky-100/70 text-sky-800 border-sky-400 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800" },
  "Under Review": { label: "Sedang Ditinjau", className: "bg-blue-100/70 text-blue-800 border-blue-400 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800" },
  "Reviewer Assigned": { label: "Reviewer Ditugaskan", className: "bg-indigo-100/70 text-indigo-800 border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800" },
  "Awaiting Decision": { label: "Menunggu Keputusan", className: "bg-emerald-100/70 text-emerald-800 border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" },
  "Revision Required": { label: "Perlu Revisi", className: "bg-amber-100/70 text-amber-800 border-amber-400 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800" },
  Copyediting: { label: "Copyediting", className: "bg-teal-100/70 text-teal-800 border-teal-400 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800" },
  Production: { label: "Produksi", className: "bg-orange-100/70 text-orange-800 border-orange-400 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800" },
  Accepted: { label: "Diterima", className: "bg-emerald-100/70 text-emerald-800 border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" },
  Published: { label: "Diterbitkan", className: "bg-purple-100/70 text-purple-800 border-purple-400 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800" },
  Rejected: { label: "Ditolak", className: "bg-rose-100/70 text-rose-800 border-rose-400 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800" },
};

export function StatusBadge({ status, round }: { status: SubmissionStatus; round?: number }) {
  const config = statusConfig[status];
  if (!config) return null;

  let displayLabel = config.label;
  if (round && (status === "Under Review" || status === "Revision Required")) {
    displayLabel = `${config.label} (Ronde ${round})`;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 px-3.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]",
        config.className
      )}
    >
      {displayLabel}
    </Badge>
  );
}
