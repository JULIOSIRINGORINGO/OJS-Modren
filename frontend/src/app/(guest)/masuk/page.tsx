"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { login } from "@/lib/api-client";

export default function MasukPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      const userRole = data.user?.role?.toLowerCase();
      if (userRole === "admin" || userRole === "editor") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

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
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border-3 border-black p-7 shadow-[6px_6px_0px_0px_#000000]"
        >
          {error && (
            <div className="flex items-center gap-2 bg-rose-100 border-2 border-black p-3 mb-4 rounded-xl text-xs font-black uppercase tracking-wide text-rose-700 shadow-[2px_2px_0px_0px_#000]">
              <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5px]" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Email</Label>
              <Input
                type="email"
                placeholder="email@institusi.ac.id"
                className="text-[13px] rounded-xl h-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              type="submit"
              disabled={loading}
              className="w-full neo-btn text-[11px] font-black uppercase tracking-wider rounded-xl h-10 gap-2"
            >
              {loading ? "Menghubungkan..." : "Masuk"}
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
        </form>
      </div>
    </div>
  );
}
