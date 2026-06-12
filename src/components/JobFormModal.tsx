"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Job, JobStatus } from "@/lib/types";
import { Modal } from "@/components/ui";
import { usePremium } from "@/components/PremiumGate";
import { Sparkles } from "lucide-react";

const CHANNELS = ["Karriereseite", "LinkedIn", "StepStone", "Indeed", "XING"];

export default function JobFormModal({
  job,
  onClose,
  onSaved,
}: {
  job?: Job | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    title: job?.title ?? "",
    department: job?.department ?? "Engineering",
    location: job?.location ?? "",
    employment_type: job?.employment_type ?? "Vollzeit",
    seniority: job?.seniority ?? "Mid-Level",
    status: (job?.status ?? "entwurf") as JobStatus,
    recruiter: job?.recruiter ?? "",
    target_hires: job?.target_hires ?? 1,
    channels: job?.channels ?? ["Karriereseite"],
    description: job?.description ?? "",
    application_deadline: job?.application_deadline ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPremium } = usePremium();

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function generateDescription() {
    setGenerating(true);
    setError(null);
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: "stellenanzeige",
        input: `Titel: ${form.title}\nAbteilung: ${form.department}\nStandort: ${form.location}\nSeniorität: ${form.seniority}\nAnstellungsart: ${form.employment_type}\nVorhandene Stichpunkte: ${form.description || "keine"}`,
      }),
    });
    const data = await res.json();
    if (data.text) {
      set("description", data.text);
    } else {
      setError(data.error ?? "KI-Generierung fehlgeschlagen.");
    }
    setGenerating(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      target_hires: Number(form.target_hires) || 1,
      application_deadline: form.application_deadline || null,
    };
    const res = job
      ? await supabase.from("jobs").update(payload).eq("id", job.id)
      : await supabase.from("jobs").insert(payload);
    if (res.error) {
      setError(res.error.message);
      setSaving(false);
      return;
    }
    onSaved();
    onClose();
  }

  return (
    <Modal title={job ? "Stelle bearbeiten" : "Neue Stelle anlegen"} onClose={onClose} wide>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Stellentitel *</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="z. B. Senior Frontend Developer (m/w/d)"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Abteilung</label>
            <select
              className="input"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            >
              {["Engineering", "People & Culture", "Sales", "Marketing", "Finance", "Operations"].map(
                (d) => (
                  <option key={d}>{d}</option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="label">Standort</label>
            <input
              className="input"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="z. B. Berlin oder Remote"
            />
          </div>
          <div>
            <label className="label">Anstellungsart</label>
            <select
              className="input"
              value={form.employment_type}
              onChange={(e) => set("employment_type", e.target.value)}
            >
              {["Vollzeit", "Teilzeit", "Werkstudent", "Praktikum", "Freelance"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Seniorität</label>
            <select
              className="input"
              value={form.seniority ?? ""}
              onChange={(e) => set("seniority", e.target.value)}
            >
              {["Junior", "Mid-Level", "Senior", "Lead"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Recruiter:in</label>
            <input
              className="input"
              value={form.recruiter ?? ""}
              onChange={(e) => set("recruiter", e.target.value)}
              placeholder="Verantwortliche Person"
            />
          </div>
          <div>
            <label className="label">Zu besetzende Stellen</label>
            <input
              className="input"
              type="number"
              min={1}
              value={form.target_hires}
              onChange={(e) => set("target_hires", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Bewerbungsfrist (optional)</label>
            <input
              className="input"
              type="date"
              value={form.application_deadline}
              onChange={(e) => set("application_deadline", e.target.value)}
            />
            <p className="mt-1 text-xs text-petrol-400">
              Nach Ablauf wird die Stelle auf der Karriereseite ausgeblendet.
            </p>
          </div>
        </div>

        <div>
          <label className="label">Status</label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["entwurf", "Entwurf"],
                ["veroeffentlicht", "Veröffentlicht"],
                ["pausiert", "Pausiert"],
                ["geschlossen", "Geschlossen"],
              ] as [JobStatus, string][]
            ).map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() => set("status", key)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  form.status === key
                    ? "border-petrol-800 bg-petrol-800 text-white"
                    : "border-petrol-200 bg-white text-petrol-600 hover:bg-petrol-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Veröffentlichungskanäle (Multiposting)</label>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((c) => {
              const active = form.channels.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() =>
                    set(
                      "channels",
                      active
                        ? form.channels.filter((x) => x !== c)
                        : [...form.channels, c]
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "border-coral-500 bg-coral-500 text-white"
                      : "border-petrol-200 bg-white text-petrol-500 hover:bg-petrol-50"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="label mb-0">Stellenbeschreibung</label>
            {isPremium && (
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-bold text-coral-500 hover:text-coral-600 disabled:opacity-50"
                onClick={generateDescription}
                disabled={generating || !form.title}
                title="Beschreibung aus den Eckdaten generieren"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {generating ? "Generiere…" : "Mit KI generieren"}
              </button>
            )}
          </div>
          <textarea
            className="input min-h-28"
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Aufgaben, Anforderungen, Benefits…"
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
            {saving ? "Speichern…" : job ? "Änderungen speichern" : "Stelle anlegen"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
