"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Employee, Absence, Goal, TimeEntry } from "@/lib/types";
import { formatDate } from "@/components/ui";
import {
  Plane,
  Clock,
  Target,
  FileText,
  LogIn,
  LogOut,
  Calendar,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PortalDashboard() {
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

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

    // Load absences
    const { data: abs } = await supabase
      .from("absences")
      .select("*")
      .eq("employee_id", employee.id)
      .order("start_date", { ascending: false });
    setAbsences((abs as Absence[]) ?? []);

    // Load goals
    const { data: g } = await supabase
      .from("goals")
      .select("*")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setGoals((g as Goal[]) ?? []);

    // Load time entries for this week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const { data: te } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", employee.id)
      .gte("clock_in", weekStart.toISOString())
      .order("clock_in", { ascending: false });
    setTimeEntries((te as TimeEntry[]) ?? []);

    setLoading(false);
  }, [supabase]);

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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-petrol-200 border-t-coral-500" />
          <p className="mt-4 text-petrol-500">Laden…</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-petrol-300" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Kein Mitarbeiterprofil gefunden</h2>
        <p className="mt-2 text-petrol-500">
          Dein Benutzerkonto ist keinem Mitarbeiterprofil zugeordnet.
        </p>
      </div>
    );
  }

  const fullName = `${employee.first_name} ${employee.last_name}`;
  const year = new Date().getFullYear();

  // Vacation stats
  const vacationEntitlement = employee.vacation_days_per_year + Number(employee.carryover_days || 0);
  const usedVacation = absences
    .filter(
      (a) =>
        a.absence_type === "urlaub" &&
        a.status === "genehmigt" &&
        new Date(a.start_date).getFullYear() === year
    )
    .reduce((s, a) => s + Number(a.days), 0);
  const pendingVacation = absences
    .filter(
      (a) =>
        a.absence_type === "urlaub" &&
        a.status === "beantragt"
    )
    .reduce((s, a) => s + Number(a.days), 0);
  const remainingVacation = vacationEntitlement - usedVacation;

  // Time tracking
  const openEntry = timeEntries.find((t) => !t.clock_out);
  const todayHours = timeEntries
    .filter((t) => {
      const today = new Date().toDateString();
      return new Date(t.clock_in).toDateString() === today && t.clock_out;
    })
    .reduce((sum, t) => {
      const hours = (new Date(t.clock_out!).getTime() - new Date(t.clock_in).getTime()) / 3600000 - (t.pause_min || 0) / 60;
      return sum + Math.max(0, hours);
    }, 0);

  // Goals
  const activeGoals = goals.filter((g) => g.status !== "erreicht" && g.status !== "verfehlt");
  const completedGoals = goals.filter((g) => g.status === "erreicht");

  // Recent absences
  const recentAbsences = absences.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-petrol-900">
          Guten Tag, {employee.first_name}! 👋
        </h1>
        <p className="mt-1 text-petrol-500">
          {employee.position} · {employee.department}
        </p>
      </div>

      {/* Quick Clock In/Out - Hero Card */}
      <div className={`rounded-2xl p-6 ${openEntry ? "bg-emerald-50" : "bg-petrol-900"}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${openEntry ? "bg-emerald-500 text-white" : "bg-white/10 text-white"}`}>
              {openEntry ? <Clock className="h-7 w-7" /> : <LogIn className="h-7 w-7" />}
            </div>
            <div>
              {openEntry ? (
                <>
                  <p className={`text-lg font-bold ${openEntry ? "text-emerald-800" : "text-white"}`}>
                    Du bist eingestempelt
                  </p>
                  <p className={`text-sm ${openEntry ? "text-emerald-600" : "text-white/70"}`}>
                    seit {new Date(openEntry.clock_in).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-white">Arbeitszeit erfassen</p>
                  <p className="text-sm text-white/70">
                    Heute {new Date().toLocaleDateString("de-DE", { weekday: "long" })}, {new Date().toLocaleDateString("de-DE")}
                  </p>
                </>
              )}
            </div>
          </div>
          {openEntry ? (
            <button
              onClick={handleClockOut}
              disabled={clocking}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <LogOut className="mr-2 inline h-5 w-5" />
              Ausstempeln
            </button>
          ) : (
            <button
              onClick={handleClockIn}
              disabled={clocking}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-petrol-900 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <LogIn className="mr-2 inline h-5 w-5" />
              Einstempeln
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Resturlaub */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-petrol-400">Resturlaub {year}</p>
              <p className="mt-1 text-3xl font-bold text-petrol-900">{remainingVacation}</p>
              <p className="text-xs text-petrol-400">von {vacationEntitlement} Tagen</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
              <Plane className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          {pendingVacation > 0 && (
            <p className="mt-3 text-xs text-amber-600">
              <Clock className="mr-1 inline h-3 w-3" />
              {pendingVacation} Tage ausstehend
            </p>
          )}
        </div>

        {/* Heute gearbeitet */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-petrol-400">Heute gearbeitet</p>
              <p className="mt-1 text-3xl font-bold text-petrol-900">
                {todayHours > 0 ? todayHours.toFixed(1) : "–"}
              </p>
              <p className="text-xs text-petrol-400">Stunden</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
              <Clock className="h-6 w-6 text-sky-600" />
            </div>
          </div>
        </div>

        {/* Aktive Ziele */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-petrol-400">Aktive Ziele</p>
              <p className="mt-1 text-3xl font-bold text-petrol-900">{activeGoals.length}</p>
              <p className="text-xs text-petrol-400">{completedGoals.length} erreicht</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
              <Target className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </div>

        {/* Offene Anträge */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-petrol-400">Offene Anträge</p>
              <p className="mt-1 text-3xl font-bold text-petrol-900">
                {absences.filter((a) => a.status === "beantragt").length}
              </p>
              <p className="text-xs text-petrol-400">Urlaub & Abwesenheit</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/portal/urlaub"
          className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral-100 text-coral-600">
            <Plane className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-petrol-900">Urlaub beantragen</p>
            <p className="text-xs text-petrol-400">Neuen Antrag stellen</p>
          </div>
          <ChevronRight className="h-5 w-5 text-petrol-300 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/portal/zeiterfassung"
          className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-petrol-900">Zeiterfassung</p>
            <p className="text-xs text-petrol-400">Stunden eintragen</p>
          </div>
          <ChevronRight className="h-5 w-5 text-petrol-300 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/portal/dokumente"
          className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-petrol-900">Meine Dokumente</p>
            <p className="text-xs text-petrol-400">Verträge & Zeugnisse</p>
          </div>
          <ChevronRight className="h-5 w-5 text-petrol-300 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/portal/ziele"
          className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Target className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-petrol-900">Meine Ziele</p>
            <p className="text-xs text-petrol-400">OKRs & Fortschritt</p>
          </div>
          <ChevronRight className="h-5 w-5 text-petrol-300 transition group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Letzte Abwesenheiten */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-petrol-900">Letzte Abwesenheiten</h2>
            <Link href="/portal/urlaub" className="text-sm font-medium text-coral-600 hover:underline">
              Alle anzeigen
            </Link>
          </div>
          {recentAbsences.length === 0 ? (
            <p className="text-sm text-petrol-400">Keine Abwesenheiten erfasst.</p>
          ) : (
            <div className="space-y-3">
              {recentAbsences.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      a.absence_type === "urlaub" ? "bg-teal-100 text-teal-800" :
                      a.absence_type === "krank" ? "bg-rose-100 text-rose-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {a.absence_type === "urlaub" ? "Urlaub" :
                       a.absence_type === "krank" ? "Krank" : "Sonstige"}
                    </span>
                    <span className="text-sm font-medium text-petrol-700">
                      {formatDate(a.start_date)} – {formatDate(a.end_date)}
                    </span>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    a.status === "genehmigt" ? "bg-emerald-100 text-emerald-800" :
                    a.status === "beantragt" ? "bg-amber-100 text-amber-800" :
                    "bg-rose-100 text-rose-700"
                  }`}>
                    {a.status === "genehmigt" ? "Genehmigt" :
                     a.status === "beantragt" ? "Ausstehend" : "Abgelehnt"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aktive Ziele */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-petrol-900">Aktive Ziele</h2>
            <Link href="/portal/ziele" className="text-sm font-medium text-coral-600 hover:underline">
              Alle anzeigen
            </Link>
          </div>
          {activeGoals.length === 0 ? (
            <p className="text-sm text-petrol-400">Keine aktiven Ziele definiert.</p>
          ) : (
            <div className="space-y-3">
              {activeGoals.slice(0, 3).map((g) => (
                <div key={g.id} className="rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-petrol-900">{g.title}</p>
                    <span className="text-sm font-bold text-petrol-700">{g.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-petrol-600 transition-all"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}