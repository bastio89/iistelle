"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Company, Job } from "@/lib/types";
import { Modal } from "@/components/ui";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  X,
} from "lucide-react";

export default function CareerPage() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deptFilter, setDeptFilter] = useState("alle");
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      setCompany((c as Company) ?? null);
      if (c) {
        const { data } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", (c as Company).id)
          .eq("status", "veroeffentlicht")
          .order("created_at", { ascending: false });
        setJobs((data as Job[]) ?? []);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-petrol-400">Lade Karriereseite…</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <h1 className="text-2xl font-bold text-petrol-900">Seite nicht gefunden</h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Unter dieser Adresse gibt es keine Karriereseite. Bitte prüfe den Link.
        </p>
      </div>
    );
  }

  const departments = Array.from(new Set(jobs.map((j) => j.department))).sort();
  const filtered =
    deptFilter === "alle" ? jobs : jobs.filter((j) => j.department === deptFilter);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-petrol-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 font-black text-white">
              {company.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-lg font-bold text-white">{company.name}</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold text-petrol-300 transition hover:text-white"
          >
            Mitarbeiter-Login
          </Link>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-14 pt-10">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white">
            Werde Teil unseres Teams
          </h1>
          <p className="mt-3 max-w-xl text-petrol-200">
            Finde die Rolle, die zu dir passt – die Bewerbung dauert keine zwei
            Minuten, Lebenslauf einfach anhängen.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-petrol-900">
            Offene Stellen ({filtered.length})
          </h2>
          <select
            className="input w-auto"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="alle">Alle Bereiche</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-petrol-500">
            Aktuell sind keine Stellen ausgeschrieben. Schau bald wieder vorbei!
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="card flex flex-wrap items-center justify-between gap-4 p-5 transition hover:shadow-cardHover"
              >
                <div>
                  <h3 className="font-bold text-petrol-900">{job.title}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-petrol-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {job.employment_type}
                    </span>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setApplyJob(job)}>
                  Jetzt bewerben <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-petrol-400">
          © {new Date().getFullYear()} {company.name} · Deine Daten werden
          DSGVO-konform verarbeitet und nur für den Bewerbungsprozess verwendet.
        </p>
      </main>

      {applyJob && (
        <ApplyModal
          job={applyJob}
          company={company}
          onClose={() => setApplyJob(null)}
        />
      )}
    </div>
  );
}

function ApplyModal({
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

    // 1) CV hochladen (optional)
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

    // 2) Kandidat anlegen
    const { data: cand, error: cErr } = await supabase
      .from("candidates")
      .insert({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        linkedin: form.linkedin,
        cv_summary: form.cv_summary,
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

    // 3) Bewerbung anlegen
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

        {/* CV-Upload */}
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
