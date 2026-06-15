"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Company, PLAN_META } from "@/lib/types";
import { useRole } from "@/lib/useRole";
import { PageHeader, StatCard } from "@/components/ui";
import { CheckCircle2, CreditCard, ExternalLink, ShieldAlert } from "lucide-react";

export default function BillingPage() {
  const supabase = createClient();
  const { isAdmin, loading: roleLoading } = useRole();
  const [company, setCompany] = useState<Company | null>(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: c }, { count }] = await Promise.all([
        supabase.from("companies").select("*").maybeSingle(),
        supabase
          .from("employees")
          .select("*", { count: "exact", head: true })
          .neq("status", "ausgeschieden"),
      ]);
      setCompany((c as Company) ?? null);
      setEmployeeCount(count ?? 0);
      setLoading(false);
    }
    load();

    const status = new URLSearchParams(window.location.search).get("status");
    if (status === "erfolg") {
      setMsg("Vielen Dank! Dein Upgrade wird verarbeitet und ist gleich aktiv.");
    } else if (status === "abgebrochen") {
      setMsg("Der Bezahlvorgang wurde abgebrochen – dein bisheriger Plan bleibt aktiv.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCheckout() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setMsg(data.error ?? "Unbekannter Fehler.");
    setBusy(false);
  }

  async function openPortal() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setMsg(data.error ?? "Unbekannter Fehler.");
    setBusy(false);
  }

  if (loading || roleLoading) {
    return <p className="py-20 text-center text-petrol-400">Lade Abrechnung…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-petrol-50 text-petrol-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-petrol-900">Kein Zugriff</h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Die Abrechnung ist nur für Admins sichtbar.
        </p>
      </div>
    );
  }

  if (!company) return null;

  const planMeta = PLAN_META[company.plan];
  const limit = planMeta.maxEmployees;

  return (
    <div>
      <PageHeader
        title="Abrechnung"
        subtitle="Dein Plan, deine Nutzung und Upgrades."
      />

      {msg && (
        <div className="mb-5 rounded-lg bg-petrol-50 px-4 py-3 text-sm text-petrol-700">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-petrol-400">
            Aktueller Plan
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${planMeta.color}`}>
              {planMeta.label}
            </span>
            {company.plan_status !== "aktiv" && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                {company.plan_status === "gekuendigt" ? "Gekündigt" : "Zahlung offen"}
              </span>
            )}
          </div>
        </div>
        <StatCard
          label="Aktive Mitarbeiter"
          value={limit ? `${employeeCount} / ${limit}` : employeeCount}
          sub={limit ? "im Starter-Plan enthalten" : "unbegrenzt"}
          accent={limit !== null && employeeCount >= limit}
        />
        <div className="card flex items-center p-5">
          {company.stripe_customer_id ? (
            <button className="btn-secondary" onClick={openPortal} disabled={busy}>
              <ExternalLink className="h-4 w-4" /> Rechnungen & Kündigung
            </button>
          ) : (
            <p className="text-sm text-petrol-400">
              Rechnungen erscheinen hier nach dem ersten Upgrade.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          {
            plan: "starter" as const,
            price: "Kostenlos",
            sub: "für immer",
            items: ["Bis 10 aktive Mitarbeiter", "Recruiting-Pipeline", "Eigene Karriereseite", "Abwesenheiten & Kalender"],
          },
          {
            plan: "professional" as const,
            price: "ab 129 €",
            sub: "pro Firma / Monat",
            items: ["Unbegrenzte Mitarbeiter", "Dokumente & CV-Upload", "Gehalt & Performance", "Rollen & Team-Einladungen", "CSV-Exporte", "API-Zugriff"],
          },
          {
            plan: "enterprise" as const,
            price: "Individuell",
            sub: "auf Anfrage",
            items: ["Alles aus Professional", "Onboarding-Begleitung", "Individuelle Anpassungen", "Persönlicher Support"],
          },
        ].map((p) => {
          const meta = PLAN_META[p.plan];
          const isCurrent = company.plan === p.plan;
          return (
            <div
              key={p.plan}
              className={`card relative flex flex-col p-7 ${
                isCurrent ? "border-2 border-petrol-700" : ""
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-petrol-800 px-3 py-0.5 text-xs font-bold text-white">
                  Dein Plan
                </span>
              )}
              <h3 className="font-bold text-petrol-900">{meta.label}</h3>
              <p className="mt-3 text-4xl font-black text-petrol-900">{p.price}</p>
              <p className="text-sm text-petrol-400">{p.sub}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-petrol-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              {p.plan === "professional" && !isCurrent && (
                <button className="btn-danger mt-6 justify-center" onClick={startCheckout} disabled={busy}>
                  <CreditCard className="h-4 w-4" />
                  {busy ? "Einen Moment…" : "Jetzt upgraden"}
                </button>
              )}
              {p.plan === "enterprise" && !isCurrent && (
                <a
                  href="mailto:hello@twenty5ai.com?subject=iistelle%20Enterprise"
                  className="btn-secondary mt-6 justify-center"
                >
                  Kontakt aufnehmen
                </a>
              )}
              {isCurrent && (
                <p className="mt-6 text-center text-sm font-semibold text-petrol-400">
                  Aktiv
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-petrol-400">
        Hinweis: Die Bezahlung läuft über Stripe. Solange die Stripe-Keys noch
        nicht hinterlegt sind, zeigt der Upgrade-Button eine entsprechende
        Meldung – alle Abläufe sind bereits fertig eingerichtet.
      </p>
    </div>
  );
}
