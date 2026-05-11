import { UploadCloud, CheckCircle, Info } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Kirim Naskah Baru" };

export default function NewSubmissionPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Kirim Naskah Baru"
        subtitle="Lengkapi metadata dan unggah berkas naskah Anda."
        icon={UploadCloud}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-4xl w-full mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 px-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
            {[
              { step: 1, label: "Mulai", active: true },
              { step: 2, label: "Unggah Berkas", active: false },
              { step: 3, label: "Metadata", active: false },
              { step: 4, label: "Selesai", active: false },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-2 bg-transparent">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    s.active
                      ? "bg-brand text-white shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {s.step}
                </div>
                <span className={`text-[11px] font-semibold ${s.active ? "text-ink" : "text-muted-text"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div
            className="bg-white/95 backdrop-blur-xl rounded-2xl border p-8 transition-all duration-300 shadow-sm"
            style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
          >
            <div className="flex items-start gap-4 mb-8 p-4 rounded-xl" style={{ backgroundColor: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}>
              <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[14px] font-semibold text-ink mb-1">Persyaratan Pengiriman</h3>
                <p className="text-[12px] text-muted-text leading-relaxed">
                  Pastikan naskah Anda belum pernah diterbitkan sebelumnya, dan sesuai dengan pedoman penulisan jurnal ini. File yang diunggah harus dalam format DOCX atau PDF tanpa menyertakan identitas penulis (blind review).
                </p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-ink">Judul Naskah</Label>
                <Input placeholder="Masukkan judul lengkap naskah..." className="bg-gray-50/50" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-ink">Abstrak</Label>
                <Textarea
                  placeholder="Ketikkan abstrak naskah Anda di sini (maks. 250 kata)..."
                  className="bg-gray-50/50 resize-y min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-ink">Bagian / Kategori</Label>
                  <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50">
                    <option>Artikel Penelitian (Research Article)</option>
                    <option>Kajian Pustaka (Review Article)</option>
                    <option>Laporan Kasus (Case Report)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-ink">Bahasa Utama</Label>
                  <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50">
                    <option>Bahasa Indonesia</option>
                    <option>English</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
                <Button variant="outline" className="text-muted-text hover:text-ink">Batal</Button>
                <Button
                  className="text-white font-sans px-6"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                >
                  Simpan & Lanjutkan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
