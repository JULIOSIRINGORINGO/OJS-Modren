"use client";

import { useState } from "react";
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
import type { Article } from "@/types";

interface ReviewActionDialogProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
}

export function ReviewActionDialog({
  article,
  open,
  onClose,
}: ReviewActionDialogProps) {
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    console.log("Keputusan:", action, "Catatan:", notes, "Artikel:", article?.id);
    setAction("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-sans">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg" style={{ color: "#09090B" }}>
            Keputusan Tinjauan
          </DialogTitle>
        </DialogHeader>

        {article && (
          <div className="space-y-4 py-2">
            <div
              className="p-3 rounded-lg border"
              style={{ backgroundColor: "#F9FAFB", borderColor: "#E4E4E7" }}
            >
              <p className="text-xs mb-1" style={{ color: "#71717A" }}>
                Artikel
              </p>
              <p className="text-sm font-serif font-medium line-clamp-2" style={{ color: "#09090B" }}>
                {article.title}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-sans">Keputusan</Label>
              <Select onValueChange={(val) => setAction(val ?? "")} value={action}>
                <SelectTrigger className="font-sans text-sm">
                  <SelectValue placeholder="Pilih keputusan..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">✓ Terima</SelectItem>
                  <SelectItem value="revision">↻ Minta Revisi</SelectItem>
                  <SelectItem value="assign">→ Tugaskan Peninjau</SelectItem>
                  <SelectItem value="reject">✕ Tolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-sans">Catatan untuk Penulis</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan editorial atau masukan..."
                className="font-sans text-sm resize-none min-h-[100px]"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-sans">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!action}
            className="text-white font-sans"
            style={{ backgroundColor: "#6366F1" }}
          >
            Kirim Keputusan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
