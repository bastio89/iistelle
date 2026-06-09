"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Candidate } from "@/lib/types";
import { Modal } from "@/components/ui";

export default function CandidateFormModal({
  candidate,
  onClose,
  onSaved,
}: {
  candidate?: Candidate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    first_name: candidate?.first_name ?? "",
    last_name: candidate?.last_name ?? "",
    email: candidate?.email ?? "",
    phone: candidate?.phone ?? "",
    city: candidate?.city ?? "",
    linkedin: candidate?.linkedin ?? "",
    source: candidate?.source ?? "Karriereseite",
    cv_summary: candidate?.cv_summary ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = candidate
      ? await supabase.from("candidates").update(form).eq("id", candidate.id)
      : await supabase.from("candidates").insert(form);
    if (res.error) {
      setError(res.error.message);
      setSaving(false);
      return;
    }
    onSaved();
    onClose();
  }

  return (
    <Modal
      title={candidate ? "Kandidat:in bearbeiten" : "Neue:n Kandidat:in anlegen"}
      onClose={onClose}
      wide
    >
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Vorname *</label>
            <input
              className="input"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Nachname *</label>
            <input
              className="input"
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">E-Mail *</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Telefon</label>
            <input
              className="input"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Stadt</label>
            <input
              className="input"
              value={form.city ?? ""}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Quelle</label>
            <select
              className="input"
              value={form.source ?? ""}
              onChange={(e) => set("source", e.target.value)}
            >
              {["Karriereseite", "LinkedIn", "StepStone", "Indeed", "XING", "Empfehlung", "Sonstige"].map(
                (s) => (
                  <option key={s}>{s}</option>
                )
              )}
            </select>
          </div>
        </div>
        <div>
          <label className="label">LinkedIn-Profil</label>
          <input
            className="input"
            value={form.linkedin ?? ""}
            onChange={(e) => set("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/…"
          />
        </div>
        <div>
          <label className="label">Lebenslauf-Zusammenfassung</label>
          <textarea
            className="input min-h-24"
            value={form.cv_summary ?? ""}
            onChange={(e) => set("cv_summary", e.target.value)}
            placeholder="Kurzprofil, Erfahrung, Skills…"
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
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
