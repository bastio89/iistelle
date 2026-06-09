"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Application, Candidate } from "@/lib/types";
import { Avatar, EmptyState, PageHeader, StageBadge, formatDate } from "@/components/ui";
import CandidateFormModal from "@/components/CandidateFormModal";
import { Plus, Search } from "lucide-react";

export default function CandidatesPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [query, setQuery] = useState("");
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

  const filtered = candidates.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email} ${c.city}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Kandidaten…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Kandidaten"
        subtitle={`${candidates.length} Personen im Talent-Pool`}
        action={
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Kandidat:in anlegen
          </button>
        }
      />

      <div className="card mb-4 flex items-center gap-2 px-4 py-2.5">
        <Search className="h-4 w-4 text-petrol-400" />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-petrol-300"
          placeholder="Nach Name, E-Mail oder Stadt suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

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
                          <p className="font-semibold text-petrol-900">
                            {c.first_name} {c.last_name}
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
                      <span className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-xs font-semibold text-petrol-600">
                        {c.source}
                      </span>
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
