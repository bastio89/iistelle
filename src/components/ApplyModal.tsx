"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Company, Job } from "@/lib/types";
import { Modal } from "@/components/ui";
import { CheckCircle2, FileText, X } from "lucide-react";

export default function ApplyModal({
  job,
  company,
  onClose,
}: {
  job: Job;
  company: Company;
  onClose: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    linkedin: "",
    cv_summary: "",
    salary_expectation: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 10 * 1024 * 1024) {
      setError("Die Datei darf maximal 10 MB groß sein.");
      e.target.value = "";
      return;
    }
    setError(null);
    setCvFile(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let cvPath = "";
    if (cvFile) {
      const path = `${company.id}/${Date.now()}-${cvFile.name}`;
      const { error: upErr } = await supabase.storage
        .from("bewerbungen")
        .upload(path, cvFile);
      if (upErr) {
        setError("Der Lebenslauf konnte nicht hochgeladen werden. Bitte versuche es erneut.");
        setSaving(false);
        return;
      }
      cvPath = path;
    }

    const { data: cand, error: cErr } = await supabase
      .from("candidates")
      .insert({
        ...form,
        cv_path: cvPath,
        source: "Karriereseite",
        company_id: company.id,
      })
      .select("id")
      .single();

    if (cErr || !cand) {
      setError("Die Bewerbung konnte nicht übermittelt werden. Bitte versuche es erneut.");
      setSaving(false);
      return;
    }

    const { error: aErr } = await supabase.from("applications").insert({
      job_id: job.id,
      candidate_id: cand.id,
      stage: "eingang",
      salary_expectation: form.salary_expectation,
    });

    if (aErr) {
      setError("Die Bewerbung konnte nicht übermittelt werden. Bitte versuche es erneut.");
      setSaving(false);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <Modal title="Bewerbung eingegangen" onClose={onClose}>
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-500" />
          <p className="mt-4 font-semibold text-petrol-900">
            Vielen Dank, {form.first_name}!
          </p>
          <p className="mt-1 max-w-sm text-sm text-petrol-500">
            Deine Bewerbung auf „{job.title}“ ist bei {company.name} eingegangen.
            Wir melden uns so schnell wie möglich.
          </p>
          <button className="btn-primary mt-6" onClick={onClose}>
            Schließen
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`Bewerbung: ${job.title}`} onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Vorname *</label>
            <input className="input" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required />
          </div>
          <div>
            <label className="label">Nachname *</label>
            <input className="input" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} required />
          </div>
          <div>
            <label className="label">E-Mail *</label>
            <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div>
            <label className="label">Telefon</label>
            <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">Stadt</label>
            <input className="input" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <label className="label">Gehaltsvorstellung</label>
            <input className="input" value={form.salary_expectation} onChange={(e) => set("salary_expectation", e.target.value)} placeholder="z. B. 65.000 €" />
          </div>
        </div>
        <div>
          <label className="label">LinkedIn / Portfolio</label>
          <input className="input" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://…" />
        </div>

        <div>
          <label className="label">Lebenslauf (PDF, max. 10 MB)</label>
          {cvFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-petrol-200 bg-petrol-50/50 px-4 py-3">
              <FileText className="h-5 w-5 shrink-0 text-petrol-500" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-petrol-800">
                {cvFile.name}
              </span>
              <span className="text-xs text-petrol-400">
                {(cvFile.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                type="button"
                onClick={() => setCvFile(null)}
                className="rounded p-1 text-petrol-400 transition hover:bg-rose-50 hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-petrol-300 px-4 py-6 text-center transition hover:border-petrol-500 hover:bg-petrol-50/50">
              <FileText className="h-6 w-6 text-petrol-400" />
              <span className="text-sm font-semibold text-petrol-700">
                Datei auswählen oder hierher ziehen
              </span>
              <span className="text-xs text-petrol-400">PDF empfohlen</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          )}
        </div>

        <div>
          <label className="label">Kurzprofil / Motivation *</label>
          <textarea
            className="input min-h-28"
            value={form.cv_summary}
            onChange={(e) => set("cv_summary", e.target.value)}
            placeholder="Erzähl uns kurz, wer du bist und warum die Rolle zu dir passt…"
            required
          />
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-primary" disabled={saving}>
            {saving ? "Wird übermittelt…" : "Bewerbung absenden"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
