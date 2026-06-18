"use client";

import { useState, useEffect } from "react";
import { 
  UploadCloud, CheckCircle, FileSpreadsheet, FileCode, FileText, 
  Save, AlertTriangle, RefreshCw, FileUp
} from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { fetchSetting, updateSetting } from "@/lib/api-client";

const defaultTemplates = [
  {
    id: "docx",
    title: "Template Naskah (DOCX)",
    desc: "Format Microsoft Word resmi yang wajib digunakan oleh seluruh pengirim naskah di FAST-Journal.",
    size: "142 KB",
    version: "v2.1 (Terbaru)",
    filename: "Template_Jurnal_UNPRI.docx",
    bgColor: "bg-blue-100",
    btnColor: "bg-primary text-primary-foreground",
  },
  {
    id: "latex",
    title: "Template Naskah (LaTeX)",
    desc: "Paket berkas LaTeX terkompresi lengkap untuk peneliti di bidang Ilmu Komputer atau Kecerdasan Buatan.",
    size: "1.2 MB",
    version: "v1.5",
    filename: "Template_Jurnal_UNPRI_LaTeX.zip",
    bgColor: "bg-purple-100",
    btnColor: "bg-yellow-300 text-black",
  },
  {
    id: "pdf",
    title: "Panduan Gaya Penulisan (PDF)",
    desc: "Berkas PDF detail mengenai struktur artikel, tata cara sitasi, ukuran margin, dan ketentuan gambar.",
    size: "420 KB",
    version: "v3.0",
    filename: "Panduan_Penulisan_UNPRI.pdf",
    bgColor: "bg-emerald-100",
    btnColor: "bg-white text-black",
  },
];

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

