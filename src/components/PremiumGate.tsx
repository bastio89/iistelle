"use client";

import Link from "next/link";
import { useRole } from "@/lib/useRole";
import { Lock, Sparkles } from "lucide-react";

/** True, wenn der Tarif der Firma Premium-Funktionen erlaubt. */
export function usePremium() {
  const { company, loading } = useRole();
  return {
    isPremium: company ? company.plan !== "starter" : false,
    loading,
  };
}

/**
 * Sperrt Premium-Inhalte für Starter-Firmen und zeigt stattdessen
 * einen Upgrade-Hinweis. Professional/Enterprise sehen die Inhalte normal.
 *
 * UX-only: Diese Komponente blendet lediglich UI aus. Premium-relevante
 * Server-Endpunkte müssen den Plan zusätzlich serverseitig prüfen.
 */
export default function PremiumGate({
  feature,
  children,
}: {
  feature: string;
  children: React.ReactNode;
}) {
  const { isPremium, loading } = usePremium();

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade…</p>;
  }

  if (isPremium) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-petrol-900 text-coral-400">
          <Sparkles className="h-8 w-8" />
        </div>
        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-coral-500 text-white">
          <Lock className="h-3.5 w-3.5" />
        </span>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-petrol-900">
        {feature} ist eine Professional-Funktion
      </h1>
      <p className="mt-2 max-w-md text-sm text-petrol-500">
        Dein aktueller Starter-Plan enthält die Recruiting-Basics. Upgrade auf
        Professional, um {feature} und alle weiteren Premium-Funktionen
        freizuschalten.
      </p>
      <Link href="/abrechnung" className="btn-danger mt-6">
        <Sparkles className="h-4 w-4" /> Jetzt upgraden
      </Link>
    </div>
  );
}

/** Kompakte Inline-Variante für Sektionen innerhalb einer Seite. */
export function PremiumSection({
  feature,
  children,
}: {
  feature: string;
  children: React.ReactNode;
}) {
  const { isPremium, loading } = usePremium();
  if (loading) return null;
  if (isPremium) return <>{children}</>;
  return (
    <div className="card mt-6 flex flex-wrap items-center justify-between gap-3 border-dashed p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-900 text-coral-400">
          <Lock className="h-4 w-4" />
        </span>
        <div>
          <p className="font-bold text-petrol-900">{feature}</p>
          <p className="text-xs text-petrol-400">
            Im Professional-Plan enthalten.
          </p>
        </div>
      </div>
      <Link href="/abrechnung" className="btn-secondary py-1.5">
        Upgraden
      </Link>
    </div>
  );
}
