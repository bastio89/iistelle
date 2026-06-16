'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  Users,
  Zap,
  TrendingUp,
  Clock,
  Briefcase,
} from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";
import { getPricingPlans, getPricingConfig, formatPrice } from "@/lib/pricing";
import Footer from "@/components/Footer";

const trustItems = [
  { icon: Zap, text: "Startklar in 1 Minute" },
  { icon: CreditCard, text: "Keine Kreditkarte nötig" },
  { icon: ShieldCheck, text: "DSGVO-konform, Hosting in Frankfurt" },
  { icon: FileText, text: "CV-Upload & Dokumentenablage" },
];

const features = [
  {
    icon: Briefcase,
    title: "Bewerber-Pipeline",
    text: "Kanban-Board mit Drag & Drop von Eingang bis Einstellung. Jede Bewerbung immer im Blick.",
    tag: "Recruiting",
  },
  {
    icon: Globe,
    title: "Eigene Karriereseite",
    text: "Automatisch generierte Karriereseite. Bewerbungen inkl. Lebenslauf landen direkt in der Pipeline.",
    tag: "Recruiting",
  },
  {
    icon: Users,
    title: "Digitale Personalakte",
    text: "Stammdaten, Dokumente, Gehalt, Ziele und Onboarding-Checklisten – pro Person gebündelt.",
    tag: "Personalakte",
  },
  {
    icon: Plane,
    title: "Abwesenheiten",
    text: "Anträge in Sekunden gestellt und genehmigt. Team-Kalender und Resturlaub auf einen Blick.",
    tag: "Personalakte",
  },
  {
    icon: CalendarClock,
    title: "Interviews & Feedback",
    text: "Gespräche planen, Feedback strukturiert einsammeln und Entscheidungen gemeinsam treffen.",
    tag: "Recruiting",
  },
  {
    icon: TrendingUp,
    title: "Performance & Gehalt",
    text: "Ziele setzen, Feedback geben, Gehaltsänderungen dokumentieren – alles an einem Ort.",
    tag: "Performance",
  },
  {
    icon: BarChart3,
    title: "Auswertungen & Reports",
    text: "Time-to-Hire, Conversion und CSV-Exporte. Entscheidungen auf Basis von Zahlen.",
    tag: "Analyse",
  },
  {
    icon: Clock,
    title: "Zeiterfassung",
    text: "Ein- und Ausstempeln, Monatsübersicht und Überstundennachweis – direkt im Browser.",
    tag: "Zeiterfassung",
  },
];

const comparisonRows = [
  { feature: "Mitarbeiter", starter: "Bis 5", professional: "Unbegrenzt" },
  { feature: "Karriereseite", starter: true, professional: true },
  { feature: "Bewerber-Pipeline", starter: true, professional: true },
  { feature: "CV-Upload", starter: true, professional: true },
  { feature: "Personalakte", starter: true, professional: true },
  { feature: "Abwesenheiten & Kalender", starter: true, professional: true },
  { feature: "Zeiterfassung", starter: false, professional: true },
  { feature: "Gehaltsdaten", starter: false, professional: true },
  { feature: "Performance-Gespräche", starter: false, professional: true },
  { feature: "Rollen & Berechtigungen", starter: false, professional: true },
  { feature: "API-Zugriff", starter: false, professional: true },
  { feature: "CSV-Exporte", starter: false, professional: true },
  { feature: "Audit-Log", starter: false, professional: true },
];

