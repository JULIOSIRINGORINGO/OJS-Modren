"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { register } from "@/lib/api-client";

export default function DaftarPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const role = "author";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !institution) {
      setError("Semua kolom bertanda * wajib diisi");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        institution: institution,
        role: role,
      });
      // Don't auto-login - clear any token that was set and redirect to login
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/masuk";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-4xl bg-card rounded-2xl border-3 border-black shadow-[8px_8px_0px_0px_#000000] overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Column - Branding (Landscape) */}
        <div className="md:col-span-5 bg-gradient-to-br from-primary via-indigo-600 to-purple-800 text-white p-8 flex flex-col justify-between border-b-3 md:border-b-0 md:border-r-3 border-black relative overflow-hidden">
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_#000]">
                <BookOpen className="w-5 h-5 text-black stroke-[2.5px]" />
              </div>
              <span className="font-black text-[16px] uppercase tracking-wider">FAST-Journal</span>
            </div>
            
            <h2 className="text-2xl font-black uppercase tracking-wider leading-tight mb-4">
              Gabung dengan Komunitas Ilmiah Terbuka
            </h2>
            <p className="text-[12px] font-bold text-purple-100 uppercase tracking-wide leading-relaxed mb-6">
              Mulai publikasikan penelitian terbaik Anda dan berkolaborasi dengan ribuan akademisi global.
            </p>
            
            <div className="space-y-3">
              {[
                "Akses Bebas (Open Access) untuk semua artikel",
                "Proses peer-review transparan dan cepat",
                "Indeksasi nasional dan internasional",
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary stroke-[2.5px] shrink-0" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-50">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 mt-8">
            <div className="bg-secondary text-secondary-foreground border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_0px_#000]">
              <p className="text-[10px] font-black uppercase tracking-wider mb-1">Status Sistem</p>
              <p className="text-[11px] font-bold opacity-90">Registrasi instan untuk akun Penulis (Author) sedang aktif.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center bg-card">
          <div className="mb-6">
            <h1 className="text-2xl font-black uppercase tracking-wider text-foreground">
              Buat Akun Baru
            </h1>
            <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
              Sudah punya akun?{" "}
              <Link href="/masuk" className="font-black text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 bg-rose-100 border-2 border-black p-3 mb-4 rounded-xl text-xs font-black uppercase tracking-wide text-rose-700 shadow-[2px_2px_0px_0px_#000]">
                <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5px]" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-100 border-2 border-black p-3 mb-4 rounded-xl text-xs font-black uppercase tracking-wide text-emerald-700 shadow-[2px_2px_0px_0px_#000]">
                <CheckCircle className="w-4 h-4 shrink-0 stroke-[2.5px]" />
                <span>Pendaftaran berhasil! Mengalihkan...</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Depan *</Label>
                  <Input
                    className="h-10 text-[13px] rounded-xl"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Belakang *</Label>
                  <Input
                    className="h-10 text-[13px] rounded-xl"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Email Institusi *</Label>
                  <Input
                    type="email"
                    className="h-10 text-[13px] rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Institusi / Universitas *</Label>
                  <Input
                    className="h-10 text-[13px] rounded-xl"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Kata Sandi *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="h-10 text-[13px] pr-10 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 stroke-[2px]" /> : <Eye className="w-4 h-4 stroke-[2px]" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full neo-btn text-[11px] font-black uppercase tracking-wider rounded-xl h-10 gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5px]" />
                {loading ? "Mendaftarkan..." : "Buat Akun Baru"}
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-sidebar-border text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Dengan mendaftar, Anda menyetujui{" "}
                <Link href="/kebijakan" className="underline hover:text-foreground">
                  Syarat & Ketentuan
                </Link>{" "}
                kami.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
