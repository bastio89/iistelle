"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Application, Candidate, Company } from "@/lib/types";
import { logAudit } from "@/lib/audit";
import { useRole } from "@/lib/useRole";
import { Avatar, PageHeader, StatCard, formatDate } from "@/components/ui";
import PremiumGate from "@/components/PremiumGate";
import { Download, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";

export default function GdprCenterPageGated() {
  return (
    <PremiumGate feature="das DSGVO-Center">
      <GdprCenterPage />
    </PremiumGate>
  );
}

function GdprCenterPage() {
  const supabase = createClient();
  const { isAdmin, company, loading: roleLoading } = useRole();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [c, a] = await Promise.all([
      supabase.from("candidates").select("*").order("created_at"),
      supabase.from("applications").select("*, job:jobs(title)"),
    ]);
    setCandidates((c.data as Candidate[]) ?? []);
    setApps((a.data as Application[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function exportCandidate(c: Candidate) {
    const cApps = apps.filter((a) => a.candidate_id === c.id);
    const data = {
      exportiert_am: new Date().toISOString(),
      kandidat: c,
      bewerbungen: cApps,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsgvo-export-${c.last_name.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAudit({
      action: "gdpr_export_request",
      category: "data",
      object_type: "candidates",
      object_id: c.id,
      details: `Datenauskunft für ${c.first_name} ${c.last_name} exportiert`,
    });
  }

  async function deleteCandidate(c: Candidate) {
    if (
      !confirm(
        `Alle Daten von ${c.first_name} ${c.last_name} unwiderruflich löschen? (Bewerbungen, Verlauf, Dokumente-Verweise)`
      )
    )
      return;
    if (c.cv_path) {
      await supabase.storage.from("bewerbungen").remove([c.cv_path]);
    }
    await supabase.from("candidates").delete().eq("id", c.id);
    logAudit({
      action: "personal_data_deleted",
      category: "data",
      object_type: "candidates",
      object_id: c.id,
      details: `Alle Daten von ${c.first_name} ${c.last_name} gelöscht`,
    });
    load();
  }

  if (loading || roleLoading) {
    return <p className="py-20 text-center text-petrol-400">Lade DSGVO-Center…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-petrol-50 text-petrol-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-petrol-900">Kein Zugriff</h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Das DSGVO-Center ist nur für Admins sichtbar.
        </p>
      </div>
    );
  }

  const retentionMonths = (company as Company | null)?.candidate_retention_months ?? 6;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - retentionMonths);

  // Kandidaten, deren Bewerbungen alle abgelehnt sind und deren letzte Aktivität vor der Frist liegt
  const expired = candidates.filter((c) => {
    const cApps = apps.filter((a) => a.candidate_id === c.id);
    if (cApps.length === 0) return false;
    const allRejected = cApps.every((a) => a.stage === "abgelehnt");
    const lastUpdate = Math.max(...cApps.map((a) => +new Date(a.updated_at)));
    return allRejected && lastUpdate < cutoff.getTime();
  });

  return (
    <div>
      <PageHeader
        title="DSGVO-Center"
        subtitle={`Datenauskunft, Recht auf Löschung und automatische Fristen (aktuell: ${retentionMonths} Monate nach Absage).`}
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Kandidaten gesamt" value={candidates.length} />
        <StatCard
          label="Löschung empfohlen"
          value={expired.length}
          sub={`Absage älter als ${retentionMonths} Monate`}
          accent={expired.length > 0}
        />
        <div className="card flex items-center gap-3 p-5">
          <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-500" />
          <p className="text-xs text-petrol-500">
            Die Löschfrist passt du in den{" "}
            <Link href="/einstellungen" className="font-semibold underline">
              Einstellungen
            </Link>{" "}
            an.
          </p>
        </div>
      </div>

      {expired.length > 0 && (
        <div className="card mb-8 border-2 border-amber-200 p-6">
          <h2 className="font-bold text-petrol-900">
            Löschung empfohlen ({expired.length})
          </h2>
          <p className="mt-1 text-sm text-petrol-500">
            Diese Bewerbungen wurden vor mehr als {retentionMonths} Monaten
            abgesagt. Ohne Einwilligung für den Talent-Pool sollten die Daten
            gelöscht werden.
          </p>
          <ul className="mt-4 divide-y divide-petrol-50">
            {expired.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <Avatar name={`${c.first_name} ${c.last_name}`} size="sm" />
                <span className="flex-1 text-sm font-semibold text-petrol-900">
                  {c.first_name} {c.last_name}
                  <span className="ml-2 font-normal text-petrol-400">{c.email}</span>
                </span>
                <button className="btn-secondary py-1.5" onClick={() => exportCandidate(c)}>
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
                <button className="btn-danger py-1.5" onClick={() => deleteCandidate(c)}>
                  <Trash2 className="h-3.5 w-3.5" /> Löschen
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card overflow-hidden">
        <p className="border-b border-petrol-100 px-5 py-3.5 font-bold text-petrol-900">
          Alle Kandidaten – Auskunft & Löschung
        </p>
        <ul className="divide-y divide-petrol-50">
          {candidates.map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar name={`${c.first_name} ${c.last_name}`} size="sm" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/recruiting/kandidaten/${c.id}`}
                  className="text-sm font-semibold text-petrol-900 hover:text-petrol-600"
                >
                  {c.first_name} {c.last_name}
                </Link>
                <p className="text-xs text-petrol-400">
                  {c.email} · im System seit {formatDate(c.created_at)}
                </p>
              </div>
              <button
                className="btn-secondary py-1.5"
                onClick={() => exportCandidate(c)}
                title="Datenauskunft als JSON"
              >
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button
                className="rounded-lg p-2 text-petrol-300 transition hover:bg-rose-50 hover:text-rose-500"
                onClick={() => deleteCandidate(c)}
                title="Recht auf Löschung ausüben"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
