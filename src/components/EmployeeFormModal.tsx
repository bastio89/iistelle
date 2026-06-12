"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Employee, EmployeeStatus, PLAN_META } from "@/lib/types";
import { useRole } from "@/lib/useRole";
import { Modal } from "@/components/ui";

export default function EmployeeFormModal({
  employee,
  onClose,
  onSaved,
}: {
  employee?: Employee | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    first_name: employee?.first_name ?? "",
    last_name: employee?.last_name ?? "",
    email: employee?.email ?? "",
    phone: employee?.phone ?? "",
    position: employee?.position ?? "",
    department: employee?.department ?? "Engineering",
    location: employee?.location ?? "",
    employment_type: employee?.employment_type ?? "Vollzeit",
    status: (employee?.status ?? "onboarding") as EmployeeStatus,
    hire_date: employee?.hire_date ?? new Date().toISOString().slice(0, 10),
    birth_date: employee?.birth_date ?? "",
    manager: employee?.manager ?? "",
    vacation_days_per_year: employee?.vacation_days_per_year ?? 28,
    carryover_days: employee?.carryover_days ?? 0,
    exit_date: employee?.exit_date ?? "",
    emergency_contact_name: employee?.emergency_contact_name ?? "",
    emergency_contact_phone: employee?.emergency_contact_phone ?? "",
  });
  const [skillsText, setSkillsText] = useState((employee?.skills ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const { company } = useRole();

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Plan-Limit prüfen (nur beim Anlegen)
    if (!employee && company) {
      const limit = PLAN_META[company.plan].maxEmployees;
      if (limit !== null) {
        const { count } = await supabase
          .from("employees")
          .select("*", { count: "exact", head: true })
          .neq("status", "ausgeschieden");
        if ((count ?? 0) >= limit) {
          setLimitReached(true);
          setSaving(false);
          return;
        }
      }
    }

    const payload = {
      ...form,
      birth_date: form.birth_date || null,
      exit_date: form.exit_date || null,
      vacation_days_per_year: Number(form.vacation_days_per_year) || 28,
      carryover_days: Number(form.carryover_days) || 0,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const res = employee
      ? await supabase.from("employees").update(payload).eq("id", employee.id)
      : await supabase.from("employees").insert(payload);
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
      title={employee ? "Mitarbeiter:in bearbeiten" : "Mitarbeiter:in anlegen"}
      onClose={onClose}
      wide
    >
      <form onSubmit={save} className="space-y-4">
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
            <input className="input" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">Position *</label>
            <input className="input" value={form.position} onChange={(e) => set("position", e.target.value)} required />
          </div>
          <div>
            <label className="label">Abteilung</label>
            <select className="input" value={form.department} onChange={(e) => set("department", e.target.value)}>
              {["Engineering", "People & Culture", "Sales", "Marketing", "Finance", "Operations", "Management"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Standort</label>
            <input className="input" value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div>
            <label className="label">Anstellungsart</label>
            <select className="input" value={form.employment_type} onChange={(e) => set("employment_type", e.target.value)}>
              {["Vollzeit", "Teilzeit", "Werkstudent", "Praktikum", "Freelance"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Eintrittsdatum</label>
            <input className="input" type="date" value={form.hire_date} onChange={(e) => set("hire_date", e.target.value)} required />
          </div>
          <div>
            <label className="label">Geburtsdatum</label>
            <input className="input" type="date" value={form.birth_date} onChange={(e) => set("birth_date", e.target.value)} />
          </div>
          <div>
            <label className="label">Vorgesetzte:r</label>
            <input className="input" value={form.manager ?? ""} onChange={(e) => set("manager", e.target.value)} />
          </div>
          <div>
            <label className="label">Urlaubstage / Jahr</label>
            <input className="input" type="number" min={0} value={form.vacation_days_per_year} onChange={(e) => set("vacation_days_per_year", Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Urlaubsübertrag aus Vorjahr</label>
            <input className="input" type="number" min={0} step={0.5} value={form.carryover_days} onChange={(e) => set("carryover_days", Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => set("status", e.target.value as EmployeeStatus)}>
              <option value="onboarding">Onboarding</option>
              <option value="aktiv">Aktiv</option>
              <option value="ausgeschieden">Ausgeschieden</option>
            </select>
          </div>
          <div>
            <label className="label">Austrittsdatum</label>
            <input className="input" type="date" value={form.exit_date} onChange={(e) => set("exit_date", e.target.value)} />
          </div>
          <div>
            <label className="label">Notfallkontakt (Name)</label>
            <input className="input" value={form.emergency_contact_name} onChange={(e) => set("emergency_contact_name", e.target.value)} placeholder="z. B. Partner:in, Elternteil" />
          </div>
          <div>
            <label className="label">Notfallkontakt (Telefon)</label>
            <input className="input" value={form.emergency_contact_phone} onChange={(e) => set("emergency_contact_phone", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Skills & Qualifikationen (kommagetrennt)</label>
          <input
            className="input"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="z. B. React, Erste Hilfe, Englisch C1"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        {limitReached && (
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Dein Starter-Plan umfasst bis zu 10 aktive Mitarbeiter.{" "}
            <Link href="/abrechnung" className="font-bold underline">
              Jetzt auf Professional upgraden
            </Link>{" "}
            für unbegrenzte Mitarbeiter.
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="btn-primary" disabled={saving}>
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
