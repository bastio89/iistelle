"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, TimeEntry } from "@/lib/types";
import { Avatar, EmptyState, Modal, PageHeader, StatCard } from "@/components/ui";
import PremiumGate from "@/components/PremiumGate";
import { useRole } from "@/lib/useRole";
import { downloadCsv } from "@/lib/csv";
import {
  Clock,
  Download,
  Edit3,
  LogIn,
  LogOut,
  Plus,
  Timer,
  Trash2,
  TrendingUp,
} from "lucide-react";

// ─── Typen ────────────────────────────────────────────────────────────────────

interface WorkSchedule {
  id: string;
  employee_id: string;
  day_of_week: number; // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
  start_time: string;  // "HH:MM"
  end_time: string;    // "HH:MM"
  break_minutes: number;
  is_working_day: boolean;
}

interface OvertimeEntry {
  id: string;
  employee_id: string;
  date: string;
  hours: number;
  reason: string;
  status: "offen" | "genehmigt" | "abgelehnt";
  created_at: string;
}

interface TimeEntryWithExtras extends TimeEntry {
  pause_min: number;
  note: string | null;
}

// ─── Helfer ────────────────────────────────────────────────────────────────────

function hoursBetween(a: string, b: string, pauseMin: number) {
  return Math.max(
    (new Date(b).getTime() - new Date(a).getTime()) / 3600000 - pauseMin / 60,
    0
  );
}

function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// ─── Komponenten ──────────────────────────────────────────────────────────────

export default function TimeTrackingPageGated() {
  return (
    <PremiumGate feature="Zeiterfassung">
      <TimeTrackingPage />
    </PremiumGate>
  );
}

