import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StatColor = "indigo" | "violet" | "emerald" | "amber" | "rose" | "cyan" | "slate";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  color?: StatColor;
}

const colorMap: Record<StatColor, {
  bg: string;
  iconBg: string;
  valueCls: string;
  titleCls: string;
  subtitleCls: string;
  trendCls: string;
}> = {
  indigo: {
    bg: "bg-purple-100 text-black dark:bg-purple-950/40 dark:text-white",
    iconBg: "bg-purple-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]",
    valueCls: "text-black dark:text-white",
    titleCls: "text-black/70 dark:text-white/70",
    subtitleCls: "text-black/60 dark:text-white/60",
    trendCls: "text-purple-800 dark:text-purple-300",
  },
  violet: {
    bg: "bg-fuchsia-100 text-black dark:bg-fuchsia-950/40 dark:text-white",
    iconBg: "bg-fuchsia-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]",
    valueCls: "text-black dark:text-white",
    titleCls: "text-black/70 dark:text-white/70",
    subtitleCls: "text-black/60 dark:text-white/60",
    trendCls: "text-fuchsia-800 dark:text-fuchsia-300",
  },
  emerald: {
    bg: "bg-emerald-100 text-black dark:bg-emerald-950/40 dark:text-white",
    iconBg: "bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]",
    valueCls: "text-black dark:text-white",
    titleCls: "text-black/70 dark:text-white/70",
    subtitleCls: "text-black/60 dark:text-white/60",
    trendCls: "text-emerald-800 dark:text-emerald-300",
  },
  amber: {
    bg: "bg-amber-100 text-black dark:bg-amber-950/40 dark:text-white",
    iconBg: "bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]",
    valueCls: "text-black dark:text-white",
    titleCls: "text-black/70 dark:text-white/70",
    subtitleCls: "text-black/60 dark:text-white/60",
    trendCls: "text-amber-800 dark:text-amber-300",
  },
  rose: {
    bg: "bg-rose-100 text-black dark:bg-rose-950/40 dark:text-white",
    iconBg: "bg-rose-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]",
    valueCls: "text-black dark:text-white",
    titleCls: "text-black/70 dark:text-white/70",
    subtitleCls: "text-black/60 dark:text-white/60",
    trendCls: "text-rose-800 dark:text-rose-300",
  },
  cyan: {
    bg: "bg-cyan-100 text-black dark:bg-cyan-950/40 dark:text-white",
    iconBg: "bg-cyan-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]",
    valueCls: "text-black dark:text-white",
    titleCls: "text-black/70 dark:text-white/70",
    subtitleCls: "text-black/60 dark:text-white/60",
    trendCls: "text-cyan-800 dark:text-cyan-300",
  },
  slate: {
    bg: "bg-slate-100 text-black dark:bg-slate-850/40 dark:text-white",
    iconBg: "bg-slate-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]",
    valueCls: "text-black dark:text-white",
    titleCls: "text-black/70 dark:text-white/70",
    subtitleCls: "text-black/60 dark:text-white/60",
    trendCls: "text-slate-800 dark:text-slate-300",
  },
};

export function StatsCard({
  title, value, subtitle, icon: Icon, trend, color = "indigo",
}: StatsCardProps) {
  const cfg = colorMap[color];

  return (
    <div
      className={cn(
        "rounded-2xl p-5 relative overflow-hidden transition-all duration-300",
        "neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)]",
        "active:translate-x-0 active:translate-y-0 active:shadow-sm",
        cfg.bg
      )}
    >
      {/* Background pattern */}
      <div
        className="absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-[0.05] bg-black"
      />

      <div className="flex items-start justify-between relative">
        <div className="flex-1 min-w-0">
          <p className={cn("text-[10px] font-black uppercase tracking-[0.12em] mb-2", cfg.titleCls)}>
            {title}
          </p>
          <p className={cn("font-extrabold leading-none mb-1.5 tracking-tight", cfg.valueCls)} style={{ fontSize: "1.75rem" }}>
            {value}
          </p>
          {subtitle && (
            <p className={cn("text-[11px] font-bold", cfg.subtitleCls)}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-wider mt-2", cfg.trendCls)}>
              <TrendingUp className="w-3.5 h-3.5 stroke-[3px]" />
              {trend}
            </p>
          )}
        </div>
        <div
          className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cfg.iconBg)}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
