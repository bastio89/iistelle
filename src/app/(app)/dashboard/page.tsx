"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Absence,
  Application,
  Employee,
  Interview,
  Job,
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
  CalendarClock,
  KanbanSquare,
  Plane,
  UserPlus,
} from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [j, a, i, e, ab] = await Promise.all([
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
      ]);
      setJobs((j.data as Job[]) ?? []);
      setApps((a.data as Application[]) ?? []);
      setInterviews((i.data as Interview[]) ?? []);
      setEmployees((e.data as Employee[]) ?? []);
      setAbsences((ab.data as Absence[]) ?? []);
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
