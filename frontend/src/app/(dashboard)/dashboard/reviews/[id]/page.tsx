"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchReviewAssignment,
  updateReviewAssignment,
  getCurrentUser
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { ArrowLeft, BookOpen, Loader2, Download, CheckCircle, FileText } from "lucide-react";

export default function ReviewAssignmentPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recommendation, setRecommendation] = useState("");
  const [comments, setComments] = useState("");
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/dashboard");
      return;
    }

    if (!id) return;

    fetchReviewAssignment(id)
      .then((data) => {
        setAssignment(data);
        if (data.status === "completed") {
          setRecommendation(data.recommendation || "");
          setComments(data.comments || "");
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message || "Gagal memuat data penugasan review.");
        setLoading(false);
      });
  }, [id, router]);

  const handleSubmit = async () => {
    if (!id || !recommendation || !comments.trim() || assignment?.status === "completed") return;
    setSubmitting(true);
    setError("");
    try {
      await updateReviewAssignment(id, {
        recommendation,
        comments,
        review_file: reviewFile ? reviewFile.name : undefined
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/reviews");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Gagal mengirim hasil evaluasi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <DashboardNavbar title="Evaluasi Naskah" icon={BookOpen} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Memuat Detail Naskah...</p>
        </div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <DashboardNavbar title="Evaluasi Naskah" icon={BookOpen} />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl border-[3px] border-black bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_#000000] font-black">
            !
          </div>
          <h2 className="text-2xl font-black text-black mb-2 uppercase">Gagal Memuat</h2>
          <p className="text-sm font-bold text-zinc-650 mb-6 uppercase tracking-wide">
            {error}
          </p>
          <Button
            onClick={() => router.push("/dashboard/reviews")}
            className="neo-btn text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Tinjauan Saya
          </Button>
        </div>
      </div>
    );
  }

  const isReadOnly = assignment?.status === "completed";

  return (
    <div className="flex flex-col h-full w-full bg-background pb-20">
      <DashboardNavbar
        title="Evaluasi Naskah"
        subtitle={isReadOnly ? "Melihat hasil ulasan yang telah Anda kirimkan." : "Berikan rekomendasi akademis dan ulasan konstruktif."}
        icon={BookOpen}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-4xl w-full mx-auto space-y-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/reviews")}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black px-3.5 py-1.5 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]" /> Kembali ke Tinjauan Saya
          </Button>

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Evaluasi berhasil terkirim! Mengalihkan...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Info Naskah */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl border-3 border-black bg-purple-50/30 text-foreground shadow-[4px_4px_0px_0px_#000]">
                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Kategori / Rumpun Ilmu
                </p>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 border-2 border-black text-purple-700">
                  {assignment.article_category}
                </span>

                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-4 mb-1">
                  Judul Naskah
                </p>
                <p className="text-[13px] font-extrabold leading-snug">
                  {assignment.article_title}
                </p>

                <div className="mt-5 space-y-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (assignment.article_file_url && assignment.article_file_name?.toLowerCase().endsWith('.pdf')) {
                        window.open(`http://localhost:3001${assignment.article_file_url}`, "_blank");
                      } else {
                        window.open(`/articles/${assignment.article_id}/pdf`, "_blank");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 h-9 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-xl bg-yellow-200 text-black hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_#000]"
                  >
                    Baca Naskah Lengkap
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (assignment.article_file_url) {
                        window.open(`http://localhost:3001${assignment.article_file_url}`, "_blank");
                      } else {
                        const blob = new Blob([`Mock article file download for ${assignment.article_title} (original)`], { type: "application/octet-stream" });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "naskah_asli.docx";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 h-9 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-xl bg-cyan-300 text-black hover:bg-cyan-400 transition-colors shadow-[2px_2px_0px_0px_#000]"
                  >
                    Unduh File Asli
                  </Button>
                </div>
              </div>

              {isReadOnly && assignment.review_file && (
                <div className="p-4 rounded-xl border-2 border-black bg-zinc-50 flex flex-col gap-2 shadow-[2px_2px_0px_0px_#000]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Berkas Hasil Review Anda</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([`Mock file download for reviewer comments: ${assignment.review_file}`], { type: "application/octet-stream" });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = assignment.review_file;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-200 text-black hover:bg-cyan-300 shadow-[1px_1px_0px_0px_#000]"
                  >
                    <Download className="w-3 h-3" /> Unduh Berkas Lampiran
                  </Button>
                </div>
              )}
            </div>

            {/* Form Evaluasi */}
            <div className="md:col-span-3 p-6 rounded-2xl border-3 border-black bg-white shadow-[6px_6px_0px_0px_#000] space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-black pb-2 border-b-2 border-dashed border-black/10">
                Formulir Evaluasi Peninjau
              </h3>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-wider text-black">Rekomendasi Keputusan</Label>
                <Select
                  onValueChange={(val) => setRecommendation(val ?? "")}
                  value={recommendation}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="font-sans text-sm w-full border-2 border-black rounded-xl h-10 bg-white">
                    <SelectValue placeholder="Pilih rekomendasi keputusan..." />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-xl">
                    <SelectItem value="accept" className="font-bold text-emerald-700">Terima & Terbitkan (Accept)</SelectItem>
                    <SelectItem value="revision" className="font-bold text-amber-700">Minta Revisi (Revisions Required)</SelectItem>
                    <SelectItem value="reject" className="font-bold text-rose-700">Tolak Naskah (Decline Submission)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-wider text-black">Catatan Evaluasi / Komentar</Label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Berikan ulasan akademis konstruktif mengenai kelebihan dan kelemahan naskah..."
                  className="font-sans text-sm resize-none min-h-[160px] border-2 border-black rounded-xl"
                  required
                  disabled={isReadOnly}
                />
              </div>

              {!isReadOnly && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-black">Unggah Berkas Review Berkomentar (Opsional)</Label>
                  <Input
                    type="file"
                    accept=".doc,.docx,.pdf"
                    onChange={(e) => setReviewFile(e.target.files?.[0] || null)}
                    className="font-sans text-xs border-2 border-black rounded-xl h-10 bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-black file:text-[10px] file:font-black file:uppercase file:bg-zinc-150 cursor-pointer"
                  />
                  {reviewFile && (
                    <p className="text-[10px] font-black text-purple-700 uppercase">Terpilih: {reviewFile.name}</p>
                  )}
                </div>
              )}

              {!isReadOnly && (
                <div className="pt-4 border-t-2 border-dashed border-black/10 flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={!recommendation || !comments.trim() || submitting}
                    className="text-white font-sans font-black uppercase text-xs tracking-wider neo-btn h-10 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]"
                    style={{ backgroundColor: "#7C3AED" }}
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim...</>
                    ) : (
                      "Kirim Evaluasi"
                    )}
                  </Button>
                </div>
              )}

              {isReadOnly && (
                <div className="p-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                  Peninjauan telah selesai dilakukan dan naskah sudah diproses.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
