"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Eye, EyeOff, UserPlus } from "lucide-react";

export default function DaftarPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center bg-secondary text-secondary-foreground shadow-[3px_3px_0px_0px_var(--neo-shadow-color)] mx-auto mb-4"
          >
            <BookOpen className="w-6 h-6 text-black stroke-[2.5px]" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-foreground">
            Buat Akun Baru
          </h1>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mt-2">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-black text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Form */}
        <div
          className="bg-card rounded-2xl border-3 border-black p-8 shadow-[6px_6px_0px_0px_#000000]"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Depan</Label>
                <Input placeholder="Andi" className="h-10 text-[13px] rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Belakang</Label>
                <Input placeholder="Prasetyo" className="h-10 text-[13px] rounded-xl" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Email Institusi</Label>
              <Input type="email" placeholder="nama@institusi.ac.id" className="h-10 text-[13px] rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Institusi / Universitas</Label>
              <Input placeholder="Universitas Indonesia" className="h-10 text-[13px] rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Peran Utama</Label>
              <Select onValueChange={(v) => setRole(v ?? "")} value={role}>
                <SelectTrigger className="h-10 text-[13px] rounded-xl border-2 border-black bg-white dark:bg-zinc-900">
                  <SelectValue placeholder="Pilih peran Anda..." />
                </SelectTrigger>
                <SelectContent className="border-2 border-black rounded-xl">
                  <SelectItem value="author" className="font-bold">Penulis</SelectItem>
                  <SelectItem value="reviewer" className="font-bold">Peninjau</SelectItem>
                  <SelectItem value="reader" className="font-bold">Pembaca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Kata Sandi</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  className="h-10 text-[13px] pr-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 stroke-[2px]" /> : <Eye className="w-4 h-4 stroke-[2px]" />}
                </button>
              </div>
            </div>

            <Button
              className="w-full neo-btn text-[11px] font-black uppercase tracking-wider rounded-xl h-10 gap-2 mt-2"
              onClick={() => (window.location.href = "/dashboard")}
            >
              <UserPlus className="w-4 h-4 stroke-[2.5px]" />
              Buat Akun Baru
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-sidebar-border text-center">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Dengan mendaftar, Anda menyetujui{" "}
              <Link href="/kebijakan" className="underline hover:text-foreground">
                Syarat & Ketentuan
              </Link>{" "}
              kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
