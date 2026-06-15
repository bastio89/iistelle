"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CheckCircle2, X, ArrowRight, Sparkles, Clock, ShieldCheck, Users, Zap, Sparkles as SparklesIcon, Search, ChevronDown } from "lucide-react";
import { PricingPlan, PricingConfig, formatPrice } from "@/lib/pricing";
import { ServiceDropdown } from "@/components/ServiceDropdown";

interface Props {
  plans: PricingPlan[];
  config: PricingConfig;
}

type BillingPeriod = "monthly" | "yearly";

// Custom hook for scroll-triggered animations
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// Animated wrapper for individual cards to avoid hook-in-loop issues
function AnimatedCard({ children, delay, highlight }: { children: React.ReactNode; delay: number; highlight?: boolean }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`card relative flex flex-col transition-all duration-500 ${
        highlight ? "border-2 border-coral-500 shadow-cardHover" : ""
      } ${isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function PricingClient({ plans, config }: Props) {
  // URL-Parameter auslesen für Sharing
  const getInitialBilling = (): BillingPeriod => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("billing") === "yearly") return "yearly";
      // localStorage für Persistenz
      const saved = localStorage.getItem("iistelle-billing");
      if (saved === "yearly" || saved === "monthly") return saved;
    }
    return "monthly";
  };

  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [mounted, setMounted] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    setBilling(getInitialBilling());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("iistelle-billing", billing);
    }
  }, [billing, mounted]);

  const yearlySavingsPercent = 17; // 2 Monate gratis = ~17% Rabatt

  const getDisplayPrice = (plan: PricingPlan) => {
    if (plan.monthlyPrice === null || plan.monthlyPrice === 0) {
      return { price: null, period: "" };
    }

    if (billing === "yearly" && plan.yearlyPrice) {
      const monthlyEquivalent = plan.yearlyPrice / 12;
      return {
        price: monthlyEquivalent,
        period: "/Monat",
        isYearly: true,
        totalYearly: plan.yearlyPrice,
        savings: plan.monthlyPrice * 12 - plan.yearlyPrice,
      };
    }

    return {
      price: plan.monthlyPrice,
      period: "/Monat",
      isYearly: false,
    };
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-petrol-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="iistelle HR Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight text-petrol-900">
              iistelle HR
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-petrol-600">
            <ServiceDropdown />
            <Link href="/preise" className="transition hover:text-petrol-900">Preise</Link>
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

      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-petrol-200 bg-petrol-50 px-4 py-1.5 text-xs font-semibold text-petrol-600">
          <Sparkles className="h-3.5 w-3.5 text-coral-500" />
          Preiswerte HR-Software für {config.countryName}
        </span>
        <h1 className="mt-6 text-4xl font-bold text-petrol-900 md:text-5xl">
          Faire Preise, keine Überraschungen
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-500">
          Starte kostenlos und wachse mit deinem Team. Monatlich kündbar,
          keine Einrichtungsgebühr, keine versteckten Kosten.
        </p>

        {/* Preis-Toggle - Mobile-optimiert */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-1 rounded-full border border-petrol-200 bg-white p-1.5">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all md:px-5 md:py-2 ${
                billing === "monthly"
                  ? "bg-petrol-800 text-white shadow-sm"
                  : "text-petrol-600 hover:text-petrol-900"
              }`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 md:px-5 md:py-2 ${
                billing === "yearly"
                  ? "bg-petrol-800 text-white shadow-sm"
                  : "text-petrol-600 hover:text-petrol-900"
              }`}
            >
              <span className="md:hidden">-17%</span>
              <span className="hidden md:inline">Jährlich</span>
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
      </header>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {plans.map((plan, index) => {
            const display = getDisplayPrice(plan);

            return (
              <AnimatedCard key={plan.id} delay={index * 100} highlight={plan.highlight}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral-500 px-4 py-1 text-xs font-bold text-white">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-petrol-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-petrol-500">{plan.tagline}</p>
                </div>

                <div className="mb-6">
                  {display.price === null ? (
                    <p className="text-3xl font-black text-petrol-900">Individuell</p>
                  ) : display.price === 0 ? (
                    <>
                      <p className="text-3xl font-black text-petrol-900">
                        {formatPrice(0, config.currency)}
                      </p>
                      <p className="text-sm text-petrol-400">für immer kostenlos</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-petrol-900 transition-all duration-300">
                          {formatPrice(display.price, config.currency)}
                        </p>
                        <p className="text-sm text-petrol-400">{display.period}</p>
                      </div>
                      {billing === "yearly" && display.isYearly && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-petrol-500">
                            Gesamt jährlich: <strong className="text-petrol-700">{formatPrice(display.totalYearly!, config.currency)}</strong>
                          </p>
                          <p className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            <SparklesIcon className="h-3 w-3" />
                            Du sparst {formatPrice(display.savings!, config.currency)} pro Jahr!
                          </p>
                        </div>
                      )}
                      {billing === "monthly" && plan.yearlyPrice && (
                        <p className="mt-1 text-xs text-petrol-500">
                          Jährlich: {formatPrice(plan.yearlyPrice, config.currency)} ({formatPrice(plan.yearlyPrice / 12, config.currency)}/Mon.)
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="mb-6">
                  {plan.maxEmployees ? (
                    <p className="text-sm font-semibold text-petrol-700">
                      Bis {plan.maxEmployees} Mitarbeiter
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-petrol-700">
                      Unbegrenzte Mitarbeiter
                    </p>
                  )}
                </div>

                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-petrol-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-petrol-300">
                      <X className="mt-0.5 h-4 w-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`${plan.ctaLink}${billing === "yearly" ? "&billing=yearly" : ""}`}
                  className={`${plan.highlight ? "btn-danger" : "btn-secondary"} mt-auto justify-center`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </AnimatedCard>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-petrol-500">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            DSGVO-konform
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Monatlich kündbar
          </span>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            14 Tage kostenlos testen
          </span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-center text-2xl font-bold text-petrol-900">
          Häufige Fragen zu den Preisen
        </h2>

        {/* FAQ Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petrol-400" />
          <input
            type="text"
            placeholder="Frage durchsuchen..."
            value={faqSearch}
            onChange={(e) => {
              setFaqSearch(e.target.value);
              setOpenFaqIndex(null);
            }}
            className="w-full rounded-xl border border-petrol-200 bg-white py-3 pl-11 pr-4 text-sm text-petrol-900 placeholder-petrol-400 transition-shadow focus:border-petrol-400 focus:shadow-sm focus:outline-none"
          />
        </div>

        <div className="mt-6 space-y-3">
          {[
            {
              q: "Was passiert nach den 14 Testtagen?",
              a: "Du kannst entweder einen Plan wählen oder automatisch auf den kostenlosen Starter-Plan zurückfallen. Keine Kreditkarte erforderlich.",
            },
            {
              q: billing === "yearly" ? "Kann ich auch monatlich zahlen?" : "Kann ich zwischen monatlicher und jährlicher Abrechnung wechseln?",
              a: billing === "yearly"
                ? "Ja! Du kannst jederzeit auf monatliche Abrechnung umstellen. Dein Vertrag wird dann zum nächsten Abrechnungsdatum angepasst."
                : "Ja! Du kannst jederzeit zwischen monatlicher und jährlicher Abrechnung wechseln. Bei jährlicher Abrechnung sparst du ca. 2 Monate.",
            },
            {
              q: `Kann ich zwischen ${config.currencySymbol} und Euro wechseln?`,
              a: "Die Preise werden basierend auf deinem Standort automatisch in der richtigen Währung angezeigt. Bei Fragen kontaktiere uns.",
            },
            {
              q: "Gibt es Mengenrabatte?",
              a: "Ja! Für Unternehmen mit mehr als 50 Mitarbeitern bieten wir individuelle Konditionen an. Kontaktiere uns für ein Angebot.",
            },
            {
              q: "Sind die Preise inklusive MWST?",
              a: config.country === "CH"
                ? "Alle Preise verstehen sich exklusive MWST. Schweizer Unternehmen können mit UID-Nummer ohne MWST abrechnen."
                : "Alle Preise verstehen sich inklusive 19% MWST für deutsche Unternehmen.",
            },
          ].map(({ q, a }, i) => {
            // Filter by search
            if (faqSearch && !q.toLowerCase().includes(faqSearch.toLowerCase()) &&
                !a.toLowerCase().includes(faqSearch.toLowerCase())) {
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

        {faqSearch && [
          { q: "Was passiert nach den 14 Testtagen?", a: "" },
          { q: billing === "yearly" ? "Kann ich auch monatlich zahlen?" : "Kann ich zwischen monatlicher und jährlicher Abrechnung wechseln?", a: "" },
          { q: `Kann ich zwischen ${config.currencySymbol} und Euro wechseln?`, a: "" },
          { q: "Gibt es Mengenrabatte?", a: "" },
          { q: "Sind die Preise inklusive MWST?", a: "" },
        ].filter(({ q }) => q.toLowerCase().includes(faqSearch.toLowerCase())).length === 0 && (
          <p className="mt-6 text-center text-petrol-400">
            Keine passenden Fragen gefunden. <Link href="/login" className="text-petrol-600 underline">Kontaktiere uns</Link> direkt.
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-petrol-900 px-8 py-14 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(50% 60% at 80% 30%, rgba(255,90,80,0.3) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <Users className="mx-auto h-10 w-10 text-coral-400" />
            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold text-white">
              Bereit für stressfreies HR?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-petrol-200">
              Starte heute und entdecke, wie einfach HR sein kann.
            </p>
            <Link href="/login" className="btn-danger mt-7 inline-flex px-6 py-3 text-base">
              Kostenlos starten <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-petrol-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="iistelle HR Logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-bold text-petrol-900">iistelle HR</span>
            <span className="ml-2 text-xs text-petrol-400">
              © {new Date().getFullYear()} · twenty5ai
            </span>
          </div>
          <div className="flex gap-5 text-sm font-semibold text-petrol-500">
            <Link href="/impressum" className="transition hover:text-petrol-900">Impressum</Link>
            <Link href="/datenschutz" className="transition hover:text-petrol-900">Datenschutz</Link>
            <Link href="/login" className="transition hover:text-petrol-900">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}