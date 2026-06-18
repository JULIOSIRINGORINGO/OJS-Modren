"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Info, Loader2, CheckCircle } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchCategories, createArticle, getCurrentUser } from "@/lib/api-client";
import type { Category } from "@/types";

export default function NewSubmissionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorList, setAuthorList] = useState<string[]>([""]);
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState("");
  const [references, setReferences] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      setAuthorList([fullName]);
    }
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(String(cats[0].id));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const joinedAuthors = authorList.filter((a) => a.trim() !== "").join(", ");
    if (!title.trim() || !abstract.trim() || !joinedAuthors) {
      setError("Judul, abstrak, dan penulis wajib diisi.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createArticle({
        title,
        abstract,
        authors: joinedAuthors,
        category_id: categoryId,
        keywords: keywords,
        references: references,
        file_name: file ? file.name : "naskah_asli.docx",
      } as any);
      setSubmitted(true);
      setTimeout(() => router.push("/dashboard/submissions"), 2000);
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat mengirim naskah.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full w-full">
        <DashboardNavbar title="Kirim Naskah Baru" subtitle="Naskah berhasil dikirimkan!" icon={UploadCloud} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-2xl border-[3px] border-black bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#000000]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-foreground mb-2">Naskah Berhasil Dikirim!</h2>
          <p className="text-sm font-bold text-muted-foreground">Anda akan dialihkan ke halaman daftar naskah...</p>
        </div>
      </div>
    );
  }

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
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-sidebar-border -z-10 -translate-y-1/2"></div>
            {[
              { step: 1, label: "Mulai", active: true },
              { step: 2, label: "Metadata", active: false },
              { step: 3, label: "Selesai", active: false },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-2 bg-transparent">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors border-2 border-black ${
                    s.active
                      ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_#000000]"
                      : "bg-card text-muted-foreground"
                  }`}
                >
                  {s.step}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-wider ${s.active ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div
            className="bg-card rounded-2xl p-8 transition-all duration-300 neo-border neo-shadow"
          >
            <div className="flex items-start gap-4 mb-8 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/10 border-2 border-sidebar-border">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5 stroke-[2.5px]" />
              <div>
                <h3 className="text-[14px] font-black text-foreground mb-1">Persyaratan Pengiriman</h3>
                <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">
                  Pastikan naskah Anda belum pernah diterbitkan sebelumnya, dan sesuai dengan pedoman penulisan jurnal ini. File yang diunggah harus dalam format DOCX atau PDF tanpa menyertakan identitas penulis (blind review).
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Judul Naskah</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul lengkap naskah..."
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Daftar Penulis (Authors)</Label>
                <div className="space-y-3">
                  {authorList.map((author, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Penulis {index + 1} {index === 0 && "(Utama)"}
                        </Label>
                        <Input
                          value={author}
                          onChange={(e) => {
                            const newList = [...authorList];
                            newList[index] = e.target.value;
                            setAuthorList(newList);
                          }}
                          placeholder={`Masukkan nama penulis ${index + 1}...`}
                          required
                        />
                      </div>
                      {authorList.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 mt-5 border-2 border-black bg-rose-100 text-rose-700 hover:bg-rose-200 px-3 shadow-[2px_2px_0px_0px_#000000] neo-btn shrink-0"
                          onClick={() => {
                            const newList = authorList.filter((_, i) => i !== index);
                            setAuthorList(newList);
                          }}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[11px] font-black uppercase tracking-wider neo-btn mt-2 border-2 border-black bg-purple-50 text-purple-700 hover:bg-purple-100"
                  onClick={() => setAuthorList([...authorList, ""])}
                >
                  + Tambah Penulis
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Abstrak</Label>
                <Textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Ketikkan abstrak naskah Anda di sini (maks. 250 kata)..."
                  className="resize-y min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Kata Kunci (Keywords)</Label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Masukkan kata kunci, pisahkan dengan koma (contoh: Machine Learning, NLP)..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Daftar Pustaka (References)</Label>
                <Textarea
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="Ketik atau tempelkan daftar pustaka naskah Anda di sini..."
                  className="resize-y min-h-[155px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-wider text-foreground">Unggah File Naskah (PDF/DOCX)</Label>
                <div className="border-[3px] border-black border-dashed rounded-xl p-8 bg-purple-50/20 dark:bg-purple-950/5 text-center relative hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="w-8 h-8 text-primary shrink-0" />
                    {file ? (
                      <div>
                        <p className="text-sm font-black text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB · Klik atau seret untuk mengganti
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-black text-foreground">Pilih berkas PDF atau DOCX</p>
                        <p className="text-xs text-muted-foreground">atau seret file Anda ke sini</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t-2 border-sidebar-border flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="text-[11px] font-black uppercase tracking-wider neo-btn"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="text-[11px] font-black uppercase tracking-wider neo-btn px-6"
                  disabled={submitting}
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim...</>
                  ) : (
                    "Kirim Naskah"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
