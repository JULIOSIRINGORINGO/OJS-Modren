import { LucideIcon } from "lucide-react";

interface DashboardNavbarProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export function DashboardNavbar({ title, subtitle, icon: Icon }: DashboardNavbarProps) {
  return (
    <header
      className="sticky top-0 z-30 h-14 border-b-[3px] border-sidebar-border flex items-center justify-between px-6 shrink-0 transition-all duration-300 bg-card text-foreground"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-sidebar-border bg-primary/10 text-primary shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]"
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h2 className="text-[13px] font-black uppercase tracking-wide text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-emerald-400 text-black px-3 py-1 rounded-lg border-2 border-sidebar-border shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]">
        <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-black">
          Sistem Aktif
        </span>
      </div>
    </header>
  );
}
