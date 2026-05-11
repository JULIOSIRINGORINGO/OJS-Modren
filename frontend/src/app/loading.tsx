"use client";

import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#0C0A0F]">
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Animated Rotating Square Box Logo */}
        <div className="relative w-16 h-16 rounded-xl border-3 border-black bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] animate-bounce">
          <BookOpen className="w-8 h-8 text-primary-foreground stroke-[2.5px] animate-pulse" />
        </div>

        {/* Small Spinner */}
        <div className="mt-8 w-8 h-8 rounded-full border-4 border-black border-t-primary animate-spin" />

        {/* Bouncing Neubrutalist Loading Banner */}
        <div className="mt-6 px-5 py-2 border-3 border-black bg-secondary text-secondary-foreground font-black text-[11px] uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_#000000]">
          FAST-Journal Memuat...
        </div>
      </div>
    </div>
  );
}
