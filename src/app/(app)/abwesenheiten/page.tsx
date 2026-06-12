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
import { downloadCsv } from "@/lib/csv";
import { isHoliday, upcomingHolidays, workdaysBetween } from "@/lib/holidays";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Paperclip,
  Plus,
  X,
} from "lucide-react";

export default function AbsencesPage() {
  const supabase = createClient();
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("alle");
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"liste" | "kalender" | "konten" | "statistik">("liste");
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

  async function openAttachment(path: string) {
    const { data } = await supabase.storage
      .from("dokumente")
      .createSignedUrl(path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
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
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() =>
                downloadCsv(
                  "abwesenheiten.csv",
                  filtered.map((a) => ({
                    Vorname: a.employee?.first_name,
                    Nachname: a.employee?.last_name,
                    Art: ABSENCE_TYPE_META[a.absence_type].label,
                    Von: a.start_date,
                    Bis: a.end_date,
                    Tage: a.days,
                    Status: ABSENCE_STATUS_META[a.status].label,
                    Kommentar: a.comment,
                  }))
                )
              }
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Antrag stellen
            </button>
          </div>
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
              ["konten", "Urlaubskonten"],
              ["statistik", "Statistik"],
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
      ) : view === "konten" ? (
        <VacationAccounts absences={absences} employees={employees} />
      ) : view === "statistik" ? (
        <AbsenceStats absences={absences} employees={employees} />
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
                    <td className="px-5 py-3 font-semibold text-petrol-800">
                      <span className="flex items-center gap-1.5">
                        {a.days}
                        {a.attachment_path && (
                          <button
                            onClick={() => openAttachment(a.attachment_path!)}
                            title="Attest öffnen"
                            className="text-petrol-400 transition hover:text-petrol-700"
                          >
                            <Paperclip className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </span>
                    </td>
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
    const dayIso = toISO(d);
    return {
      day: i + 1,
      iso: dayIso,
      weekend: d.getDay() === 0 || d.getDay() === 6,
      holiday: isHoliday(dayIso),
    };
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
                  title={d.holiday ?? undefined}
                  className={`min-w-7 px-0.5 py-2 text-center font-semibold ${
                    d.iso === todayIso
                      ? "bg-coral-500 text-white"
                      : d.holiday
                        ? "bg-amber-100 text-amber-700"
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
                        className={`h-9 px-0.5 ${
                          d.holiday ? "bg-amber-50/70" : d.weekend ? "bg-petrol-50/60" : ""
                        }`}
                        title={
                          d.holiday ??
                          (abs
                            ? `${ABSENCE_TYPE_META[abs.absence_type].label} (${ABSENCE_STATUS_META[abs.status].label})`
                            : undefined)
                        }
                      >
                        {abs && !d.weekend && !d.holiday && (
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
        Halbtransparente Balken = noch nicht genehmigt. Wochenenden grau, bundesweite
        Feiertage gelb markiert.
      </p>
    </div>
  );
}

function VacationAccounts({
  absences,
  employees,
}: {
  absences: Absence[];
  employees: Employee[];
}) {
  const year = new Date().getFullYear();

  const rows = employees.map((emp) => {
    const empVacation = absences.filter(
      (a) =>
        a.employee_id === emp.id &&
        a.absence_type === "urlaub" &&
        new Date(a.start_date).getFullYear() === year
    );
    const taken = empVacation
      .filter((a) => a.status === "genehmigt")
      .reduce((s, a) => s + Number(a.days), 0);
    const planned = empVacation
      .filter((a) => a.status === "beantragt")
      .reduce((s, a) => s + Number(a.days), 0);
    const entitlement = emp.vacation_days_per_year + Number(emp.carryover_days || 0);
    const remaining = entitlement - taken;
    return { emp, entitlement, taken, planned, remaining };
  });

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-petrol-100 px-5 py-4">
        <h2 className="font-bold text-petrol-900">Urlaubskonten {year}</h2>
        <p className="text-xs text-petrol-400">
          Anspruch = Jahresurlaub + Übertrag aus Vorjahr · Genommen = genehmigte
          Urlaubstage · Geplant = noch nicht genehmigte Anträge
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
            <th className="px-5 py-3">Mitarbeiter:in</th>
            <th className="px-5 py-3">Anspruch</th>
            <th className="px-5 py-3">Genommen</th>
            <th className="px-5 py-3">Geplant</th>
            <th className="px-5 py-3">Rest</th>
            <th className="px-5 py-3 w-48">Verbrauch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-petrol-50">
          {rows.map(({ emp, entitlement, taken, planned, remaining }) => (
            <tr key={emp.id} className="transition hover:bg-petrol-50/40">
              <td className="px-5 py-3">
                <Link href={`/mitarbeiter/${emp.id}`} className="flex items-center gap-3">
                  <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                  <span className="font-semibold text-petrol-900">
                    {emp.first_name} {emp.last_name}
                  </span>
                </Link>
              </td>
              <td className="px-5 py-3 text-petrol-700">
                {entitlement}
                {Number(emp.carryover_days) > 0 && (
                  <span
                    className="ml-1.5 rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700"
                    title={`davon ${emp.carryover_days} Tage Übertrag aus dem Vorjahr`}
                  >
                    +{emp.carryover_days}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-petrol-700">{taken}</td>
              <td className="px-5 py-3 text-petrol-500">{planned}</td>
              <td
                className={`px-5 py-3 font-bold ${
                  remaining < 5 ? "text-coral-500" : "text-petrol-900"
                }`}
              >
                {remaining}
              </td>
              <td className="px-5 py-3">
                <div className="h-2.5 overflow-hidden rounded-full bg-petrol-50">
                  <div
                    className={`h-full rounded-full ${
                      taken / Math.max(entitlement, 1) > 0.8
                        ? "bg-coral-500"
                        : "bg-petrol-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        (taken / Math.max(entitlement, 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const MONTH_SHORT = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

function AbsenceStats({
  absences,
  employees,
}: {
  absences: Absence[];
  employees: Employee[];
}) {
  const year = new Date().getFullYear();
  const approved = absences.filter(
    (a) => a.status === "genehmigt" && new Date(a.start_date).getFullYear() === year
  );

  const byType = (Object.keys(ABSENCE_TYPE_META) as AbsenceType[]).map((t) => ({
    type: t,
    days: approved
      .filter((a) => a.absence_type === t)
      .reduce((s, a) => s + Number(a.days), 0),
  }));
  const totalDays = byType.reduce((s, t) => s + t.days, 0);

  const sickDays = byType.find((t) => t.type === "krank")?.days ?? 0;
  const headcount = Math.max(employees.length, 1);

  // Krankheitstage pro Monat (nach Startdatum zugeordnet)
  const sickByMonth = Array.from({ length: 12 }, (_, m) =>
    approved
      .filter(
        (a) => a.absence_type === "krank" && new Date(a.start_date).getMonth() === m
      )
      .reduce((s, a) => s + Number(a.days), 0)
  );
  const maxSick = Math.max(...sickByMonth, 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label={`Abwesenheitstage ${year}`} value={totalDays} sub="genehmigt" />
        <StatCard
          label="Krankheitstage"
          value={sickDays}
          sub={`Ø ${(sickDays / headcount).toFixed(1)} pro Kopf`}
          accent={sickDays / headcount > 10}
        />
        <StatCard
          label="Urlaubstage genommen"
          value={byType.find((t) => t.type === "urlaub")?.days ?? 0}
          sub={`bei ${employees.length} Mitarbeitenden`}
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 font-bold text-petrol-900">Verteilung nach Art ({year})</h2>
        <div className="space-y-2.5">
          {byType.map(({ type, days }) => {
            const meta = ABSENCE_TYPE_META[type];
            const pct = totalDays ? (days / totalDays) * 100 : 0;
            return (
              <div key={type} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-medium text-petrol-500">
                  {meta.label}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-petrol-50">
                  <div
                    className={`h-full rounded-full ${CAL_COLORS[type]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-bold text-petrol-700">
                  {days} T.
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 font-bold text-petrol-900">
          Krankheitstage pro Monat ({year})
        </h2>
        <div className="flex h-36 items-end gap-2">
          {sickByMonth.map((v, m) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-petrol-600">
                {v > 0 ? v : ""}
              </span>
              <div
                className={`w-full rounded-t ${v > 0 ? "bg-rose-400" : "bg-petrol-50"}`}
                style={{ height: `${Math.max((v / maxSick) * 100, 4)}%` }}
                title={`${MONTH_SHORT[m]}: ${v} Tage`}
              />
              <span className="text-[10px] text-petrol-400">{MONTH_SHORT[m]}</span>
            </div>
          ))}
        </div>
      </div>
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
  const [halfDay, setHalfDay] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const singleDay = form.start_date === form.end_date;
  const days =
    singleDay && halfDay ? 0.5 : workdaysBetween(form.start_date, form.end_date);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let attachmentPath = "";
    if (attachment) {
      const path = `atteste/${Date.now()}-${attachment.name}`;
      const { error: upErr } = await supabase.storage
        .from("dokumente")
        .upload(path, attachment);
      if (!upErr) attachmentPath = path;
    }

    await supabase.from("absences").insert({
      ...form,
      days,
      status: "beantragt",
      attachment_path: attachmentPath,
    });
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
        {singleDay && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-petrol-700">
            <input
              type="checkbox"
              checked={halfDay}
              onChange={(e) => setHalfDay(e.target.checked)}
              className="h-4 w-4 accent-petrol-700"
            />
            Nur halber Tag (0,5 Tage)
          </label>
        )}
        <p className="rounded-lg bg-petrol-50 px-4 py-2.5 text-sm text-petrol-600">
          {days} Arbeitstag{days === 1 ? "" : "e"} (Mo–Fr, bundesweite Feiertage
          bereits abgezogen)
        </p>
        <p className="text-xs text-petrol-400">
          Nächste Feiertage:{" "}
          {upcomingHolidays(3)
            .map((h) => `${h.name} (${formatDate(h.date)})`)
            .join(" · ")}
        </p>
        {form.absence_type === "krank" && (
          <div>
            <label className="label">Attest / Nachweis (optional)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="block w-full text-sm text-petrol-500 file:mr-3 file:rounded-lg file:border-0 file:bg-petrol-800 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-petrol-700"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </div>
        )}
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
