"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Application, Job, STAGES, Stage } from "@/lib/types";
import { Avatar, PageHeader, RatingStars, formatDate } from "@/components/ui";
import { GripVertical } from "lucide-react";

export default function PipelinePage() {
  const supabase = createClient();
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobFilter, setJobFilter] = useState<string>("alle");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [a, j] = await Promise.all([
      supabase
        .from("applications")
        .select("*, candidate:candidates(*), job:jobs(*)")
        .order("applied_at", { ascending: false }),
      supabase.from("jobs").select("*").order("title"),
    ]);
    setApps((a.data as Application[]) ?? []);
    setJobs((j.data as Job[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    jobFilter === "alle" ? apps : apps.filter((a) => a.job_id === jobFilter);

  async function moveTo(stage: Stage) {
    if (!dragId) return;
    const app = apps.find((a) => a.id === dragId);
    setOverStage(null);
    setDragId(null);
    if (!app || app.stage === stage) return;

    // Optimistisches Update
    setApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, stage } : a))
    );
    const { error } = await supabase
      .from("applications")
      .update({ stage, updated_at: new Date().toISOString() })
      .eq("id", app.id);
    if (error) load();
  }

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Pipeline…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Bewerbungen"
        subtitle="Ziehe Karten per Drag & Drop in die nächste Phase."
        action={
          <select
            className="input w-64"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="alle">Alle Stellen</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        }
      />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = filtered.filter((a) => a.stage === stage.key);
          const isOver = overStage === stage.key;
          return (
            <div
              key={stage.key}
              className={`flex w-72 shrink-0 flex-col rounded-xl2 border-2 transition ${
                isOver
                  ? "border-coral-400 bg-coral-400/5"
                  : "border-transparent bg-petrol-100/40"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage.key);
              }}
              onDragLeave={() => setOverStage(null)}
              onDrop={(e) => {
                e.preventDefault();
                moveTo(stage.key);
              }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${stage.color}`}
                >
                  {stage.label}
                </span>
                <span className="text-sm font-bold text-petrol-500">
                  {stageApps.length}
                </span>
              </div>

              <div className="flex-1 space-y-2.5 px-3 pb-3">
                {stageApps.map((a) => (
                  <div
                    key={a.id}
                    draggable
                    onDragStart={() => setDragId(a.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverStage(null);
                    }}
                    className={`card cursor-grab p-3.5 transition active:cursor-grabbing ${
                      dragId === a.id ? "opacity-40" : "hover:shadow-cardHover"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Avatar
                        name={`${a.candidate?.first_name} ${a.candidate?.last_name}`}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/recruiting/kandidaten/${a.candidate_id}`}
                          className="block truncate text-sm font-bold text-petrol-900 hover:text-petrol-600"
                        >
                          {a.candidate?.first_name} {a.candidate?.last_name}
                        </Link>
                        <p className="truncate text-xs text-petrol-400">
                          {a.job?.title}
                        </p>
                      </div>
                      <GripVertical className="h-4 w-4 shrink-0 text-petrol-200" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <RatingStars value={a.rating} size={13} />
                      <span className="text-[11px] text-petrol-400">
                        {formatDate(a.applied_at)}
                      </span>
                    </div>
                  </div>
                ))}
                {stageApps.length === 0 && (
                  <div className="rounded-lg border border-dashed border-petrol-200 px-3 py-6 text-center text-xs text-petrol-400">
                    Karten hierher ziehen
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
