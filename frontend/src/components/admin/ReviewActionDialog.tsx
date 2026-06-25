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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateArticleStatus, fetchUsers } from "@/lib/api-client";
import type { Article } from "@/types";
import { Loader2, Plus, X, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewActionDialogProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: (newStatus: Article["status"]) => void;
}

interface ReviewerUser {
  id: number | string;
  name: string;
  email: string;
  institution: string;
}

export function ReviewActionDialog({
  article,
  open,
  onClose,
  onSuccess,
}: ReviewActionDialogProps) {
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reviewer assignment states
  const [allReviewers, setAllReviewers] = useState<ReviewerUser[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<ReviewerUser[]>([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [loadingReviewers, setLoadingReviewers] = useState(false);
  const [slots, setSlots] = useState(1); // number of reviewer slots

  // Fetch reviewers when dialog opens and action is "assign"
  useEffect(() => {
    if (open && action === "assign" && allReviewers.length === 0) {
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
  }, [open, action, allReviewers.length]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setAction("");
      setNotes("");
      setSelectedReviewers([]);
      setSlots(1);
      setShowAddSlot(false);
      setAllReviewers([]);
    }
  }, [open]);

  const statusMap: Record<string, string> = {
    approve: "Published",
    revision: "Revision Required",
    reject: "Rejected",
    assign: "Reviewer Assigned",
    copyedit: "Copyediting",
    production: "Production",
  };

  const handleSubmit = async () => {
    if (!article || !action) return;
    if (action === "assign" && selectedReviewers.length === 0) return;

    setSubmitting(true);
    try {
      const newStatus = statusMap[action] || "Under Review";
      const fullNotes = action === "assign" ? "" : notes;

      const reviewerIds = action === "assign"
        ? selectedReviewers.filter(Boolean).map(r => String(r.id))
        : undefined;

      await updateArticleStatus(
        article.id,
        newStatus,
        fullNotes,
        undefined,
        undefined,
        reviewerIds
      );

      if (onSuccess) {
        onSuccess(newStatus as Article["status"]);
      }
      onClose();
    } catch (err) {
      console.error("Gagal mengirim keputusan:", err);
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

  // Reviewers already selected (to prevent duplicates)
  const selectedIds = new Set(selectedReviewers.map((r) => r?.id?.toString()));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-sans border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] p-6">
        <DialogHeader>
          <DialogTitle className="font-black text-lg uppercase tracking-wider text-black">
            Keputusan Tinjauan
          </DialogTitle>
        </DialogHeader>

        {article && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl border-2 border-black bg-purple-50/30 text-foreground">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                Artikel
              </p>
              <p className="text-[13px] font-extrabold line-clamp-2">
                {article.title}
              </p>
              <div className="mt-3">
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
                  className="w-full flex items-center justify-center gap-1.5 h-8 text-[10px] font-black uppercase tracking-wider border-2 border-black rounded-lg bg-yellow-200 text-black hover:bg-yellow-300 transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
                >
                  Baca Naskah Lengkap
                </Button>
              </div>
            </div>

            {article.review_assignments && article.review_assignments.length > 0 && (
              <div className="space-y-2 border-2 border-black p-4 rounded-xl bg-yellow-50/50">
                <p className="text-[10px] font-black uppercase tracking-wider text-purple-700">Hasil Ulasan Peer Review</p>
                <div className="space-y-2.5 max-h-36 overflow-y-auto divide-y-2 divide-black/10 pr-1">
                  {article.review_assignments.map((ra: any) => (
                    <div key={ra.id} className="pt-2.5 first:pt-0 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-foreground">{ra.reviewer_name}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black rounded-lg ${
                          ra.recommendation === 'accept' ? 'bg-emerald-300 text-black' :
                          ra.recommendation === 'revision' ? 'bg-amber-300 text-black' :
                          ra.recommendation === 'reject' ? 'bg-rose-300 text-black' :
                          'bg-zinc-200 text-black'
                        }`}>
                          {ra.recommendation ? ra.recommendation.toUpperCase() : 'BELUM MERESPON'}
                        </span>
                      </div>
                      {ra.comments && (
                        <p className="text-zinc-600 italic font-medium mt-0.5 bg-white p-2 border border-black rounded-lg">"{ra.comments}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-wider text-black">Keputusan</Label>
              <Select
                onValueChange={(val) => setAction(val ?? "")}
                value={action}
              >
                <SelectTrigger className="font-sans text-sm w-full border-2 border-black rounded-xl h-10 bg-white">
                  <SelectValue placeholder="Pilih keputusan..." />
                </SelectTrigger>
                <SelectContent className="border-2 border-black rounded-xl">
                  <SelectItem value="assign">
                    Reviewer Sedang Ditugaskan
                  </SelectItem>
                  <SelectItem value="revision">Minta Revisi</SelectItem>
                  <SelectItem value="copyedit">
                    Kirim ke Copyediting
                  </SelectItem>
                  <SelectItem value="production">
                    Kirim ke Produksi
                  </SelectItem>
                  <SelectItem value="approve">
                    Terima &amp; Terbitkan
                  </SelectItem>
                  <SelectItem value="reject">Tolak Naskah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reviewer Picker - only shown when action is "assign" */}
            {action === "assign" && (
              <div className="space-y-3">
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
                    <span className="text-xs text-muted-foreground">
                      Memuat daftar reviewer...
                    </span>
                  </div>
                ) : allReviewers.length === 0 ? (
                  <div className="p-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 text-center">
                    <p className="text-xs font-bold text-amber-700">
                      Tidak ada reviewer terdaftar dalam sistem.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Array.from({ length: slots }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            value={
                              selectedReviewers[index]?.id?.toString() || ""
                            }
                            onValueChange={(val) =>
                              handleSelectReviewer(index, val || "")
                            }
                          >
                            <SelectTrigger className="font-sans text-sm w-full border-2 border-black rounded-xl h-10 bg-white">
                              <SelectValue
                                placeholder={`Reviewer ${index + 1}...`}
                              />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-black rounded-xl">
                              {allReviewers
                                .filter(
                                  (r) =>
                                    !selectedIds.has(r.id.toString()) ||
                                    selectedReviewers[index]?.id?.toString() === r.id.toString()
                                )
                                .map((reviewer) => (
                                  <SelectItem
                                    key={reviewer.id}
                                    value={reviewer.id.toString()}
                                  >
                                    {reviewer.name} ({reviewer.institution})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Remove button - only show on additional slots */}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 border-black bg-red-200 text-black hover:bg-red-300 transition-colors shadow-[2px_2px_0px_0px_#000]"
                            title="Hapus slot"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add more reviewer button */}
                    {slots < allReviewers.length && (
                      <button
                        type="button"
                        onClick={addSlot}
                        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-dashed border-black bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Reviewer
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {action !== "assign" && (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-wider text-black">
                  Catatan untuk Penulis
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan editorial atau masukan..."
                  className="font-sans text-sm resize-none min-h-[100px] border-2 border-black rounded-xl"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="font-sans font-black uppercase text-xs tracking-wider neo-btn h-10 border-2 border-black rounded-xl">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !action ||
              submitting ||
              (action === "assign" &&
                selectedReviewers.filter(Boolean).length === 0)
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
