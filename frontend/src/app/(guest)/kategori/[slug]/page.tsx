"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchCategory } from "@/lib/api-client";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import type { Article, Category } from "@/types";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function KategoriPage() {
  const { slug } = useParams() as { slug: string };
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    fetchCategory(slug)
      .then((data) => {
        setCategory(data.category);
        setArticles(data.articles);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Memuat Kategori...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-black mb-4">Kategori Tidak Ditemukan</h2>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-black text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Neubrutalist Header Section */}
      <div className="bg-blue-50 border-b-[3px] border-black py-20 relative overflow-hidden">
        {/* Decorative Grid Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]" /> Kembali ke Beranda
          </Link>

          <div className="flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-fit">
            <BookOpen className="w-4 h-4 text-blue-600 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Bidang Disiplin Ilmu
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-4 uppercase tracking-tight">
            KATEGORI: <span className="bg-yellow-200 px-3 border-2 border-black inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_#000]">{category.name}</span>
          </h1>

          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-550 mt-4">
            Total {category.count || 0} artikel terbit · {articles.length} naskah tersedia secara online
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length > 0 ? (
          <>
            <h2 className="text-xl font-black uppercase tracking-tight text-black mb-8 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-purple-500 border border-black inline-block" />
              ARTIKEL YANG DITERBITKAN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border-[3px] border-black p-16 text-center shadow-[6px_6px_0px_0px_#000] max-w-2xl mx-auto">
            <p className="text-xl font-black uppercase tracking-tight text-black mb-2">
              Belum ada artikel yang diterbitkan
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Artikel dalam kategori ini sedang dalam proses tinjauan (under review) oleh tim editor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
