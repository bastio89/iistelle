"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ABSENCE_STATUS_META,
  ABSENCE_TYPE_META,
  Absence,
  AbsenceStatus,
  AbsenceType,
  Employee,
} from "@/lib/types";
import {
  Avatar,
  EmptyState,
  Modal,
  PageHeader,
  StatCard,
  formatDate,
} from "@/components/ui";
import { Check, Plus, X } from "lucide-react";

function workdaysBetween(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  let days = 0;
  const d = new Date(s);
  while (d <= e) {
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) days++;
    d.setDate(d.getDate() + 1);
  }
  return Math.max(days, 1);
}

export default function AbsencesPage() {
  const supabase = createClient();
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("alle");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [a, e] = await Promise.all([
      supabase
        .from("absences")
        .select("*, employee:employees(*)")
        .order("start_date", { ascending: false }),
      supabase.from("employees").select("*").neq("status", "ausgeschieden").order("last_name"),
    ]);
    setAbsences((a.data as Absence[]) ?? []);
    setEmployees((e.data as Employee[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: AbsenceStatus) {
    await supabase.from("absences").update({ status }).eq("id", id);
    load();
  }

  const today = new Date().toISOString().slice(0, 10);
  const absentToday = absences.filter(
    (a) => a.status === "genehmigt" && a.start_date <= today && a.end_date >= today
  );
  const pending = absences.filter((a) => a.status === "beantragt");

  const filtered =
    statusFilter === "alle"
      ? absences
      : absences.filter((a) => a.status === statusFilter);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Abwesenheiten…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Abwesenheiten"
        subtitle="Anträge stellen, genehmigen und den Überblick behalten."
        action={
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Antrag stellen
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Heute abwesend" value={absentToday.length} />
        <StatCard label="Offene Anträge" value={pending.length} accent />
        <StatCard label="Einträge gesamt" value={absences.length} />
      </div>

      {absentToday.length > 0 && (
        <div className="card mb-6 p-5">
          <h2 className="mb-3 font-bold text-petrol-900">Heute nicht da</h2>
          <div className="flex flex-wrap gap-3">
            {absentToday.map((a) => {
              const typeMeta = ABSENCE_TYPE_META[a.absence_type];
              return (
                <Link
                  key={a.id}
                  href={`/mitarbeiter/${a.employee_id}`}
                  className="flex items-center gap-2.5 rounded-xl bg-petrol-50/70 px-3 py-2 transition hover:bg-petrol-100"
                >
                  <Avatar
                    name={`${a.employee?.first_name} ${a.employee?.last_name}`}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-petrol-900">
                      {a.employee?.first_name} {a.employee?.last_name}
                    </p>
                    <p className="text-xs text-petrol-400">
                      bis {formatDate(a.end_date)}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeMeta.color}`}>
                    {typeMeta.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["alle", "Alle"],
          ["beantragt", "Beantragt"],
          ["genehmigt", "Genehmigt"],
          ["abgelehnt", "Abgelehnt"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              statusFilter === key
                ? "bg-petrol-800 text-white"
                : "bg-white text-petrol-600 shadow-card hover:bg-petrol-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Keine Abwesenheiten in dieser Ansicht" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                <th className="px-5 py-3">Mitarbeiter:in</th>
                <th className="px-5 py-3">Art</th>
                <th className="px-5 py-3">Zeitraum</th>
                <th className="px-5 py-3">Tage</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-50">
              {filtered.map((a) => {
                const typeMeta = ABSENCE_TYPE_META[a.absence_type];
                const stMeta = ABSENCE_STATUS_META[a.status];
                return (
                  <tr key={a.id} className="transition hover:bg-petrol-50/40">
                    <td className="px-5 py-3">
                      <Link
                        href={`/mitarbeiter/${a.employee_id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar
                          name={`${a.employee?.first_name} ${a.employee?.last_name}`}
                          size="sm"
                        />
                        <span className="font-semibold text-petrol-900">
                          {a.employee?.first_name} {a.employee?.last_name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeMeta.color}`}>
                        {typeMeta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-petrol-700">
                      {formatDate(a.start_date)} – {formatDate(a.end_date)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-petrol-800">{a.days}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stMeta.color}`}>
                        {stMeta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {a.status === "beantragt" && (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setStatus(a.id, "genehmigt")}
                            className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700 transition hover:bg-emerald-200"
                            title="Genehmigen"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setStatus(a.id, "abgelehnt")}
                            className="rounded-lg bg-rose-100 p-1.5 text-rose-600 transition hover:bg-rose-200"
                            title="Ablehnen"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <AbsenceFormModal
          employees={employees}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function AbsenceFormModal({
  employees,
  onClose,
  onSaved,
}: {
  employees: Employee[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    employee_id: employees[0]?.id ?? "",
    absence_type: "urlaub" as AbsenceType,
    start_date: today,
    end_date: today,
    comment: "",
  });
  const [saving, setSaving] = useState(false);

  const days = workdaysBetween(form.start_date, form.end_date);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("absences").insert({ ...form, days, status: "beantragt" });
    onSaved();
  }

  return (
    <Modal title="Abwesenheit beantragen" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Mitarbeiter:in</label>
          <select
            className="input"
            value={form.employee_id}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Art</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ABSENCE_TYPE_META) as AbsenceType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, absence_type: t })}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  form.absence_type === t
                    ? "border-petrol-800 bg-petrol-800 text-white"
                    : "border-petrol-200 bg-white text-petrol-600 hover:bg-petrol-50"
                }`}
              >
                {ABSENCE_TYPE_META[t].label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Von</label>
            <input
              className="input"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Bis</label>
            <input
              className="input"
              type="date"
              value={form.end_date}
              min={form.start_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              required
            />
          </div>
        </div>
        <p className="rounded-lg bg-petrol-50 px-4 py-2.5 text-sm text-petrol-600">
          {days} Arbeitstag{days === 1 ? "" : "e"} (Mo–Fr)
        </p>
        <div>
          <label className="label">Kommentar</label>
          <input
            className="input"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="optional"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-primary" disabled={saving || !form.employee_id}>
            {saving ? "Speichern…" : "Antrag stellen"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
