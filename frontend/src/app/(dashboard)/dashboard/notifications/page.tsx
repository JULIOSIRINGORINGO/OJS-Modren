"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, ClipboardCheck, FileText, MessageSquare,
  CheckCircle2, Check, Filter, Loader2
} from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getCurrentUser,
  type NotificationItem,
} from "@/lib/api-client";

const kindConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  assignment: { icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-100", label: "Penugasan" },
  status_change: { icon: FileText, color: "text-amber-600", bg: "bg-amber-100", label: "Perubahan Status" },
  message: { icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-100", label: "Pesan" },
  review_completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100", label: "Tinjauan Selesai" },
  info: { icon: Bell, color: "text-cyan-600", bg: "bg-cyan-100", label: "Info" },
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/masuk");
      return;
    }
    const data = await fetchNotifications();
    setNotifications(data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      await markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    if (notif.link) router.push(notif.link);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Notifikasi"
        subtitle="Semua pemberitahuan aktivitas jurnal Anda."
        icon={Bell}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-4xl w-full mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-3 text-sm font-bold text-muted-foreground">
                Memuat notifikasi...
              </span>
            </div>
          ) : (
            <div className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow">
              {/* Toolbar */}
              <div className="p-4 border-b-[3px] border-sidebar-border flex flex-col sm:flex-row gap-3 items-center justify-between bg-purple-50 dark:bg-purple-950/20">
                <div className="flex items-center gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn rounded-lg"
                    onClick={() => setFilter("all")}
                  >
                    Semua ({notifications.length})
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn rounded-lg"
                    onClick={() => setFilter("unread")}
                  >
                    Belum Dibaca ({unreadCount})
                  </Button>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    className="h-8 text-[10px] font-black uppercase tracking-wider neo-btn rounded-lg"
                    onClick={handleMarkAllRead}
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Tandai Semua Dibaca
                  </Button>
                )}
              </div>

              {/* Notification List */}
              <div className="divide-y-2 divide-sidebar-border">
                {filtered.length === 0 ? (
                  <div className="py-16 text-center">
                    <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm font-black text-foreground">
                      {filter === "unread"
                        ? "Semua notifikasi sudah dibaca"
                        : "Belum ada notifikasi"}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      {filter === "unread"
                        ? "Tidak ada notifikasi yang belum dibaca."
                        : "Notifikasi akan muncul saat ada aktivitas baru."}
                    </p>
                  </div>
                ) : (
                  filtered.map((notif) => {
                    const config = kindConfig[notif.kind] || kindConfig.info;
                    const Icon = config.icon;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className={cn(
                          "w-full text-left px-5 py-4 flex items-start gap-4 transition-colors group",
                          notif.read
                            ? "bg-card hover:bg-purple-50/30 dark:hover:bg-purple-950/5"
                            : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_#000000]",
                            config.bg,
                            config.color
                          )}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                "text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border font-black",
                                config.bg,
                                config.color,
                                "border-black"
                              )}
                            >
                              {config.label}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
                            )}
                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider ml-auto shrink-0">
                              {timeAgo(notif.createdAt)}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-[13px] leading-snug mb-1",
                              notif.read
                                ? "font-bold text-muted-foreground"
                                : "font-black text-foreground"
                            )}
                          >
                            {notif.title}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                            {notif.body}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
