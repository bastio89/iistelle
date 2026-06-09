"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GOAL_STATUS_META, Goal, Review } from "@/lib/types";
import {
  Avatar,
  EmptyState,
  PageHeader,
  RatingStars,
  StatCard,
  formatDate,
} from "@/components/ui";

export default function PerformancePage() {
  const supabase = createClient();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [g, r] = await Promise.all([
        supabase
          .from("goals")
          .select("*, employee:employees(*)")
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("*, employee:employees(*)")
          .order("created_at", { ascending: false }),
      ]);
      setGoals((g.data as Goal[]) ?? []);
      setReviews((r.data as Review[]) ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Performance-Daten…</p>;
  }

  const achieved = goals.filter((g) => g.status === "erreicht").length;
  const avgProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
    : 0;
  const avgScore = reviews.length
    ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1)
    : "–";

  return (
    <div>
      <PageHeader
        title="Performance"
        subtitle="Ziele und Reviews im Überblick. Neue Einträge erfasst du in der Personalakte."
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Aktive Ziele" value={goals.length} sub={`${achieved} erreicht`} />
        <StatCard label="Ø Zielfortschritt" value={`${avgProgress}%`} accent />
        <StatCard label="Ø Review-Score" value={avgScore} sub={`${reviews.length} Reviews`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-bold text-petrol-900">Ziele</h2>
          {goals.length === 0 ? (
            <EmptyState title="Keine Ziele definiert" />
          ) : (
            <div className="space-y-3">
              {goals.map((g) => {
                const meta = GOAL_STATUS_META[g.status];
                return (
                  <div key={g.id} className="card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/mitarbeiter/${g.employee_id}`}
                        className="flex items-center gap-2.5"
                      >
                        <Avatar
                          name={`${g.employee?.first_name} ${g.employee?.last_name}`}
                          size="sm"
                        />
                        <span className="text-sm font-semibold text-petrol-900">
                          {g.employee?.first_name} {g.employee?.last_name}
                        </span>
                      </Link>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-petrol-800">{g.title}</p>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-petrol-50">
                        <div
                          className="h-full rounded-full bg-petrol-600"
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-petrol-700">{g.progress}%</span>
                    </div>
                    {g.due_date && (
                      <p className="mt-1.5 text-xs text-petrol-400">
                        Fällig: {formatDate(g.due_date)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-petrol-900">Letzte Reviews</h2>
          {reviews.length === 0 ? (
            <EmptyState title="Noch keine Reviews" />
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/mitarbeiter/${r.employee_id}`}
                      className="flex items-center gap-2.5"
                    >
                      <Avatar
                        name={`${r.employee?.first_name} ${r.employee?.last_name}`}
                        size="sm"
                      />
                      <span className="text-sm font-semibold text-petrol-900">
                        {r.employee?.first_name} {r.employee?.last_name}
                      </span>
                    </Link>
                    <RatingStars value={r.score} size={14} />
                  </div>
                  <p className="mt-1.5 text-xs text-petrol-400">
                    {r.cycle} · von {r.reviewer} · {formatDate(r.created_at)}
                  </p>
                  {r.strengths && (
                    <p className="mt-2 text-sm text-petrol-700">{r.strengths}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
