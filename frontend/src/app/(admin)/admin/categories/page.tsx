import { Tag, Plus, CheckCircle, FileText, BarChart3, AlertCircle } from "lucide-react";
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

export const metadata = { title: "Manajemen Kategori Jurnal" };

const mockCategories = [
  {
    id: "CAT-001",
    code: "COMP",
    name: "Ilmu Komputer",
    description: "Kecerdasan buatan, jaringan komputer, pengolahan citra digital, dan rekayasa perangkat lunak.",
    status: "Active",
    count: 14,
  },
  {
    id: "CAT-002",
    code: "ECON",
    name: "Ekonomi",
    description: "Ekonomi pembangunan, digital bisnis, kebijakan fiskal, dan analisis UMKM.",
    status: "Active",
    count: 8,
  },
  {
    id: "CAT-003",
    code: "LING",
    name: "Linguistik",
    description: "Analisis sintaksis, pemrosesan bahasa alami (NLP), sastra bandingan, dan semantik.",
    status: "Active",
    count: 6,
  },
  {
    id: "CAT-004",
    code: "MATH",
    name: "Matematika",
    description: "Matematika diskrit, statistik terapan, optimasi numerik, dan teori graf.",
    status: "Active",
    count: 4,
  },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Manajemen Kategori Jurnal"
        subtitle="Kelola rumpun ilmu publikasi ilmiah dan deskripsi klasifikasi naskah."
        icon={Tag}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <StatsCard title="Total Kategori" value={mockCategories.length} icon={Tag} color="indigo" />
            <StatsCard title="Kategori Aktif" value={mockCategories.filter(c => c.status === "Active").length} icon={CheckCircle} color="emerald" />
            <StatsCard title="Naskah Terklasifikasi" value={mockCategories.reduce((acc, curr) => acc + curr.count, 0)} icon={FileText} color="amber" />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-[16px] font-black uppercase tracking-wider text-foreground">Daftar Rumpun Ilmu / Kategori</h2>
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Klasifikasi naskah submisi penulis</p>
            </div>
            <Button className="h-10 text-[11px] font-black uppercase tracking-wider neo-btn rounded-xl">
              <Plus className="w-4 h-4 mr-2 stroke-[2.5px]" /> Tambah Kategori
            </Button>
          </div>

          {/* Table Container */}
          <div className="bg-card rounded-2xl overflow-hidden neo-border neo-shadow">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-50/50 border-b-[3px] border-sidebar-border">
                  {["Kode", "Nama Kategori", "Deskripsi Kategori", "Jumlah Artikel", "Status", "Aksi"].map((header) => (
                    <TableHead key={header} className="font-black text-[10px] uppercase tracking-wider text-muted-foreground py-4">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y-2 divide-sidebar-border">
                {mockCategories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/5 transition-colors">
                    <TableCell className="py-4">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border-2 border-black bg-purple-100 text-purple-700 shadow-[2px_2px_0px_0px_#000000]">
                        {cat.code}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] font-black text-foreground">{cat.name}</span>
                      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{cat.id}</span>
                    </TableCell>
                    <TableCell className="py-4 max-w-xs">
                      <span className="text-[12px] font-medium text-muted-foreground leading-relaxed block">{cat.description}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[13px] font-black text-primary uppercase tracking-wider">{cat.count} Naskah</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className="text-[9px] font-extrabold px-2.5 py-0.5 border-2 border-black rounded-lg uppercase tracking-wider bg-emerald-100 text-emerald-800"
                      >
                        {cat.status === "Active" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn">
                          Edit
                        </Button>
                        <Button variant="outline" className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn hover:bg-rose-100 hover:text-rose-700">
                          Hapus
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
