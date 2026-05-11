"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3, MessageSquare, Brain, Eye, Network, Lightbulb,
} from "lucide-react";
import type { Category } from "@/types";
import { mockCategories } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  BarChart3, MessageSquare, Brain, Eye, Network, Lightbulb,
};

// Premium solid pastel themes for category items
const categoryThemes: Record<string, { bg: string; text: string; iconBg: string }> = {
  "Ilmu Data": {
    bg: "bg-blue-100 dark:bg-blue-950/40",
    text: "text-blue-800 dark:text-blue-300",
    iconBg: "bg-blue-200 dark:bg-blue-900/60",
  },
  "Pemrosesan Bahasa Alami": {
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
    text: "text-emerald-800 dark:text-emerald-300",
    iconBg: "bg-emerald-200 dark:bg-emerald-900/60",
  },
  "Pembelajaran Mesin": {
    bg: "bg-purple-100 dark:bg-purple-950/40",
    text: "text-purple-800 dark:text-purple-300",
    iconBg: "bg-purple-200 dark:bg-purple-900/60",
  },
  "Penglihatan Komputer": {
    bg: "bg-cyan-100 dark:bg-cyan-950/40",
    text: "text-cyan-800 dark:text-cyan-300",
    iconBg: "bg-cyan-200 dark:bg-cyan-900/60",
  },
  "Sistem Terdistribusi": {
    bg: "bg-amber-100 dark:bg-amber-950/40",
    text: "text-amber-850 dark:text-amber-350",
    iconBg: "bg-amber-200 dark:bg-amber-900/60",
  },
  "AI yang Dapat Dijelaskan": {
    bg: "bg-rose-100 dark:bg-rose-950/40",
    text: "text-rose-800 dark:text-rose-300",
    iconBg: "bg-rose-200 dark:bg-rose-900/60",
  },
};

const defaultTheme = {
  bg: "bg-purple-50 dark:bg-purple-950/20",
  text: "text-primary dark:text-purple-300",
  iconBg: "bg-purple-100 dark:bg-purple-900/40",
};

export function CategoryNav() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
        <div>
          <p
            className="text-[11px] font-black uppercase tracking-[0.15em] text-primary mb-2"
          >
            Eksplorasi
          </p>
          <h2
            className="text-2xl font-black uppercase tracking-wider text-foreground"
          >
            Jelajahi Berdasarkan Bidang
          </h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1.5">
            Temukan hasil penelitian terbaik di rumpun disiplin ilmu pilihan
          </p>
        </div>
        <Link
          href="/kategori/ilmu-data"
          className="text-[11px] font-black uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
        >
          Lihat semua terbitan
          <span>&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {mockCategories.map((cat: Category, i: number) => {
          const Icon = iconMap[cat.icon] || Brain;
          const theme = categoryThemes[cat.name] || defaultTheme;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
            >
              <Link
                href={`/kategori/${cat.slug}`}
                className={`group flex flex-col items-center gap-3.5 p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[7px_7px_0px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-sm transition-all text-center ${theme.bg}`}
              >
                {/* Icon box */}
                <div
                  className={`w-11 h-11 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] group-hover:rotate-6 transition-transform ${theme.iconBg}`}
                >
                  <Icon className="w-5 h-5 text-black stroke-[2.5px] dark:text-white" />
                </div>
                <div>
                  <span className="text-[12px] font-black text-foreground uppercase tracking-wider leading-tight block">
                    {cat.name}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 block ${theme.text}`}>
                    {cat.count} artikel
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
