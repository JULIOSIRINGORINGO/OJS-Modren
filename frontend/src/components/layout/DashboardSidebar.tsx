"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Bookmark, Users,
  Settings, BookOpen, ChevronRight, LogOut,
  PanelLeftClose, PanelLeft, UploadCloud, MessageSquare, User, HelpCircle,
  Library, Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const authorNavItems = [
  { label: "Ikhtisar", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kirim Naskah", href: "/dashboard/submissions/new", icon: UploadCloud },
  { label: "Naskah Saya", href: "/dashboard/submissions", icon: FileText },
  { label: "Tinjauan Saya", href: "/dashboard/reviews", icon: BookOpen },
  { label: "Penanda", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Pesan & Diskusi", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Profil Saya", href: "/dashboard/profile", icon: User },
  { label: "Bantuan", href: "/dashboard/help", icon: HelpCircle },
];

const adminNavItems = [
  { label: "Ikhtisar", href: "/admin", icon: LayoutDashboard },
  { label: "Naskah", href: "/admin/submissions", icon: FileText },
  { label: "Edisi Jurnal", href: "/admin/issues", icon: Library },
  { label: "Kategori Jurnal", href: "/admin/categories", icon: Tag },
  { label: "Manajemen Pengguna", href: "/admin/users", icon: Users },
  { label: "Pengaturan Jurnal", href: "/admin/settings", icon: Settings },
];

const roleLabel: Record<string, string> = {
  Admin: "Administrator", Editor: "Editor",
  Reviewer: "Peninjau", Author: "Penulis", Reader: "Pembaca",
};

export function DashboardSidebar({ role = "Author" }: { role?: string }) {
  const pathname = usePathname();
  const isAdmin = role === "Admin" || role === "Editor";
  const navItems = isAdmin ? adminNavItems : authorNavItems;
  const sectionLabel = isAdmin ? "Administrasi" : "Ruang Saya";
  const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false);

  return (
    <aside
      className={cn(
        "shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-40 bg-sidebar text-sidebar-foreground border-r-[3px] border-sidebar-border",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Header */}
      <div
        className="h-14 px-4 flex items-center gap-3 shrink-0 border-b-[3px] border-sidebar-border"
      >
        <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-secondary text-secondary-foreground border-2 border-sidebar-border shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]"
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <span
            className="font-black text-[13px] uppercase tracking-wider whitespace-nowrap transition-all duration-300 text-white"
            style={{
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "140px",
              overflow: "hidden",
            }}
          >
            {isAdmin ? "Admin Panel" : "Modern OJS"}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto overflow-x-hidden space-y-1.5">
        <SectionLabel label={sectionLabel} collapsed={!!collapsed} />
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={pathname === item.href}
            collapsed={!!collapsed}
          />
        ))}
      </nav>

      {/* User info */}
      <div className="p-3 border-t-[3px] border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/10 transition-colors group">
          <Avatar className="w-8 h-8 shrink-0 border-2 border-sidebar-border shadow-sm">
            <AvatarFallback
              className="text-indigo-950 text-[11px] font-black"
              style={{ background: "linear-gradient(135deg, #E0E7FF, #FAE8FF)" }}
            >
              AP
            </AvatarFallback>
          </Avatar>
          <div
            className="flex-1 min-w-0 transition-all duration-300"
            style={{
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "130px",
              overflow: "hidden",
            }}
          >
            <p className="text-[12px] font-black uppercase tracking-wide truncate text-white">
              Andi Prasetyo
            </p>
            <p className="text-[10px] font-bold truncate text-purple-200">
              {roleLabel[role] ?? role}
            </p>
          </div>
          {!collapsed && (
            <LogOut
              className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-300"
            />
          )}
        </div>
      </div>

      {/* Sidebar Toggle */}
      <div
        className={cn("p-2 border-t-[3px] border-sidebar-border flex items-center transition-all duration-300", collapsed ? "justify-center" : "justify-end")}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 hover:bg-white/10 text-purple-200 hover:text-white transition-colors"
          aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          {collapsed ? <PanelLeft className="w-4.5 h-4.5" /> : <PanelLeftClose className="w-4.5 h-4.5" />}
        </button>
      </div>
    </aside>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  return (
    <div
      style={{
        opacity: collapsed ? 0 : 1,
        maxHeight: collapsed ? 0 : "2rem",
        overflow: "hidden",
        transition: "all 0.3s ease",
        paddingLeft: "0.5rem",
        paddingBottom: collapsed ? 0 : "0.5rem",
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-300/50"
      >
        {label}
      </p>
    </div>
  );
}

function NavItem({
  item,
  active,
  collapsed,
}: {
  item: { label: string; href: string; icon: React.ElementType };
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center rounded-xl mb-1.5 text-[11px] font-black transition-all duration-200 group relative uppercase tracking-wider",
        collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3.5 py-2.5",
        active
          ? "bg-secondary text-secondary-foreground border-2 border-sidebar-border shadow-[3px_3px_0px_0px_var(--neo-shadow-color)] scale-[1.02] -translate-y-0.5"
          : "text-purple-100/80 hover:bg-white/10 hover:text-white border-2 border-transparent"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
          active ? "text-secondary-foreground" : "text-purple-300 group-hover:text-white"
        )}
      />
      <span
        className={cn("transition-all duration-300 truncate", active ? "font-extrabold" : "font-semibold")}
        style={{
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : "150px",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
      </span>
      {active && !collapsed && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto text-secondary-foreground shrink-0 stroke-[3px]" />
      )}
    </Link>
  );
}