export default function LandingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [mounted, setMounted] = useState(false);
  const yearlySavingsPercent = 17;

  // Zentralisierte Preise basierend auf Standort
  const pricingPlans = getPricingPlans("DE");
  const pricingConfig = getPricingConfig("DE");
  const starterPlan = pricingPlans.find((p) => p.id === "starter");
  const proPlan = pricingPlans.find((p) => p.id === "professional");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("billing") === "yearly") {
      setBilling("yearly");
    } else {
      const saved = localStorage.getItem("iistelle-billing");
      if (saved === "yearly" || saved === "monthly") {
        setBilling(saved);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("iistelle-billing", billing);
    }
  }, [billing, mounted]);

  const getYearlyPrice = (monthlyPrice: number, yearlyPrice: number) => {
    if (billing === "yearly") {
      return {
        monthly: yearlyPrice / 12,
        totalYearly: yearlyPrice,
        savings: monthlyPrice * 12 - yearlyPrice,
      };
    }
    return {
      monthly: monthlyPrice,
      totalYearly: 0,
      savings: 0,
    };
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-petrol-100/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="iistelle Logo"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-lg font-bold tracking-tight text-petrol-900">
              iistelle
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-petrol-600 md:flex">
            <Link href="#funktionen" className="link-hover transition-colors hover:text-petrol-900">
              Funktionen
            </Link>
            <Link href="#vergleich" className="link-hover transition-colors hover:text-petrol-900">
              Vergleich
            </Link>
            <Link href="/preise" className="link-hover transition-colors hover:text-petrol-900">
              Preise
            </Link>
            <ServiceDropdown />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-petrol-700 transition-all hover:bg-petrol-50"
            >
              Anmelden
            </Link>
            <Link href="/login" className="btn-primary">
              14 Tage kostenlos testen
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden bg-petrol-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 20%, rgba(255,90,80,0.25) 0%, transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(69,144,154,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 text-center">
          {/* Badge */}
          <div className="badge-pop inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <Sparkles className="h-3.5 w-3.5 text-coral-400" />
            Recruiting + HR in einer Plattform · Made in Switzerland
          </div>

          <h1 className="hero-title mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Stellen schneller besetzen.{" "}
            <span className="text-coral-400">HR ohne Reibung.</span>
          </h1>

          <p className="hero-subtitle mx-auto mt-5 max-w-2xl text-lg text-petrol-200">
            iistelle bündelt Recruiting, Personalakte, Abwesenheiten und
            Performance in einem schlanken Tool – gebaut für kleine und mittlere
            Unternehmen, die keine Zeit für komplizierte Software haben.
          </p>

          <div className="hero-cta mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login" className="btn-danger group px-6 py-3 text-base">
              14 Tage kostenlos testen
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="/karriere/iistelle"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              <Star className="h-4 w-4" />
              Live-Demo ansehen
            </a>
          </div>

          <p className="hero-note mt-4 text-xs text-petrol-400">
            Keine Kreditkarte nötig · In unter einer Minute startklar · Daten in Frankfurt gehostet
          </p>

          {/* Produkt-Mockup */}
          <div className="hero-mockup relative mx-auto mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
              {/* Fenster-Kopf */}
              <div className="flex items-center gap-1.5 border-b border-petrol-100 bg-petrol-50/70 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-[10px] text-petrol-400">
                  app.iistelle.de/recruiting/bewerbungen
                </span>
              </div>

              <div className="flex">
                {/* Mini-Sidebar */}
                <div className="hidden w-36 shrink-0 flex-col gap-1 bg-petrol-950 p-3 text-left sm:flex">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-coral-500 text-[9px] font-black text-white">ii</span>
                    <span className="text-[10px] font-bold text-white">iistelle</span>
                  </div>
                  {["Dashboard", "Stellen", "Bewerbungen", "Kandidaten", "Interviews"].map((x, i) => (
                    <span
                      key={x}
                      className={`rounded px-2 py-1 text-[10px] ${i === 2 ? "bg-white/10 font-bold text-white" : "text-petrol-300"}`}
                    >
                      {x}
                    </span>
                  ))}
                </div>

                {/* Mini-Kanban */}
                <div className="flex flex-1 gap-2 overflow-hidden bg-surface p-3">
                  {[
                    { label: "Eingang", color: "bg-sky-100 text-sky-800", cards: ["Aylin Y.", "Paul N."] },
                    { label: "Screening", color: "bg-violet-100 text-violet-800", cards: ["Jonas B.", "Felix Z."] },
                    { label: "Interview", color: "bg-amber-100 text-amber-800", cards: ["Lena H.", "Emma F."] },
                    { label: "Angebot", color: "bg-teal-100 text-teal-800", cards: ["Hannah S."] },
                  ].map((col) => (
                    <div key={col.label} className="flex-1 rounded-lg bg-petrol-100/50 p-2 text-left">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${col.color}`}>
                        {col.label}
                      </span>
                      <div className="mt-2 space-y-1.5">
                        {col.cards.map((c) => (
                          <div key={c} className="rounded-md bg-white p-2 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-1.5">
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-petrol-100 text-[7px] font-bold text-petrol-700">
                                {c.slice(0, 1)}
                              </span>
                              <span className="text-[9px] font-bold text-petrol-900">{c}</span>
                            </div>
                            <div className="mt-1 h-1 w-3/4 rounded bg-petrol-50" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Recruiting Fakten */}
      <section className="border-b border-petrol-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-black text-petrol-900">40%</p>
            <p className="text-sm text-petrol-500">der Stellenanzeigen scheitern</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-petrol-900">65%</p>
            <p className="text-sm text-petrol-500">suchen aktiv nach Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-petrol-900">2 Min.</p>
            <p className="text-sm text-petrol-500">Ø erste Impression zählt</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-petrol-900">73%</p>
            <p className="text-sm text-petrol-500">erwarten Gehaltsangaben</p>
          </div>
        </div>
      </section>

      {/* Vorteils-Leiste */}
      <section className="border-b border-petrol-100 bg-petrol-50/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {trustItems.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-petrol-50 text-petrol-600 transition-transform hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-petrol-800">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Funktionen */}
      <section id="funktionen" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-coral-500">Funktionen</p>
          <h2 className="mt-2 text-3xl font-bold text-petrol-900 md:text-4xl">
            Alles, was dein HR braucht
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-petrol-500">
            Vom ersten Bewerbungseingang bis zum Mitarbeitergespräch – ohne
            Tool-Wechsel, ohne Excel-Chaos.
          </p>
        </div>

        <div className="fade-in-stagger mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text, tag }) => (
            <div key={title} className="card group p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-petrol-800 text-white transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-petrol-100 px-2 py-0.5 text-[10px] font-bold text-petrol-500">
                  {tag}
                </span>
              </div>
              <h3 className="font-bold text-petrol-900 transition-colors group-hover:text-coral-500">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-petrol-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ablauf */}
      <section className="bg-petrol-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-coral-400">So funktioniert's</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Von der Anmeldung zur ersten Einstellung
            </h2>
          </div>

          <div className="fade-in-stagger mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Kostenlos testen",
                text: "Registriere dich ohne Kreditkarte. Dein eigener, komplett getrennter HR-Bereich steht in unter einer Minute.",
              },
              {
                n: "02",
                title: "Stelle veröffentlichen",
                text: "Stelle anlegen, auf deiner automatisch erstellten Karriereseite live schalten – oder manuell Bewerber hinzufügen.",
              },
              {
                n: "03",
                title: "Schneller einstellen",
                text: "Bewerbungen laufen direkt in die Pipeline. Interviewen, bewerten, einstellen – und per Klick ins Onboarding.",
              },
            ].map((s) => (
              <div key={s.n} className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
                <span className="text-4xl font-black text-coral-400/60 transition-all group-hover:text-coral-400/80">
                  {s.n}
                </span>
                <h3 className="mt-3 font-bold text-white transition-colors group-hover:text-coral-400">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-petrol-200">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preise */}
      <section id="preise" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-coral-500">Preise</p>
          <h2 className="mt-2 text-3xl font-bold text-petrol-900 md:text-4xl">
            Einfach. Transparent. Fair.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-petrol-500">
            Zwei klare Pläne – kein Verstecken hinter Mindestabnahmen. Starte mit 14 Tagen
            kostenlos und kündige monatlich.
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-petrol-200 bg-white p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-petrol-800 text-white shadow-sm"
                  : "text-petrol-600 hover:text-petrol-900"
              }`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-petrol-800 text-white shadow-sm"
                  : "text-petrol-600 hover:text-petrol-900"
              }`}
            >
              Jährlich
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                -{yearlySavingsPercent}%
              </span>
            </button>
          </div>
          <p className="mt-2 text-sm text-petrol-500">
            {billing === "yearly" ? (
              <span className="text-emerald-600 font-medium">
                Jährliche Abrechnung – 2 Monate gratis!
              </span>
            ) : (
              <span>
                Jährlich sparen: ca. {yearlySavingsPercent}% (2 Monate gratis)
              </span>
            )}
          </p>
        </div>

        <div className="fade-in-stagger mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-2">
          {pricingPlans
            .filter((p) => p.id === "starter" || p.id === "professional")
            .map((plan) => {
            const priceData = getYearlyPrice(plan.monthlyPrice ?? 0, plan.yearlyPrice ?? 0);
            const currency = plan.currency;
            const displayPrice = billing === "yearly" ? priceData.monthly : (plan.monthlyPrice ?? 0);
            const formattedPrice = formatPrice(displayPrice, currency);

            return (
              <div
                key={plan.id}
                className={`card relative flex flex-col p-7 transition-all ${
                  plan.highlight ? "border-2 border-coral-500 shadow-cardHover scale-in-spring" : ""
                }`}
              >
                {plan.highlight && (
                  <span className="badge-pop absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral-500 px-3 py-1 text-xs font-bold text-white">
                    Empfohlen
                  </span>
                )}
                {billing === "yearly" && priceData.savings > 0 && (
                  <span className="absolute -right-2 -top-2 rotate-3 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    2 Monate gratis
                  </span>
                )}

                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-petrol-900">{plan.name}</h3>
                    <p className="mt-1 text-sm text-petrol-500">{plan.tagline}</p>

                    <div className="mt-6 space-y-3">
                      {plan.features.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-petrol-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {item}
                        </div>
                      ))}
                    </div>

                    {plan.id === "professional" && (
                      <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-petrol-400 mb-2">
                          Plus
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Unbegrenzte Mitarbeiter</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Alles aus Starter</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Gehaltsdaten</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">360°-Feedback</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Zeiterfassung</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Rollen</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">API-Zugriff</span>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Audit-Log</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-32 shrink-0 text-right">
                    <p className="text-3xl font-black text-petrol-900">{formattedPrice}</p>
                    <p className="text-xs text-petrol-400">pro Monat</p>
                  </div>
                </div>

                <Link
                  href={`/login?plan=${plan.id}${billing === "yearly" ? "&billing=yearly" : ""}`}
                  className={`${plan.highlight ? "btn-danger" : "btn-secondary"} mt-6 justify-center flex`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-petrol-400">
          Beide Pläne inkludieren 14 Tage kostenloses Testen. Danach monatlich kündbar.
          <Link href="/preise" className="ml-1 font-semibold text-petrol-600 underline">
            Alle Details →
          </Link>
        </p>
      </section>

      {/* Vergleichstabelle */}
      <section id="vergleich" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-coral-500">Vergleich</p>
          <h2 className="mt-2 text-3xl font-bold text-petrol-900 md:text-4xl">
            Starter vs. Professional
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-petrol-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-petrol-100 bg-petrol-50">
                <th className="py-4 pl-6 text-left font-bold text-petrol-900">Funktion</th>
                <th className="w-48 py-4 text-center font-bold text-petrol-900">Starter</th>
                <th className="w-48 bg-coral-50/50 py-4 text-center font-bold text-petrol-900">Professional</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-petrol-50 ${i % 2 === 0 ? "bg-white" : "bg-petrol-50/30"}`}
                >
                  <td className="py-3.5 pl-6 text-petrol-700">{row.feature}</td>
                  <td className="py-3.5 text-center">
                    {typeof row.starter === "boolean" ? (
                      row.starter ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
                      ) : (
                        <span className="text-petrol-300">—</span>
                      )
                    ) : (
                      <span className="font-semibold text-petrol-700">{row.starter}</span>
                    )}
                  </td>
                  <td className="bg-coral-50/20 py-3.5 text-center">
                    {typeof row.professional === "boolean" ? (
                      row.professional ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
                      ) : (
                        <span className="text-petrol-300">—</span>
                      )
                    ) : (
                      <span className="font-semibold text-petrol-700">{row.professional}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-petrol-50/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-coral-500">Kundenstimmen</p>
            <h2 className="mt-2 text-3xl font-bold text-petrol-900 md:text-4xl">
              Was unsere Kunden sagen
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "iistelle hat unsere Stellenbesetzung von 6 Wochen auf 3 Wochen verkürzt. Die Pipeline ist intuitiv und das Team hat sie sofort angenommen.",
                author: "Lena Berger",
                role: "HR-Leiterin, Menziken AG",
                stars: 5,
              },
              {
                quote: "Endlich eine Lösung, die nicht wie ein Konzern-System aussieht und sich auch so anfühlt. Klein, schnell, genau richtig für uns.",
                author: "Marco Fusco",
                role: "Geschäftsführer, Fusco Consulting",
                stars: 5,
              },
              {
                quote: "Die Abwesenheitsverwaltung allein hat schon 3 Stunden pro Woche gespart. Plus: Die Mitarbeiter lieben die Karriereseite.",
                author: "Sandra Meier",
                role: "Office Manager, TechStart GmbH",
                stars: 5,
              },
            ].map((t) => (
              <div key={t.author} className="card p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-petrol-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-petrol-100 text-sm font-bold text-petrol-700">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-petrol-900">{t.author}</p>
                    <p className="text-xs text-petrol-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="group relative overflow-hidden rounded-3xl bg-petrol-900 px-8 py-16 text-center transition-all hover:shadow-2xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-60"
            style={{
              background:
                "radial-gradient(50% 60% at 80% 30%, rgba(255,90,80,0.3) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-500/20 text-coral-400 transition-transform group-hover:scale-110">
              <UserPlus className="h-8 w-8" />
            </div>
            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold text-white">
              Bereit, deine nächste Stelle schneller zu besetzen?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-petrol-200">
              Registriere dich in unter einer Minute und teste alle Funktionen 14 Tage lang kostenlos.
            </p>
            <Link href="/login" className="btn-danger group mt-7 inline-flex px-8 py-3 text-base">
              Jetzt 14 Tage kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}