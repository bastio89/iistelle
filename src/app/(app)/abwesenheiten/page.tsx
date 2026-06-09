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
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

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
  const [view, setView] = useState<"liste" | "kalender">("liste");
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

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
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
        <div className="flex rounded-lg border border-petrol-200 bg-white p-0.5">
          {(
            [
              ["liste", "Liste"],
              ["kalender", "Team-Kalender"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                view === key
                  ? "bg-petrol-800 text-white"
                  : "text-petrol-600 hover:bg-petrol-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "kalender" ? (
        <TeamCalendar absences={absences} employees={employees} />
      ) : filtered.length === 0 ? (
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

const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const CAL_COLORS: Record<string, string> = {
  urlaub: "bg-teal-400",
  krank: "bg-rose-400",
  sonderurlaub: "bg-violet-400",
  unbezahlt: "bg-slate-400",
};

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function TeamCalendar({
  absences,
  employees,
}: {
  absences: Absence[];
  employees: Employee[];
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return { day: i + 1, iso: toISO(d), weekend: d.getDay() === 0 || d.getDay() === 6 };
  });
  const todayIso = toISO(now);

  function prev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const relevant = absences.filter((a) => a.status !== "abgelehnt");

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-petrol-100 px-5 py-3">
        <h2 className="font-bold text-petrol-900">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 text-xs text-petrol-500 md:flex">
            {Object.entries(ABSENCE_TYPE_META).map(([key, meta]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${CAL_COLORS[key]}`} />
                {meta.label}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <button onClick={prev} className="rounded-lg p-1.5 text-petrol-500 transition hover:bg-petrol-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="rounded-lg p-1.5 text-petrol-500 transition hover:bg-petrol-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-44 bg-petrol-50/80 px-4 py-2 text-left font-bold uppercase tracking-wide text-petrol-500">
                Mitarbeiter:in
              </th>
              {days.map((d) => (
                <th
                  key={d.day}
                  className={`min-w-7 px-0.5 py-2 text-center font-semibold ${
                    d.iso === todayIso
                      ? "bg-coral-500 text-white"
                      : d.weekend
                        ? "bg-petrol-100/60 text-petrol-400"
                        : "bg-petrol-50/80 text-petrol-500"
                  }`}
                >
                  {d.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-petrol-50">
            {employees.map((emp) => {
              const empAbs = relevant.filter((a) => a.employee_id === emp.id);
              return (
                <tr key={emp.id}>
                  <td className="sticky left-0 z-10 bg-white px-4 py-2">
                    <Link
                      href={`/mitarbeiter/${emp.id}`}
                      className="flex items-center gap-2"
                    >
                      <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                      <span className="whitespace-nowrap text-sm font-semibold text-petrol-900">
                        {emp.first_name} {emp.last_name}
                      </span>
                    </Link>
                  </td>
                  {days.map((d) => {
                    const abs = empAbs.find(
                      (a) => a.start_date <= d.iso && a.end_date >= d.iso
                    );
                    return (
                      <td
                        key={d.day}
                        className={`h-9 px-0.5 ${d.weekend ? "bg-petrol-50/60" : ""}`}
                        title={
                          abs
                            ? `${ABSENCE_TYPE_META[abs.absence_type].label} (${ABSENCE_STATUS_META[abs.status].label})`
                            : undefined
                        }
                      >
                        {abs && !d.weekend && (
                          <div
                            className={`h-5 w-full rounded ${CAL_COLORS[abs.absence_type]} ${
                              abs.status === "beantragt" ? "opacity-40" : ""
                            }`}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-petrol-50 px-5 py-2.5 text-xs text-petrol-400">
        Halbtransparente Balken = noch nicht genehmigt. Wochenenden sind ausgegraut.
      </p>
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
