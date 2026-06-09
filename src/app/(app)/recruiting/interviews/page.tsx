"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { INTERVIEW_TYPE_LABEL, Interview } from "@/lib/types";
import { Avatar, EmptyState, PageHeader, formatDateTime } from "@/components/ui";
import { CalendarClock, MapPin, Phone, Video } from "lucide-react";

const TYPE_ICON = { telefon: Phone, video: Video, vor_ort: MapPin } as const;

export default function InterviewsPage() {
  const supabase = createClient();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filter, setFilter] = useState<"anstehend" | "vergangen" | "alle">("anstehend");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("interviews")
      .select("*, application:applications(*, candidate:candidates(*), job:jobs(*))")
      .order("scheduled_at", { ascending: true });
    setInterviews((data as Interview[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: Interview["status"]) {
    await supabase.from("interviews").update({ status }).eq("id", id);
    load();
  }

  const now = Date.now();
  const filtered = interviews.filter((iv) => {
    const t = new Date(iv.scheduled_at).getTime();
    if (filter === "anstehend") return t >= now && iv.status === "geplant";
    if (filter === "vergangen") return t < now || iv.status !== "geplant";
    return true;
  });

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Interviews…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle="Alle geplanten und vergangenen Gespräche im Überblick."
      />

      <div className="mb-4 flex gap-2">
        {(
          [
            ["anstehend", "Anstehend"],
            ["vergangen", "Vergangen / Abgeschlossen"],
            ["alle", "Alle"],
          ] as const
        ).map(([key, label]) => (
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
          title="Keine Interviews in dieser Ansicht"
          hint="Plane Interviews über das Profil einer Kandidatin oder eines Kandidaten."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((iv) => {
            const Icon = TYPE_ICON[iv.interview_type] ?? CalendarClock;
            const cand = iv.application?.candidate;
            return (
              <div key={iv.id} className="card flex flex-wrap items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-petrol-50 text-petrol-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/recruiting/kandidaten/${cand?.id}`}
                      className="font-bold text-petrol-900 hover:text-petrol-600"
                    >
                      {cand?.first_name} {cand?.last_name}
                    </Link>
                    <span className="text-sm text-petrol-400">· {iv.title}</span>
                  </div>
                  <p className="text-sm text-petrol-500">
                    {formatDateTime(iv.scheduled_at)} · {iv.duration_min} Min ·{" "}
                    {INTERVIEW_TYPE_LABEL[iv.interview_type]} · {iv.interviewer}
                  </p>
                  <p className="text-xs text-petrol-400">{iv.application?.job?.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {cand && <Avatar name={`${cand.first_name} ${cand.last_name}`} size="sm" />}
                  <select
                    className="input w-auto py-1.5"
                    value={iv.status}
                    onChange={(e) => setStatus(iv.id, e.target.value as Interview["status"])}
                  >
                    <option value="geplant">Geplant</option>
                    <option value="abgeschlossen">Abgeschlossen</option>
                    <option value="abgesagt">Abgesagt</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