export default function TemplatesManagementPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Load configuration from database or localStorage fallback on mount
  useEffect(() => {
    async function loadData() {
      // 1. Fetch templates
      const dbTemplates = await fetchSetting("journal_templates");
      if (dbTemplates) {
        try {
          setTemplates(JSON.parse(dbTemplates));
        } catch (e) {
          setTemplates(defaultTemplates);
        }
      } else {
        const savedTemplates = localStorage.getItem("journal_templates");
        if (savedTemplates) {
          setTemplates(JSON.parse(savedTemplates));
        } else {
          setTemplates(defaultTemplates);
        }
      }

      // 2. Fetch steps
      const dbSteps = await fetchSetting("journal_guidelines");
      if (dbSteps) {
        try {
          setSteps(JSON.parse(dbSteps));
        } catch (e) {
          setSteps(defaultSteps);
        }
      } else {
        const savedSteps = localStorage.getItem("journal_guidelines");
        if (savedSteps) {
          setSteps(JSON.parse(savedSteps));
        } else {
          setSteps(defaultSteps);
        }
      }
    }

    loadData();
  }, []);

  const triggerNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const handleTemplateChange = (id: string, field: string, value: string) => {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.id === id ? { ...tpl, [field]: value } : tpl))
    );
  };

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Format file size
      let sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
      if (file.size > 1024 * 1024) {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      setTemplates((prev) =>
        prev.map((tpl) =>
          tpl.id === id
            ? { ...tpl, filename: file.name, size: sizeStr, version: `${tpl.version} (Diperbarui)` }
            : tpl
        )
      );
      triggerNotification(`File "${file.name}" berhasil diunggah secara lokal!`);
    }
  };

  const saveTemplates = async () => {
    const success = await updateSetting("journal_templates", JSON.stringify(templates));
    localStorage.setItem("journal_templates", JSON.stringify(templates));
    if (success) {
      triggerNotification("Konfigurasi file template berhasil disimpan ke Database.");
    } else {
      triggerNotification("Simpan lokal berhasil, gagal mengirim ke Database.", "error");
    }
  };

  const handleStepTitleChange = (index: number, val: string) => {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, title: val } : s))
    );
  };

  const handleStepItemsChange = (index: number, val: string) => {
    // Split text by lines, filtering out empty lines
    const items = val.split("\n").filter((line) => line.trim() !== "");
    setSteps((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, items } : s))
    );
  };

  const saveSteps = async () => {
    const success = await updateSetting("journal_guidelines", JSON.stringify(steps));
    localStorage.setItem("journal_guidelines", JSON.stringify(steps));
    if (success) {
      triggerNotification("Panduan gaya penulisan berhasil disimpan ke Database.");
    } else {
      triggerNotification("Simpan lokal berhasil, gagal mengirim ke Database.", "error");
    }
  };

  const resetToDefaults = async () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang seluruh pengaturan template & panduan ke bawaan sistem?")) {
      await updateSetting("journal_templates", "");
      await updateSetting("journal_guidelines", "");
      localStorage.removeItem("journal_templates");
      localStorage.removeItem("journal_guidelines");
      setTemplates(defaultTemplates);
      setSteps(defaultSteps);
      triggerNotification("Semua pengaturan disetel ulang ke bawaan.");
    }
  };

  const getTemplateIcon = (id: string) => {
    if (id === "docx") return FileSpreadsheet;
    if (id === "latex") return FileCode;
    return FileText;
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative">
      <DashboardNavbar
        title="Template & Panduan"
        subtitle="Kelola aset berkas penulisan jurnal dan perbarui langkah panduan gaya penulisan naskah."
        icon={UploadCloud}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-5xl w-full mx-auto space-y-12">
          
          {/* Main Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50 border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-black">Pemberitahuan Sinkronisasi</h3>
                <p className="text-xs font-bold text-zinc-700 uppercase tracking-wide mt-1 leading-relaxed">
                  Seluruh perubahan berkas, versi, deskripsi, dan langkah penulisan yang disimpan di sini akan langsung disinkronkan ke halaman publik <span className="underline">/template</span> dan <span className="underline">/panduan-penulis</span>.
                </p>
              </div>
            </div>
            <button
              onClick={resetToDefaults}
              className="inline-flex h-10 items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-zinc-100 text-xs font-black uppercase tracking-wider px-4 gap-2 shadow-[2px_2px_0px_0px_#000000] shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Default
            </button>
          </div>

          {/* SECTION 1: TEMPLATE FILES */}
          <div className="space-y-6">
            <div className="border-b-[3px] border-black pb-2 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-black">1. Kelola Berkas Template</h2>
              <button
                onClick={saveTemplates}
                className="inline-flex h-10 items-center justify-center rounded-xl border-2 border-black bg-indigo-500 hover:bg-indigo-600 text-xs font-black uppercase tracking-wider text-white px-5 gap-2 shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              >
                <Save className="w-4 h-4" /> Simpan Berkas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((tpl) => {
                const Icon = getTemplateIcon(tpl.id);
                return (
                  <div 
                    key={tpl.id}
                    className="bg-white border-[3px] border-black p-6 shadow-[5px_5px_0px_0px_#000000] flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      {/* Badge Header */}
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] ${tpl.bgColor || 'bg-zinc-100'}`}>
                          <Icon className="w-5 h-5 text-black stroke-[2.5px]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 bg-zinc-50 border border-black rounded px-2 py-0.5">
                          {tpl.size}
                        </span>
                      </div>

                      {/* Title input */}
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Nama Aset</Label>
                        <Input
                          value={tpl.title}
                          onChange={(e) => handleTemplateChange(tpl.id, "title", e.target.value)}
                          className="font-sans border-2 border-black rounded-lg text-xs font-bold"
                        />
                      </div>

                      {/* Version input */}
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Versi</Label>
                        <Input
                          value={tpl.version}
                          onChange={(e) => handleTemplateChange(tpl.id, "version", e.target.value)}
                          className="font-sans border-2 border-black rounded-lg text-xs font-bold"
                        />
                      </div>

                      {/* Desc textarea */}
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Deskripsi</Label>
                        <Textarea
                          value={tpl.desc}
                          onChange={(e) => handleTemplateChange(tpl.id, "desc", e.target.value)}
                          className="font-sans border-2 border-black rounded-lg text-xs font-semibold resize-none h-20"
                        />
                      </div>

                      {/* Filename info */}
                      <div className="space-y-1 bg-zinc-50 p-2.5 rounded-lg border-2 border-dashed border-black">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Berkas Terkini</span>
                          <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-100 border border-emerald-300 px-1 rounded">Aktif</span>
                        </div>
                        <p className="text-[10px] font-bold text-black truncate mt-1">{tpl.filename}</p>
                      </div>
                    </div>

                    {/* File Upload Button wrapper */}
                    <div className="pt-2">
                      <Label
                        htmlFor={`file-upload-${tpl.id}`}
                        className="w-full inline-flex h-9 items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-zinc-50 text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all gap-1.5"
                      >
                        <FileUp className="w-3.5 h-3.5 stroke-[2.5px]" />
                        Unggah File Baru
                      </Label>
                      <input
                        id={`file-upload-${tpl.id}`}
                        type="file"
                        accept={tpl.id === "docx" ? ".docx" : tpl.id === "latex" ? ".zip,.tar.gz" : ".pdf"}
                        onChange={(e) => handleFileUpload(tpl.id, e)}
                        className="hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="border-t-2 border-black" />

          {/* SECTION 2: WRITING GUIDELINES STEPS */}
          <div className="space-y-6">
            <div className="border-b-[3px] border-black pb-2 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-black">2. Sunting Langkah Panduan Penulisan</h2>
              <button
                onClick={saveSteps}
                className="inline-flex h-10 items-center justify-center rounded-xl border-2 border-black bg-emerald-500 hover:bg-emerald-600 text-xs font-black uppercase tracking-wider text-white px-5 gap-2 shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              >
                <Save className="w-4 h-4" /> Simpan Panduan
              </button>
            </div>

            <div className="space-y-6">
              {steps.map((s, index) => (
                <div 
                  key={s.step}
                  className={`border-[3px] border-black p-6 shadow-[5px_5px_0px_0px_#000000] flex flex-col md:flex-row items-stretch gap-6 ${s.bgColor || 'bg-white'}`}
                >
                  {/* Step indicator */}
                  <div className="flex md:flex-col items-center justify-center gap-2 md:w-32 shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-black pb-4 md:pb-0 md:pr-6">
                    <span className="text-4xl font-black text-black/10 select-none">#{s.step}</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] rounded ${s.badgeBg || 'bg-zinc-150'}`}>
                      Langkah {s.step}
                    </span>
                  </div>

                  {/* Inputs */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 gap-1">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Judul Langkah</Label>
                      <Input
                        value={s.title}
                        onChange={(e) => handleStepTitleChange(index, e.target.value)}
                        className="font-sans border-2 border-black rounded-lg text-sm font-bold bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                        <span>Poin-Poin Persyaratan</span>
                        <span className="text-[9px] lowercase font-semibold text-zinc-400">Tekan enter untuk setiap poin baru</span>
                      </Label>
                      <Textarea
                        value={s.items.join("\n")}
                        onChange={(e) => handleStepItemsChange(index, e.target.value)}
                        className="font-sans border-2 border-black rounded-lg text-xs font-semibold resize-none h-24 bg-white"
                        placeholder="Tulis setiap ketentuan pada baris baru..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Center Top Notification Toast */}
      {notification && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border-[3px] border-black p-5 shadow-[6px_6px_0px_0px_#000000] min-w-[320px] max-w-md animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-black bg-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-black stroke-[2.5px]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black">Perubahan Disimpan</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1 leading-relaxed">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
