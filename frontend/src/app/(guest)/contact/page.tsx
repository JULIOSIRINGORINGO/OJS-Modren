"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="bg-blue-50 border-b-[3px] border-black py-20 relative overflow-hidden">
        {/* Decorative Grid Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4.5 py-1.5 mb-6 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]"
          >
            <MessageSquare className="w-4 h-4 text-blue-600 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Hubungi Kami
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-6">
            KOTAK KONTAK <br className="hidden sm:inline" />
            <span className="bg-blue-300 px-3 border-2 border-black inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_#000] mt-2">
              REDAKSI JURNAL
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold leading-relaxed text-zinc-700 max-w-2xl mx-auto uppercase tracking-wide">
            Ada pertanyaan atau butuh informasi kerja sama? Hubungi tim redaksi kami secara langsung.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div
                className="bg-emerald-50 border-[3px] border-black p-12 text-center shadow-[6px_6px_0px_0px_#000]"
              >
                <div
                  className="w-16 h-16 rounded-full border-2 border-black bg-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_#000]"
                >
                  <CheckCircle className="w-8 h-8 text-black stroke-[2.5px]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-3">
                  PESAN TERKIRIM!
                </h2>
                <p className="text-sm font-bold uppercase tracking-wide text-zinc-600">
                  Terima kasih telah menghubungi kami. Tim redaksi kami akan membalas pesan Anda dalam waktu 1-2 hari kerja ke email yang terdaftar.
                </p>
              </div>
            ) : (
              <div
                className="bg-white border-[3px] border-black p-8 sm:p-10 shadow-[6px_6px_0px_0px_#000]"
              >
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mb-8 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-blue-500 border border-black inline-block" />
                  KIRIM PESAN BARU
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-wider text-black">Nama Lengkap *</Label>
                      <Input 
                        placeholder="Nama Lengkap Anda..." 
                        className="font-sans border-[3px] border-black rounded-xl h-11 px-4 text-sm font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_#000] focus:shadow-[3px_3px_0px_0px_#000] focus-visible:ring-0 transition-all bg-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-wider text-black">Alamat Email *</Label>
                      <Input 
                        type="email" 
                        placeholder="email@institusi.ac.id" 
                        className="font-sans border-[3px] border-black rounded-xl h-11 px-4 text-sm font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_#000] focus:shadow-[3px_3px_0px_0px_#000] focus-visible:ring-0 transition-all bg-white" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-wider text-black">Subjek Pesan *</Label>
                    <Input 
                      placeholder="Masukkan subjek atau topik pertanyaan..." 
                      className="font-sans border-[3px] border-black rounded-xl h-11 px-4 text-sm font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_#000] focus:shadow-[3px_3px_0px_0px_#000] focus-visible:ring-0 transition-all bg-white" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-wider text-black">Pesan Detail *</Label>
                    <Textarea
                      placeholder="Tuliskan pertanyaan atau kendala Anda secara lengkap di sini..."
                      className="font-sans border-[3px] border-black rounded-xl p-4 text-sm font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_#000] focus:shadow-[3px_3px_0px_0px_#000] focus-visible:ring-0 transition-all bg-white resize-none"
                      style={{ minHeight: "140px" }}
                    />
                  </div>
                  
                  <Button
                    className="w-full inline-flex h-12 items-center justify-center rounded-xl border-[3px] border-black bg-primary text-primary-foreground font-black uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all gap-2"
                    onClick={() => setSent(true)}
                  >
                    <Send className="w-4 h-4 stroke-[2.5px]" />
                    KIRIM PESAN SEKARANG
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Info Cards */}
          <div className="space-y-6">
            {[
              {
                icon: Mail,
                label: "Email Redaksi",
                value: "redaksi@modernojs.id",
                sub: "Untuk bantuan administrasi jurnal",
                bgColor: "bg-purple-100",
              },
              {
                icon: Phone,
                label: "Telepon / Whatsapp",
                value: "+62 812-3456-7890",
                sub: "Senin-Jumat, 08:00 - 16:00 WIB",
                bgColor: "bg-yellow-100",
              },
              {
                icon: MapPin,
                label: "Kantor Redaksi",
                value: "Gedung Rektorat Lt. 3",
                sub: "Jl. Kampus No. 1, Universitas Prima Indonesia",
                bgColor: "bg-emerald-100",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white border-[3px] border-black p-6 flex gap-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] ${item.bgColor}`}>
                    <Icon className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      {item.label}
                    </p>
                    <p className="text-sm font-black uppercase tracking-tight text-black mt-1">
                      {item.value}
                    </p>
                    <p className="text-[11px] font-bold text-zinc-500 mt-1 uppercase tracking-wide">
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
