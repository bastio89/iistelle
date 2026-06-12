"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CompanyFile,
  CompanyFileCategory,
  COMPANY_FILE_CATEGORY_META,
} from "@/lib/types";
import { EmptyState, PageHeader, formatDate } from "@/components/ui";
import { Download, FileText, Trash2, Upload } from "lucide-react";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function CompanyFilesPage() {
  const supabase = createClient();
  const [files, setFiles] = useState<CompanyFile[]>([]);
  const [filter, setFilter] = useState<CompanyFileCategory | "alle">("alle");
  const [category, setCategory] = useState<CompanyFileCategory>("richtlinie");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("company_files")
      .select("*")
      .order("created_at", { ascending: false });
    setFiles((data as CompanyFile[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `firma/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("dokumente")
      .upload(path, file);
    if (!upErr) {
      await supabase.from("company_files").insert({
        name: file.name,
        category,
        storage_path: path,
        size_bytes: file.size,
      });
    }
    setUploading(false);
    e.target.value = "";
    load();
  }

  async function download(f: CompanyFile) {
    const { data } = await supabase.storage
      .from("dokumente")
      .createSignedUrl(f.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function remove(f: CompanyFile) {
    if (!confirm(`„${f.name}" wirklich löschen?`)) return;
    await supabase.storage.from("dokumente").remove([f.storage_path]);
    await supabase.from("company_files").delete().eq("id", f.id);
    load();
  }

  const filtered = filter === "alle" ? files : files.filter((f) => f.category === filter);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Dokumente…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Firmendokumente"
        subtitle="Richtlinien, Vorlagen und Handbücher zentral für das ganze Team."
      />

      <div className="card mb-6 flex flex-wrap items-end gap-3 p-5">
        <div>
          <label className="label">Kategorie</label>
          <select
            className="input w-44"
            value={category}
            onChange={(e) => setCategory(e.target.value as CompanyFileCategory)}
          >
            {Object.entries(COMPANY_FILE_CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
        <label className="btn-primary cursor-pointer">
          <Upload className="h-4 w-4" />
          {uploading ? "Lädt hoch…" : "Datei hochladen"}
          <input type="file" className="hidden" onChange={upload} disabled={uploading} />
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["alle", "Alle"],
            ...Object.entries(COMPANY_FILE_CATEGORY_META).map(
              ([key, meta]) => [key, meta.label] as const
            ),
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key as CompanyFileCategory | "alle")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === key
                ? "bg-petrol-800 text-white"
                : "bg-white text-petrol-600 shadow-card hover:bg-petrol-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Keine Dokumente in dieser Ansicht"
          hint="Lade Richtlinien, Vorlagen oder Handbücher hoch, damit dein Team sie findet."
        />
      ) : (
        <div className="card divide-y divide-petrol-50">
          {filtered.map((f) => {
            const meta = COMPANY_FILE_CATEGORY_META[f.category];
            return (
              <div key={f.id} className="group flex items-center gap-3 px-5 py-3.5">
                <FileText className="h-5 w-5 shrink-0 text-petrol-300" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-petrol-900">
                    {f.name}
                  </p>
                  <p className="text-xs text-petrol-400">
                    {formatBytes(f.size_bytes)} · hochgeladen {formatDate(f.created_at)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.color}`}
                >
                  {meta.label}
                </span>
                <button
                  onClick={() => download(f)}
                  className="rounded p-1.5 text-petrol-300 transition hover:bg-petrol-50 hover:text-petrol-700"
                  title="Herunterladen"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(f)}
                  className="rounded p-1.5 text-petrol-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                  title="Löschen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
