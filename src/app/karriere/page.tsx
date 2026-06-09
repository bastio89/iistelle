"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Job } from "@/lib/types";
import { Modal } from "@/components/ui";
import { ArrowRight, Briefcase, CheckCircle2, Clock, MapPin } from "lucide-react";

export default function CareerPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deptFilter, setDeptFilter] = useState("alle");
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "veroeffentlicht")
        .order("created_at", { ascending: false });
      setJobs((data as Job[]) ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const departments = Array.from(new Set(jobs.map((j) => j.department))).sort();
  const filtered =
    deptFilter === "alle" ? jobs : jobs.filter((j) => j.department === deptFilter);

  return (
    <div className="min-h-screen bg-surface">
      {/* Öffentlicher Header */}
      <header className="bg-petrol-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 font-black text-white">
              ii
            </div>
            <span className="text-lg font-bold text-white">iistelle GmbH</span>
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
            Wir bauen die Zukunft moderner HR-Arbeit. Finde die Rolle, die zu dir
            passt – die Bewerbung dauert keine zwei Minuten.
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

        {loading ? (
          <p className="py-16 text-center text-petrol-400">Lade Stellen…</p>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center text-petrol-500">
            Aktuell sind keine Stellen in diesem Bereich ausgeschrieben.
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
          © {new Date().getFullYear()} iistelle GmbH · Deine Daten werden DSGVO-konform
          verarbeitet und nur für den Bewerbungsprozess verwendet.
        </p>
      </main>

      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}
    </div>
  );
}

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
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
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

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
        source: "Karriereseite",
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
            Deine Bewerbung auf „{job.title}“ ist bei uns eingegangen. Wir melden
            uns so schnell wie möglich bei dir.
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
