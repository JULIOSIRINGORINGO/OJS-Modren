"use client";

import { useState, useEffect } from "react";
import { User, Mail, Link as LinkIcon, Building2, Loader2, Check, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fetchProfile, updateProfile } from "@/lib/api-client";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [orcid, setOrcid] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);

  useEffect(() => {
    fetchProfile().then((user) => {
      setProfile(user);
      setFirstName(user?.first_name || "");
      setLastName(user?.last_name || "");
      setBio(user?.bio || "");
      setInstitution(user?.institution || "");
      setEmail(user?.email || "");
      setOrcid(user?.orcid || "");
      setAvatar(user?.avatar || "");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      const result = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email,
        institution,
        bio,
        orcid,
        avatar,
      });
      setProfile(result.user);
      // Also update session storage
      sessionStorage.setItem("auth_user", JSON.stringify(result.user));
      setSaved(true);
      setToast({
        type: "success",
        message: "Profil berhasil diperbarui!",
      });
      setTimeout(() => {
        setSaved(false);
        setToast(null);
      }, 2000); // 2 seconds
    } catch (err: any) {
      console.error("Gagal menyimpan profil:", err);
      const msg = err.message || "Gagal menyimpan profil. Silakan coba kembali.";
      setError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 2000); // 2 seconds
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    if (!password || !confirmPassword) {
      const msg = "Silakan isi kedua kolom kata sandi";
      setError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 2000);
      return;
    }
    if (password.length < 8) {
      const msg = "Kata sandi baru minimal harus 8 karakter";
      setError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 2000);
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Konfirmasi kata sandi baru tidak cocok";
      setError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setSavingPassword(true);
    setSavedPassword(false);
    try {
      const result = await updateProfile({ password });
      setProfile(result.user);
      // Also update session storage
      sessionStorage.setItem("auth_user", JSON.stringify(result.user));
      setPassword("");
      setConfirmPassword("");
      setSavedPassword(true);
      setToast({
        type: "success",
        message: "Kata sandi berhasil diubah!",
      });
      setTimeout(() => {
        setSavedPassword(false);
        setToast(null);
      }, 2000); // 2 seconds
    } catch (err: any) {
      console.error("Gagal mengubah kata sandi:", err);
      const msg = err.message || "Gagal mengubah kata sandi. Silakan coba kembali.";
      setError(msg);
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 2000); // 2 seconds
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = profile
    ? `${(profile.first_name || "?")[0]}${(profile.last_name || "?")[0]}`.toUpperCase()
    : "??";

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <DashboardNavbar title="Profil Saya" subtitle="Kelola informasi publik dan data pribadi Anda." icon={User} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat profil...</span>
        </div>
      </div>
    );
  }

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
            {error && (
              <div className="flex items-center gap-2 bg-rose-100 border-2 border-black p-3 rounded-xl text-xs font-black uppercase tracking-wide text-rose-700 shadow-[2px_2px_0px_0px_#000]">
                <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5px]" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Kartu Profil Publik */}
            <div
              className="bg-card rounded-2xl p-6 transition-all duration-300 neo-border neo-shadow"
            >
              <h2 className="text-[14px] font-black uppercase tracking-wider text-foreground mb-6">Informasi Publik</h2>
              
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-2xl border-[3px] border-black object-cover shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_var(--neo-shadow-color)]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center border-[3px] border-black bg-purple-100 text-purple-700 text-3xl font-black shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_var(--neo-shadow-color)]">
                      {initials}
                    </div>
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatar(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    className="h-8 text-[11px] font-black uppercase tracking-wider neo-btn"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                  >
                    Ubah Foto
                  </Button>
                </div>
                
                <div className="flex-1 space-y-5 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Depan</Label>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Nama Belakang</Label>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Biografi Singkat</Label>
                    <Textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tuliskan biografi singkat Anda..."
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
                  <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground stroke-[2.5px]" /> Email Kontak
                    </Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-muted-foreground stroke-[2.5px]" /> ORCID iD
                    </Label>
                    <Input value={orcid} onChange={(e) => setOrcid(e.target.value)} placeholder="0000-0000-0000-0000" />
                  </div>
                </div>
              </div>
            </div>

            {/* Keamanan Akun */}
            <div
              className="bg-card rounded-2xl p-6 transition-all duration-300 neo-border neo-shadow"
            >
              <h2 className="text-[14px] font-black uppercase tracking-wider text-foreground mb-6">Keamanan Akun</h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground stroke-[2.5px]" /> Ubah Kata Sandi Baru
                    </Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Masukkan kata sandi baru..." 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 stroke-[2px]" /> : <Eye className="w-4 h-4 stroke-[2px]" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground stroke-[2.5px]" /> Konfirmasi Kata Sandi Baru
                    </Label>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Konfirmasi kata sandi baru..." 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 stroke-[2px]" /> : <Eye className="w-4 h-4 stroke-[2px]" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-6 border-t-2 border-sidebar-border">
                <Button
                  className="text-[11px] font-black uppercase tracking-wider neo-btn px-6"
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                >
                  {savingPassword ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengubah...</>
                  ) : savedPassword ? (
                    <><Check className="w-4 h-4 mr-2" /> Diubah!</>
                  ) : (
                    "Ubah Kata Sandi"
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                className="text-[11px] font-black uppercase tracking-wider neo-btn px-6"
                onClick={() => {
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                  if (profile) {
                    setFirstName(profile.first_name || "");
                    setLastName(profile.last_name || "");
                    setBio(profile.bio || "");
                    setInstitution(profile.institution || "");
                    setEmail(profile.email || "");
                    setOrcid(profile.orcid || "");
                    setAvatar(profile.avatar || "");
                  }
                }}
              >
                Batal
              </Button>
              <Button
                className="text-[11px] font-black uppercase tracking-wider neo-btn px-8"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                ) : saved ? (
                  <><Check className="w-4 h-4 mr-2" /> Tersimpan!</>
                ) : (
                  "Simpan Profil"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className={cn(
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000] flex items-center gap-4 animate-in fade-in zoom-in-95 duration-200 rounded-2xl max-w-sm w-[90%]",
            toast.type === "success" ? "bg-emerald-100 text-black" : "bg-rose-100 text-rose-800"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0",
            toast.type === "success" ? "bg-emerald-300 text-black" : "bg-rose-300 text-rose-800"
          )}>
            {toast.type === "success" ? (
              <Check className="w-4 h-4 stroke-[2.5px]" />
            ) : (
              <AlertCircle className="w-4 h-4 stroke-[2.5px]" />
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">
              {toast.type === "success" ? "Berhasil!" : "Gagal!"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-85 mt-0.5">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
