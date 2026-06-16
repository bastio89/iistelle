"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CheckCircle2, X, ArrowRight, Sparkles, Clock, ShieldCheck, Users, Zap, Search, ChevronDown, Star, Heart, Globe, FileText, Calendar, BarChart3, TrendingUp } from "lucide-react";
import { PricingPlan, PricingConfig, formatPrice } from "@/lib/pricing";
import { ServiceDropdown } from "@/components/ServiceDropdown";
import Footer from "@/components/Footer";

interface Props {
  plans: PricingPlan[];
  config: PricingConfig;
}

type BillingPeriod = "monthly" | "yearly";

export default function PricingClient({ plans, config }: Props) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [mounted, setMounted] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("billing") === "yearly") setBilling("yearly");
      const saved = localStorage.getItem("iistelle-billing");
      if (saved === "yearly" || saved === "monthly") setBilling(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("iistelle-billing", billing);
  }, [billing, mounted]);

  const yearlySavingsPercent = 17;

  const getDisplayPrice = (plan: PricingPlan) => {
    if (plan.monthlyPrice === null || plan.monthlyPrice === 0) {
      return { price: null, period: "" };
    }
    if (billing === "yearly" && plan.yearlyPrice) {
      return {
        price: plan.yearlyPrice / 12,
        period: "/Monat",
        isYearly: true,
        totalYearly: plan.yearlyPrice,
        savings: plan.monthlyPrice * 12 - plan.yearlyPrice,
      };
    }
    return { price: plan.monthlyPrice, period: "/Monat", isYearly: false };
  };

  const whyIistelle = [
    {
      icon: Clock,
      title: "Startklar in Minuten",
      description: "Keine komplizierte Einrichtung. Importiere deine Mitarbeiter, lade dein Team ein – in unter 5 Minuten einsatzbereit.",
    },
    {
      icon: ShieldCheck,
      title: "100% DSGVO-konform",
      description: "Server in Frankfurt, CH oder EU. Vollständige Datenhoheit, Audit-Log und Löschkonzepte serienmäßig dabei.",
    },
    {
      icon: Globe,
      title: "Made in Switzerland",
      description: "Entwickelt von einem Schweizer Unternehmen für den Schweizer und deutschen Markt. Lokal, nah, persönlich.",
    },
    {
      icon: Heart,
      title: "Monatlich kündbar",
      description: "Keine Langzeitverträge. Zahle monatlich oder jährlich – du bleibst immer Herr über deine Daten.",
    },
  ];

  const featureCategories = [
    {
      title: "Recruiting",
      icon: Users,
      color: "bg-sky-100 text-sky-600",
      features: [
        { name: "Karriereseite", starter: true, pro: true },
        { name: "Bewerber-Pipeline", starter: true, pro: true },
        { name: "CV-Upload & Parsing", starter: true, pro: true },
        { name: "Feedback-Tool für Interviewer", starter: true, pro: true },
        { name: "Automatisierte E-Mail-Kommunikation", starter: false, pro: true },
        { name: "API-Zugriff für eigene Integrationen", starter: false, pro: true },
      ],
    },
    {
      title: "Personalakte & Mitarbeiter",
      icon: FileText,
      color: "bg-emerald-100 text-emerald-600",
      features: [
        { name: "Digitale Personalakte", starter: true, pro: true },
        { name: "Verträge & Dokumente", starter: true, pro: true },
        { name: "Gehaltsdaten & Vergütung", starter: false, pro: true },
        { name: "Notfallkontakte", starter: true, pro: true },
        { name: "Skills & Zertifikate", starter: true, pro: true },
        { name: "Equipment-Verwaltung", starter: true, pro: true },
      ],
    },
    {
      title: "Abwesenheiten & Kalender",
      icon: Calendar,
      color: "bg-violet-100 text-violet-600",
      features: [
        { name: "Urlaubsanträge & Genehmigung", starter: true, pro: true },
        { name: "Team-Kalender", starter: true, pro: true },
        { name: "Feiertage (CH, DE, AT)", starter: true, pro: true },
        { name: "Resturlaub-Übertrag", starter: true, pro: true },
        { name: "Krankmeldungen", starter: true, pro: true },
        { name: "Gantt-ähnliche Zeitachse", starter: false, pro: true },
      ],
    },
    {
      title: "Performance & Analyse",
      icon: TrendingUp,
      color: "bg-amber-100 text-amber-600",
      features: [
        { name: "Ziele setzen & verfolgen", starter: true, pro: true },
        { name: "Feedback-Gespräche", starter: false, pro: true },
        { name: "360°-Feedback", starter: false, pro: true },
        { name: "Analyse-Dashboard", starter: true, pro: true },
        { name: "CSV-Exporte", starter: false, pro: true },
        { name: "Audit-Log", starter: false, pro: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-petrol-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight text-petrol-900">iistelle</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-petrol-600">
            <ServiceDropdown />
            <Link href="/preise" className="text-coral-500 font-bold">Preise</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-petrol-700 transition hover:bg-petrol-50">
              Anmelden
            </Link>
            <Link href="/login" className="btn-primary">
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero mit Mehrwert */}
      <header className="relative overflow-hidden bg-petrol-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(60% 50% at 70% 20%, rgba(255,90,80,0.25) 0%, transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(69,144,154,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <Sparkles className="h-3.5 w-3.5 text-coral-400" />
            Preiswerte HR-Software für {config.countryName}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold text-white md:text-5xl">
            Recruiting & HR –<br />
            <span className="text-coral-400">einfach, fair, komplett.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-petrol-300">
            Von der Stellenausschreibung bis zum Offboarding: iistelle begleitet dich durch den gesamten Employee Lifecycle.
            Ohne versteckte Kosten, ohne Setup-Gebühren.
          </p>
        </div>
      </header>

      {/* Warum iistelle - 4 Vorteile */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {whyIistelle.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-petrol-100 text-coral-500">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-petrol-900">{item.title}</h3>
              <p className="mt-2 text-sm text-petrol-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preis-Toggle */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-1 rounded-full border border-petrol-200 bg-white p-1.5">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                billing === "monthly" ? "bg-petrol-800 text-white shadow-sm" : "text-petrol-600 hover:text-petrol-900"
              }`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                billing === "yearly" ? "bg-petrol-800 text-white shadow-sm" : "text-petrol-600 hover:text-petrol-900"
              }`}
            >
              Jährlich
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                -{yearlySavingsPercent}%
              </span>
            </button>
          </div>
          {billing === "yearly" ? (
            <p className="text-sm text-emerald-600 font-medium">✓ Jährliche Abrechnung – 2 Monate gratis!</p>
          ) : (
            <p className="text-sm text-petrol-500">Jährlich sparen: ca. {yearlySavingsPercent}% (2 Monate gratis)</p>
          )}
        </div>
      </section>

      {/* Preisübersicht - Kompakt */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {plans.map((plan) => {
            const display = getDisplayPrice(plan);
            const starterPlan = plans.find(p => p.id === "starter");
            const proPlan = plans.find(p => p.id === "professional");
            const isStarter = plan.id === "starter";
            const isPro = plan.id === "professional";

            return (
              <div
                key={plan.id}
                className={`card relative flex flex-col p-8 ${plan.highlight ? "border-2 border-coral-500 shadow-cardHover" : ""}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral-500 px-4 py-1 text-xs font-bold text-white">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-petrol-900">{plan.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-petrol-500">{plan.tagline}</p>

                    {/* Preis rechts */}
                    <div className="mt-6 w-full">
                      {display.price === null ? (
                        <div className="text-right">
                          <p className="text-3xl font-black text-petrol-900">Individuell</p>
                          <p className="text-sm text-petrol-400">auf Anfrage</p>
                        </div>
                      ) : display.price === 0 ? (
                        <div className="text-right">
                          <p className="text-3xl font-black text-petrol-900">{formatPrice(0, config.currency)}</p>
                          <p className="text-sm text-petrol-400">für immer kostenlos</p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-3xl font-black text-petrol-900">{formatPrice(display.price, config.currency)}</p>
                          <p className="text-sm text-petrol-400">pro Monat, pro Firma</p>
                          {billing === "yearly" && display.isYearly && (
                            <p className="mt-1 text-xs text-emerald-600 font-medium">
                              {formatPrice(display.savings!, config.currency)}/Jahr gespart ✓
                            </p>
                          )}
                          {billing === "monthly" && plan.yearlyPrice && (
                            <p className="mt-1 text-xs text-petrol-400">
                              Jährlich: {formatPrice(plan.yearlyPrice, config.currency)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mitarbeiter */}
                    <p className="mt-4 text-sm font-semibold text-petrol-600">
                      {plan.maxEmployees ? `Bis ${plan.maxEmployees} Mitarbeiter` : "Unbegrenzte Mitarbeiter"}
                    </p>

                    {/* Features */}
                    <div className="mt-6 space-y-2">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-petrol-700">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          {feature}
                        </div>
                      ))}
                      {plan.notIncluded?.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-petrol-300">
                          <X className="h-4 w-4 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Pro-Features als Pill-Tags */}
                    {isPro && starterPlan && (
                      <div className="mt-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-petrol-400">
                          Plus für Professional
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {starterPlan.features.slice(0, 3).map(f => (
                            <span key={f} className="rounded-full bg-petrol-100 px-3 py-1 text-xs text-petrol-500 line-through">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href={`${plan.ctaLink}${billing === "yearly" ? "&billing=yearly" : ""}`}
                  className={`${plan.highlight ? "btn-danger" : "btn-secondary"} mt-8 flex justify-center`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-petrol-500">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />DSGVO-konform</span>
          <span className="flex items-center gap-2"><Clock className="h-4 w-4" />Monatlich kündbar</span>
          <span className="flex items-center gap-2"><Zap className="h-4 w-4" />14 Tage kostenlos testen</span>
        </div>
      </section>

      {/* Feature-Vergleich nach Kategorie */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-petrol-900 md:text-3xl">
            Was ist in jedem Plan enthalten?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-petrol-500">
            Vergleiche die Funktionen nach Kategorie – so siehst du auf einen Blick, was in Starter und Professional enthalten ist.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {featureCategories.map((cat) => (
            <div key={cat.title} className="overflow-hidden rounded-2xl border border-petrol-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-petrol-100 bg-petrol-50 px-6 py-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.color}`}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-petrol-900">{cat.title}</h3>
              </div>
              <div className="divide-y divide-petrol-50">
                {cat.features.map((f) => (
                  <div key={f.name} className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm text-petrol-700">{f.name}</span>
                    <div className="flex items-center gap-4">
                      {f.starter ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <X className="h-5 w-5 text-petrol-300" />
                      )}
                      {f.pro ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <X className="h-5 w-5 text-petrol-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-petrol-100 bg-petrol-50 px-6 py-3 text-xs font-semibold text-petrol-500">
                <span></span>
                <div className="flex items-center gap-8">
                  <span className="w-20 text-center">Starter</span>
                  <span className="w-20 text-center">Professional</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-petrol-800 to-petrol-900">
          <div className="px-8 py-14">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-5 w-5 fill-coral-400 text-coral-400" />
                  ))}
                </div>
                <p className="text-lg font-medium text-white italic">
                  „iistelle hat unser gesamtes Recruiting revolutioniert. Wir haben die Zeit bis zur Einstellung um 40% reduziert."
                </p>
                <p className="mt-4 text-sm text-petrol-300">
                  — Sarah M., HR-Leiterin bei TechCorp AG
                </p>
              </div>
              <div className="flex flex-col justify-center gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-black text-white">500+</p>
                    <p className="text-sm text-petrol-300">Unternehmen vertrauen uns</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-white">50k+</p>
                    <p className="text-sm text-petrol-300">Bewerbungen verarbeitet</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-white">4.9/5</p>
                    <p className="text-sm text-petrol-300">Durchschnittliche Bewertung</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-white">98%</p>
                    <p className="text-sm text-petrol-300">Kundenzufriedenheit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-center text-2xl font-bold text-petrol-900">
          Häufige Fragen zu den Preisen
        </h2>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petrol-400" />
          <input
            type="text"
            placeholder="Frage durchsuchen..."
            value={faqSearch}
            onChange={(e) => { setFaqSearch(e.target.value); setOpenFaqIndex(null); }}
            className="w-full rounded-xl border border-petrol-200 bg-white py-3 pl-11 pr-4 text-sm text-petrol-900 placeholder-petrol-400 transition-shadow focus:border-petrol-400 focus:shadow-sm focus:outline-none"
          />
        </div>

        <div className="mt-6 space-y-3">
          {[
            {
              q: "Was passiert nach den 14 Testtagen?",
              a: "Du kannst entweder einen Plan wählen oder automatisch auf den kostenlosen Starter-Plan zurückfallen. Keine Kreditkarte erforderlich für den Testzeitraum.",
            },
            {
              q: billing === "yearly" ? "Kann ich auch monatlich zahlen?" : "Kann ich zwischen monatlicher und jährlicher Abrechnung wechseln?",
              a: billing === "yearly"
                ? "Ja! Du kannst jederzeit auf monatliche Abrechnung umstellen. Dein Vertrag wird dann zum nächsten Abrechnungsdatum angepasst."
                : "Ja! Du kannst jederzeit zwischen monatlicher und jährlicher Abrechnung wechseln. Bei jährlicher Abrechnung sparst du ca. 2 Monate.",
            },
            {
              q: "Wie viele Mitarbeiter kann ich verwalten?",
              a: "Im Starter-Plan bis zu 5 Mitarbeiter, im Professional-Plan unbegrenzt. Bei mehr als 50 Mitarbeitern bieten wir individuelle Enterprise-Konditionen an.",
            },
            {
              q: "Sind die Preise inklusive MWST?",
              a: config.country === "CH"
                ? "Alle Preise verstehen sich exklusive MWST. Schweizer Unternehmen können mit UID-Nummer ohne MWST abrechnen."
                : "Alle Preise verstehen sich inklusive 19% MWST für deutsche Unternehmen.",
            },
            {
              q: "Kann ich meine Daten exportieren?",
              a: "Ja! Im Professional-Plan hast du vollen Zugriff auf CSV-Exporte und unsere API. Im Starter-Plan kannst du wichtige Daten als PDF oder CSV exportieren.",
            },
            {
              q: "Was passiert, wenn ich kündige?",
              a: "Deine Daten bleiben 30 Tage nach Kündigung verfügbar. Du kannst jederzeit einen vollständigen Export aller Daten anfordern. Danach werden sie gemäß DSGVO gelöscht.",
            },
            {
              q: "Gibt es eine Einrichtungsgebühr?",
              a: "Nein! Die Einrichtung ist komplett kostenlos. Du registrierst dich, lädst dein Team ein – und kannst sofort loslegen.",
            },
          ].map(({ q, a }, i) => {
            if (faqSearch && !q.toLowerCase().includes(faqSearch.toLowerCase()) && !a.toLowerCase().includes(faqSearch.toLowerCase())) {
              return null;
            }
            const isOpen = openFaqIndex === i;
            return (
              <div key={q} className="overflow-hidden rounded-xl border border-petrol-100 bg-white shadow-sm">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-petrol-50"
                >
                  <h3 className="pr-4 font-bold text-petrol-900">{q}</h3>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-petrol-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="px-5 pb-5 text-sm text-petrol-600">{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-petrol-900 px-8 py-14 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: "radial-gradient(50% 60% at 80% 30%, rgba(255,90,80,0.3) 0%, transparent 70%)" }}
          />
          <div className="relative">
            <Users className="mx-auto h-10 w-10 text-coral-400" />
            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold text-white">
              Bereit für stressfreies HR?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-petrol-200">
              Starte heute und entdecke, wie einfach HR sein kann. 14 Tage kostenlos, keine Kreditkarte.
            </p>
            <Link href="/login" className="btn-danger mt-7 inline-flex px-6 py-3 text-base">
              Kostenlos starten <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}