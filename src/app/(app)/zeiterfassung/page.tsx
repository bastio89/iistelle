"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, TimeEntry } from "@/lib/types";
import { Avatar, EmptyState, PageHeader, StatCard } from "@/components/ui";
import PremiumGate from "@/components/PremiumGate";
import { LogIn, LogOut, Timer } from "lucide-react";

function hoursBetween(a: string, b: string, pauseMin: number) {
  return Math.max(
    (new Date(b).getTime() - new Date(a).getTime()) / 3600000 - pauseMin / 60,
    0
  );
}

export default function TimeTrackingPageGated() {
  return (
    <PremiumGate feature="Zeiterfassung">
      <TimeTrackingPage />
    </PremiumGate>
  );
}

function TimeTrackingPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();

  const load = useCallback(async () => {
    const [e, t] = await Promise.all([
      supabase
        .from("employees")
        .select("*")
        .neq("status", "ausgeschieden")
        .order("last_name"),
      supabase
        .from("time_entries")
        .select("*, employee:employees(*)")
        .gte("clock_in", monthStart)
        .order("clock_in", { ascending: false }),
    ]);
    const emps = (e.data as Employee[]) ?? [];
    setEmployees(emps);
    setEntries((t.data as TimeEntry[]) ?? []);
    setSelectedId((prev) => prev || emps[0]?.id || "");
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Zeiterfassung…</p>;
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((t) => t.clock_in.slice(0, 10) === todayIso);
  const monthHoursByEmp = employees.map((emp) => {
    const h = entries
      .filter((t) => t.employee_id === emp.id && t.clock_out)
      .reduce((s, t) => s + hoursBetween(t.clock_in, t.clock_out!, t.pause_min), 0);
    return { emp, hours: h };
  });
  const selected = monthHoursByEmp.find((x) => x.emp.id === selectedId);

  return (
    <div>
      <PageHeader
        title="Zeiterfassung"
        subtitle="Stempeluhr und Monatsübersicht für dein Team."
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Heute eingestempelt" value={todayEntries.filter((t) => !t.clock_out).length} />
        <StatCard label="Einträge heute" value={todayEntries.length} />
        <StatCard
          label="Monatsstunden (Auswahl)"
          value={selected ? `${selected.hours.toFixed(1)} h` : "–"}
          accent
        />
      </div>

      {/* Stempeluhr */}
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Letzte Einträge */}
        <div className="card overflow-hidden">
          <p className="border-b border-petrol-100 px-5 py-3.5 font-bold text-petrol-900">
            Letzte Einträge (dieser Monat)
          </p>
          {entries.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-petrol-400">
              Noch keine Zeiteinträge.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-petrol-50 overflow-y-auto">
              {entries.slice(0, 30).map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
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
                .sort((a, b) => b.hours - a.hours)
                .map(({ emp, hours }) => (
                  <li key={emp.id} className="flex items-center gap-3 px-5 py-2.5">
                    <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                    <span className="flex-1 text-sm font-semibold text-petrol-900">
                      {emp.first_name} {emp.last_name}
                    </span>
                    <span className="text-sm font-bold text-petrol-700">
                      {hours.toFixed(1)} h
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
