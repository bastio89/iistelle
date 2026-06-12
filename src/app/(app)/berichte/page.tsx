"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Absence,
  Application,
  Employee,
  Job,
  STAGES,
} from "@/lib/types";
import { useRole } from "@/lib/useRole";
import { PageHeader } from "@/components/ui";
import PremiumGate from "@/components/PremiumGate";
import { Printer } from "lucide-react";

export default function ReportsPageGated() {
  return (
    <PremiumGate feature="Management-Berichte">
      <ReportsPage />
    </PremiumGate>
  );
}

function ReportsPage() {
  const supabase = createClient();
  const { company } = useRole();
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [a, j, e, ab] = await Promise.all([
        supabase.from("applications").select("*"),
        supabase.from("jobs").select("*"),
        supabase.from("employees").select("*"),
        supabase.from("absences").select("*"),
      ]);
      setApps((a.data as Application[]) ?? []);
      setJobs((j.data as Job[]) ?? []);
      setEmployees((e.data as Employee[]) ?? []);
      setAbsences((ab.data as Absence[]) ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Bericht…</p>;
  }

  const monthName = new Date().toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const newApps = apps.filter((a) => new Date(a.applied_at) >= monthStart);
  const hired = apps.filter(
    (a) => a.stage === "eingestellt" && new Date(a.updated_at) >= monthStart
  );
  const activeEmployees = employees.filter((e) => e.status !== "ausgeschieden");
  const openJobs = jobs.filter((j) => j.status === "veroeffentlicht");
  const pendingAbs = absences.filter((a) => a.status === "beantragt");

  const funnel = STAGES.map((s) => ({
    label: s.label,
    count: apps.filter((a) => a.stage === s.key).length,
  }));

  return (
    <div>
      <div className="print:hidden">
        <PageHeader
          title="Berichte"
          subtitle="Management-Report zum Ausdrucken oder als PDF speichern."
          action={
            <button className="btn-primary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Als PDF speichern / Drucken
            </button>
          }
        />
      </div>

      {/* Druckoptimierter Report */}
      <div className="card p-10 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between border-b-2 border-petrol-900 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-petrol-900">
              HR-Report · {monthName}
            </h1>
            <p className="mt-1 text-petrol-500">{company?.name ?? "—"}</p>
          </div>
          <div className="text-right text-sm text-petrol-400">
            <p>Erstellt am {new Date().toLocaleDateString("de-DE")}</p>
            <p>iistelle HR</p>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-bold text-petrol-900">Überblick</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Aktive Mitarbeiter", activeEmployees.length],
            ["Offene Stellen", openJobs.length],
            ["Neue Bewerbungen (Monat)", newApps.length],
            ["Einstellungen (Monat)", hired.length],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-xl border border-petrol-100 p-4">
              <p className="text-3xl font-bold text-petrol-900">{value as number}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-petrol-400">
                {label as string}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-lg font-bold text-petrol-900">
          Recruiting-Pipeline (gesamt)
        </h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-petrol-200 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
              <th className="py-2">Phase</th>
              <th className="py-2 text-right">Bewerbungen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-petrol-100">
            {funnel.map((f) => (
              <tr key={f.label}>
                <td className="py-2 font-medium text-petrol-800">{f.label}</td>
                <td className="py-2 text-right font-bold text-petrol-900">{f.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-10 text-lg font-bold text-petrol-900">Offene Stellen</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-petrol-200 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
              <th className="py-2">Stelle</th>
              <th className="py-2">Abteilung</th>
              <th className="py-2 text-right">Bewerbungen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-petrol-100">
            {openJobs.map((j) => (
              <tr key={j.id}>
                <td className="py-2 font-medium text-petrol-800">{j.title}</td>
                <td className="py-2 text-petrol-500">{j.department}</td>
                <td className="py-2 text-right font-bold text-petrol-900">
                  {apps.filter((a) => a.job_id === j.id).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-10 text-lg font-bold text-petrol-900">Personal</h2>
        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-petrol-100 p-4">
            <p className="text-2xl font-bold text-petrol-900">
              {employees.filter((e) => e.status === "onboarding").length}
            </p>
            <p className="text-xs font-semibold uppercase text-petrol-400">Im Onboarding</p>
          </div>
          <div className="rounded-xl border border-petrol-100 p-4">
            <p className="text-2xl font-bold text-petrol-900">{pendingAbs.length}</p>
            <p className="text-xs font-semibold uppercase text-petrol-400">Offene Anträge</p>
          </div>
          <div className="rounded-xl border border-petrol-100 p-4">
            <p className="text-2xl font-bold text-petrol-900">
              {
                absences.filter(
                  (a) =>
                    a.status === "genehmigt" &&
                    new Date(a.start_date) >= monthStart &&
                    a.absence_type === "krank"
                ).length
              }
            </p>
            <p className="text-xs font-semibold uppercase text-petrol-400">
              Krankmeldungen (Monat)
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-petrol-100 pt-4 text-xs text-petrol-400">
          Automatisch erstellt mit iistelle HR · Vertraulich
        </p>
      </div>
    </div>
  );
}
