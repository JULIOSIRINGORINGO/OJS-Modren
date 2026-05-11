"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { mockArticles } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function LatestIssueGrid() {
  const [loading] = useState(false);
  const published = mockArticles.filter((a) => a.status === "Published");

  return (
    <section className="bg-purple-50/20 dark:bg-purple-950/5 border-t-[3px] border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <p
              className="text-[11px] font-black uppercase tracking-[0.15em] text-primary mb-2"
            >
              Vol. 12, Edisi 1 · 2025
            </p>
            <h2
              className="text-2xl font-black uppercase tracking-wider text-foreground"
            >
              Artikel Terbaru yang Diterbitkan
            </h2>
          </div>
          <Link
            href="/terbitan"
            className="text-[11px] font-black uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
          >
            Semua terbitan berkala
            <span>&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {published.map((article) => (
              <motion.div
                key={article.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="neo-btn h-10 text-[11px] font-black uppercase tracking-wider rounded-xl px-6"
          >
            <ArrowDown className="w-3.5 h-3.5 mr-2 stroke-[2.5px]" />
            Muat Lebih Banyak Artikel
          </Button>
        </div>
      </div>
    </section>
  );
}
