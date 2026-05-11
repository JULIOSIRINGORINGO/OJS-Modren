"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background border-b-[3px] border-black",
        scrolled ? "shadow-md" : ""
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--neo-shadow-color)] transition-transform group-hover:scale-105"
          >
            <BookOpen className="w-4 h-4 text-black stroke-[2.5px]" />
          </div>
          <span
            className="font-black text-[14px] uppercase tracking-wider text-foreground"
          >
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all border-2",
                  isActive
                    ? "border-black bg-purple-300 text-black shadow-[2px_2px_0px_0px_#000]"
                    : "border-transparent text-foreground hover:text-primary hover:bg-purple-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/masuk"
            className="inline-flex h-9 items-center justify-center rounded-xl px-4 text-[11px] font-black uppercase tracking-wider text-foreground hover:bg-purple-100 dark:hover:bg-purple-950/20 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="inline-flex h-9 items-center justify-center rounded-xl px-4 text-[11px] font-black uppercase tracking-wider bg-primary text-primary-foreground neo-btn gap-1.5"
          >
            Daftar
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg border-2 border-black bg-card text-foreground shadow-[2px_2px_0px_0px_#000000]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Buka menu"
        >
          {mobileOpen ? <X className="w-4 h-4 stroke-[2.5px]" /> : <Menu className="w-4 h-4 stroke-[2.5px]" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t-3 border-black px-4 py-4 space-y-1.5 bg-card animate-in fade-in-50 duration-200"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-[11px] font-black uppercase tracking-wider py-2.5 px-3 rounded-lg transition-all border-2",
                  isActive
                    ? "border-black bg-purple-300 text-black shadow-[2px_2px_0px_0px_#000]"
                    : "border-transparent text-foreground hover:bg-purple-50"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex gap-3 pt-4 border-t-2 border-sidebar-border">
            <Link
              href="/masuk"
              className="flex-1 inline-flex h-10 items-center justify-center rounded-xl border-2 border-black bg-white text-black font-black uppercase tracking-wider text-[11px] shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-50"
              onClick={() => setMobileOpen(false)}
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="flex-1 inline-flex h-10 items-center justify-center rounded-xl text-[11px] font-black uppercase tracking-wider bg-primary text-primary-foreground neo-btn"
              onClick={() => setMobileOpen(false)}
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
