"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, CheckCircle, Loader2 } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { fetchSetting, updateSetting } from "@/lib/api-client";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Journal Identity States
  const [journalName, setJournalName] = useState("FAST-Journal");
  const [journalAbbr, setJournalAbbr] = useState("FASTJ");
  const [journalDesc, setJournalDesc] = useState("Platform modern untuk penerbitan akademik, tinjauan sejawat, dan diseminasi akses terbuka.");
  const [issnPrint, setIssnPrint] = useState("2580-1234");
  const [issnOnline, setIssnOnline] = useState("2580-5678");

  // Publication States
  const [currentVolume, setCurrentVolume] = useState("12");
  const [currentIssue, setCurrentIssue] = useState("2");
  const [editorialEmail, setEditorialEmail] = useState("redaksi@fastjournal.id");

  // Peer Review States
  const [reviewersPerManuscript, setReviewersPerManuscript] = useState("2");
  const [reviewDurationDays, setReviewDurationDays] = useState("30");

  // DOI Configuration States
  const [doiPrefix, setDoiPrefix] = useState("10.31258");
  const [doiSuffixPattern, setDoiSuffixPattern] = useState("fastjournal");

  useEffect(() => {
    async function loadSettings() {
      try {
        const name = await fetchSetting("journal_name");
        if (name) setJournalName(name);

        const abbr = await fetchSetting("journal_abbr");
        if (abbr) setJournalAbbr(abbr);

        const desc = await fetchSetting("journal_desc");
        if (desc) setJournalDesc(desc);

        const print = await fetchSetting("issn_print");
        if (print) setIssnPrint(print);

        const online = await fetchSetting("issn_online");
        if (online) setIssnOnline(online);

        const volume = await fetchSetting("current_volume");
        if (volume) setCurrentVolume(volume);

        const issue = await fetchSetting("current_issue");
        if (issue) setCurrentIssue(issue);

        const email = await fetchSetting("editorial_email");
        if (email) setEditorialEmail(email);

        const reviewers = await fetchSetting("reviewers_per_manuscript");
        if (reviewers) setReviewersPerManuscript(reviewers);

        const duration = await fetchSetting("review_duration_days");
        if (duration) setReviewDurationDays(duration);

        const prefix = await fetchSetting("doi_prefix");
        if (prefix) setDoiPrefix(prefix);

        const suffix = await fetchSetting("doi_suffix_pattern");
        if (suffix) setDoiSuffixPattern(suffix);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSetting("journal_name", journalName),
        updateSetting("journal_abbr", journalAbbr),
        updateSetting("journal_desc", journalDesc),
        updateSetting("issn_print", issnPrint),
        updateSetting("issn_online", issnOnline),
        updateSetting("current_volume", currentVolume),
        updateSetting("current_issue", currentIssue),
        updateSetting("editorial_email", editorialEmail),
        updateSetting("reviewers_per_manuscript", reviewersPerManuscript),
        updateSetting("review_duration_days", reviewDurationDays),
        updateSetting("doi_prefix", doiPrefix),
        updateSetting("doi_suffix_pattern", doiSuffixPattern),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardNavbar
        title="Pengaturan Jurnal"
        subtitle="Konfigurasi informasi dan preferensi jurnal."
        icon={Settings}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          {saved && (
            <div
              className="flex items-center gap-2 p-4 rounded-xl mb-6 border"
              style={{ backgroundColor: "rgba(5,150,105,0.06)", borderColor: "rgba(5,150,105,0.2)" }}
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium font-sans" style={{ color: "#065F46" }}>
                Pengaturan berhasil disimpan ke Database.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-3 text-sm font-bold text-muted-foreground">Memuat pengaturan...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Identitas Jurnal */}
              <div
                className="bg-white/95 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 shadow-sm"
                style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
              >
                <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                  Identitas Jurnal
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Nama Jurnal</Label>
                      <Input
                        value={journalName}
                        onChange={(e) => setJournalName(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Singkatan</Label>
                      <Input
                        value={journalAbbr}
                        onChange={(e) => setJournalAbbr(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Deskripsi Jurnal</Label>
                    <Textarea
                      value={journalDesc}
                      onChange={(e) => setJournalDesc(e.target.value)}
                      className="font-sans resize-none"
                      style={{ minHeight: "80px" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">ISSN (Cetak)</Label>
                      <Input
                        value={issnPrint}
                        onChange={(e) => setIssnPrint(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">ISSN (Online)</Label>
                      <Input
                        value={issnOnline}
                        onChange={(e) => setIssnOnline(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pengaturan Publikasi */}
              <div
                className="bg-white/95 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 shadow-sm"
                style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
              >
                <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                  Pengaturan Publikasi
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Volume Saat Ini</Label>
                      <Input
                        value={currentVolume}
                        onChange={(e) => setCurrentVolume(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Edisi Saat Ini</Label>
                      <Input
                        value={currentIssue}
                        onChange={(e) => setCurrentIssue(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-sans text-sm">Email Redaksi</Label>
                    <Input
                      value={editorialEmail}
                      onChange={(e) => setEditorialEmail(e.target.value)}
                      type="email"
                      className="font-sans"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Konfigurasi DOI */}
              <div
                className="bg-white/95 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 shadow-sm"
                style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
              >
                <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                  Konfigurasi DOI (Digital Object Identifier)
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Prefix DOI (misal: 10.31258)</Label>
                      <Input
                        value={doiPrefix}
                        onChange={(e) => setDoiPrefix(e.target.value)}
                        className="font-sans"
                        placeholder="10.xxxx"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Pola Suffix DOI / Kode Jurnal (misal: fastjournal)</Label>
                      <Input
                        value={doiSuffixPattern}
                        onChange={(e) => setDoiSuffixPattern(e.target.value)}
                        className="font-sans"
                        placeholder="kodejurnal"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    Format DOI yang akan dihasilkan secara otomatis: <span className="text-purple-650 font-extrabold">{doiPrefix}/{doiSuffixPattern}.v[Volume]i[Edisi].[ID_Artikel]</span>
                  </p>
                </div>
              </div>

              <Separator />

              {/* Pengaturan Tinjauan */}
              <div
                className="bg-white/95 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 shadow-sm"
                style={{ borderColor: "rgba(139, 92, 246, 0.15)" }}
              >
                <h2 className="font-serif text-base font-semibold mb-4" style={{ color: "#09090B" }}>
                  Konfigurasi Tinjauan Sejawat
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Jumlah Peninjau per Naskah</Label>
                      <Input
                        value={reviewersPerManuscript}
                        onChange={(e) => setReviewersPerManuscript(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-sans text-sm">Batas Waktu Tinjauan (hari)</Label>
                      <Input
                        value={reviewDurationDays}
                        onChange={(e) => setReviewDurationDays(e.target.value)}
                        className="font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="text-white font-sans px-8"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Pengaturan"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
