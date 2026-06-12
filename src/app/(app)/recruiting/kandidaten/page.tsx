"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Application, Candidate } from "@/lib/types";
import { Avatar, EmptyState, PageHeader, StageBadge, formatDate } from "@/components/ui";
import CandidateFormModal from "@/components/CandidateFormModal";
import { downloadCsv } from "@/lib/csv";
import { Download, Plus, Search } from "lucide-react";

export default function CandidatesPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [poolOnly, setPoolOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [c, a] = await Promise.all([
      supabase.from("candidates").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("*, job:jobs(*)"),
    ]);
    setCandidates((c.data as Candidate[]) ?? []);
    setApps((a.data as Application[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Duplikat-Erkennung: gleiche E-Mail-Adresse
  const emailGroups = candidates.reduce<Record<string, Candidate[]>>((acc, c) => {
    const key = c.email.toLowerCase().trim();
    (acc[key] = acc[key] ?? []).push(c);
    return acc;
  }, {});
  const duplicateGroups = Object.values(emailGroups).filter((g) => g.length > 1);

  async function mergeDuplicates(group: Candidate[]) {
    const [primary, ...rest] = [...group].sort(
      (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
    );
    if (
      !confirm(
        `${rest.length} Duplikat(e) von ${primary.first_name} ${primary.last_name} in das älteste Profil zusammenführen? Bewerbungen und Verlauf werden übernommen.`
      )
    )
      return;
    for (const dup of rest) {
      await supabase
        .from("applications")
        .update({ candidate_id: primary.id })
        .eq("candidate_id", dup.id);
      await supabase
        .from("activities")
        .update({ candidate_id: primary.id })
        .eq("candidate_id", dup.id);
      await supabase.from("candidates").delete().eq("id", dup.id);
    }
    load();
  }

  const allTags = Array.from(new Set(candidates.flatMap((c) => c.tags ?? []))).sort();

  const filtered = candidates.filter((c) => {
    const matchesQuery = `${c.first_name} ${c.last_name} ${c.email} ${c.city}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesTag = !tagFilter || (c.tags ?? []).includes(tagFilter);
    const matchesPool = !poolOnly || c.in_talent_pool;
    return matchesQuery && matchesTag && matchesPool;
  });

  const poolCount = candidates.filter((c) => c.in_talent_pool).length;

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Kandidaten…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Kandidaten"
        subtitle={`${candidates.length} Personen im Talent-Pool`}
        action={
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() =>
                downloadCsv(
                  "kandidaten.csv",
                  filtered.map((c) => ({
                    Vorname: c.first_name,
                    Nachname: c.last_name,
                    "E-Mail": c.email,
                    Telefon: c.phone,
                    Stadt: c.city,
                    Quelle: c.source,
                    Tags: (c.tags ?? []).join(", "),
                    "Talent-Pool": c.in_talent_pool ? "ja" : "nein",
                    Angelegt: c.created_at.slice(0, 10),
                  }))
                )
              }
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Kandidat:in anlegen
            </button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="card flex min-w-64 flex-1 items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 text-petrol-400" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-petrol-300"
            placeholder="Nach Name, E-Mail oder Stadt suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setPoolOnly((p) => !p)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            poolOnly
              ? "bg-violet-600 text-white"
              : "bg-white text-petrol-600 shadow-card hover:bg-petrol-50"
          }`}
        >
          ✦ Talent-Pool ({poolCount})
        </button>
      </div>

      {duplicateGroups.length > 0 && (
        <div className="card mb-4 border-2 border-amber-200 p-4">
          <p className="text-sm font-semibold text-petrol-900">
            ⚠️ {duplicateGroups.length} mögliche{" "}
            {duplicateGroups.length === 1 ? "Dublette" : "Dubletten"} gefunden
            (gleiche E-Mail-Adresse)
          </p>
          <div className="mt-2 space-y-1.5">
            {duplicateGroups.map((g) => (
              <div key={g[0].email} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-petrol-600">
                  {g[0].first_name} {g[0].last_name} · {g[0].email} ({g.length} Profile)
                </span>
                <button
                  className="btn-secondary py-1"
                  onClick={() => mergeDuplicates(g)}
                >
                  Zusammenführen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-petrol-400">
            Tags:
          </span>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(tagFilter === t ? null : t)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                tagFilter === t
                  ? "border-coral-500 bg-coral-500 text-white"
                  : "border-petrol-200 bg-white text-petrol-600 hover:bg-petrol-50"
              }`}
            >
              {t}
            </button>
          ))}
          {tagFilter && (
            <button
              onClick={() => setTagFilter(null)}
              className="text-xs font-semibold text-petrol-400 hover:text-petrol-700"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="Keine Kandidat:innen gefunden" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Kontakt</th>
                <th className="px-5 py-3">Quelle</th>
                <th className="px-5 py-3">Bewerbungen</th>
                <th className="px-5 py-3">Angelegt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-50">
              {filtered.map((c) => {
                const cApps = apps.filter((a) => a.candidate_id === c.id);
                return (
                  <tr key={c.id} className="transition hover:bg-petrol-50/40">
                    <td className="px-5 py-3">
                      <Link
                        href={`/recruiting/kandidaten/${c.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar name={`${c.first_name} ${c.last_name}`} />
                        <div>
                          <p className="flex items-center gap-1.5 font-semibold text-petrol-900">
                            {c.first_name} {c.last_name}
                            {c.in_talent_pool && (
                              <span
                                className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700"
                                title="Im Talent-Pool vorgemerkt"
                              >
                                ✦ Pool
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-petrol-400">{c.city}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-petrol-500">
                      <p>{c.email}</p>
                      <p className="text-xs text-petrol-400">{c.phone}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-xs font-semibold text-petrol-600">
                          {c.source}
                        </span>
                        {(c.tags ?? []).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-coral-500/10 px-2 py-0.5 text-[10px] font-bold text-coral-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {cApps.length === 0 ? (
                          <span className="text-xs text-petrol-300">–</span>
                        ) : (
                          cApps.map((a) => <StageBadge key={a.id} stage={a.stage} />)
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-petrol-500">{formatDate(c.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CandidateFormModal onClose={() => setShowForm(false)} onSaved={load} />
      )}
    </div>
  );
}
