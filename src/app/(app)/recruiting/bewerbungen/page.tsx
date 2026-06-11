"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Application, Job, STAGES, Stage } from "@/lib/types";
import { Avatar, Modal, PageHeader, RatingStars, formatDate } from "@/components/ui";
import { logActivity } from "@/lib/activity";
import { GripVertical } from "lucide-react";

export default function PipelinePage() {
  const supabase = createClient();
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobFilter, setJobFilter] = useState<string>("alle");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [rejectApp, setRejectApp] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState("");
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

    // Beim Ablehnen nach dem Grund fragen
    if (stage === "abgelehnt") {
      setRejectApp(app);
      setRejectReason("");
      return;
    }

    // Optimistisches Update
    setApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, stage } : a))
    );
    const { error } = await supabase
      .from("applications")
      .update({ stage, updated_at: new Date().toISOString() })
      .eq("id", app.id);
    if (error) {
      load();
    } else {
      const label = STAGES.find((s) => s.key === stage)?.label ?? stage;
      logActivity(app.candidate_id, `Phase geändert auf „${label}“ (${app.job?.title})`);
    }
  }

  async function confirmReject() {
    if (!rejectApp) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === rejectApp.id
          ? { ...a, stage: "abgelehnt" as Stage, rejected_reason: rejectReason }
          : a
      )
    );
    await supabase
      .from("applications")
      .update({
        stage: "abgelehnt",
        rejected_reason: rejectReason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", rejectApp.id);
    logActivity(
      rejectApp.candidate_id,
      `Abgesagt${rejectReason ? ` – Grund: ${rejectReason}` : ""} (${rejectApp.job?.title})`
    );
    setRejectApp(null);
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

      {rejectApp && (
        <Modal
          title={`Absage: ${rejectApp.candidate?.first_name} ${rejectApp.candidate?.last_name}`}
          onClose={() => setRejectApp(null)}
        >
          <div className="space-y-4">
            <p className="text-sm text-petrol-500">
              Stelle: <strong>{rejectApp.job?.title}</strong>. Der Grund wird
              intern gespeichert und hilft bei Auswertungen.
            </p>
            <div>
              <label className="label">Ablehnungsgrund</label>
              <div className="mb-2 flex flex-wrap gap-2">
                {[
                  "Erfahrung passt nicht",
                  "Gehaltsvorstellung",
                  "Anderer Kandidat eingestellt",
                  "Kultureller Fit",
                  "Bewerbung zurückgezogen",
                ].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRejectReason(r)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      rejectReason === r
                        ? "border-petrol-800 bg-petrol-800 text-white"
                        : "border-petrol-200 bg-white text-petrol-500 hover:bg-petrol-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <textarea
                className="input min-h-20"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Grund eintragen oder oben auswählen…"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setRejectApp(null)}>
                Abbrechen
              </button>
              <button className="btn-danger" onClick={confirmReject}>
                Absage bestätigen
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
