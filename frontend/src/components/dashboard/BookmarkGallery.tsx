import { ArticleCard } from "@/components/shared/ArticleCard";
import { mockArticles } from "@/lib/mock-data";
import { Bookmark } from "lucide-react";

export function BookmarkGallery() {
  const bookmarked = mockArticles.filter((a) => a.status === "Published").slice(0, 3);

  if (bookmarked.length === 0) {
    return (
      <div
        className="bg-white border rounded-xl p-12 text-center"
        style={{ borderColor: "#E4E4E7" }}
      >
        <Bookmark className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(107,114,128,0.4)" }} />
        <p className="text-sm font-medium font-sans" style={{ color: "#09090B" }}>
          Belum ada penanda
        </p>
        <p className="text-xs font-sans mt-1" style={{ color: "#71717A" }}>
          Simpan artikel untuk dibaca nanti dengan mengklik ikon penanda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {bookmarked.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
