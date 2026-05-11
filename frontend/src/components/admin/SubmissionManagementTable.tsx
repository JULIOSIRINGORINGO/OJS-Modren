"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ReviewActionDialog } from "@/components/admin/ReviewActionDialog";
import { mockArticles } from "@/lib/mock-data";
import type { Article } from "@/types";
import { MoreHorizontal, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/useDebounce";

export function SubmissionManagementTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery);

  const filtered = mockArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      a.authors.some((auth) =>
        auth.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
  );

  const handleAction = (article: Article) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  return (
    <>
      <div
        className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow"
      >
        {/* Toolbar */}
        <div
          className="px-6 py-4 border-b-[3px] border-sidebar-border bg-purple-50/50 dark:bg-purple-950/20 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
        >
          <div>
            <h3 className="text-[14px] font-black uppercase tracking-wider text-foreground">
              Naskah Masuk
            </h3>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
              {filtered.length} naskah ditemukan
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau penulis..."
                className="pl-9 text-[13px] h-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-[11px] font-black uppercase tracking-wider neo-btn"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50/30 dark:bg-purple-950/10 hover:bg-purple-50/30 border-b-2 border-sidebar-border">
              {["Judul & Penulis", "Kategori", "Dikirim", "Status", "Aksi"].map((h) => (
                <TableHead
                  key={h}
                  className="font-black text-[10px] uppercase tracking-wider text-muted-foreground py-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y-2 divide-sidebar-border">
            {filtered.map((article) => (
              <TableRow
                key={article.id}
                className="hover:bg-purple-50/30 dark:hover:bg-purple-950/5 transition-colors group"
              >
                <TableCell className="max-w-xs py-4">
                  <p
                    className="text-[13px] font-black text-foreground line-clamp-1 mb-1"
                  >
                    {article.title}
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider line-clamp-1">
                    {article.authors.join(", ")}
                  </p>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-[11px] font-black text-primary uppercase tracking-wider">
                    {article.category}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {new Date(article.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <StatusBadge status={article.status} />
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn"
                      onClick={() => handleAction(article)}
                    >
                      Tinjau
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-white text-black p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-50"
                        aria-label="Opsi lainnya"
                      >
                        <MoreHorizontal className="w-4 h-4 text-black" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="font-sans text-sm border-2 border-black rounded-xl">
                        <DropdownMenuItem className="font-bold">Lihat Artikel Lengkap</DropdownMenuItem>
                        <DropdownMenuItem className="font-bold">Lihat Riwayat</DropdownMenuItem>
                        <DropdownMenuItem className="text-rose-600 font-bold">Arsipkan</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-black text-foreground">
              Tidak ada naskah ditemukan
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
              Coba sesuaikan kata pencarian Anda.
            </p>
          </div>
        )}
      </div>

      <ReviewActionDialog
        article={selectedArticle}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedArticle(null);
        }}
      />
    </>
  );
}
