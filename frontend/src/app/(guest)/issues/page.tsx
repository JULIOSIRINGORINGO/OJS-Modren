import Link from "next/link";
import { mockArticles } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Eye, Download, BookOpen } from "lucide-react";

export const metadata = { title: "Terbitan" };

const volumes = [
  {
    volume: "Vol. 12",
    year: "2025",
    issues: [
      { label: "Edisi 2", articles: mockArticles.filter((a) => a.volume === "Vol. 12" && a.issue === "Edisi 2") },
      { label: "Edisi 1", articles: mockArticles.filter((a) => a.volume === "Vol. 12" && a.issue === "Edisi 1") },
    ],
  },
  {
    volume: "Vol. 11",
    year: "2024",
    issues: [
      { label: "Edisi 2", articles: [] },
      { label: "Edisi 1", articles: [] },
    ],
  },
];

export default function IssuesPage() {
  const publishedArticles = mockArticles.filter((a) => a.status === "Published");

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-white opacity-70" />
            <span className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.7)" }}>
              Arsip Terbitan
            </span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Terbitan Jurnal</h1>
          <p className="font-sans" style={{ color: "rgba(255,255,255,0.75)" }}>
            Seluruh edisi dan volume yang telah diterbitkan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Issue Highlight */}
        <div
          className="rounded-2xl p-8 mb-12 border"
          style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-xs font-semibold font-sans uppercase tracking-wider" style={{ color: "#F59E0B" }}>
                Terbitan Terkini
              </span>
              <h2 className="font-serif text-2xl font-semibold mt-1" style={{ color: "#09090B" }}>
                Vol. 12, Edisi 2 · 2025
              </h2>
              <p className="text-sm font-sans mt-1" style={{ color: "#71717A" }}>
                Diterbitkan: 1 April 2025 · {publishedArticles.length} Artikel
              </p>
            </div>
            <span
              className="text-xs font-medium px-3 py-1 rounded-full font-sans"
              style={{ backgroundColor: "rgba(45,58,140,0.08)", color: "#6366F1" }}
            >
              Aktif
            </span>
          </div>

          <div className="space-y-4">
            {publishedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-[#6366F1]/30 hover:shadow-sm group"
                style={{ borderColor: "#F4F4F5" }}
              >
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-serif text-base font-semibold line-clamp-1 transition-colors group-hover:text-[#6366F1]"
                    style={{ color: "#09090B" }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-xs font-sans mt-1" style={{ color: "#71717A" }}>
                    {article.authors.join(", ")}
                  </p>
                  {article.doi && (
                    <p className="text-xs font-sans mt-0.5" style={{ color: "#9CA3AF" }}>
                      DOI: {article.doi}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <StatusBadge status={article.status} />
                  {article.views !== undefined && (
                    <span className="flex items-center gap-1 text-xs font-sans" style={{ color: "#9CA3AF" }}>
                      <Eye className="w-3 h-3" /> {article.views.toLocaleString()}
                    </span>
                  )}
                  {article.downloads !== undefined && (
                    <span className="flex items-center gap-1 text-xs font-sans" style={{ color: "#9CA3AF" }}>
                      <Download className="w-3 h-3" /> {article.downloads.toLocaleString()}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Archive */}
        <h2 className="font-serif text-xl font-semibold mb-6" style={{ color: "#09090B" }}>
          Arsip Volume
        </h2>
        <div className="space-y-4">
          {volumes.map((vol) => (
            <details
              key={vol.volume}
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <summary
                className="flex items-center justify-between px-6 py-4 cursor-pointer font-sans font-medium select-none"
                style={{ color: "#09090B" }}
              >
                <span className="font-serif text-base font-semibold">
                  {vol.volume} · {vol.year}
                </span>
                <span className="text-xs font-sans" style={{ color: "#71717A" }}>
                  {vol.issues.length} edisi
                </span>
              </summary>
              <div className="border-t px-6 py-4 space-y-3" style={{ borderColor: "#F4F4F5" }}>
                {vol.issues.map((issue) => (
                  <div key={issue.label} className="flex items-center justify-between">
                    <span className="text-sm font-sans" style={{ color: "#374151" }}>
                      {issue.label}
                    </span>
                    <span className="text-xs font-sans" style={{ color: "#9CA3AF" }}>
                      {issue.articles.length > 0 ? `${issue.articles.length} artikel` : "Segera hadir"}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
