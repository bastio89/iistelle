"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, TimeEntry } from "@/lib/types";
import { formatDate } from "@/components/ui";
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function PortalZeiterfassungPage() {
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (!emp) {
      setLoading(false);
      return;
    }

    const employee = emp as Employee;
    setEmployee(employee);

    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

    const { data: te } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", employee.id)
      .gte("clock_in", monthStart.toISOString())
      .lte("clock_in", monthEnd.toISOString())
      .order("clock_in", { ascending: false });
    setTimeEntries((te as TimeEntry[]) ?? []);

    setLoading(false);
  }, [supabase, currentMonth]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleClockIn() {
    if (!employee) return;
    setClocking(true);
    await supabase.from("time_entries").insert({
      employee_id: employee.id,
      clock_in: new Date().toISOString(),
    });
    await load();
    setClocking(false);
  }

  async function handleClockOut() {
    const openEntry = timeEntries.find((t) => !t.clock_out);
    if (!openEntry) return;
    setClocking(true);
    await supabase
      .from("time_entries")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", openEntry.id);
    await load();
    setClocking(false);
  }

  function previousMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-petrol-200 border-t-coral-500" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-petrol-300" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Kein Mitarbeiterprofil</h2>
      </div>
    );
  }

  const openEntry = timeEntries.find((t) => !t.clock_out);

  // Calculate monthly stats
  const totalHours = timeEntries.reduce((sum, t) => {
    if (!t.clock_out) return sum;
    const hours = (new Date(t.clock_out).getTime() - new Date(t.clock_in).getTime()) / 3600000 - (t.pause_min || 0) / 60;
    return sum + Math.max(0, hours);
  }, 0);

  const totalWorkDays = new Set(
    timeEntries
      .filter((t) => t.clock_out)
      .map((t) => new Date(t.clock_in).toDateString())
  ).size;

  const avgHoursPerDay = totalWorkDays > 0 ? totalHours / totalWorkDays : 0;

  // Group entries by day
  const entriesByDay = timeEntries.reduce((acc, entry) => {
    const day = new Date(entry.clock_in).toDateString();
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-petrol-900">Zeiterfassung</h1>
          <p className="mt-1 text-petrol-500">Erfasse deine Arbeitszeit</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openEntry ? handleClockOut : handleClockIn}
            disabled={clocking}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition disabled:opacity-50 ${
              openEntry
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-petrol-900 text-white hover:bg-petrol-800"
            }`}
          >
            {openEntry ? (
              <>
                <LogOut className="h-5 w-5" />
                Ausstempeln
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Einstempeln
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Card */}
      {openEntry && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">Du bist eingestempelt</p>
              <p className="text-sm text-emerald-600">
                seit {new Date(openEntry.clock_in).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
              </p>
            </div>
          </div>
          <button
            onClick={handleClockOut}
            disabled={clocking}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Ausstempeln
          </button>
        </div>
      )}

      {/* Month Navigation & Stats */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="rounded-lg p-2 text-petrol-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-[180px] text-center">
            <p className="font-semibold text-petrol-900">
              {currentMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 text-petrol-600 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-4">
          <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm">
            <p className="text-2xl font-bold text-petrol-900">{totalHours.toFixed(1)}</p>
            <p className="text-xs text-petrol-500">Stunden gesamt</p>
          </div>
          <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm">
            <p className="text-2xl font-bold text-petrol-900">{totalWorkDays}</p>
            <p className="text-xs text-petrol-500">Arbeitstage</p>
          </div>
          <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm">
            <p className="text-2xl font-bold text-petrol-900">{avgHoursPerDay.toFixed(1)}</p>
            <p className="text-xs text-petrol-500">Ø Std/Tag</p>
          </div>
        </div>
      </div>

      {/* Time Entries by Day */}
      <div className="space-y-4">
        {Object.keys(entriesByDay).length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <Clock className="mx-auto h-12 w-12 text-petrol-300" />
            <p className="mt-4 text-petrol-500">Keine Zeiteinträge in diesem Monat.</p>
          </div>
        ) : (
          Object.entries(entriesByDay)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([day, entries]) => {
              const dayHours = entries.reduce((sum, t) => {
                if (!t.clock_out) return sum;
                const hours = (new Date(t.clock_out).getTime() - new Date(t.clock_in).getTime()) / 3600000 - (t.pause_min || 0) / 60;
                return sum + Math.max(0, hours);
              }, 0);

              return (
                <div key={day} className="rounded-2xl bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-petrol-400" />
                      <span className="font-medium text-petrol-900">
                        {new Date(day).toLocaleDateString("de-DE", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <span className="font-semibold text-petrol-700">
                      {dayHours.toFixed(1)} h
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {entries.map((entry) => {
                      const duration = entry.clock_out
                        ? (new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime()) / 3600000 - (entry.pause_min || 0) / 60
                        : null;

                      return (
                        <div key={entry.id} className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              entry.clock_out ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                            }`}>
                              {entry.clock_out ? (
                                <LogOut className="h-5 w-5" />
                              ) : (
                                <LogIn className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-petrol-900">
                                {new Date(entry.clock_in).toLocaleTimeString("de-DE", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {entry.clock_out
                                  ? ` – ${new Date(entry.clock_out).toLocaleTimeString("de-DE", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}`
                                  : " – läuft…"}
                              </p>
                              {entry.pause_min && entry.pause_min > 0 && (
                                <p className="text-xs text-petrol-400">Pause: {entry.pause_min} Min.</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${duration !== null ? "text-petrol-900" : "text-amber-600"}`}>
                              {duration !== null ? `${duration.toFixed(1)} h` : "⏳"}
                            </p>
                            {entry.note && (
                              <p className="text-xs text-petrol-400">{entry.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}