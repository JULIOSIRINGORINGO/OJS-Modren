import { mockArticles } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { Eye, Download, Calendar, ExternalLink, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return mockArticles.map((a) => ({ id: a.id }));
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = mockArticles.find((a) => a.id === params.id);
  if (!article) notFound();

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/issues"
            className="inline-flex items-center gap-1.5 text-sm font-sans mb-6 opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "white" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Terbitan
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full font-sans"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
            >
              {article.category}
            </span>
            {article.volume && (
              <span className="text-xs font-sans opacity-70 text-white">
                {article.volume} · {article.issue}
              </span>
            )}
            <StatusBadge status={article.status} />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            {article.title}
          </h1>

          <p className="font-sans" style={{ color: "rgba(255,255,255,0.8)" }}>
            {article.authors.join(" · ")}
          </p>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="border-b" style={{ borderColor: "#E4E4E7", backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-6">
            {article.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                <span className="text-xs font-sans" style={{ color: "#71717A" }}>
                  Diterbitkan:{" "}
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {article.views !== undefined && (
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                <span className="text-xs font-sans" style={{ color: "#71717A" }}>
                  {article.views.toLocaleString("id-ID")} tampilan
                </span>
              </div>
            )}
            {article.downloads !== undefined && (
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                <span className="text-xs font-sans" style={{ color: "#71717A" }}>
                  {article.downloads.toLocaleString("id-ID")} unduhan
                </span>
              </div>
            )}
            {article.doi && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                <span className="text-xs font-sans font-medium" style={{ color: "#6366F1" }}>
                  {article.doi}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Abstract */}
            <div
              className="p-8 rounded-2xl border"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: "#09090B" }}>
                Abstrak
              </h2>
              <p className="font-sans leading-relaxed text-base" style={{ color: "#374151" }}>
                {article.abstract}
              </p>
            </div>

            {/* Keywords */}
            {article.keywords && (
              <div
                className="p-6 rounded-2xl border"
                style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
              >
                <h3 className="font-serif text-base font-semibold mb-3" style={{ color: "#09090B" }}>
                  Kata Kunci
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs font-medium px-3 py-1.5 rounded-full font-sans border"
                      style={{
                        backgroundColor: "rgba(45,58,140,0.05)",
                        borderColor: "rgba(45,58,140,0.2)",
                        color: "#6366F1",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div
              className="p-6 rounded-2xl border"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <h3 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                Unduh Artikel
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-medium font-sans transition-colors"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                >
                  <Download className="w-4 h-4" />
                  Unduh PDF
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium font-sans transition-colors"
                  style={{ borderColor: "#E4E4E7", color: "#374151" }}
                >
                  <Download className="w-4 h-4" />
                  Unduh TeX
                </button>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl border"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <h3 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                Informasi Artikel
              </h3>
              <div className="space-y-3 text-sm font-sans">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: "#9CA3AF" }}>Penulis</p>
                  <p className="mt-0.5" style={{ color: "#374151" }}>{article.authors.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: "#9CA3AF" }}>Bidang</p>
                  <p className="mt-0.5" style={{ color: "#374151" }}>{article.category}</p>
                </div>
                {article.doi && (
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: "#9CA3AF" }}>DOI</p>
                    <p className="mt-0.5" style={{ color: "#6366F1" }}>{article.doi}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
