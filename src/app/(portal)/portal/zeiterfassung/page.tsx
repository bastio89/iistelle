"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, TimeEntry } from "@/lib/types";
import { formatDate } from "@/components/ui";
import {
  Clock,
  Play,
  Square,
  Pause,
  Calendar,
  TrendingUp,
  Loader2,
  AlertCircle,
  Coffee,
} from "lucide-react";

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
}

export default function PortalZeiterfassungPage() {
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [pauseNote, setPauseNote] = useState("");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("employee_profiles")
      .select("employee_id")
      .eq("user_id", user.id)
      .single();

    if (profile?.employee_id) {
      const today = new Date().toISOString().split("T")[0];
      const [emp, ents, active] = await Promise.all([
        supabase.from("employees").select("*").eq("id", profile.employee_id).single(),
        supabase
          .from("time_entries")
          .select("*")
          .eq("employee_id", profile.employee_id)
          .gte("clock_in", `${today}T00:00:00`)
          .lte("clock_in", `${today}T23:59:59`)
          .order("clock_in", { ascending: true }),
        supabase
          .from("time_entries")
          .select("*")
          .eq("employee_id", profile.employee_id)
          .is("clock_out", null)
          .single(),
      ]);
      setEmployee(emp.data);
      setEntries(ents.data || []);
      setActiveEntry(active.data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function clockIn() {
    if (!employee) return;
    setClocking(true);
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("time_entries")
      .insert({
        employee_id: employee.id,
        clock_in: now,
        pause_min: 0,
      })
      .select()
      .single();
    if (data) {
      setActiveEntry(data);
      setEntries([...entries, data]);
    }
    setClocking(false);
  }

  async function clockOut() {
    if (!activeEntry) return;
    setClocking(true);
    const now = new Date().toISOString();
    await supabase
      .from("time_entries")
      .update({ clock_out: now })
      .eq("id", activeEntry.id);
    setActiveEntry(null);
    load();
    setClocking(false);
  }

  async function addPause(minutes: number) {
    if (!activeEntry) return;
    setClocking(true);
    await supabase
      .from("time_entries")
      .update({ pause_min: activeEntry.pause_min + minutes })
      .eq("id", activeEntry.id);
    setActiveEntry({ ...activeEntry, pause_min: activeEntry.pause_min + minutes });
    setClocking(false);
  }

  function getTodayHours(): string {
    const todayEntries = entries.filter((e) => e.clock_out);
    const totalMs = todayEntries.reduce((acc, e) => {
      const inTime = new Date(e.clock_in).getTime();
      const outTime = new Date(e.clock_out!).getTime();
      return acc + (outTime - inTime) - (e.pause_min || 0) * 60 * 1000;
    }, 0);
    const hours = totalMs / (1000 * 60 * 60);
    return hours.toFixed(1);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-petrol-400" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl border border-petrol-100 bg-white p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Zeiterfassung nicht verfügbar</h2>
        <p className="mt-2 text-petrol-500">Dein Mitarbeiterprofil konnte nicht gefunden werden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card p-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-xl font-bold text-petrol-900">Zeiterfassung</h1>
            <p className="text-petrol-500">{formatDate(new Date().toISOString())}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-petrol-50 px-4 py-2">
              <TrendingUp className="h-5 w-5 text-petrol-600" />
              <span className="text-lg font-bold text-petrol-900">{getTodayHours()}h</span>
              <span className="text-sm text-petrol-400">heute</span>
            </div>

            {activeEntry ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addPause(15)}
                  disabled={clocking}
                  className="flex items-center gap-2 rounded-lg border border-petrol-200 bg-white px-4 py-2 text-sm font-semibold text-petrol-600 transition-all hover:bg-petrol-50 disabled:opacity-50"
                >
                  <Coffee className="h-4 w-4" />
                  +15 Min. Pause
                </button>
                <button
                  onClick={clockOut}
                  disabled={clocking}
                  className="btn-danger flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Ausstempeln
                </button>
              </div>
            ) : (
              <button
                onClick={clockIn}
                disabled={clocking}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Einstempeln
              </button>
            )}
          </div>
        </div>

        {/* Active Timer */}
        {activeEntry && (
          <div className="mt-6 rounded-xl bg-emerald-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Clock className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-bold text-emerald-800">Aktive Session</p>
                  <p className="text-sm text-emerald-600">
                    Gestartet um {formatTime(activeEntry.clock_in)}
                    {activeEntry.pause_min > 0 && ` · ${activeEntry.pause_min} Min. Pause`}
                  </p>
                </div>
              </div>
              <LiveTimer startTime={activeEntry.clock_in} />
            </div>
          </div>
        )}
      </div>

      {/* Today's Entries */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-petrol-900">Heutige Einträge</h2>

        {entries.length === 0 ? (
          <div className="py-8 text-center text-petrol-400">
            <Clock className="mx-auto h-12 w-12 text-petrol-200" />
            <p className="mt-2">Noch keine Zeiteinträge heute</p>
            <p className="text-sm">Stempel dich ein, um zu beginnen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  entry.clock_out ? "border-petrol-100" : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    entry.clock_out ? "bg-petrol-50 text-petrol-600" : "bg-emerald-100 text-emerald-600"
                  }`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">
                      {formatTime(entry.clock_in)} – {entry.clock_out ? formatTime(entry.clock_out) : "offen"}
                    </p>
                    <p className="text-sm text-petrol-500">
                      {entry.clock_out ? `${getDuration(entry.clock_in, entry.clock_out, entry.pause_min)} Std.` : "Läuft..."}
                      {entry.pause_min > 0 && ` · ${entry.pause_min} Min. Pause`}
                      {entry.note && ` · ${entry.note}`}
                    </p>
                  </div>
                </div>
                {entry.clock_out ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    ✓ Abgeschlossen
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white animate-pulse">
                    Aktiv
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-petrol-900">Wochenübersicht</h2>
        <WeeklySummary employeeId={employee.id} supabase={supabase} />
      </div>
    </div>
  );
}

function LiveTimer({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <span className="text-2xl font-bold text-emerald-700">{elapsed}</span>;
}

function getDuration(start: string, end: string, pauseMin: number): string {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const totalMs = endTime - startTime - (pauseMin || 0) * 60 * 1000;
  return (totalMs / (1000 * 60 * 60)).toFixed(1);
}

function WeeklySummary({ employeeId, supabase }: { employeeId: string; supabase: ReturnType<typeof createClient> }) {
  const [weekData, setWeekData] = useState<{ day: string; hours: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      monday.setHours(0, 0, 0, 0);

      const { data: entries } = await supabase
        .from("time_entries")
        .select("clock_in, clock_out, pause_min")
        .eq("employee_id", employeeId)
        .gte("clock_in", monday.toISOString())
        .order("clock_in", { ascending: true });

      const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
      const weekSummary = days.map((day, i) => {
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + i);
        const dayStr = dayDate.toISOString().split("T")[0];

        const dayEntries = (entries || []).filter((e) => {
          const entryDate = e.clock_in.split("T")[0];
          return entryDate === dayStr;
        });

        const totalMs = dayEntries.reduce((acc, e) => {
          if (!e.clock_out) return acc;
          const inTime = new Date(e.clock_in).getTime();
          const outTime = new Date(e.clock_out).getTime();
          return acc + (outTime - inTime) - (e.pause_min || 0) * 60 * 1000;
        }, 0);

        const hours = totalMs / (1000 * 60 * 60);
        return { day, hours: hours > 0 ? hours.toFixed(1) : "0" };
      });

      setWeekData(weekSummary);
      setLoading(false);
    }
    load();
  }, [employeeId, supabase]);

  if (loading) {
    return <Loader2 className="h-6 w-6 animate-spin text-petrol-400" />;
  }

  const maxHours = Math.max(...weekData.map((d) => parseFloat(d.hours) || 0), 8);

  return (
    <div className="flex items-end gap-2">
      {weekData.map((d, i) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-32 w-full items-end justify-center">
            <div
              className={`w-full rounded-t-lg transition-all ${
                i === new Date().getDay() - 1 ? "bg-coral-500" : "bg-petrol-200"
              }`}
              style={{ height: `${Math.max(4, (parseFloat(d.hours) / maxHours) * 100)}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${
            i === new Date().getDay() - 1 ? "text-coral-600" : "text-petrol-500"
          }`}>
            {d.day}
          </span>
          <span className="text-xs text-petrol-400">{d.hours}h</span>
        </div>
      ))}
    </div>
  );
}