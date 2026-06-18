"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, ClipboardCheck, FileText, MessageSquare,
  CheckCircle2, X, Check, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from "@/lib/api-client";

const kindConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  assignment: { icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-100" },
  status_change: { icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
  message: { icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-100" },
  review_completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  info: { icon: Bell, color: "text-cyan-600", bg: "bg-cyan-100" },
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unread count on mount + polling
  const refreshUnread = useCallback(async () => {
    const count = await fetchUnreadCount();
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    refreshUnread();
    const interval = setInterval(refreshUnread, 30000);
    return () => clearInterval(interval);
  }, [refreshUnread]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleToggle = async () => {
    if (!open) {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
      setLoading(false);
    }
    setOpen(!open);
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      await markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    if (notif.link) router.push(notif.link);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const displayedNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "relative w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-200",
          open
            ? "bg-primary/10 border-primary text-primary shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]"
            : "bg-card border-sidebar-border text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/50 shadow-[2px_2px_0px_0px_var(--neo-shadow-color)]"
        )}
        aria-label="Notifikasi"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center px-1 border-2 border-card animate-in zoom-in-50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[380px] bg-card rounded-2xl overflow-hidden neo-border neo-shadow z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b-[3px] border-sidebar-border flex items-center justify-between bg-purple-50 dark:bg-purple-950/20">
            <h3 className="text-[12px] font-black uppercase tracking-wider text-foreground">
              Notifikasi
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[9px] font-black uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Tandai Dibaca
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[320px] overflow-y-auto divide-y-2 divide-sidebar-border">
            {loading ? (
              <div className="py-10 text-center">
                <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Memuat...
                </p>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-[11px] font-black text-muted-foreground">
                  Belum ada notifikasi
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => {
                const config = kindConfig[notif.kind] || kindConfig.info;
                const Icon = config.icon;
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors group",
                      notif.read
                        ? "bg-card hover:bg-purple-50/30 dark:hover:bg-purple-950/5"
                        : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 border-black shadow-[1px_1px_0px_0px_#000000]",
                        config.bg, config.color
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-[11px] uppercase tracking-wider truncate",
                          notif.read ? "font-bold text-muted-foreground" : "font-black text-foreground"
                        )}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                        {notif.body}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mt-1">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary shrink-0 mt-1 transition-colors" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t-[3px] border-sidebar-border bg-purple-50/50 dark:bg-purple-950/10">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/notifications");
                }}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline w-full text-center"
              >
                Lihat Semua Notifikasi &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
