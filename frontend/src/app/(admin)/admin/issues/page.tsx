import { Library, Plus, Calendar, FileText, CheckCircle, Clock } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = { title: "Manajemen Edisi Jurnal" };

const mockIssues = [
  {
    id: "ISS-012",
    volume: "Vol. 5 No. 1 (2025)",
    title: "Inovasi Teknologi Digital & Pemrosesan Bahasa Alami",
    publishDate: "2025-04-15",
    articlesCount: 6,
    status: "Published", // Published, Draft
  },
  {
    id: "ISS-011",
    volume: "Vol. 4 No. 2 (2024)",
    title: "Penerapan Kecerdasan Buatan dalam Kehidupan Sosial",
    publishDate: "2024-10-10",
    articlesCount: 8,
    status: "Published",
  },
  {
    id: "ISS-013",
    volume: "Vol. 5 No. 2 (2025)",
    title: "Riset Keamanan Jaringan & Internet of Things (IoT)",
    publishDate: "2025-10-15",
    articlesCount: 0,
    status: "Draft",
  },
];

export default function IssuesPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Manajemen Edisi Jurnal"
        subtitle="Atur volume, nomor edisi, dan jadwal penerbitan naskah berkala."
        icon={Library}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <StatsCard title="Total Edisi" value={mockIssues.length} icon={Library} color="indigo" />
            <StatsCard title="Edisi Terbit" value={mockIssues.filter(i => i.status === "Published").length} icon={CheckCircle} color="emerald" />
            <StatsCard title="Edisi Draft" value={mockIssues.filter(i => i.status === "Draft").length} icon={Clock} color="amber" />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-[16px] font-black uppercase tracking-wider text-foreground">Daftar Volume & Nomor Edisi</h2>
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Kelola arsip jurnal berkala</p>
            </div>
            <Button className="h-10 text-[11px] font-black uppercase tracking-wider neo-btn rounded-xl">
              <Plus className="w-4 h-4 mr-2 stroke-[2.5px]" /> Buat Edisi Baru
            </Button>
          </div>

          {/* Table Container */}
          <div className="bg-card rounded-2xl overflow-hidden neo-border neo-shadow">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-50/50 border-b-[3px] border-sidebar-border">
                  {["Volume & No", "Judul Edisi", "Tanggal Terbit", "Jumlah Artikel", "Status", "Aksi"].map((header) => (
                    <TableHead key={header} className="font-black text-[10px] uppercase tracking-wider text-muted-foreground py-4">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y-2 divide-sidebar-border">
                {mockIssues.map((issue) => (
                  <TableRow key={issue.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/5 transition-colors">
                    <TableCell className="py-4">
                      <span className="text-[13px] font-black text-foreground">{issue.volume}</span>
                      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{issue.id}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] font-bold text-foreground leading-snug line-clamp-1">{issue.title}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                        {new Date(issue.publishDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] font-black text-primary uppercase tracking-wider">{issue.articlesCount} Naskah</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-extrabold px-2.5 py-0.5 border-2 border-black rounded-lg uppercase tracking-wider ${
                          issue.status === "Published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-850"
                        }`}
                      >
                        {issue.status === "Published" ? "Diterbitkan" : "Konsep (Draft)"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn">
                          Edit
                        </Button>
                        <Button variant="outline" className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn">
                          Atur Naskah
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </div>
      </div>
    </div>
  );
}
