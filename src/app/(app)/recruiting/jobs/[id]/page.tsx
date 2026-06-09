"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Application, Candidate, Job, STAGES } from "@/lib/types";
import {
  Avatar,
  EmptyState,
  JobStatusBadge,
  Modal,
  RatingStars,
  StageBadge,
  formatDate,
} from "@/components/ui";
import JobFormModal from "@/components/JobFormModal";
import { ArrowLeft, MapPin, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [j, a, c] = await Promise.all([
      supabase.from("jobs").select("*").eq("id", id).single(),
      supabase
        .from("applications")
        .select("*, candidate:candidates(*)")
        .eq("job_id", id)
        .order("applied_at", { ascending: false }),
      supabase.from("candidates").select("*").order("last_name"),
    ]);
    setJob(j.data as Job);
    setApps((a.data as Application[]) ?? []);
    setCandidates((c.data as Candidate[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteJob() {
    if (!confirm("Stelle und alle zugehörigen Bewerbungen wirklich löschen?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    router.push("/recruiting");
  }

  async function addApplication(candidateId: string) {
    await supabase
      .from("applications")
      .insert({ job_id: id, candidate_id: candidateId, stage: "eingang" });
    setShowAdd(false);
    load();
  }

  if (loading || !job) {
    return <p className="py-20 text-center text-petrol-400">Lade Stelle…</p>;
  }

  const candidatesWithoutApp = candidates.filter(
    (c) => !apps.some((a) => a.candidate_id === c.id)
  );

  return (
    <div>
      <Link
        href="/recruiting"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-petrol-500 hover:text-petrol-800"
      >
        <ArrowLeft className="h-4 w-4" /> Zurück zu den Stellen
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-petrol-900">{job.title}</h1>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="mt-1 text-sm text-petrol-500">
              {job.department} · {job.seniority} · {job.employment_type}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-petrol-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {job.location}
              </span>
              <span>Recruiter:in: {job.recruiter || "–"}</span>
              <span>Erstellt am {formatDate(job.created_at)}</span>
            </div>
            {job.channels.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Megaphone className="h-4 w-4 text-petrol-400" />
                {job.channels.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-xs font-semibold text-petrol-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setShowEdit(true)}>
              <Pencil className="h-4 w-4" /> Bearbeiten
            </button>
            <button
              className="rounded-lg border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50"
              onClick={deleteJob}
              title="Stelle löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {job.description && (
          <p className="mt-5 max-w-3xl whitespace-pre-line border-t border-petrol-50 pt-5 text-sm leading-relaxed text-petrol-700">
            {job.description}
          </p>
        )}
      </div>

      {/* Mini-Pipeline */}
      <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
        {STAGES.map((s) => (
          <div key={s.key} className="card p-3 text-center">
            <p className="text-xl font-bold text-petrol-900">
              {apps.filter((a) => a.stage === s.key).length}
            </p>
            <p className="text-xs font-medium text-petrol-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bewerbungen */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-petrol-900">
            Bewerbungen ({apps.length})
          </h2>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4" /> Bewerbung hinzufügen
          </button>
        </div>

        {apps.length === 0 ? (
          <EmptyState
            title="Noch keine Bewerbungen"
            hint="Füge Kandidat:innen manuell hinzu oder warte auf Eingänge."
          />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                  <th className="px-5 py-3">Kandidat:in</th>
                  <th className="px-5 py-3">Phase</th>
                  <th className="px-5 py-3">Bewertung</th>
                  <th className="px-5 py-3">Beworben am</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-petrol-50">
                {apps.map((a) => (
                  <tr key={a.id} className="transition hover:bg-petrol-50/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${a.candidate?.first_name} ${a.candidate?.last_name}`}
                        />
                        <div>
                          <p className="font-semibold text-petrol-900">
                            {a.candidate?.first_name} {a.candidate?.last_name}
                          </p>
                          <p className="text-xs text-petrol-400">
                            {a.candidate?.source}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StageBadge stage={a.stage} />
                    </td>
                    <td className="px-5 py-3">
                      <RatingStars value={a.rating} />
                    </td>
                    <td className="px-5 py-3 text-petrol-500">
                      {formatDate(a.applied_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/recruiting/kandidaten/${a.candidate_id}`}
                        className="font-semibold text-coral-500 hover:text-coral-600"
                      >
                        Profil →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEdit && (
        <JobFormModal job={job} onClose={() => setShowEdit(false)} onSaved={load} />
      )}

      {showAdd && (
        <Modal title="Bewerbung hinzufügen" onClose={() => setShowAdd(false)}>
          {candidatesWithoutApp.length === 0 ? (
            <p className="text-sm text-petrol-500">
              Alle vorhandenen Kandidat:innen haben sich bereits auf diese Stelle
              beworben. Lege unter „Kandidaten“ zuerst eine neue Person an.
            </p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {candidatesWithoutApp.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => addApplication(c.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-petrol-50"
                  >
                    <Avatar name={`${c.first_name} ${c.last_name}`} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-petrol-900">
                        {c.first_name} {c.last_name}
                      </p>
                      <p className="text-xs text-petrol-400">{c.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}
