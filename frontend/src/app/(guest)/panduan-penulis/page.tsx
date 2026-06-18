"use client";

import { useState, useEffect } from "react";
import { BookOpen, HelpCircle } from "lucide-react";
import { fetchSetting } from "@/lib/api-client";

const defaultSteps = [
  {
    step: "01",
    title: "Persyaratan Umum",
    bgColor: "bg-purple-50",
    badgeBg: "bg-purple-200",
    items: [
      "Naskah belum pernah diterbitkan dan tidak sedang dalam proses review di jurnal lain",
      "Ditulis dalam Bahasa Indonesia atau Bahasa Inggris yang baik dan benar",
      "Panjang naskah: 4.000–8.000 kata (termasuk referensi)",
      "Format file: Microsoft Word (.docx) atau LaTeX (.tex)",
    ],
  },
  {
    step: "02",
    title: "Struktur Naskah",
    bgColor: "bg-yellow-50",
    badgeBg: "bg-yellow-250",
    items: [
      "Judul: ringkas, informatif, maksimal 15 kata",
      "Abstrak: 150–250 kata dalam satu paragraf",
      "Kata kunci: 4–6 kata, dipisahkan koma",
      "Pendahuluan, Metode, Hasil, Diskusi, Kesimpulan, Referensi",
    ],
  },
  {
    step: "03",
    title: "Format Penulisan",
    bgColor: "bg-blue-50",
    badgeBg: "bg-blue-200",
    items: [
      "Font: Times New Roman 12pt, spasi 1,5",
      "Margin: 2,5 cm semua sisi",
      "Gambar dan tabel diberi judul dan nomor urut",
      "Persamaan matematis diberi nomor di sisi kanan",
    ],
  },
  {
    step: "04",
    title: "Gaya Sitasi",
    bgColor: "bg-emerald-50",
    badgeBg: "bg-emerald-200",
    items: [
      "Gunakan format APA 7th Edition untuk referensi",
      "Minimal 20 referensi dari jurnal bereputasi",
      "Referensi dalam 5 tahun terakhir minimal 60%",
      "Hindari sitasi diri berlebihan (maks. 10%)",
    ],
  },
  {
    step: "05",
    title: "Proses Setelah Pengiriman",
    bgColor: "bg-rose-50",
    badgeBg: "bg-rose-200",
    items: [
      "Konfirmasi penerimaan dikirim dalam 3 hari kerja",
      "Pemeriksaan awal (desk review) oleh editor: 7–14 hari",
      "Proses tinjauan sejawat: 30–45 hari",
      "Keputusan editorial disampaikan melalui email",
    ],
  },
];

export default function PanduanPenulisPage() {
  const [loadedSteps, setLoadedSteps] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Panduan Penulis — FAST-Journal";

    async function loadData() {
      const dbSteps = await fetchSetting("journal_guidelines");
      let dataString = dbSteps;
      
      if (!dataString) {
        dataString = localStorage.getItem("journal_guidelines");
      }

      if (dataString) {
        try {
          const parsed = JSON.parse(dataString);
          const mapped = parsed.map((item: any) => {
            const defaults = defaultSteps.find((s) => s.step === item.step);
            return {
              ...item,
              bgColor: defaults?.bgColor || "bg-zinc-50",
              badgeBg: defaults?.badgeBg || "bg-zinc-200",
            };
          });
          setLoadedSteps(mapped);
          return;
        } catch (e) {
          // fallback
        }
      }
      setLoadedSteps(defaultSteps);
    }
    loadData();
  }, []);

  return (
    <div className="pb-24">
      {/* Neubrutalist Header Section */}
      <div className="bg-yellow-50 border-b-[3px] border-black py-20 relative overflow-hidden">
        {/* Decorative Grid Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4.5 py-1.5 mb-6 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
            <BookOpen className="w-4 h-4 text-yellow-600 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Petunjuk Penulisan
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-black leading-tight mb-6">
            PANDUAN PENULIS <br className="hidden sm:inline" />
            <span className="bg-yellow-300 px-3 border-2 border-black inline-block transform rotate-1 shadow-[4px_4px_0px_0px_#000] mt-2">
              FORMAT & ATURAN
            </span>
          </h1>
          <p className="text-sm sm:text-base font-bold leading-relaxed text-zinc-700 max-w-2xl mx-auto uppercase tracking-wide">
            Persiapkan draf tulisan Anda dengan mengikuti panduan teknis penulisan naskah FAST-Journal berikut.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {loadedSteps.map((s) => (
            <div
              key={s.step}
              className={`border-[3px] border-black p-8 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[7px_7px_0px_0px_#000] transition-all relative overflow-hidden ${s.bgColor}`}
            >
              <div className="absolute top-4 right-4 text-7xl font-black text-black/5 select-none z-0">
                #{s.step}
              </div>

              <div className="flex items-start gap-6 relative z-10">
                <span className={`text-base font-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-lg shrink-0 ${s.badgeBg}`}>
                  Langkah {s.step}
                </span>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mb-4">
                    {s.title}
                  </h2>
                  <ul className="space-y-3">
                    {s.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-black shrink-0 mt-2" />
                        <span className="text-xs sm:text-sm font-bold text-zinc-700 uppercase tracking-wide leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-white border-[3px] border-black p-6 text-center shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-lg border-2 border-black bg-purple-200 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <HelpCircle className="w-5 h-5 text-black stroke-[2.5px]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Butuh bantuan format?</p>
              <p className="text-xs font-black uppercase tracking-tight text-black mt-0.5">Konsultasikan kendala naskah Anda ke redaksi</p>
            </div>
          </div>
          <a
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-xl border-[3px] border-black bg-primary text-primary-foreground px-5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
          >
            HUBUNGI KAMI
          </a>
        </div>
      </div>
    </div>
  );
}
