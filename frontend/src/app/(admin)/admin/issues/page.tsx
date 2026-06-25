"use client";

import { useState, useEffect } from "react";
import { Library, Plus, Calendar, FileText, CheckCircle, Clock, Trash2, Globe, Loader2, ChevronDown, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchIssues, createIssue, updateIssue, deleteIssue, publishIssue, fetchArticles, updateArticleStatus, fetchSetting, updateSetting } from "@/lib/api-client";
import type { Issue, Article } from "@/types";

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [openManage, setOpenManage] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  // Custom Confirmation Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  // DOI Configuration state
  const [doiPrefix, setDoiPrefix] = useState("10.31258");
  const [doiSuffixPattern, setDoiSuffixPattern] = useState("fastjournal");

  // Form states
  const [volume, setVolume] = useState("");
  const [number, setNumber] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchIssues(),
      fetchArticles({ scope: "admin" }),
      fetchSetting("doi_prefix"),
      fetchSetting("doi_suffix_pattern")
    ])
      .then(([issuesData, articlesData, prefix, suffix]) => {
        setIssues(issuesData);
        setArticles(articlesData);
        if (prefix) setDoiPrefix(prefix);
        if (suffix) setDoiSuffixPattern(suffix);
      })
      .catch((err) => console.error("Gagal memuat edisi:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volume || !number || !year || !title) return;
    setSubmitting(true);
    try {
      await Promise.all([
        createIssue({
          volume: `Vol. ${volume}`,
          number: `Edisi ${number}`,
          year,
          title,
          description,
          status: "draft",
        }),
        updateSetting("doi_prefix", doiPrefix),
        updateSetting("doi_suffix_pattern", doiSuffixPattern)
      ]);
      setOpenCreate(false);
      // Reset form
      setVolume("");
      setNumber("");
      setYear(new Date().getFullYear());
      setTitle("");
      setDescription("");
      loadData();
    } catch (err) {
      console.error("Gagal membuat edisi:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (issue: Issue) => {
    const volNum = issue.volume ? issue.volume.replace(/\D/g, "") : "";
    const numNum = issue.number ? issue.number.replace(/\D/g, "") : "";
    
    setVolume(volNum);
    setNumber(numNum);
    setYear(issue.year);
    setTitle(issue.title);
    setDescription(issue.description || "");
    setEditingIssue(issue);
    setOpenEdit(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue || !volume || !number || !year || !title) return;
    setSubmitting(true);
    try {
      await Promise.all([
        updateIssue(editingIssue.id, {
          volume: `Vol. ${volume}`,
          number: `Edisi ${number}`,
          year,
          title,
          description,
        }),
        updateSetting("doi_prefix", doiPrefix),
        updateSetting("doi_suffix_pattern", doiSuffixPattern)
      ]);
      setOpenEdit(false);
      setEditingIssue(null);
      setVolume("");
      setNumber("");
      setYear(new Date().getFullYear());
      setTitle("");
      setDescription("");
      loadData();
    } catch (err) {
      console.error("Gagal memperbarui edisi:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id: string | number) => {
    triggerConfirm(
      "Terbitkan Edisi Secara Online?",
      "Apakah Anda yakin ingin menerbitkan edisi ini secara online? Semua naskah di dalamnya akan otomatis berstatus Published.",
      async () => {
        try {
          await publishIssue(id);
          loadData();
        } catch (err) {
          console.error("Gagal menerbitkan edisi:", err);
        }
      }
    );
  };

  const handleDelete = async (id: string | number) => {
    triggerConfirm(
      "Hapus Edisi Jurnal?",
      "Apakah Anda yakin ingin menghapus edisi ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await deleteIssue(id);
          loadData();
        } catch (err) {
          console.error("Gagal menghapus edisi:", err);
        }
      }
    );
  };

  const handleManageArticles = (issue: Issue) => {
    setSelectedIssue(issue);
    setOpenManage(true);
  };

  const toggleArticleAssignment = async (articleId: string, assign: boolean) => {
    if (!selectedIssue) return;
    try {
      await updateArticleStatus(
        articleId,
        assign ? "Published" : "Production", // If assigned, publish or send back
        undefined,
        undefined,
        undefined,
        undefined,
        assign ? selectedIssue.id : ""
      );
      loadData();
      // Update local selectedIssue count
      const updatedIssue = await fetchIssues().then(list => list.find(i => String(i.id) === String(selectedIssue.id)));
      if (updatedIssue) setSelectedIssue(updatedIssue);
    } catch (err) {
      console.error("Gagal menugaskan naskah:", err);
    }
  };

  const total = issues.length;
  const publishedCount = issues.filter((i) => i.status === "published").length;
  const draftCount = issues.filter((i) => i.status === "draft").length;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Manajemen Edisi Jurnal"
        subtitle="Atur volume, nomor edisi, dan jadwal penerbitan naskah berkala."
        icon={Library}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <StatsCard title="Total Edisi" value={total} icon={Library} color="indigo" />
            <StatsCard title="Edisi Terbit" value={publishedCount} icon={CheckCircle} color="emerald" />
            <StatsCard title="Edisi Draft" value={draftCount} icon={Clock} color="amber" />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-[16px] font-black uppercase tracking-wider text-foreground">Daftar Volume & Nomor Edisi</h2>
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Kelola arsip jurnal berkala</p>
            </div>
            <Button 
              onClick={() => setOpenCreate(true)} 
              className="h-10 text-[11px] font-black uppercase tracking-wider neo-btn rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2 stroke-[2.5px]" /> Buat Edisi Baru
            </Button>
          </div>

          {/* Table Container */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Memuat daftar edisi...</span>
            </div>
          ) : (
            <div className="bg-card rounded-2xl overflow-hidden neo-border neo-shadow">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-50/50 border-b-[3px] border-sidebar-border">
                    {["Volume & No", "Judul Edisi", "Tanggal Terbit", "Jumlah Artikel", "Status", "Aksi"].map((header) => (
                      <TableHead key={header} className="font-black text-[10px] uppercase tracking-wider text-muted-foreground py-4">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y-2 divide-sidebar-border">
                  {issues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Belum ada edisi yang dibuat. Silakan buat edisi baru.
                      </TableCell>
                    </TableRow>
                  ) : (
                    issues.map((issue) => (
                      <TableRow key={issue.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/5 transition-colors">
                        <TableCell className="py-4">
                          <span className="text-[13px] font-black text-foreground">
                            {issue.volume} · {
                              issue.number.toLowerCase().startsWith("no") || 
                              issue.number.toLowerCase().startsWith("edisi") 
                                ? issue.number 
                                : `No. ${issue.number}`
                            }
                          </span>
                          <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Tahun {issue.year}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-[13px] font-bold text-foreground leading-snug line-clamp-1">{issue.title}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                            {issue.published_at ? new Date(issue.published_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-[13px] font-black text-primary uppercase tracking-wider">{issue.articlesCount || 0} Naskah</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-extrabold px-2.5 py-0.5 border-2 border-black rounded-lg uppercase tracking-wider ${
                              issue.status === "published"
                                ? "bg-emerald-100 text-emerald-805"
                                : "bg-amber-100 text-amber-850"
                            }`}
                          >
                            {issue.status === "published" ? "Diterbitkan" : "Konsep (Draft)"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 px-3 text-[10px] font-black uppercase tracking-wider border-2 border-black bg-white hover:bg-zinc-50 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-1.5 outline-none">
                              Pilih Aksi <ChevronDown className="w-3 h-3 stroke-[2.5px]" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="font-sans text-xs border-2 border-black bg-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-1 min-w-[140px] z-50">
                              <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => handleManageArticles(issue)}>
                                <FileText className="w-3.5 h-3.5 mr-1.5 text-zinc-500" /> Atur Naskah
                              </DropdownMenuItem>
                              <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => handleEditOpen(issue)}>
                                <Pencil className="w-3.5 h-3.5 mr-1.5 text-zinc-500" /> Edit Edisi
                              </DropdownMenuItem>
                              {issue.status === "draft" && (
                                <DropdownMenuItem className="font-bold cursor-pointer text-emerald-600 focus:text-emerald-700" onClick={() => handlePublish(issue.id)}>
                                  <Globe className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Terbitkan
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem variant="destructive" className="font-bold cursor-pointer" onClick={() => handleDelete(issue.id)}>
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus Edisi
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Create Issue */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-2xl font-sans border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6">
          <DialogHeader>
            <DialogTitle className="font-black text-lg uppercase tracking-wider text-black border-b-2 border-black pb-2">
              Buat Edisi Jurnal Baru
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Issue Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase bg-indigo-100 text-indigo-750 px-2 py-0.5 rounded border border-black">Langkah 1</span>
                  <Label className="text-[10px] font-black uppercase tracking-wider text-black">Informasi Edisi</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Volume (Angka Saja)</Label>
                    <Input 
                      type="text"
                      pattern="[0-9]*"
                      value={volume} 
                      onChange={(e) => setVolume(e.target.value.replace(/\D/g, ""))} 
                      placeholder="Contoh: 12" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Nomor Edisi (Angka Saja)</Label>
                    <Input 
                      type="text"
                      pattern="[0-9]*"
                      value={number} 
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} 
                      placeholder="Contoh: 2" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Tahun Terbit</Label>
                    <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} required className="border-2 border-black rounded-xl h-9 text-xs font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Judul Edisi</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul fokus edisi..." required className="border-2 border-black rounded-xl h-9 text-xs font-semibold" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Deskripsi (Opsional)</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi mengenai edisi terbitan ini..." className="border-2 border-black rounded-xl resize-none min-h-[70px] text-xs font-semibold" />
                </div>
              </div>

              {/* Right Column: DOI Settings */}
              <div className="space-y-3 md:border-l-2 md:border-dashed md:border-black/15 md:pl-6">
                <div className="flex items-center gap-1.5 justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-750 px-2 py-0.5 rounded border border-black">Langkah 2</span>
                    <Label className="text-[10px] font-black uppercase tracking-wider text-purple-750">Pengaturan DOI Jurnal</Label>
                  </div>
                  <span className="text-[8px] font-black uppercase bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-black">Global</span>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Prefix DOI (misal: 10.31258)</Label>
                    <Input 
                      value={doiPrefix} 
                      onChange={(e) => setDoiPrefix(e.target.value)} 
                      placeholder="10.31258" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Pola Suffix / Kode Suffix Jurnal</Label>
                    <Input 
                      value={doiSuffixPattern} 
                      onChange={(e) => setDoiSuffixPattern(e.target.value)} 
                      placeholder="fastjournal" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                  
                  <div className="bg-purple-50/50 border-2 border-black/15 rounded-xl p-3 space-y-1">
                    <span className="text-[8px] font-black text-purple-800 uppercase tracking-wider">Live Preview Format DOI Otomatis:</span>
                    <p className="text-[10px] font-black text-purple-950 break-all select-all bg-white p-2 border border-black rounded-lg">
                      {doiPrefix}/{doiSuffixPattern}.v{volume.replace(/\D/g, "") || "X"}i{number.replace(/\D/g, "") || "Y"}.[ID_Artikel]
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t-2 border-black/10 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setOpenCreate(false)} className="font-sans font-black text-xs uppercase tracking-wider neo-btn h-10 border-2 border-black rounded-xl">
                Batal
              </Button>
              <Button type="submit" disabled={submitting} className="text-white font-sans font-black text-xs uppercase tracking-wider neo-btn h-10 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]" style={{ backgroundColor: "#7C3AED" }}>
                {submitting ? "Membuat..." : "Simpan Edisi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Issue */}
      <Dialog open={openEdit} onOpenChange={(val) => {
        setOpenEdit(val);
        if (!val) {
          setEditingIssue(null);
          setVolume("");
          setNumber("");
          setYear(new Date().getFullYear());
          setTitle("");
          setDescription("");
        }
      }}>
        <DialogContent className="sm:max-w-2xl font-sans border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6">
          <DialogHeader>
            <DialogTitle className="font-black text-lg uppercase tracking-wider text-black border-b-2 border-black pb-2">
              Edit Edisi Jurnal
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Issue Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase bg-indigo-100 text-indigo-750 px-2 py-0.5 rounded border border-black">Langkah 1</span>
                  <Label className="text-[10px] font-black uppercase tracking-wider text-black">Informasi Edisi</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Volume (Angka Saja)</Label>
                    <Input 
                      type="text"
                      pattern="[0-9]*"
                      value={volume} 
                      onChange={(e) => setVolume(e.target.value.replace(/\D/g, ""))} 
                      placeholder="Contoh: 12" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Nomor Edisi (Angka Saja)</Label>
                    <Input 
                      type="text"
                      pattern="[0-9]*"
                      value={number} 
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} 
                      placeholder="Contoh: 2" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Tahun Terbit</Label>
                    <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} required className="border-2 border-black rounded-xl h-9 text-xs font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Judul Edisi</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul fokus edisi..." required className="border-2 border-black rounded-xl h-9 text-xs font-semibold" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Deskripsi (Opsional)</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi mengenai edisi terbitan ini..." className="border-2 border-black rounded-xl resize-none min-h-[70px] text-xs font-semibold" />
                </div>
              </div>

              {/* Right Column: DOI Settings */}
              <div className="space-y-3 md:border-l-2 md:border-dashed md:border-black/15 md:pl-6">
                <div className="flex items-center gap-1.5 justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-750 px-2 py-0.5 rounded border border-black">Langkah 2</span>
                    <Label className="text-[10px] font-black uppercase tracking-wider text-purple-750">Pengaturan DOI Jurnal</Label>
                  </div>
                  <span className="text-[8px] font-black uppercase bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-black">Global</span>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Prefix DOI (misal: 10.31258)</Label>
                    <Input 
                      value={doiPrefix} 
                      onChange={(e) => setDoiPrefix(e.target.value)} 
                      placeholder="10.31258" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Pola Suffix / Kode Suffix Jurnal</Label>
                    <Input 
                      value={doiSuffixPattern} 
                      onChange={(e) => setDoiSuffixPattern(e.target.value)} 
                      placeholder="fastjournal" 
                      required 
                      className="border-2 border-black rounded-xl h-9 text-xs font-semibold" 
                    />
                  </div>
                  
                  <div className="bg-purple-50/50 border-2 border-black/15 rounded-xl p-3 space-y-1">
                    <span className="text-[8px] font-black text-purple-800 uppercase tracking-wider">Live Preview Format DOI Otomatis:</span>
                    <p className="text-[10px] font-black text-purple-950 break-all select-all bg-white p-2 border border-black rounded-lg">
                      {doiPrefix}/{doiSuffixPattern}.v{volume.replace(/\D/g, "") || "X"}i{number.replace(/\D/g, "") || "Y"}.[ID_Artikel]
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t-2 border-black/10 flex justify-end">
              <Button type="button" variant="outline" onClick={() => {
                setOpenEdit(false);
                setEditingIssue(null);
                setVolume("");
                setNumber("");
                setYear(new Date().getFullYear());
                setTitle("");
                setDescription("");
              }} className="font-sans font-black text-xs uppercase tracking-wider neo-btn h-10 border-2 border-black rounded-xl">
                Batal
              </Button>
              <Button type="submit" disabled={submitting} className="text-white font-sans font-black text-xs uppercase tracking-wider neo-btn h-10 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]" style={{ backgroundColor: "#7C3AED" }}>
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Manage Articles in Issue */}
      <Dialog open={openManage} onOpenChange={setOpenManage}>
        <DialogContent className="sm:max-w-xl font-sans border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-black text-lg uppercase tracking-wider text-black">
              Kelola Naskah Edisi: {selectedIssue?.volume} No. {selectedIssue?.number}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
            <div className="p-3 bg-purple-50/50 border-2 border-black rounded-xl text-xs font-bold leading-relaxed text-purple-900">
              Pilih naskah yang berstatus <strong>Production</strong> atau <strong>Published</strong> untuk dikaitkan ke edisi terbitan ini.
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-black">Naskah Terpilih dalam Edisi ini</p>
              {articles.filter(a => String(a.issue_id) === String(selectedIssue?.id)).length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-1">Belum ada naskah dikaitkan.</p>
              ) : (
                <div className="space-y-2">
                  {articles.filter(a => String(a.issue_id) === String(selectedIssue?.id)).map(article => (
                    <div key={article.id} className="flex justify-between items-center p-3 border-2 border-black bg-emerald-50 rounded-xl">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-xs font-black text-foreground truncate">{article.title}</p>
                        <p className="text-[10px] font-bold text-muted-foreground truncate uppercase">{article.authors.join(", ")}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleArticleAssignment(article.id, false)}
                        className="h-8 text-[9px] font-black uppercase border-2 border-black bg-rose-150 hover:bg-rose-250 text-rose-700 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all shrink-0"
                      >
                        Keluarkan
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 border-t-2 border-dashed border-black/10 pt-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-black">Daftar Naskah Siap Terbit (Antrean Produksi)</p>
              {articles.filter(a => (!a.issue_id || a.issue_id === "") && ["Production", "Accepted", "Copyediting"].includes(a.status)).length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-1">Tidak ada naskah dalam antrean produksi.</p>
              ) : (
                <div className="space-y-2">
                  {articles.filter(a => (!a.issue_id || a.issue_id === "") && ["Production", "Accepted", "Copyediting"].includes(a.status)).map(article => (
                    <div key={article.id} className="flex justify-between items-center p-3 border-2 border-black bg-white rounded-xl">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-xs font-bold text-foreground truncate">{article.title}</p>
                        <p className="text-[10px] font-medium text-muted-foreground truncate uppercase">{article.authors.join(", ")} · <span className="text-primary font-bold">{article.status}</span></p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => toggleArticleAssignment(article.id, true)}
                        className="h-8 text-[9px] font-black uppercase border-2 border-black bg-purple-50 hover:bg-purple-100 text-purple-750 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all shrink-0"
                      >
                        Masukkan
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t-2 border-black/10 pt-4">
            <Button onClick={() => setOpenManage(false)} className="w-full font-sans font-black text-xs uppercase tracking-wider neo-btn h-10 border-2 border-black rounded-xl">
              Selesai & Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md font-sans border-3 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6">
          <DialogHeader>
            <DialogTitle className="font-black text-lg uppercase tracking-wider text-black">
              {confirmTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-wide leading-relaxed">
              {confirmMessage}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="font-sans font-black text-[10px] uppercase tracking-wider neo-btn h-10 border-2 border-black rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (confirmAction) confirmAction();
                setConfirmOpen(false);
              }}
              className="text-white font-sans font-black text-[10px] uppercase tracking-wider neo-btn h-10 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] bg-rose-500 hover:bg-rose-650 shrink-0 px-4"
            >
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
