"use client";

import { createClient } from "@/lib/supabase/client";
import { Clock, Calendar, FileText, Target, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/components/ui";

interface PortalStats {
  timeEntriesToday: number;
  pendingAbsences: number;
  goalsProgress: number;
  documentsCount: number;
}

export default function PortalPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<PortalStats>({
    timeEntriesToday: 0,
    pendingAbsences: 0,
    goalsProgress: 0,
    documentsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get employee data
        const { data: employee } = await supabase
          .from("employees")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (employee) {
          // Get today's time entries
          const today = new Date().toISOString().slice(0, 10);
          const { data: timeEntries } = await supabase
            .from("time_entries")
            .select("*")
            .eq("employee_id", employee.id)
            .gte("clock_in", today)
            .lt("clock_in", `${today}T23:59:59`);

          if (timeEntries && timeEntries.length > 0) {
            const lastEntry = timeEntries[timeEntries.length - 1];
            if (!lastEntry.clock_out) {
              setClockInTime(lastEntry.clock_in);
              setWorking(true);
            }
          }

          // Get pending absences
          const { data: absences } = await supabase
            .from("absences")
            .select("*")
            .eq("employee_id", employee.id)
            .eq("status", "beantragt");

          // Get goals
          const { data: goals } = await supabase
            .from("goals")
            .select("*")
            .eq("employee_id", employee.id);

          const avgProgress = goals && goals.length > 0
            ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
            : 0;

          setStats({
            timeEntriesToday: timeEntries?.length || 0,
            pendingAbsences: absences?.length || 0,
            goalsProgress: avgProgress,
            documentsCount: 0,
          });
        }
      }

      setLoading(false);
    };

    loadData();
  }, [supabase]);

  async function toggleClock() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: employee } = await supabase
      .from("employees")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!employee) return;

    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    if (working) {
      // Clock out
      const { data: entries } = await supabase
        .from("time_entries")
        .select("id")
        .eq("employee_id", employee.id)
        .gte("clock_in", today)
        .is("clock_out", null)
        .order("clock_in", { ascending: false })
        .limit(1);

      if (entries && entries.length > 0) {
        await supabase
          .from("time_entries")
          .update({ clock_out: now })
          .eq("id", entries[0].id);
      }
      setWorking(false);
      setClockInTime(null);
    } else {
      // Clock in
      await supabase.from("time_entries").insert({
        employee_id: employee.id,
        clock_in: now,
        pause_min: 0,
      });
      setClockInTime(now);
      setWorking(true);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
      </div>
    );
  }

  const firstName = user?.user_metadata?.first_name || "Mitarbeiter";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-petrol-900">
          Guten Morgen, {firstName}! 👋
        </h1>
        <p className="mt-1 text-petrol-500">
          {new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Clock In/Out Card */}
        <div className="card p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coral-100">
            <Clock className="h-6 w-6 text-coral-600" />
          </div>
          <h3 className="font-semibold text-petrol-900">Zeiterfassung</h3>
          <p className="mt-1 text-sm text-petrol-500">
            {working ? `Gestempelt seit ${new Date(clockInTime!).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}` : "Noch nicht eingestempelt"}
          </p>
          <button
            onClick={toggleClock}
            className={`mt-4 w-full rounded-lg px-4 py-2.5 font-semibold transition ${
              working
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {working ? "Ausstempeln" : "Einstempeln"}
          </button>
        </div>

        {/* Vacation Card */}
        <Link href="/portal/urlaub" className="card p-6 transition hover:border-petrol-300">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <Calendar className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-petrol-900">Urlaub</h3>
          <p className="mt-1 text-sm text-petrol-500">
            {stats.pendingAbsences > 0
              ? `${stats.pendingAbsences} Antrag${stats.pendingAbsences > 1 ? "e" : ""} ausstehend`
              : "Alle Anträge bearbeitet"}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-coral-600">
            Urlaub beantragen <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>

        {/* Goals Card */}
        <Link href="/portal/performance" className="card p-6 transition hover:border-petrol-300">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
            <Target className="h-6 w-6 text-violet-600" />
          </div>
          <h3 className="font-semibold text-petrol-900">Ziele</h3>
          <p className="mt-1 text-sm text-petrol-500">
            {stats.goalsProgress}% durchschnittlicher Fortschritt
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-petrol-100">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${stats.goalsProgress}%` }}
            />
          </div>
        </Link>

        {/* Documents Card */}
        <Link href="/portal/dokumente" className="card p-6 transition hover:border-petrol-300">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
            <FileText className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="font-semibold text-petrol-900">Dokumente</h3>
          <p className="mt-1 text-sm text-petrol-500">
            Verträge, Zeugnisse & Bescheinigungen
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-coral-600">
            Ansehen <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Profile Summary */}
      <div className="card p-6">
        <h3 className="font-semibold text-petrol-900">Dein Profil</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase text-petrol-400">E-Mail</p>
            <p className="mt-1 text-petrol-700">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-petrol-400">Name</p>
            <p className="mt-1 text-petrol-700">
              {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-petrol-400">Letzter Login</p>
            <p className="mt-1 text-petrol-700">
              {formatDate(user?.last_sign_in_at || new Date().toISOString())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}