"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { fetchArticles } from "@/lib/api-client";
import type { Article } from "@/types";
import Link from "next/link";

export function SubmissionTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles({ scope: "dashboard" })
      .then(setArticles)
      .finally(() => setLoading(false));

    // Set polling for real-time submissions table updates
    const interval = setInterval(() => {
      fetchArticles({ scope: "dashboard" })
        .then(setArticles)
        .catch(console.error);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow"
    >
      <div className="px-6 py-4 border-b-[3px] border-sidebar-border bg-purple-50 dark:bg-purple-950/20">
        <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground">
          Naskah Saya
        </h3>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
          Pantau status naskah yang telah Anda kirimkan
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat naskah...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm font-black text-foreground">Belum ada naskah</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
            Kirimkan naskah pertama Anda untuk mulai.
          </p>
          <Link href="/dashboard/submissions/new">
            <Button className="mt-4 neo-btn text-[11px] font-black uppercase tracking-wider">
              Kirim Naskah Baru
            </Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-b-[3px] border-sidebar-border bg-purple-50/50 dark:bg-purple-950/10 hover:bg-purple-50/50">
              {["Judul", "Kategori", "Dikirim", "Status", ""].map((h, i) => (
                <TableHead
                  key={i}
                  className="font-black text-[10px] uppercase tracking-wider text-foreground/80 pb-3 h-10 px-6"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow
                key={article.id}
                className="border-b-2 border-sidebar-border hover:bg-purple-50/30 dark:hover:bg-purple-950/5 group transition-colors"
              >
                <TableCell className="max-w-xs px-6 py-4">
                  <p
                    className="font-extrabold text-[13px] text-foreground line-clamp-1 transition-colors"
                  >
                    {article.title}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    {article.category}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    {new Date(article.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <StatusBadge status={article.status} round={article.round} />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Link href={`/articles/${article.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0 neo-btn rounded-md border-2 border-black"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
