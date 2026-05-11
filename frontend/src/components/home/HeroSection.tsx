"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export function HeroSection() {
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debouncedQuery = useDebounce(query);

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 bg-background border-b-[3px] border-black"
    >
      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-xl px-4 py-1.5 mb-8 border-2 border-black bg-purple-100 text-purple-700 shadow-[3px_3px_0px_0px_#000000] dark:bg-purple-950 dark:text-purple-300">
            <Zap className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              Vol. 12 · Edisi 2 · 2025 telah terbit
            </span>
          </div>

          <h1
            className="font-black text-foreground mb-6 leading-none tracking-tight uppercase"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.2rem)" }}
          >
            Pengetahuan,
            <br />
            <span className="px-5 py-2 inline-block border-[4px] border-black bg-primary text-primary-foreground shadow-[6px_6px_0px_0px_#000000] rotate-[-1deg] mt-3 select-none">
              Ditinjau Sejawat.
            </span>
          </h1>

          <p
            className="text-[12px] font-bold leading-relaxed mb-10 max-w-xl mx-auto text-muted-foreground uppercase tracking-wider"
          >
            Temukan penelitian mutakhir di bidang ilmu komputer, ilmu data,
            dan kecerdasan buatan. Akses terbuka, tinjauan sejawat yang ketat.
          </p>

          {/* Search */}
          <div className="flex max-w-lg mx-auto gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black z-10 stroke-[2.5px] dark:text-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari artikel, penulis, kata kunci..."
                className="pl-11 pr-4 text-[13px] h-12 bg-white text-black border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] focus:shadow-[6px_6px_0px_0px_#000000] transition-all dark:bg-zinc-900 dark:text-white"
              />
            </div>
            <Button
              className="h-12 text-[12px] font-black uppercase tracking-wider neo-btn px-6 shrink-0 rounded-xl"
            >
              Cari
              <ArrowRight className="w-4 h-4 ml-1.5 stroke-[2.5px]" />
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {[
              { label: "artikel", value: "1.200+", bg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
              { label: "kategori", value: "48", bg: "bg-amber-100 text-amber-850 dark:bg-amber-950 dark:text-amber-300" },
              { label: "open access", value: "100%", bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black ${stat.bg} shadow-[2px_2px_0px_0px_#000000]`}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {stat.value} {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