function TimeTrackingPage() {
  const supabase = createClient();
  const { company } = useRole();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [entries, setEntries] = useState<TimeEntryWithExtras[]>([]);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [overtimeEntries, setOvertimeEntries] = useState<OvertimeEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [view, setView] = useState<"uhr" | "monat" | "statistik">("uhr");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [editingEntry, setEditingEntry] = useState<TimeEntryWithExtras | null>(null);
  const [showOvertimeForm, setShowOvertimeForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const monthStart = new Date(
    currentMonth.year,
    currentMonth.month,
    1
  ).toISOString();
  const monthEnd = new Date(
    currentMonth.year,
    currentMonth.month + 1,
    0
  ).toISOString();

  const load = useCallback(async () => {
    const [e, t, sched, ot] = await Promise.all([
      supabase
        .from("employees")
        .select("*")
        .neq("status", "ausgeschieden")
        .order("last_name"),
      supabase
        .from("time_entries")
        .select("*, pause_min, note")
        .gte("clock_in", monthStart)
        .lte("clock_in", monthEnd)
        .order("clock_in", { ascending: false }),
      supabase.from("work_schedules").select("*"),
      supabase.from("overtime_entries").select("*").order("date", { ascending: false }),
    ]);
    const emps = (e.data as Employee[]) ?? [];
    const ents = (t.data as TimeEntryWithExtras[]) ?? [];
    setEmployees(emps);
    setEntries(ents.map(e => ({ ...e, pause_min: e.pause_min ?? 0 })));
    setSchedules((sched.data as WorkSchedule[]) ?? []);
    setOvertimeEntries((ot.data as OvertimeEntry[]) ?? []);
    setSelectedId((prev) => prev || emps[0]?.id || "");
    setLoading(false);
  }, [monthStart, monthEnd]);

  useEffect(() => {
    load();
  }, [load]);

  const openEntry = entries.find(
    (t) => t.employee_id === selectedId && !t.clock_out
  );

  async function clockIn() {
    if (!selectedId || openEntry) return;
    await supabase.from("time_entries").insert({ employee_id: selectedId });
    load();
  }

  async function clockOut() {
    if (!openEntry) return;
    await supabase
      .from("time_entries")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", openEntry.id);
    load();
  }

  async function deleteEntry(id: string) {
    await supabase.from("time_entries").delete().eq("id", id);
    load();
  }

  async function updateEntry(
    id: string,
    updates: { clock_in?: string; clock_out?: string; pause_min?: number; note?: string }
  ) {
    await supabase.from("time_entries").update(updates).eq("id", id);
    setEditingEntry(null);
    load();
  }

  async function saveOvertime(data: Omit<OvertimeEntry, "id" | "created_at" | "status">) {
    await supabase.from("overtime_entries").insert(data);
    setShowOvertimeForm(false);
    load();
  }

  async function approveOvertime(id: string, approved: boolean) {
    await supabase
      .from("overtime_entries")
      .update({ status: approved ? "genehmigt" : "abgelehnt" })
      .eq("id", id);
    load();
  }

  // Statistiken
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((t) => t.clock_in.slice(0, 10) === todayIso);
  const todayClockedIn = todayEntries.filter((t) => !t.clock_out).length;

  // Monatsübersicht pro Mitarbeiter
  const monthHoursByEmp = employees.map((emp) => {
    const empEntries = entries.filter(
      (t) => t.employee_id === emp.id && t.clock_out
    );
    const regularHours = empEntries.reduce(
      (s, t) => s + hoursBetween(t.clock_in, t.clock_out!, t.pause_min),
      0
    );
    const empOvertime = overtimeEntries.filter(
      (o) => o.employee_id === emp.id && o.status === "genehmigt"
    );
    const overtimeHours = empOvertime.reduce((s, o) => s + o.hours, 0);
    return { emp, regularHours, overtimeHours, totalHours: regularHours + overtimeHours };
  });

  const selected = monthHoursByEmp.find((x) => x.emp.id === selectedId);

  // Wochenübersicht
  const weekNum = getWeekNumber(new Date(currentMonth.year, currentMonth.month, 1));
  const weekEntries = entries.filter((t) => {
    const d = new Date(t.clock_in);
    return getWeekNumber(d) === weekNum;
  });

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Zeiterfassung…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Zeiterfassung"
        subtitle="Stempeluhr, Monatsübersicht und Überstunden für dein Team."
        action={
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() =>
                downloadCsv(
                  `zeiterfassung-${currentMonth.year}-${currentMonth.month + 1}.csv`,
                  entries.map((t) => ({
                    Mitarbeiter: `${t.employee?.first_name} ${t.employee?.last_name}`,
                    Datum: new Date(t.clock_in).toLocaleDateString("de-DE"),
                    "Start (Uhr)": new Date(t.clock_in).toLocaleTimeString("de-DE"),
                    "Ende (Uhr)": t.clock_out
                      ? new Date(t.clock_out).toLocaleTimeString("de-DE")
                      : "offen",
                    Stunden: t.clock_out
                      ? hoursBetween(t.clock_in, t.clock_out, t.pause_min).toFixed(2)
                      : "–",
                    Pause: `${t.pause_min} Min.`,
                    Notiz: t.note ?? "",
                  }))
                )
              }
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowScheduleModal(true)}
            >
              <Clock className="h-4 w-4" /> Arbeitszeit
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowOvertimeForm(true)}
            >
              <Plus className="h-4 w-4" /> Überzeit
            </button>
          </div>
        }
      />

      {/* Statistik-Karten */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Heute eingestempelt"
          value={todayClockedIn}
          sub={`${todayEntries.length} Einträge`}
        />
        <StatCard
          label="Monatsstunden (Auswahl)"
          value={selected ? formatDuration(selected.totalHours) : "–"}
          sub={`Ø ${selected ? formatDuration(selected.totalHours / 4) : "–"}/Woche`}
          accent
        />
        <StatCard
          label="Überstunden (Auswahl)"
          value={selected ? formatDuration(selected.overtimeHours) : "–"}
          sub="genehmigt"
        />
        <StatCard
          label="Einträge diesen Monat"
          value={entries.length}
          sub={`KW ${weekNum}`}
        />
      </div>

      {/* View-Tabs */}
      <div className="mb-4 flex rounded-lg border border-petrol-200 bg-white p-0.5 w-fit">
        {(
          [
            ["uhr", "Stempeluhr"],
            ["monat", "Monatsansicht"],
            ["statistik", "Statistik"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              view === key
                ? "bg-petrol-800 text-white"
                : "text-petrol-600 hover:bg-petrol-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stempeluhr */}
      {view === "uhr" && (
        <div className="card mb-8 flex flex-wrap items-end gap-4 p-6">
          <div className="min-w-64 flex-1">
            <label className="label">Mitarbeiter:in</label>
            <select
              className="input"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.first_name} {e.last_name}
                </option>
              ))}
            </select>
          </div>
          {openEntry ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Timer className="h-4 w-4" />
                Eingestempelt seit{" "}
                {new Date(openEntry.clock_in).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                Uhr
              </span>
              <button className="btn-danger" onClick={clockOut}>
                <LogOut className="h-4 w-4" /> Ausstempeln
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={clockIn} disabled={!selectedId}>
              <LogIn className="h-4 w-4" /> Einstempeln
            </button>
          )}
        </div>
      )}

      {/* Monatsansicht */}
      {view === "monat" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Letzte Einträge */}
          <div className="card overflow-hidden">
            <p className="border-b border-petrol-100 px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold text-petrol-900">Letzte Einträge</span>
              <span className="text-xs text-petrol-400">
                {currentMonth.year}-{String(currentMonth.month + 1).padStart(2, "0")}
              </span>
            </p>
            {entries.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-petrol-400">
                Noch keine Zeiteinträge.
              </p>
            ) : (
              <ul className="max-h-96 divide-y divide-petrol-50 overflow-y-auto">
                {entries.slice(0, 30).map((t) => (
                  <li key={t.id} className="flex items-center gap-3 px-5 py-2.5 text-sm group">
                    <Avatar
                      name={`${t.employee?.first_name} ${t.employee?.last_name}`}
                      size="sm"
                    />
                    <span className="flex-1 font-semibold text-petrol-900">
                      {t.employee?.first_name} {t.employee?.last_name}
                    </span>
                    <span className="text-petrol-500">
                      {new Date(t.clock_in).toLocaleDateString("de-DE")} ·{" "}
                      {new Date(t.clock_in).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" – "}
                      {t.clock_out
                        ? new Date(t.clock_out).toLocaleTimeString("de-DE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "läuft"}
                    </span>
                    <span className="w-14 text-right font-bold text-petrol-700">
                      {t.clock_out
                        ? `${hoursBetween(t.clock_in, t.clock_out, t.pause_min).toFixed(1)} h`
                        : "•"}
                    </span>
                    <button
                      onClick={() => setEditingEntry(t)}
                      className="opacity-0 group-hover:opacity-100 rounded p-1 text-petrol-400 hover:text-petrol-700 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Monatssummen */}
          <div className="card overflow-hidden">
            <p className="border-b border-petrol-100 px-5 py-3.5 font-bold text-petrol-900">
              Monatsstunden pro Person
            </p>
            {monthHoursByEmp.length === 0 ? (
              <EmptyState title="Keine Mitarbeiter" />
            ) : (
              <ul className="divide-y divide-petrol-50">
                {monthHoursByEmp
                  .sort((a, b) => b.totalHours - a.totalHours)
                  .map(({ emp, regularHours, overtimeHours, totalHours }) => (
                    <li key={emp.id} className="flex items-center gap-3 px-5 py-2.5">
                      <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                      <span className="flex-1 text-sm font-semibold text-petrol-900">
                        {emp.first_name} {emp.last_name}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-petrol-700">
                          {formatDuration(totalHours)}
                        </span>
                        {overtimeHours > 0 && (
                          <span className="ml-2 text-xs text-amber-600">
                            +{formatDuration(overtimeHours)} Überzeit
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Statistik-Ansicht */}
      {view === "statistik" && (
        <div className="space-y-6">
          {/* Überstunden-Anträge */}
          <div className="card overflow-hidden">
            <p className="border-b border-petrol-100 px-5 py-3.5 font-bold text-petrol-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Überstunden-Anträge
            </p>
            {overtimeEntries.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-petrol-400">
                Keine Überstunden erfasst.
              </p>
            ) : (
              <ul className="divide-y divide-petrol-50">
                {overtimeEntries.map((o) => {
                  const emp = employees.find((e) => e.id === o.employee_id);
                  return (
                    <li key={o.id} className="flex items-center gap-3 px-5 py-3">
                      <Avatar name={`${emp?.first_name} ${emp?.last_name}`} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-petrol-900">
                          {emp?.first_name} {emp?.last_name}
                        </p>
                        <p className="text-xs text-petrol-500">
                          {new Date(o.date).toLocaleDateString("de-DE")} · {o.reason}
                        </p>
                      </div>
                      <span className="font-bold text-petrol-700">
                        {formatDuration(o.hours)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          o.status === "genehmigt"
                            ? "bg-emerald-100 text-emerald-700"
                            : o.status === "abgelehnt"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {o.status === "genehmigt" ? "Genehmigt" : o.status === "abgelehnt" ? "Abgelehnt" : "Offen"}
                      </span>
                      {o.status === "offen" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => approveOvertime(o.id, true)}
                            className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700 hover:bg-emerald-200"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => approveOvertime(o.id, false)}
                            className="rounded-lg bg-rose-100 p-1.5 text-rose-600 hover:bg-rose-200"
                          >
                            ✗
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Monatsvergleich */}
          <div className="card p-5">
            <h2 className="mb-4 font-bold text-petrol-900">Monatsübersicht</h2>
            <div className="space-y-3">
              {monthHoursByEmp
                .filter((m) => m.totalHours > 0)
                .sort((a, b) => b.totalHours - a.totalHours)
                .map(({ emp, regularHours, overtimeHours, totalHours }) => {
                  // Annahme: 40h/Woche × 4 = 160h/Monat Soll
                  const targetHours = 160;
                  const diff = totalHours - targetHours;
                  const pct = (totalHours / targetHours) * 100;
                  return (
                    <div key={emp.id} className="flex items-center gap-3">
                      <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                      <span className="w-32 shrink-0 text-sm font-medium text-petrol-700">
                        {emp.first_name} {emp.last_name}
                      </span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-petrol-50">
                        <div
                          className={`h-full rounded-full ${
                            diff > 0 ? "bg-emerald-500" : diff < -20 ? "bg-rose-400" : "bg-petrol-600"
                          }`}
                          style={{ width: `${Math.min(pct, 120)}%` }}
                        />
                      </div>
                      <span className="w-20 text-right text-sm font-bold text-petrol-700">
                        {formatDuration(totalHours)}
                      </span>
                      <span
                        className={`w-20 text-right text-xs font-semibold ${
                          diff > 0 ? "text-emerald-600" : diff < -20 ? "text-rose-500" : "text-petrol-500"
                        }`}
                      >
                        {diff > 0 ? `+${formatDuration(diff)}` : `-${formatDuration(Math.abs(diff))}`}
                      </span>
                    </div>
                  );
                })}
            </div>
            <p className="mt-4 text-xs text-petrol-400">Soll: 160h/Monat (40h/Woche)</p>
          </div>
        </div>
      )}

      {/* Eintrag bearbeiten Modal */}
      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSave={(updates) => updateEntry(editingEntry.id, updates)}
          onDelete={() => {
            deleteEntry(editingEntry.id);
            setEditingEntry(null);
          }}
        />
      )}

      {/* Überzeit erfassen Modal */}
      {showOvertimeForm && (
        <OvertimeFormModal
          employees={employees}
          onClose={() => setShowOvertimeForm(false)}
          onSave={saveOvertime}
        />
      )}

      {/* Arbeitszeit-Verwaltung Modal */}
      {showScheduleModal && (
        <ScheduleModal
          schedules={schedules}
          employees={employees}
          onClose={() => setShowScheduleModal(false)}
          onSave={() => {
            setShowScheduleModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}

// ─── Edit Entry Modal ─────────────────────────────────────────────────────────

function EditEntryModal({
  entry,
  onClose,
  onSave,
  onDelete,
}: {
  entry: TimeEntryWithExtras;
  onClose: () => void;
  onSave: (updates: { clock_in?: string; clock_out?: string; pause_min?: number; note?: string }) => void;
  onDelete: () => void;
}) {
  const [clockIn, setClockIn] = useState(
    new Date(entry.clock_in).toISOString().slice(0, 16)
  );
  const [clockOut, setClockOut] = useState(
    entry.clock_out ? new Date(entry.clock_out).toISOString().slice(0, 16) : ""
  );
  const [pauseMin, setPauseMin] = useState(entry.pause_min ?? 0);
  const [note, setNote] = useState(entry.note ?? "");

  return (
    <Modal title="Zeiteintrag bearbeiten" onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start</label>
            <input
              type="datetime-local"
              className="input"
              value={clockIn}
              onChange={(e) => setClockIn(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Ende</label>
            <input
              type="datetime-local"
              className="input"
              value={clockOut}
              onChange={(e) => setClockOut(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Pausenzeit (Minuten)</label>
          <input
            type="number"
            className="input w-32"
            value={pauseMin}
            min={0}
            onChange={(e) => setPauseMin(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">Notiz</label>
          <input
            type="text"
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="optional"
          />
        </div>
        <div className="flex justify-between pt-2">
          <button
            onClick={onDelete}
            className="btn-danger"
          >
            <Trash2 className="h-4 w-4" /> Löschen
          </button>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={onClose}>
              Abbrechen
            </button>
            <button
              className="btn-primary"
              onClick={() =>
                onSave({
                  clock_in: new Date(clockIn).toISOString(),
                  clock_out: clockOut ? new Date(clockOut).toISOString() : undefined,
                  pause_min: pauseMin,
                  note: note || undefined,
                })
              }
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Overtime Form Modal ──────────────────────────────────────────────────────

function OvertimeFormModal({
  employees,
  onClose,
  onSave,
}: {
  employees: Employee[];
  onClose: () => void;
  onSave: (data: Omit<OvertimeEntry, "id" | "created_at" | "status">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    employee_id: employees[0]?.id ?? "",
    date: today,
    hours: 0,
    reason: "",
  });

  return (
    <Modal title="Überzeit erfassen" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="label">Mitarbeiter:in</label>
          <select
            className="input"
            value={form.employee_id}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.first_name} {e.last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Datum</label>
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Stunden</label>
          <input
            type="number"
            className="input w-32"
            value={form.hours}
            min={0.5}
            step={0.5}
            onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="label">Grund</label>
          <input
            type="text"
            className="input"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="z.B. Projekt X, Messevorbereitung"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="btn-primary"
            disabled={!form.employee_id || !form.hours || !form.reason}
            onClick={() => onSave(form)}
          >
            Erfassen
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Schedule Modal ────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = [
  { key: 1, label: "Montag" },
  { key: 2, label: "Dienstag" },
  { key: 3, label: "Mittwoch" },
  { key: 4, label: "Donnerstag" },
  { key: 5, label: "Freitag" },
  { key: 6, label: "Samstag" },
  { key: 0, label: "Sonntag" },
];

function ScheduleModal({
  schedules,
  employees,
  onClose,
  onSave,
}: {
  schedules: WorkSchedule[];
  employees: Employee[];
  onClose: () => void;
  onSave: () => void;
}) {
  const supabase = createClient();
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id ?? "");
  const [empSchedules, setEmpSchedules] = useState<WorkSchedule[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const filtered = schedules.filter((s) => s.employee_id === selectedEmpId);
    // Initialisiere mit Standard-Werten falls leer
    if (filtered.length === 0) {
      const defaults = DAYS_OF_WEEK.map((d) => ({
        id: `new-${d.key}`,
        employee_id: selectedEmpId,
        day_of_week: d.key,
        start_time: d.key <= 5 ? "09:00" : "00:00",
        end_time: d.key <= 5 ? "18:00" : "00:00",
        break_minutes: d.key <= 5 ? 60 : 0,
        is_working_day: d.key <= 5,
      }));
      setEmpSchedules(defaults);
    } else {
      setEmpSchedules(filtered);
    }
  }, [selectedEmpId, schedules]);

  async function saveSchedule(s: WorkSchedule) {
    setSaving(true);
    const { id, ...data } = s;
    if (id.startsWith("new-")) {
      await supabase.from("work_schedules").insert({ ...data, employee_id: selectedEmpId });
    } else {
      await supabase.from("work_schedules").update(data).eq("id", id);
    }
    setSaving(false);
    onSave();
  }

  function updateSchedule(key: number, updates: Partial<WorkSchedule>) {
    setEmpSchedules((prev) =>
      prev.map((s) => (s.day_of_week === key ? { ...s, ...updates } : s))
    );
  }

  return (
    <Modal title="Arbeitszeit-Regelung" onClose={onClose} wide>
      <div className="space-y-4">
        <div>
          <label className="label">Mitarbeiter:in</label>
          <select
            className="input"
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.first_name} {e.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-petrol-100 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                <th className="pb-2">Tag</th>
                <th className="pb-2">Arbeitstag</th>
                <th className="pb-2">Start</th>
                <th className="pb-2">Ende</th>
                <th className="pb-2">Pause (Min.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-50">
              {DAYS_OF_WEEK.map((d) => {
                const schedule = empSchedules.find((s) => s.day_of_week === d.key);
                return (
                  <tr key={d.key}>
                    <td className="py-2 font-medium text-petrol-700">{d.label}</td>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={schedule?.is_working_day ?? false}
                        onChange={(e) =>
                          updateSchedule(d.key, { is_working_day: e.target.checked })
                        }
                        className="h-4 w-4 accent-petrol-700"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="time"
                        className="input w-28"
                        value={schedule?.start_time ?? "09:00"}
                        disabled={!schedule?.is_working_day}
                        onChange={(e) =>
                          updateSchedule(d.key, { start_time: e.target.value })
                        }
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="time"
                        className="input w-28"
                        value={schedule?.end_time ?? "18:00"}
                        disabled={!schedule?.is_working_day}
                        onChange={(e) =>
                          updateSchedule(d.key, { end_time: e.target.value })
                        }
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        className="input w-20"
                        value={schedule?.break_minutes ?? 60}
                        min={0}
                        disabled={!schedule?.is_working_day}
                        onChange={(e) =>
                          updateSchedule(d.key, {
                            break_minutes: Number(e.target.value),
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="btn-primary"
            disabled={saving}
            onClick={async () => {
              for (const s of empSchedules) {
                await saveSchedule(s);
              }
            }}
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </Modal>
  );
}