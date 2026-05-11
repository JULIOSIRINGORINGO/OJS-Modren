import { MessageSquare, Send, Search } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Pesan & Diskusi" };

const mockConversations = [
  {
    id: 1,
    subject: "Revisi Naskah #1042",
    contact: "Budi Santoso (Editor)",
    lastMessage: "Tolong perbaiki format sitasi di bab 3.",
    time: "10:30",
    unread: true,
  },
  {
    id: 2,
    subject: "Hasil Keputusan Review",
    contact: "Siti Aminah (Editor)",
    lastMessage: "Selamat, naskah Anda diterima untuk edisi selanjutnya.",
    time: "Kemarin",
    unread: false,
  },
  {
    id: 3,
    subject: "Pertanyaan Format Gambar",
    contact: "Admin Jurnal",
    lastMessage: "Resolusi minimal untuk gambar adalah 300 DPI.",
    time: "2 Mei",
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Pesan & Diskusi"
        subtitle="Berkomunikasi dengan editor dan pengelola jurnal mengenai naskah Anda."
        icon={MessageSquare}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <div
            className="bg-card rounded-2xl border-[3px] border-black flex flex-col md:flex-row overflow-hidden shadow-[5px_5px_0px_0px_var(--neo-shadow-color)] h-[600px]"
          >
            {/* Sidebar List Pesan */}
            <div className="w-full md:w-1/3 border-r-[3px] border-sidebar-border flex flex-col bg-purple-50/20 dark:bg-purple-950/5">
              <div className="p-4 border-b-2 border-sidebar-border bg-purple-50/50 dark:bg-purple-950/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input placeholder="Cari obrolan..." className="pl-9 h-9 text-[13px]" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y-2 divide-sidebar-border">
                {mockConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-colors relative ${conv.unread ? "bg-purple-50/30 dark:bg-purple-950/5" : ""}`}
                  >
                    {conv.unread && (
                      <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-md"></span>
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-[13px] truncate pr-2 ${conv.unread ? "font-black text-foreground" : "font-extrabold text-foreground/85"}`}>
                        {conv.subject}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mt-0.5">{conv.time}</span>
                    </div>
                    <p className="text-[11px] text-primary font-black uppercase tracking-wider mb-1">{conv.contact}</p>
                    <p className={`text-[12px] truncate ${conv.unread ? "text-foreground font-extrabold" : "text-muted-foreground font-medium"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Area Obrolan */}
            <div className="flex-1 flex flex-col bg-card">
              <div className="p-4 border-b-[3px] border-sidebar-border flex items-center justify-between bg-purple-50/40 dark:bg-purple-950/10">
                <div>
                  <h3 className="text-[14px] font-black uppercase tracking-wider text-foreground">Revisi Naskah #1042</h3>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Budi Santoso (Editor Utama)</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-purple-50/10 dark:bg-purple-950/5">
                {/* Bubble Lain */}
                <div className="flex items-end gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-purple-100 text-purple-700 border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_0px_#000000]">BS</AvatarFallback>
                  </Avatar>
                  <div className="bg-purple-100/80 dark:bg-purple-900/20 border-2 border-sidebar-border text-foreground px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[80%] shadow-sm">
                    <p className="text-[13px] font-medium leading-relaxed">
                      Halo Bapak Andi, terima kasih atas revisi yang dikirimkan. Namun kami menemukan format sitasi di Bab 3 masih belum sesuai dengan standar APA 7th Edition. Tolong diperbaiki sebelum kami teruskan ke *layouting*.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1 text-right">10:30</p>
                  </div>
                </div>

                {/* Bubble Kita */}
                <div className="flex items-end gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground border-2 border-black px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[80%] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_var(--neo-shadow-color)]">
                    <p className="text-[13px] font-medium leading-relaxed">
                      Baik Pak Budi, saya akan segera memperbaikinya sesuai pedoman APA 7th dan mengirimkan ulang sore ini. Terima kasih atas koreksinya.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70 mt-1 text-right">10:45</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t-[3px] border-sidebar-border bg-purple-50/30 dark:bg-purple-950/10">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Ketik balasan Anda..."
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    className="shrink-0 neo-btn rounded-xl border-2 border-black"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
