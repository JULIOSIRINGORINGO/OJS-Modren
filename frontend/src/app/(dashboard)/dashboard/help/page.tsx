import { HelpCircle, BookOpen, FileText, Download, Mail } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Bantuan & Panduan" };

const faqs = [
  {
    q: "Berapa lama proses tinjauan sejawat (peer review) berlangsung?",
    a: "Proses tinjauan sejawat biasanya memakan waktu antara 3 hingga 6 minggu, tergantung pada ketersediaan peninjau (reviewer) dan kompleksitas naskah. Anda dapat memantau status naskah di menu 'Naskah Saya'.",
  },
  {
    q: "Apakah ada biaya publikasi (Article Processing Charge / APC)?",
    a: "Ya, jurnal kami membebankan biaya publikasi sebesar Rp 500.000 jika naskah Anda diterima untuk diterbitkan. Biaya ini digunakan untuk proses penyuntingan (copyediting) dan pengaturan letak (layouting).",
  },
  {
    q: "Bagaimana cara merevisi naskah saya?",
    a: "Jika naskah Anda memerlukan revisi, Anda akan menerima pemberitahuan di menu 'Pesan & Diskusi'. Anda dapat mengunggah berkas revisi di menu 'Naskah Saya' dengan mengklik naskah terkait dan memilih tombol 'Unggah Revisi'.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Bantuan & Panduan"
        subtitle="Pusat informasi dan dukungan untuk penulis Modern OJS."
        icon={HelpCircle}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-4xl w-full mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <a
              href="#"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center mb-3 bg-purple-100 text-purple-700 shadow-[2px_2px_0px_0px_#000000] font-black">
                <BookOpen className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground mb-2">Panduan Penulis</h3>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Pedoman lengkap cara menulis dan mensitasi untuk jurnal ini.</p>
            </a>
            
            <a
              href="#"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center mb-3 bg-emerald-100 text-emerald-700 shadow-[2px_2px_0px_0px_#000000] font-black">
                <Download className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground mb-2">Unduh Templat</h3>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Templat naskah resmi dalam format Microsoft Word (.docx).</p>
            </a>
            
            <a
              href="#"
              className="bg-card rounded-2xl p-5 transition-all duration-300 neo-border neo-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--neo-shadow-color)] active:translate-x-0 active:translate-y-0 active:shadow-sm group flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center mb-3 bg-amber-100 text-amber-700 shadow-[2px_2px_0px_0px_#000000] font-black">
                <FileText className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <h3 className="text-[13px] font-black uppercase tracking-wider text-foreground mb-2">Kebijakan Hak Cipta</h3>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Informasi terkait lisensi publikasi dan akses terbuka (Open Access).</p>
            </a>
          </div>

          <div
            className="bg-card rounded-2xl p-6 transition-all duration-300 neo-border neo-shadow mb-8"
          >
            <h2 className="text-[14px] font-black uppercase tracking-wider text-foreground mb-6">Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/10 border-2 border-sidebar-border">
                  <h3 className="text-[13px] font-black text-foreground mb-2">{faq.q}</h3>
                  <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-secondary rounded-2xl border-[3px] border-black p-6 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(167,139,250,1)]"
          >
            <div className="text-center sm:text-left">
              <h3 className="text-[14px] font-black uppercase tracking-wider text-black mb-1">Masih butuh bantuan?</h3>
              <p className="text-[12px] font-bold text-black/80 max-w-sm leading-relaxed">
                Jika Anda memiliki pertanyaan teknis atau kendala saat mengirim naskah, silakan hubungi tim dukungan kami.
              </p>
            </div>
            <a
              href="mailto:support@modernojs.id"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-black font-black uppercase text-[11px] tracking-wider text-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000000] active:translate-y-0 active:shadow-none transition-all duration-200 shrink-0 shadow-[2px_2px_0px_0px_#000000]"
            >
              <Mail className="w-4 h-4 stroke-[2.5px]" /> Hubungi Dukungan
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
