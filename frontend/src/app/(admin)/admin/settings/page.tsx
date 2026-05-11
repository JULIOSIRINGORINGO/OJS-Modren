"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, CheckCircle } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Pengaturan Jurnal"
        subtitle="Konfigurasi informasi dan preferensi jurnal."
        icon={Settings}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {saved && (
            <div
              className="flex items-center gap-2 p-4 rounded-xl mb-6 border"
              style={{ backgroundColor: "rgba(5,150,105,0.06)", borderColor: "rgba(5,150,105,0.2)" }}
            >
              <CheckCircle className="w-4 h-4" style={{ color: "#E2E8F0" }} />
              <p className="text-sm font-medium font-sans" style={{ color: "#065F46" }}>
                Pengaturan berhasil disimpan.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Identitas Jurnal */}
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 shadow-sm"
              style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
            >
              <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                Identitas Jurnal
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Nama Jurnal</Label>
                    <Input defaultValue="Modern OJS" className="font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Singkatan</Label>
                    <Input defaultValue="MOJS" className="font-sans" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Deskripsi Jurnal</Label>
                  <Textarea
                    defaultValue="Platform modern untuk penerbitan akademik, tinjauan sejawat, dan diseminasi akses terbuka."
                    className="font-sans resize-none"
                    style={{ minHeight: "80px" }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">ISSN (Cetak)</Label>
                    <Input defaultValue="2580-1234" className="font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">ISSN (Online)</Label>
                    <Input defaultValue="2580-5678" className="font-sans" />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pengaturan Publikasi */}
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 shadow-sm"
              style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
            >
              <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                Pengaturan Publikasi
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Volume Saat Ini</Label>
                    <Input defaultValue="12" className="font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Edisi Saat Ini</Label>
                    <Input defaultValue="2" className="font-sans" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Email Redaksi</Label>
                  <Input defaultValue="redaksi@modernojs.id" type="email" className="font-sans" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Pengaturan Tinjauan */}
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 shadow-sm"
              style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
            >
              <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                Konfigurasi Tinjauan Sejawat
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Jumlah Peninjau per Naskah</Label>
                    <Input defaultValue="2" className="font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Batas Waktu Tinjauan (hari)</Label>
                    <Input defaultValue="30" className="font-sans" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="text-white font-sans px-8"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                onClick={handleSave}
              >
                Simpan Pengaturan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
