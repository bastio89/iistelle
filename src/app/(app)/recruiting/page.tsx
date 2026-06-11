"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Application, Job } from "@/lib/types";
import {
  EmptyState,
  JobStatusBadge,
  PageHeader,
  StatCard,
} from "@/components/ui";
import JobFormModal from "@/components/JobFormModal";
import { Copy, MapPin, Users, Plus, Megaphone } from "lucide-react";

export default function JobsPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [filter, setFilter] = useState<string>("alle");
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [j, a] = await Promise.all([
      supabase.from("jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("*"),
    ]);
    setJobs((j.data as Job[]) ?? []);
    setApps((a.data as Application[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function duplicateJob(job: Job) {
    await supabase.from("jobs").insert({
      title: `${job.title} (Kopie)`,
      department: job.department,
      location: job.location,
      employment_type: job.employment_type,
      seniority: job.seniority,
      status: "entwurf",
      description: job.description,
      recruiter: job.recruiter,
      target_hires: job.target_hires,
      channels: job.channels,
    });
    load();
  }

  const filtered =
    filter === "alle" ? jobs : jobs.filter((j) => j.status === filter);

  const published = jobs.filter((j) => j.status === "veroeffentlicht").length;
  const activeApps = apps.filter(
    (a) => !["eingestellt", "abgelehnt"].includes(a.stage)
  ).length;

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Stellen…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Stellen"
        subtitle="Verwalte alle offenen Positionen und deren Veröffentlichung."
        action={
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Neue Stelle
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Veröffentlicht" value={published} />
        <StatCard label="Aktive Bewerbungen" value={activeApps} accent />
        <StatCard
          label="Ø Bewerbungen / Stelle"
          value={jobs.length ? Math.round(apps.length / jobs.length) : 0}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["alle", "Alle"],
          ["veroeffentlicht", "Veröffentlicht"],
          ["entwurf", "Entwürfe"],
          ["pausiert", "Pausiert"],
          ["geschlossen", "Geschlossen"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === key
                ? "bg-petrol-800 text-white"
                : "bg-white text-petrol-600 shadow-card hover:bg-petrol-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Keine Stellen gefunden"
          hint="Lege über „Neue Stelle“ deine erste Position an."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((job) => {
            const jobApps = apps.filter((a) => a.job_id === job.id);
            const active = jobApps.filter(
              (a) => !["eingestellt", "abgelehnt"].includes(a.stage)
            ).length;
            const hired = jobApps.filter((a) => a.stage === "eingestellt").length;
            const target = Math.max(job.target_hires, 1);
            return (
              <div
                key={job.id}
                className="card group p-5 transition hover:shadow-cardHover"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/recruiting/jobs/${job.id}`} className="min-w-0">
                    <h3 className="truncate font-bold text-petrol-900 group-hover:text-petrol-600">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-petrol-500">
                      {job.department} · {job.seniority}
                    </p>
                  </Link>
                  <JobStatusBadge status={job.status} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-petrol-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {active} aktiv · {jobApps.length} gesamt
                  </span>
                  {job.channels.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Megaphone className="h-4 w-4" /> {job.channels.length} Kanäle
                    </span>
                  )}
                </div>

                {/* Besetzungs-Fortschritt */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-petrol-50">
                    <div
                      className={`h-full rounded-full transition-all ${
                        hired >= target ? "bg-emerald-500" : "bg-petrol-600"
                      }`}
                      style={{ width: `${Math.min((hired / target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-petrol-600">
                    {hired}/{target} besetzt
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-petrol-50 pt-3">
                  <span className="text-xs text-petrol-400">
                    {job.employment_type} · Recruiter: {job.recruiter || "–"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded p-1 text-petrol-400 transition hover:bg-petrol-50 hover:text-petrol-700"
                      onClick={() => duplicateJob(job)}
                      title="Stelle duplizieren"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      className="text-sm font-semibold text-petrol-600 hover:text-petrol-800"
                      onClick={() => setEditJob(job)}
                    >
                      Bearbeiten
                    </button>
                    <Link
                      href={`/recruiting/jobs/${job.id}`}
                      className="text-sm font-semibold text-coral-500 hover:text-coral-600"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showForm || editJob) && (
        <JobFormModal
          job={editJob}
          onClose={() => {
            setShowForm(false);
            setEditJob(null);
          }}
          onSaved={load}
        />
      )}
    </div>
  );
}
