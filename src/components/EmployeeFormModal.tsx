"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, EmployeeStatus } from "@/lib/types";
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
    manager: employee?.manager ?? "",
    vacation_days_per_year: employee?.vacation_days_per_year ?? 28,
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
    const payload = {
      ...form,
      vacation_days_per_year: Number(form.vacation_days_per_year) || 28,
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
            <label className="label">Vorgesetzte:r</label>
            <input className="input" value={form.manager ?? ""} onChange={(e) => set("manager", e.target.value)} />
          </div>
          <div>
            <label className="label">Urlaubstage / Jahr</label>
            <input className="input" type="number" min={0} value={form.vacation_days_per_year} onChange={(e) => set("vacation_days_per_year", Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => set("status", e.target.value as EmployeeStatus)}>
              <option value="onboarding">Onboarding</option>
              <option value="aktiv">Aktiv</option>
              <option value="ausgeschieden">Ausgeschieden</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
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
