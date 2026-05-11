"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, ArrowRight } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export default function MasukPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center bg-secondary text-secondary-foreground shadow-[3px_3px_0px_0px_var(--neo-shadow-color)] mx-auto mb-4"
          >
            <BookOpen className="w-6 h-6 text-black stroke-[2.5px]" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-foreground">
            Masuk ke {SITE_NAME}
          </h1>

          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mt-2">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-black text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Form */}
        <div
          className="bg-card rounded-2xl border-3 border-black p-7 shadow-[6px_6px_0px_0px_#000000]"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Email</Label>
              <Input
                type="email"
                placeholder="email@institusi.ac.id"
                className="text-[13px] rounded-xl h-10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Kata Sandi</Label>
                <Link
                  href="#"
                  className="text-[11px] font-black uppercase tracking-wider text-primary hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className="text-[13px] pr-10 rounded-xl h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: "#A1A1AA" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 stroke-[2px]" /> : <Eye className="w-4 h-4 stroke-[2px]" />}
                </button>
              </div>
            </div>

            <Button
              className="w-full neo-btn text-[11px] font-black uppercase tracking-wider rounded-xl h-10 gap-2"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Masuk
              <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
            </Button>
          </div>

          <div className="mt-6 pt-5 border-t-2 border-sidebar-border text-center">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Dengan masuk, Anda menyetujui{" "}
              <Link href="/kebijakan" className="underline hover:text-foreground">
                Kebijakan Privasi
              </Link>{" "}
              kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
