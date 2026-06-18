"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { getCurrentUser } from "@/lib/api-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push("/masuk");
    } else {
      const allowedRoles = ["admin", "editor", "Admin", "Editor"];
      if (!allowedRoles.includes(u.role)) {
        router.push("/dashboard");
      } else {
        setUser(u);
      }
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden text-foreground bg-background">
      <DashboardSidebar role={user.role || "Admin"} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
