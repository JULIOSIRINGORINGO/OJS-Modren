"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchArticle,
  updateArticleStatus,
  uploadArticleFile,
  fetchUsers,
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
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Download,
  Plus,
  X,
  UserCheck,
  CheckCircle,
  FileText
} from "lucide-react";
import type { Article } from "@/types";

interface ReviewerUser {
  id: number | string;
  name: string;
  email: string;
  institution: string;
}

export default function EditorDecisionPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reviewer assignment states
  const [allReviewers, setAllReviewers] = useState<ReviewerUser[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<ReviewerUser[]>([]);
  const [loadingReviewers, setLoadingReviewers] = useState(false);
  const [slots, setSlots] = useState(1);

  // Copyedit file state
  const [copyeditFile, setCopyeditFile] = useState<File | null>(null);

  // Final file & LoA file states
  const [finalFile, setFinalFile] = useState<File | null>(null);
  const [loaFile, setLoaFile] = useState<File | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    const allowedRoles = ["editor", "admin", "Editor", "Admin"];
    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
      return;
    }

    if (!id) return;

    fetchArticle(id)
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message || "Gagal memuat detail naskah.");
        setLoading(false);
      });

    // Set polling for real-time reviewer/article updates
    const interval = setInterval(() => {
      fetchArticle(id)
        .then((data) => {
          setArticle(data);
        })
        .catch(console.error);
    }, 3000);

    return () => clearInterval(interval);
  }, [id, router]);

  // Fetch reviewers when action is "assign"
  useEffect(() => {
    if (action === "assign" && allReviewers.length === 0) {
      setLoadingReviewers(true);
      fetchUsers()
        .then((users) => {
          const reviewers = users.filter(
            (u: any) => u.role?.toLowerCase() === "reviewer"
          );
          setAllReviewers(reviewers);
        })
        .catch(console.error)
        .finally(() => setLoadingReviewers(false));
    }
  }, [action, allReviewers.length]);

  const statusMap: Record<string, string> = {
    approve: "Published",
    revision: "Revision Required",
    reject: "Rejected",
    assign: "Reviewer Assigned",
    copyedit: "Copyediting",
  };

  const handleSubmit = async () => {
    if (!article || !action) return;
    if (action === "assign" && selectedReviewers.length === 0) return;

    setSubmitting(true);
    setError("");
    try {
      // Upload real files first
      let uploadedFinalName: string | undefined;
      let uploadedLoaName: string | undefined;
      let uploadedCopyeditName: string | undefined;

      if (action === "approve" && finalFile) {
        const result = await uploadArticleFile(article.id, finalFile, 'final');
        uploadedFinalName = result.filename;
      }
      if (action === "approve" && loaFile) {
        const result = await uploadArticleFile(article.id, loaFile, 'loa');
        uploadedLoaName = result.filename;
      }
      if (action === "copyedit" && copyeditFile) {
        const result = await uploadArticleFile(article.id, copyeditFile, 'copyedit');
        uploadedCopyeditName = result.filename;
      }

      const newStatus = statusMap[action] || "Under Review";
      const reviewerInfo =
        action === "assign"
          ? selectedReviewers.filter(Boolean).map((r) => r.name).join(", ")
          : "";
      const fullNotes = reviewerInfo
        ? `${notes}\n\n[Reviewer ditugaskan: ${reviewerInfo}]`
        : notes;

      const reviewerIds = action === "assign"
        ? selectedReviewers.filter(Boolean).map(r => String(r.id))
        : undefined;

      await updateArticleStatus(
        article.id,
        newStatus,
        fullNotes,
        undefined,
        undefined,
        reviewerIds,
        undefined,
        uploadedCopyeditName || uploadedFinalName,
        uploadedLoaName
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/submissions");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Gagal mengirim keputusan.");
    } finally {
      setSubmitting(false);
    }
  };

  const addSlot = () => {
    setSlots((s) => s + 1);
  };

  const removeSlot = (index: number) => {
    setSelectedReviewers((prev) => prev.filter((_, i) => i !== index));
    setSlots((s) => Math.max(1, s - 1));
  };

  const handleSelectReviewer = (slotIndex: number, reviewerId: string) => {
    const reviewer = allReviewers.find(
      (r) => r.id.toString() === reviewerId
    );
    if (!reviewer) return;

    setSelectedReviewers((prev) => {
      const copy = [...prev];
      copy[slotIndex] = reviewer;
      return copy;
    });
  };

  const selectedIds = new Set(selectedReviewers.map((r) => r?.id?.toString()));

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <DashboardNavbar title="Evaluasi & Keputusan Editor" icon={FileText} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Memuat Detail Naskah...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <DashboardNavbar title="Evaluasi & Keputusan Editor" icon={FileText} />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl border-[3px] border-black bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_#000000] font-black">
            !
          </div>
          <h2 className="text-2xl font-black text-black mb-2 uppercase">Gagal Memuat</h2>
          <p className="text-sm font-bold text-zinc-650 mb-6 uppercase tracking-wide">
            {error}
          </p>
          <Button
            onClick={() => router.push("/admin/submissions")}
            className="neo-btn text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Manajemen Naskah
          </Button>
        </div>
      </div>
    );
  }

  const activeRound = article?.round || 1;
  const activeAssignments = article?.review_assignments?.filter(
    (ra: any) => Number(ra.round || 1) === Number(activeRound)
  ) || [];

  return (
    <div className="flex flex-col h-full w-full bg-background pb-20">
      <DashboardNavbar
        title="Evaluasi &amp; Keputusan Editor"
        subtitle="Berikan evaluasi, tunjuk reviewer, atau terbitkan naskah yang dikelola."
        icon={FileText}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-5xl w-full mx-auto space-y-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/submissions")}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black px-3.5 py-1.5 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 transition-all rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]" /> Kembali ke Manajemen Naskah
          </Button>

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Keputusan berhasil dikirim! Mengalihkan...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          {article && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom Kiri: Info Naskah & Hasil Review */}
              <div className="space-y-6">
                {/* Info Naskah */}
                <div className="p-5 rounded-2xl border-3 border-black bg-purple-50/30 text-foreground shadow-[4px_4px_0px_0px_#000]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Detail Naskah
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 border-2 border-black text-purple-700">
                    {article.category}
                  </span>
                  <p className="text-[13px] font-extrabold leading-snug mt-3">
                    {article.title}
                  </p>
                  <p className="text-[11px] font-bold text-zinc-550 uppercase mt-1">
                    Oleh: {article.authors.join(", ")}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (article.file_url && article.file_name?.toLowerCase().endsWith('.pdf')) {
                          window.open(`http://localhost:3001${article.file_url}`, "_blank");
                        } else {
                          window.open(`/articles/${article.id}/pdf`, "_blank");
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
                        const blob = new Blob([`Mock article file download for ${article.title} (original)`], { type: "application/octet-stream" });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "naskah_asli.docx";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 h-9 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-xl bg-cyan-300 text-black hover:bg-cyan-400 transition-colors shadow-[2px_2px_0px_0px_#000]"
                    >
                      Unduh File Asli
                    </Button>
                  </div>
                </div>

                {/* Hasil Ulasan Peer Review */}
                <div className="space-y-3 border-3 border-black p-5 rounded-2xl bg-yellow-50/30 shadow-[4px_4px_0px_0px_#000]">
                  <h3 className="font-black text-xs uppercase tracking-wider text-purple-750 border-b-2 border-dashed border-black/10 pb-2">
                    Hasil Ulasan Peer Review (Ronde {activeRound})
                  </h3>
                  {activeAssignments.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic font-bold py-2 uppercase tracking-wide">
                      Belum ada penugasan ulasan untuk ronde ini.
                    </p>
                  ) : (
                    <div className="space-y-4 divide-y-2 divide-black/10 max-h-[300px] overflow-y-auto pr-2">
                      {activeAssignments.map((ra: any) => (
                        <div key={ra.id} className="pt-4 first:pt-0 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs text-foreground">{ra.reviewer_name}</span>
                            <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 border-2 border-black rounded-lg ${
                              ra.recommendation === 'accept' ? 'bg-emerald-300 text-black' :
                              ra.recommendation === 'revision' ? 'bg-amber-300 text-black' :
                              ra.recommendation === 'reject' ? 'bg-rose-300 text-black' :
                              'bg-zinc-200 text-black'
                            }`}>
                              {ra.recommendation ? (ra.recommendation === 'accept' ? 'TERIMA' : ra.recommendation === 'revision' ? 'PERLU REVISI' : 'TOLAK') : 'BELUM MERESPON'}
                            </span>
                          </div>
                          {ra.comments && (
                            <p className="text-xs text-zinc-650 italic bg-white p-2.5 border border-black rounded-lg leading-relaxed">
                              "{ra.comments}"
                            </p>
                          )}
                          {ra.review_file && (
                            <div className="pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const blob = new Blob([`Mock file download for reviewer comments: ${ra.review_file}`], { type: "application/octet-stream" });
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = ra.review_file;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  window.URL.revokeObjectURL(url);
                                }}
                                className="inline-flex items-center gap-1 h-7 px-2.5 text-[9px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-200 text-black hover:bg-cyan-300 shadow-[1px_1px_0px_0px_#000]"
                              >
                                <Download className="w-3 h-3" /> Unduh Berkas Ulasan ({ra.review_file})
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: Formulir Keputusan */}
              <div className="p-6 rounded-2xl border-3 border-black bg-white shadow-[6px_6px_0px_0px_#000] space-y-4 h-fit">
                <h3 className="font-black text-sm uppercase tracking-wider text-black pb-2 border-b-2 border-dashed border-black/10">
                  Keputusan Evaluasi Editor
                </h3>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-black">Pilih Keputusan</Label>
                  <Select onValueChange={(val) => {
                    setAction(val ?? "");
                    // Auto-populate notes from reviewer comments
                    if (val && val !== 'assign' && article) {
                      const currentRound = article.round || 1;
                      const completedReviews = (article.review_assignments || []).filter(
                        (ra: any) => Number(ra.round || 1) === Number(currentRound) && ra.status === 'completed'
                      );
                      if (completedReviews.length > 0 && !notes.trim()) {
                        const reviewerSummary = completedReviews.map((ra: any) => {
                          const recLabel = ra.recommendation === 'accept' ? 'Terima'
                            : ra.recommendation === 'revision' ? 'Perlu Revisi'
                            : ra.recommendation === 'reject' ? 'Tolak'
                            : 'Belum Ada';
                          let summary = `• ${ra.reviewer_name} — Rekomendasi: ${recLabel}`;
                          if (ra.comments) summary += `\n  Komentar: ${ra.comments}`;
                          return summary;
                        }).join('\n\n');
                        setNotes(`[Rangkuman Ulasan Reviewer Ronde ${currentRound}]\n\n${reviewerSummary}`);
                      }
                    }
                  }} value={action}>
                    <SelectTrigger className="font-sans text-sm w-full border-2 border-black rounded-xl h-10 bg-white">
                      <SelectValue placeholder="Pilih keputusan..." />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-black rounded-xl">
                      <SelectItem value="assign">Reviewer Sedang Ditugaskan</SelectItem>
                      <SelectItem value="revision">Minta Revisi</SelectItem>
                      <SelectItem value="copyedit">Kirim ke Copyediting</SelectItem>
                      <SelectItem value="approve">Terima &amp; Terbitkan</SelectItem>
                      <SelectItem value="reject">Tolak Naskah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reviewer Picker */}
                {action === "assign" && (
                  <div className="space-y-3 border-2 border-black p-4 rounded-xl bg-purple-50/10">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        Pilih Reviewer
                      </Label>
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        {selectedReviewers.filter(Boolean).length} dipilih
                      </span>
                    </div>

                    {loadingReviewers ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
                        <span className="text-xs text-muted-foreground">Memuat reviewer...</span>
                      </div>
                    ) : allReviewers.length === 0 ? (
                      <div className="p-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 text-center">
                        <p className="text-xs font-bold text-amber-700">Tidak ada reviewer terdaftar.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Array.from({ length: slots }).map((_, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1">
                              <Select
                                value={selectedReviewers[index]?.id?.toString() || ""}
                                onValueChange={(val) => handleSelectReviewer(index, val || "")}
                              >
                                <SelectTrigger className="font-sans text-xs w-full border-2 border-black rounded-xl h-9 bg-white">
                                  <SelectValue placeholder={`Reviewer ${index + 1}...`} />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-black rounded-xl">
                                  {allReviewers
                                    .filter(
                                      (r) =>
                                        !selectedIds.has(r.id.toString()) ||
                                        selectedReviewers[index]?.id?.toString() === r.id.toString()
                                    )
                                    .map((reviewer) => (
                                      <SelectItem key={reviewer.id} value={reviewer.id.toString()}>
                                        {reviewer.name} ({reviewer.institution})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeSlot(index)}
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 border-black bg-red-200 text-black hover:bg-red-300 transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}

                        {slots < allReviewers.length && (
                          <button
                            type="button"
                            onClick={addSlot}
                            className="w-full flex items-center justify-center gap-1 py-2 rounded-xl border-2 border-dashed border-black bg-purple-50 text-purple-750 hover:bg-purple-100 transition-all text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_#000]"
                          >
                            <Plus className="w-3 h-3" /> Tambah Reviewer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Upload File Copyedit */}
                {action === "copyedit" && (
                  <div className="space-y-1.5 border-2 border-black p-4 rounded-xl bg-purple-50/10">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-black">
                      Unggah Berkas Copyedit / Naskah Hasil Copyedited (.docx)
                    </Label>
                    <Input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      onChange={(e) => setCopyeditFile(e.target.files?.[0] || null)}
                      className="font-sans text-xs border-2 border-black rounded-xl h-10 bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-black file:text-[10px] file:font-black file:uppercase file:bg-zinc-150 cursor-pointer"
                    />
                    {copyeditFile && (
                      <p className="text-[10px] font-black text-purple-700 uppercase">
                        Terpilih: {copyeditFile.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Upload File LoA & Final File for Approve */}
                {action === "approve" && (
                  <div className="space-y-4 border-2 border-black p-4 rounded-xl bg-purple-50/10">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-black">
                        Unggah Berkas Naskah Final (.docx, .pdf)
                      </Label>
                      <Input
                        type="file"
                        accept=".doc,.docx,.pdf"
                        onChange={(e) => setFinalFile(e.target.files?.[0] || null)}
                        className="font-sans text-xs border-2 border-black rounded-xl h-10 bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-black file:text-[10px] file:font-black file:uppercase file:bg-zinc-150 cursor-pointer"
                      />
                      {finalFile && (
                        <p className="text-[10px] font-black text-purple-700 uppercase">
                          Terpilih: {finalFile.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 border-t border-black/10 pt-3">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-black">
                        Unggah Berkas Letter of Acceptance (LoA) (.pdf)
                      </Label>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setLoaFile(e.target.files?.[0] || null)}
                        className="font-sans text-xs border-2 border-black rounded-xl h-10 bg-white file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-black file:text-[10px] file:font-black file:uppercase file:bg-zinc-150 cursor-pointer"
                      />
                      {loaFile && (
                        <p className="text-[10px] font-black text-purple-700 uppercase">
                          Terpilih: {loaFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-black">
                    Catatan untuk Penulis
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tambahkan catatan editorial atau masukan untuk penulis..."
                    className="font-sans text-sm resize-none min-h-[120px] border-2 border-black rounded-xl"
                  />
                </div>

                <div className="pt-4 border-t-2 border-dashed border-black/10 flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !action ||
                      submitting ||
                      (action === "assign" && selectedReviewers.filter(Boolean).length === 0)
                    }
                    className="text-white font-sans font-black uppercase text-xs tracking-wider neo-btn h-10 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]"
                    style={{ backgroundColor: "#7C3AED" }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim...
                      </>
                    ) : (
                      "Kirim Keputusan"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
