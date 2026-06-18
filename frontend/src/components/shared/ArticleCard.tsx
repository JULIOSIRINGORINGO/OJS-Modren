"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, ArrowUpRight, FileText } from "lucide-react";
import type { Article } from "@/types";
import { cn } from "@/lib/utils";
import { trackArticleDownload } from "@/lib/api-client";

const categoryBg: Record<string, string> = {
  "Ilmu Data": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  "Pemrosesan Bahasa Alami": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  "Pembelajaran Mesin": "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  "Penglihatan Komputer": "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
  "Sistem Terdistribusi": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  "AI yang Dapat Dijelaskan": "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
};

export function ArticleCard({ article }: { article: Article }) {
  const badgeClass = categoryBg[article.category] ?? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200";
  const [downloads, setDownloads] = useState(article.downloads || 0);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If a real PDF file was uploaded, open from backend server
    if (article.file_url && article.file_name?.toLowerCase().endsWith('.pdf')) {
      window.open(`http://localhost:3001${article.file_url}`, "_blank");
    } else {
      // Fallback to generated PDF galley page
      window.open(`/articles/${article.id}/pdf`, "_blank");
    }

    trackArticleDownload(article.id)
      .then((res) => {
        if (res.success) {
          setDownloads(res.downloads);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm flex flex-col"
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={cn("text-[9px] font-extrabold border-2 border-black rounded-lg px-2 py-0.5 uppercase tracking-wider", badgeClass)}
          >
            {article.category}
          </Badge>
          {article.volume && (
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              {article.volume} · {article.issue}
            </span>
          )}
        </div>

        <Link href={`/articles/${article.id}`} className="flex-1 group/title">
          <h3
            className="text-[14px] font-black leading-snug mb-2 line-clamp-2 transition-colors duration-200 tracking-wide text-foreground group-hover/title:text-primary"
          >
            {article.title}
            <ArrowUpRight
              className="inline-block w-4 h-4 ml-1 opacity-0 group-hover/title:opacity-100 transition-all duration-200 -translate-y-0.5 text-primary stroke-[2.5px]"
            />
          </h3>
        </Link>

        <p className="text-[12px] font-medium leading-relaxed mb-4 line-clamp-2 text-muted-foreground">
          {article.abstract}
        </p>

        <div
          className="flex items-center justify-between mt-auto pt-3 border-t-2 border-sidebar-border"
        >
          <p className="text-[10px] truncate flex-1 font-black uppercase tracking-wider text-foreground/80 mr-2">
            {article.authors[0]}{article.authors.length > 1 ? ` +${article.authors.length - 1}` : ""}
          </p>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border-2 border-black bg-red-100 hover:bg-red-200 text-black shadow-[1.5px_1.5px_0px_0px_#000] hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded"
            >
              <FileText className="w-3.5 h-3.5 text-red-650" />
              PDF
            </button>
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/90 ml-1">
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" /> {article.views !== undefined ? article.views.toLocaleString('id-ID') : 0}
              </span>
              <span className="flex items-center gap-0.5">
                <Download className="w-3 h-3" /> {downloads.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
