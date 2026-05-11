"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(145deg, #0F0F1A 0%, #1a1a2e 40%, #16213e 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Kontak</h1>
          <p className="font-sans" style={{ color: "rgba(255,255,255,0.75)" }}>
            Hubungi tim kami untuk pertanyaan atau kerja sama
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div
                className="rounded-2xl border p-12 text-center"
                style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "rgba(5,150,105,0.1)" }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: "#059669" }} />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#09090B" }}>
                  Pesan Terkirim!
                </h2>
                <p className="font-sans text-sm" style={{ color: "#71717A" }}>
                  Terima kasih telah menghubungi kami. Kami akan membalas pesan Anda dalam 1–2 hari kerja.
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl border p-8"
                style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
              >
                <h2 className="font-serif text-xl font-semibold mb-6" style={{ color: "#09090B" }}>
                  Kirim Pesan
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Nama Lengkap *</Label>
                      <Input placeholder="Nama Anda" className="font-sans" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Email *</Label>
                      <Input type="email" placeholder="email@domain.com" className="font-sans" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Subjek *</Label>
                    <Input placeholder="Topik pesan Anda" className="font-sans" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Pesan *</Label>
                    <Textarea
                      placeholder="Tuliskan pesan Anda di sini..."
                      className="font-sans resize-none"
                      style={{ minHeight: "140px" }}
                    />
                  </div>
                  <Button
                    className="w-full text-white font-sans"
                    style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                    onClick={() => setSent(true)}
                  >
                    Kirim Pesan
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                label: "Email Redaksi",
                value: "redaksi@modernojs.id",
                sub: "Untuk pengiriman naskah",
              },
              {
                icon: Phone,
                label: "Telepon",
                value: "+62 21 5550 1234",
                sub: "Senin–Jumat, 08.00–16.00 WIB",
              },
              {
                icon: MapPin,
                label: "Alamat",
                value: "Gedung Rektorat Lt. 3",
                sub: "Jl. Kampus No. 1, Jakarta 10430",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border p-5 flex gap-4"
                style={{ backgroundColor: "white", borderColor: "#E4E4E7" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(45,58,140,0.08)" }}
                >
                  <item.icon className="w-4 h-4" style={{ color: "#6366F1" }} />
                </div>
                <div>
                  <p className="text-xs font-sans font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-medium font-sans mt-0.5" style={{ color: "#09090B" }}>
                    {item.value}
                  </p>
                  <p className="text-xs font-sans" style={{ color: "#71717A" }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
