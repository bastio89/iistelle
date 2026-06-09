"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Application, Candidate, Job, STAGES } from "@/lib/types";
import { PageHeader, StatCard } from "@/components/ui";

export default function ReportsPage() {
  const supabase = createClient();
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [a, j, c] = await Promise.all([
        supabase.from("applications").select("*, job:jobs(*)"),
        supabase.from("jobs").select("*"),
        supabase.from("candidates").select("*"),
      ]);
      setApps((a.data as Application[]) ?? []);
      setJobs((j.data as Job[]) ?? []);
      setCandidates((c.data as Candidate[]) ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Auswertungen…</p>;
  }

  const hired = apps.filter((a) => a.stage === "eingestellt");
  const rejected = apps.filter((a) => a.stage === "abgelehnt");
  const conversion = apps.length ? Math.round((hired.length / apps.length) * 100) : 0;

  // Durchschnittliche Zeit bis Einstellung (Tage)
  const avgTimeToHire =
    hired.length > 0
      ? Math.round(
          hired.reduce(
            (s, a) =>
              s +
              (new Date(a.updated_at).getTime() - new Date(a.applied_at).getTime()) /
                86400000,
            0
          ) / hired.length
        )
      : null;

  // Funnel (kumulativ: wer mindestens Phase X erreicht hat)
  const funnelStages = STAGES.filter((s) => s.key !== "abgelehnt");
  const stageOrder = funnelStages.map((s) => s.key);
  const funnel = funnelStages.map((s, idx) => {
    const count = apps.filter((a) => {
      const pos = stageOrder.indexOf(a.stage as (typeof stageOrder)[number]);
      return pos >= idx;
    }).length;
    return { ...s, count };
  });
  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1);

  // Quellen
  const sources = candidates.reduce<Record<string, number>>((acc, c) => {
    const key = c.source || "Unbekannt";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const sourceEntries = Object.entries(sources).sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(...sourceEntries.map(([, v]) => v), 1);

  // Bewerbungen pro Stelle
  const perJob = jobs
    .map((j) => ({
      job: j,
      count: apps.filter((a) => a.job_id === j.id).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxPerJob = Math.max(...perJob.map((p) => p.count), 1);

  return (
    <div>
      <PageHeader
        title="Auswertungen"
        subtitle="Kennzahlen für ein schnelleres, schlankeres Recruiting."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Bewerbungen gesamt" value={apps.length} />
        <StatCard
          label="Time-to-Hire"
          value={avgTimeToHire !== null ? `${avgTimeToHire} Tage` : "–"}
          sub="Ø von Eingang bis Einstellung"
          accent
        />
        <StatCard label="Conversion" value={`${conversion}%`} sub="Eingang → Einstellung" />
        <StatCard
          label="Absagequote"
          value={`${apps.length ? Math.round((rejected.length / apps.length) * 100) : 0}%`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Funnel */}
        <div className="card p-6">
          <h2 className="mb-5 font-bold text-petrol-900">Recruiting-Funnel</h2>
          <div className="space-y-3">
            {funnel.map((f) => (
              <div key={f.key}>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-petrol-600">{f.label}</span>
                  <span className="text-petrol-900">{f.count}</span>
                </div>
                <div className="h-7 overflow-hidden rounded-lg bg-petrol-50">
                  <div
                    className="flex h-full items-center rounded-lg bg-gradient-to-r from-petrol-700 to-petrol-500 px-2 text-[11px] font-bold text-white transition-all"
                    style={{ width: `${Math.max((f.count / maxFunnel) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quellen */}
        <div className="card p-6">
          <h2 className="mb-5 font-bold text-petrol-900">Kandidaten-Quellen</h2>
          <div className="space-y-3">
            {sourceEntries.map(([source, count]) => (
              <div key={source} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs font-medium text-petrol-500">
                  {source}
                </span>
                <div className="h-5 flex-1 overflow-hidden rounded-md bg-petrol-50">
                  <div
                    className="h-full rounded-md bg-coral-500"
                    style={{ width: `${(count / maxSource) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-bold text-petrol-700">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bewerbungen pro Stelle */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-5 font-bold text-petrol-900">Bewerbungen pro Stelle</h2>
          <div className="space-y-3">
            {perJob.map(({ job, count }) => (
              <div key={job.id} className="flex items-center gap-3">
                <span className="w-64 shrink-0 truncate text-xs font-medium text-petrol-600">
                  {job.title}
                </span>
                <div className="h-5 flex-1 overflow-hidden rounded-md bg-petrol-50">
                  <div
                    className="h-full rounded-md bg-petrol-600"
                    style={{ width: `${(count / maxPerJob) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-bold text-petrol-700">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
