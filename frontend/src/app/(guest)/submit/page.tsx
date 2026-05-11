"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Upload, FileText, AlertCircle } from "lucide-react";

const categories = [
  "Ilmu Data",
  "Pemrosesan Bahasa Alami",
  "Pembelajaran Mesin",
  "Penglihatan Komputer",
  "Sistem Terdistribusi",
  "AI yang Dapat Dijelaskan",
  "Keamanan Siber",
  "Rekayasa Perangkat Lunak",
];

const steps = [
  { number: 1, title: "Siapkan Naskah", desc: "Format naskah sesuai template jurnal" },
  { number: 2, title: "Isi Formulir", desc: "Lengkapi metadata dan informasi penulis" },
  { number: 3, title: "Unggah File", desc: "Unggah naskah dalam format .docx atau .pdf" },
  { number: 4, title: "Tunggu Konfirmasi", desc: "Tim redaksi akan menghubungi dalam 3 hari kerja" },
];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState("");

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(5,150,105,0.1)" }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: "#059669" }} />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: "#09090B" }}>
          Naskah Berhasil Dikirim!
        </h2>
        <p className="font-sans" style={{ color: "#71717A" }}>
          Terima kasih. Tim redaksi kami akan meninjau naskah Anda dan mengirimkan konfirmasi dalam 3 hari kerja ke alamat email yang Anda daftarkan.
        </p>
        <p
          className="mt-4 text-sm font-sans font-medium px-4 py-2 rounded-lg inline-block"
          style={{ backgroundColor: "rgba(45,58,140,0.08)", color: "#6366F1" }}
        >
          ID Naskah: OJS-2025-{Math.floor(Math.random() * 9000) + 1000}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Kirim Naskah</h1>
          <p className="font-sans" style={{ color: "rgba(255,255,255,0.75)" }}>
            Kirimkan karya ilmiah Anda untuk ditinjau dan diterbitkan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="rounded-2xl border p-8"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4" style={{ color: "#6366F1" }} />
                <h2 className="font-serif text-lg font-semibold" style={{ color: "#09090B" }}>
                  Informasi Naskah
                </h2>
              </div>
              <p className="text-xs font-sans mb-6" style={{ color: "#71717A" }}>
                Lengkapi semua kolom di bawah ini
              </p>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Judul Naskah *</Label>
                  <Input placeholder="Masukkan judul lengkap naskah Anda..." className="font-sans" />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Abstrak *</Label>
                  <Textarea
                    placeholder="Tulis abstrak naskah (150–300 kata)..."
                    className="font-sans resize-none"
                    style={{ minHeight: "120px" }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Nama Penulis *</Label>
                    <Input placeholder="Nama lengkap penulis utama" className="font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Institusi *</Label>
                    <Input placeholder="Nama universitas / lembaga" className="font-sans" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Email Korespondensi *</Label>
                  <Input type="email" placeholder="email@institusi.ac.id" className="font-sans" />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Bidang Ilmu *</Label>
                  <Select onValueChange={(v) => setCategory(v ?? "")} value={category}>
                    <SelectTrigger className="font-sans text-sm">
                      <SelectValue placeholder="Pilih kategori yang sesuai..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Kata Kunci *</Label>
                  <Input
                    placeholder="Pisahkan dengan koma (maks. 6 kata kunci)"
                    className="font-sans"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Unggah Berkas Naskah *</Label>
                  <div
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
                    style={{ borderColor: "#E4E4E7" }}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "#9CA3AF" }} />
                    <p className="text-sm font-sans font-medium" style={{ color: "#374151" }}>
                      Klik untuk unggah atau seret file ke sini
                    </p>
                    <p className="text-xs font-sans mt-1" style={{ color: "#9CA3AF" }}>
                      Format: .docx, .pdf (Maks. 10 MB)
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full text-white font-sans"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                  onClick={() => setSubmitted(true)}
                >
                  Kirim Naskah
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
            >
              <h3 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                Proses Pengiriman
              </h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white font-sans"
                      style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                    >
                      {step.number}
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-sans" style={{ color: "#09090B" }}>
                        {step.title}
                      </p>
                      <p className="text-xs font-sans" style={{ color: "#71717A" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: "rgba(255,251,235,0.8)", borderColor: "#FDE68A" }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#D97706" }} />
                <div>
                  <p className="text-sm font-semibold font-sans" style={{ color: "#92400E" }}>
                    Perhatian
                  </p>
                  <p className="text-xs font-sans mt-1 leading-relaxed" style={{ color: "#78350F" }}>
                    Pastikan naskah belum pernah diterbitkan atau sedang dalam proses review di jurnal lain. Pengiriman ganda akan otomatis ditolak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
