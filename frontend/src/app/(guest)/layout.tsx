"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api-client";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setChecked(true);
  }, [pathname]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user is logged in and viewing article detail, wrap with DashboardSidebar
  const isArticlePage = pathname.startsWith("/articles/");
  if (user && isArticlePage) {
    return (
      <div className="flex h-screen overflow-hidden text-foreground bg-background">
        <DashboardSidebar role={user.role || "Author"} />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#FAFAFA]">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-16" style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
