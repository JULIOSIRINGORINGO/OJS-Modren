import { mockArticles, mockCategories } from "@/lib/mock-data";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return mockCategories.map((cat) => ({ slug: cat.slug }));
}

export default function KategoriPage({ params }: { params: { slug: string } }) {
  const category = mockCategories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const articles = mockArticles.filter(
    (a) => a.category === category.name && a.status === "Published"
  );
  const allInCategory = mockArticles.filter((a) => a.category === category.name);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2 font-sans"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Bidang Ilmu
          </p>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">{category.name}</h1>
          <p className="font-sans" style={{ color: "rgba(255,255,255,0.75)" }}>
            {category.count} artikel · {allInCategory.length} naskah tersedia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length > 0 ? (
          <>
            <h2 className="font-serif text-xl font-semibold mb-6" style={{ color: "#09090B" }}>
              Artikel yang Diterbitkan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div
            className="rounded-2xl border p-16 text-center"
            style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
          >
            <p className="font-serif text-xl font-semibold mb-2" style={{ color: "#09090B" }}>
              Belum ada artikel yang diterbitkan
            </p>
            <p className="text-sm font-sans" style={{ color: "#71717A" }}>
              Artikel dalam kategori ini sedang dalam proses tinjauan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
