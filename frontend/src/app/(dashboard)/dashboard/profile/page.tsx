import { User, Mail, Link as LinkIcon, Building2 } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Profil Saya" };

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Profil Saya"
        subtitle="Kelola informasi publik dan data pribadi Anda."
        icon={User}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-4xl w-full mx-auto">
          <div className="space-y-6">
            
            {/* Kartu Profil Publik */}
            <div
              className="bg-card rounded-2xl p-6 transition-all duration-300 neo-border neo-shadow"
            >
              <h2 className="text-[14px] font-black uppercase tracking-wider text-foreground mb-6">Informasi Publik</h2>
              
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center border-[3px] border-black bg-purple-100 text-purple-700 text-3xl font-black shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_var(--neo-shadow-color)]">
                    AP
                  </div>
                  <Button variant="outline" className="h-8 text-[11px] font-black uppercase tracking-wider neo-btn">
                    Ubah Foto
                  </Button>
                </div>
                
                <div className="flex-1 space-y-5 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Depan</Label>
                      <Input defaultValue="Andi" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Belakang</Label>
                      <Input defaultValue="Prasetyo" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Biografi Singkat</Label>
                    <Textarea 
                      defaultValue="Peneliti di bidang kecerdasan buatan dan pemrosesan bahasa alami."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Afiliasi dan Akademik */}
            <div
              className="bg-card rounded-2xl p-6 transition-all duration-300 neo-border neo-shadow"
            >
              <h2 className="text-[14px] font-black uppercase tracking-wider text-foreground mb-6">Afiliasi & Identitas Akademik</h2>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground stroke-[2.5px]" /> Institusi
                  </Label>
                  <Input defaultValue="Universitas Teknologi Nusantara" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground stroke-[2.5px]" /> Email Kontak
                    </Label>
                    <Input defaultValue="andi.prasetyo@utn.ac.id" type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-muted-foreground stroke-[2.5px]" /> ORCID iD
                    </Label>
                    <Input defaultValue="0000-0002-1825-0097" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" className="text-[11px] font-black uppercase tracking-wider neo-btn px-6">Batal</Button>
              <Button
                className="text-[11px] font-black uppercase tracking-wider neo-btn px-8"
              >
                Simpan Profil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
