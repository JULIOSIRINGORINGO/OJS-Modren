"use client";

import { useState, useEffect } from "react";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { fetchBookmarks, removeBookmark } from "@/lib/api-client";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookmarkGallery() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks()
      .then(setBookmarks)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (bookmarkId: string) => {
    try {
      await removeBookmark(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (err) {
      console.error("Gagal menghapus penanda:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat penanda...</span>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div
        className="bg-card rounded-2xl p-12 text-center neo-border neo-shadow"
      >
        <Bookmark className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-sm font-black text-foreground">
          Belum ada penanda
        </p>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
          Simpan artikel untuk dibaca nanti dengan mengklik ikon penanda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="relative group">
          <ArticleCard article={bookmark.article} />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-3 right-3 h-7 text-[9px] font-black uppercase tracking-wider neo-btn bg-rose-50 text-rose-600 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100"
            onClick={() => handleRemove(bookmark.id)}
          >
            Hapus
          </Button>
        </div>
      ))}
    </div>
  );
}
