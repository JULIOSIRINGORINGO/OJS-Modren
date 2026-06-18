"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { updateReviewAssignment } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

interface ReviewFormDialogProps {
  assignmentId: string;
  articleId: string;
  articleTitle: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: (newStatus: string) => void;
  readOnly?: boolean;
}

export function ReviewFormDialog({
  assignmentId,
  articleId,
  articleTitle,
  open,
  onClose,
  onSuccess,
  readOnly = false,
}: ReviewFormDialogProps) {
  const [recommendation, setRecommendation] = useState("");
  const [comments, setComments] = useState("");
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setRecommendation("");
      setComments("");
      setReviewFile(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!assignmentId || !recommendation || readOnly) return;
    setSubmitting(true);
    try {
      await updateReviewAssignment(assignmentId, {
        recommendation,
        comments,
        review_file: reviewFile ? reviewFile.name : undefined
      });
      
      setRecommendation("");
      setComments("");
      setReviewFile(null);
      
      if (onSuccess) {
        onSuccess(recommendation);
      }
      onClose();
    } catch (err) {
      console.error("Gagal mengirim hasil review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-sans border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] p-6">
        <DialogHeader>
          <DialogTitle className="font-black text-lg uppercase tracking-wider text-black">
            {readOnly ? "Hasil Evaluasi Review" : "Kirim Evaluasi Review (Peer Review)"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div
            className="p-4 rounded-xl border-2 border-black bg-purple-50/30 text-foreground"
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
              Judul Naskah
            </p>
            <p className="text-[13px] font-extrabold line-clamp-2">
              {articleTitle}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/articles/${articleId}/pdf`, "_blank")}
                className="w-full flex items-center justify-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-yellow-250 text-black hover:bg-yellow-300 transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
              >
                Baca Naskah Lengkap
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([`Mock article file download for ${articleTitle} (original)`], { type: "application/octet-stream" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "naskah_asli.docx";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-cyan-300 text-black hover:bg-cyan-400 transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
              >
                Unduh File Asli
              </Button>
            </div>
          </div>

          {readOnly ? (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-wider">
                Peninjauan telah selesai dilakukan dan naskah sudah diproses oleh Editor.
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-wider text-black">Rekomendasi Peninjau</Label>
                <Select onValueChange={(val) => setRecommendation(val ?? "")} value={recommendation}>
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
                <Label className="text-[10px] font-black uppercase tracking-wider text-black">Catatan Evaluasi / Ulasan</Label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Berikan ulasan akademis konstruktif mengenai kelebihan dan kelemahan naskah..."
                  className="font-sans text-sm resize-none min-h-[120px] border-2 border-black rounded-xl"
                  required
                />
              </div>

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
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="font-sans font-black uppercase text-xs tracking-wider neo-btn h-10 border-2 border-black rounded-xl">
            Tutup
          </Button>
          {!readOnly && (
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
