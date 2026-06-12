"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Absence,
  Application,
  Employee,
  HrTask,
  Interview,
  Job,
  OnboardingTask,
  STAGES,
} from "@/lib/types";
import {
  Avatar,
  PageHeader,
  StatCard,
  StageBadge,
  formatDateTime,
} from "@/components/ui";
import {
  ArrowRight,
  Briefcase,
  Cake,
  CalendarClock,
  Hourglass,
  KanbanSquare,
  ListTodo,
  PartyPopper,
  Plane,
  Rocket,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useRole } from "@/lib/useRole";

export default function DashboardPage() {
  const supabase = createClient();
  const { company } = useRole();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [hrTasks, setHrTasks] = useState<HrTask[]>([]);
  const [obTasks, setObTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [j, a, i, e, ab, ht, ob] = await Promise.all([
        supabase.from("jobs").select("*"),
        supabase.from("applications").select("*, candidate:candidates(*), job:jobs(*)"),
        supabase
          .from("interviews")
          .select("*, application:applications(*, candidate:candidates(*), job:jobs(*))")
          .eq("status", "geplant")
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at")
          .limit(5),
        supabase.from("employees").select("*"),
        supabase.from("absences").select("*"),
        supabase
          .from("hr_tasks")
          .select("*")
          .eq("done", false)
          .order("due_date", { ascending: true, nullsFirst: false })
          .limit(5),
        supabase.from("onboarding_tasks").select("*"),
      ]);
      setJobs((j.data as Job[]) ?? []);
      setApps((a.data as Application[]) ?? []);
      setInterviews((i.data as Interview[]) ?? []);
      setEmployees((e.data as Employee[]) ?? []);
      setAbsences((ab.data as Absence[]) ?? []);
      setHrTasks((ht.data as HrTask[]) ?? []);
      setObTasks((ob.data as OnboardingTask[]) ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openJobs = jobs.filter((j) => j.status === "veroeffentlicht").length;
  const activeApps = apps.filter(
    (a) => !["eingestellt", "abgelehnt"].includes(a.stage)
  );
  const hired = apps.filter((a) => a.stage === "eingestellt").length;
  const newThisWeek = apps.filter(
    (a) => Date.now() - new Date(a.applied_at).getTime() < 7 * 86400000
  ).length;

  const activeEmployees = employees.filter((e) => e.status === "aktiv").length;
  const onboardingCount = employees.filter((e) => e.status === "onboarding").length;
  const pendingAbsences = absences.filter((a) => a.status === "beantragt").length;
  const todayIso = new Date().toISOString().slice(0, 10);
  const absentToday = absences.filter(
    (a) => a.status === "genehmigt" && a.start_date <= todayIso && a.end_date >= todayIso
  ).length;

  const recentApps = [...apps]
    .sort((a, b) => +new Date(b.applied_at) - +new Date(a.applied_at))
    .slice(0, 6);

  // Geburtstage & Jubiläen der nächsten 30 Tage
  const upcoming: { name: string; label: string; days: number; icon: "cake" | "party" }[] = [];
  const now2 = new Date();
  employees
    .filter((e) => e.status !== "ausgeschieden")
    .forEach((e) => {
      const check = (dateStr: string | null, icon: "cake" | "party", what: string) => {
        if (!dateStr) return;
        const d = new Date(dateStr);
        const next = new Date(now2.getFullYear(), d.getMonth(), d.getDate());
        if (next < new Date(now2.getFullYear(), now2.getMonth(), now2.getDate())) {
          next.setFullYear(next.getFullYear() + 1);
        }
        const days = Math.round((next.getTime() - now2.getTime()) / 86400000);
        if (days <= 30) {
          const years = next.getFullYear() - d.getFullYear();
          upcoming.push({
            name: `${e.first_name} ${e.last_name}`,
            label: what === "geb" ? `${years}. Geburtstag` : `${years}. Firmenjubiläum`,
            days,
            icon,
          });
        }
      };
      check(e.birth_date, "cake", "geb");
      check(e.hire_date, "party", "jub");
    });
  upcoming.sort((a, b) => a.days - b.days);

  // Endende Probezeiten (nächste 30 Tage)
  const probationMonths = company?.probation_months ?? 6;
  const probations = employees
    .filter((e) => e.status !== "ausgeschieden")
    .map((e) => {
      const end = new Date(e.hire_date);
      end.setMonth(end.getMonth() + probationMonths);
      const days = Math.round((end.getTime() - Date.now()) / 86400000);
      return { employee: e, end, days };
    })
    .filter((p) => p.days >= 0 && p.days <= 30)
    .sort((a, b) => a.days - b.days);

  // Headcount-Entwicklung der letzten 12 Monate
  const months: { label: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const ref = new Date();
    ref.setMonth(ref.getMonth() - i);
    const monthEnd = new Date(ref.getFullYear(), ref.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);
    const count = employees.filter((e) => {
      if (e.hire_date > monthEnd) return false;
      if (e.exit_date) return e.exit_date > monthEnd;
      return e.status !== "ausgeschieden";
    }).length;
    months.push({
      label: ref.toLocaleDateString("de-DE", { month: "short" }),
      count,
    });
  }
  const maxHeadcount = Math.max(...months.map((m) => m.count), 1);

  // Laufende Onboardings mit Fortschritt
  const onboardings = employees
    .filter((e) => e.status === "onboarding")
    .map((e) => {
      const tasks = obTasks.filter((t) => t.employee_id === e.id);
      const done = tasks.filter((t) => t.done).length;
      return { employee: e, done, total: tasks.length };
    });

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Dashboard…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Guten Tag 👋"
        subtitle="Hier ist der aktuelle Stand deines Recruitings."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Offene Stellen" value={openJobs} sub={`${jobs.length} insgesamt`} />
        <StatCard
          label="Aktive Bewerbungen"
          value={activeApps.length}
          sub={`${newThisWeek} neu diese Woche`}
          accent
        />
        <StatCard label="Geplante Interviews" value={interviews.length} sub="nächste Termine" />
        <StatCard label="Einstellungen" value={hired} sub="in diesem Zeitraum" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Aktive Mitarbeiter" value={activeEmployees} sub={`${onboardingCount} im Onboarding`} />
        <StatCard label="Offene Anträge" value={pendingAbsences} sub="Abwesenheiten" accent={pendingAbsences > 0} />
        <StatCard label="Heute abwesend" value={absentToday} sub="genehmigt" />
        <StatCard label="Kandidaten-Pool" value={apps.length} sub="Bewerbungen gesamt" />
      </div>

      {/* Schnellaktionen */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { href: "/recruiting", label: "Stelle anlegen", icon: Briefcase },
          { href: "/recruiting/bewerbungen", label: "Pipeline öffnen", icon: KanbanSquare },
          { href: "/abwesenheiten", label: "Antrag stellen", icon: Plane },
          { href: "/mitarbeiter", label: "Mitarbeiter anlegen", icon: UserPlus },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="card flex items-center gap-3 px-4 py-3 transition hover:shadow-cardHover"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-petrol-900">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Neueste Bewerbungen */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-petrol-100 px-5 py-4">
            <h2 className="font-bold text-petrol-900">Neueste Bewerbungen</h2>
            <Link
              href="/recruiting/bewerbungen"
              className="flex items-center gap-1 text-sm font-semibold text-petrol-600 hover:text-petrol-800"
            >
              Pipeline öffnen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-petrol-50">
            {recentApps.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/recruiting/kandidaten/${a.candidate_id}`}
                  className="flex items-center gap-3 px-5 py-3 transition hover:bg-petrol-50/50"
                >
                  <Avatar
                    name={`${a.candidate?.first_name} ${a.candidate?.last_name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-petrol-900">
                      {a.candidate?.first_name} {a.candidate?.last_name}
                    </p>
                    <p className="truncate text-xs text-petrol-400">
                      {a.job?.title}
                    </p>
                  </div>
                  <StageBadge stage={a.stage} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {/* Anstehende Interviews */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-petrol-100 px-5 py-4">
              <h2 className="font-bold text-petrol-900">Anstehende Interviews</h2>
              <Link
                href="/recruiting/interviews"
                className="flex items-center gap-1 text-sm font-semibold text-petrol-600 hover:text-petrol-800"
              >
                Alle <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {interviews.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-petrol-400">
                Keine anstehenden Interviews.
              </p>
            ) : (
              <ul className="divide-y divide-petrol-50">
                {interviews.map((iv) => (
                  <li key={iv.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-petrol-900">
                        {iv.application?.candidate?.first_name}{" "}
                        {iv.application?.candidate?.last_name} · {iv.title}
                      </p>
                      <p className="text-xs text-petrol-400">
                        {formatDateTime(iv.scheduled_at)} · {iv.interviewer}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pipeline-Verteilung */}
          <div className="card p-5">
            <h2 className="mb-4 font-bold text-petrol-900">Pipeline-Verteilung</h2>
            <div className="space-y-2.5">
              {STAGES.map((s) => {
                const count = apps.filter((a) => a.stage === s.key).length;
                const pct = apps.length ? (count / apps.length) * 100 : 0;
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs font-medium text-petrol-500">
                      {s.label}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-petrol-50">
                      <div
                        className="h-full rounded-full bg-petrol-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs font-bold text-petrol-700">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Aufgaben, Jubiläen, Onboarding */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-center justify-between border-b border-petrol-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-petrol-900">
              <ListTodo className="h-4 w-4 text-petrol-500" /> Offene Aufgaben
            </h2>
            <Link
              href="/aufgaben"
              className="text-sm font-semibold text-petrol-600 hover:text-petrol-800"
            >
              Alle →
            </Link>
          </div>
          {hrTasks.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-petrol-400">
              Keine offenen Aufgaben. 🎉
            </p>
          ) : (
            <ul className="divide-y divide-petrol-50">
              {hrTasks.map((t) => (
                <li key={t.id} className="px-5 py-3">
                  <p className="text-sm font-semibold text-petrol-900">{t.title}</p>
                  <p className="text-xs text-petrol-400">
                    {t.assignee && `${t.assignee} · `}
                    {t.due_date
                      ? `fällig ${new Date(t.due_date).toLocaleDateString("de-DE")}`
                      : "ohne Frist"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="border-b border-petrol-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-petrol-900">
              <Cake className="h-4 w-4 text-petrol-500" /> Anstehende Anlässe
            </h2>
          </div>
          {upcoming.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-petrol-400">
              Keine Geburtstage oder Jubiläen in den nächsten 30 Tagen.
            </p>
          ) : (
            <ul className="divide-y divide-petrol-50">
              {upcoming.slice(0, 5).map((u, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
                    {u.icon === "cake" ? (
                      <Cake className="h-4 w-4" />
                    ) : (
                      <PartyPopper className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-petrol-900">
                      {u.name}
                    </p>
                    <p className="text-xs text-petrol-400">{u.label}</p>
                  </div>
                  <span className="text-xs font-bold text-petrol-600">
                    {u.days === 0 ? "Heute!" : `in ${u.days} T.`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="border-b border-petrol-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-petrol-900">
              <Rocket className="h-4 w-4 text-petrol-500" /> Laufende Onboardings
            </h2>
          </div>
          {onboardings.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-petrol-400">
              Aktuell keine Onboardings.
            </p>
          ) : (
            <ul className="divide-y divide-petrol-50">
              {onboardings.map(({ employee, done, total }) => (
                <li key={employee.id}>
                  <Link
                    href={`/mitarbeiter/${employee.id}`}
                    className="block px-5 py-3 transition hover:bg-petrol-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-petrol-900">
                        {employee.first_name} {employee.last_name}
                      </p>
                      <span className="text-xs font-bold text-petrol-600">
                        {total > 0 ? `${done}/${total}` : "–"}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-petrol-50">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: total > 0 ? `${(done / total) * 100}%` : "0%",
                        }}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Probezeiten & Headcount */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="border-b border-petrol-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-petrol-900">
              <Hourglass className="h-4 w-4 text-petrol-500" /> Endende Probezeiten
            </h2>
            <p className="text-xs text-petrol-400">
              in den nächsten 30 Tagen ({probationMonths} Monate Probezeit)
            </p>
          </div>
          {probations.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-petrol-400">
              Keine Probezeiten enden in den nächsten 30 Tagen.
            </p>
          ) : (
            <ul className="divide-y divide-petrol-50">
              {probations.map(({ employee, end, days }) => (
                <li key={employee.id}>
                  <Link
                    href={`/mitarbeiter/${employee.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-petrol-50/50"
                  >
                    <Avatar name={`${employee.first_name} ${employee.last_name}`} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-petrol-900">
                        {employee.first_name} {employee.last_name}
                      </p>
                      <p className="text-xs text-petrol-400">
                        Probezeit endet am {end.toLocaleDateString("de-DE")} – Feedbackgespräch planen
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        days <= 7 ? "bg-coral-500 text-white" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {days === 0 ? "Heute" : `in ${days} T.`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-1 flex items-center gap-2 font-bold text-petrol-900">
            <TrendingUp className="h-4 w-4 text-petrol-500" /> Headcount-Entwicklung
          </h2>
          <p className="mb-4 text-xs text-petrol-400">
            Mitarbeiterzahl zum Monatsende, letzte 12 Monate
          </p>
          <div className="flex h-36 items-end gap-1.5">
            {months.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-petrol-600">{m.count}</span>
                <div
                  className={`w-full rounded-t ${
                    i === months.length - 1 ? "bg-coral-500" : "bg-petrol-600"
                  }`}
                  style={{ height: `${Math.max((m.count / maxHeadcount) * 100, 3)}%` }}
                  title={`${m.label}: ${m.count}`}
                />
                <span className="text-[10px] text-petrol-400">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/recruiting"
          className="card flex items-center gap-4 p-5 transition hover:shadow-cardHover"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-petrol-800 text-white">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-petrol-900">Stellen verwalten</p>
            <p className="text-sm text-petrol-500">
              Neue Stellen anlegen, veröffentlichen und Bewerbungen zuordnen.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-petrol-400" />
        </Link>
      </div>
    </div>
  );
}
