import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, BookOpen, FileText, Users, Shield, Zap, Lightbulb, TrendingUp, Heart, Coffee, Sparkles, ChevronRight, CheckCircle } from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services – iistelle",
  description:
    "Entdecke nützliche HR-Tools, Ratgeber und Insights für Schweizer und deutsche Unternehmen.",
};

const services = [
  {
    title: "Stellenausschreibung erstellen",
    description: "So schreibst du Stellenanzeigen, die qualifizierte Kandidaten anziehen.",
    link: "/ratgeber/stellenanzeige-schreiben",
    category: "Recruiting",
    color: "bg-gradient-to-br from-sky-500 to-sky-600",
    icon: Users,
  },
  {
    title: "Onboarding optimieren",
    description: "Der perfekte Onboarding-Prozess: Vom ersten Tag bis zur erfolgreichen Einarbeitung.",
    link: "/ratgeber/onboarding",
    category: "Mitarbeiter",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    icon: Zap,
  },
  {
    title: "Performance-Gespräche führen",
    description: "So führst du erfolgreich Mitarbeitergespräche: Feedback, Ziele und Entwicklung.",
    link: "/ratgeber/feedbackgespraeche",
    category: "Führung",
    color: "bg-gradient-to-br from-violet-500 to-violet-600",
    icon: TrendingUp,
  },
  {
    title: "DSGVO-konform recruiting",
    description: "Rechtliche Anforderungen an Bewerberdaten: Was du wissen musst.",
    link: "/ratgeber/dsgvo-recruiting",
    category: "Recht",
    color: "bg-gradient-to-br from-amber-500 to-amber-600",
    icon: Shield,
  },
  {
    title: "Mitarbeiterzufriedenheit steigern",
    description: "Die wichtigsten Hebel für höhere Zufriedenheit und geringere Fluktuation.",
    link: "/ratgeber/mitarbeiterzufriedenheit",
    category: "Kultur",
    color: "bg-gradient-to-br from-rose-500 to-rose-600",
    icon: Heart,
  },
  {
    title: "Remote-Teams führen",
    description: "Erfolgreiche Führung von verteilten Teams: Tools, Kommunikation und Kultur.",
    link: "/ratgeber/remote-arbeit",
    category: "Führung",
    color: "bg-gradient-to-br from-violet-500 to-violet-600",
    icon: Coffee,
  },
];

const tools = [
  {
    title: "Stundensatz-Rechner",
    description: "Berechne deinen optimalen Stundensatz basierend auf Lebenshaltungskosten und Gewinnmarge.",
    link: "/rechner/stundensatz",
    badge: "Kostenlos",
    icon: Calculator,
  },
  {
    title: "eNPS-Rechner",
    description: "Misst die Mitarbeiterzufriedenheit und -bindung in deinem Unternehmen.",
    link: "/rechner/enps",
    badge: "Kostenlos",
    icon: Heart,
  },
  {
    title: "Fluktuationsrechner",
    description: "Berechne deine Fluktuationsrate und vergleiche sie mit dem Branchendurchschnitt.",
    link: "/rechner/fluktuation",
    badge: "Kostenlos",
    icon: TrendingUp,
  },
  {
    title: "Onboarding-Checkliste",
    description: "Die komplette Checkliste für erfolgreiches Onboarding.",
    link: "/ratgeber/onboarding",
    badge: "Kostenlos",
    icon: CheckCircle,
  },
  {
    title: "Stellenbeschreibung-Vorlage",
    description: "Downloadbare Vorlage für professionelle Stellenbeschreibungen.",
    link: "/ratgeber/stellenanzeige-schreiben",
    badge: "Kostenlos",
    icon: FileText,
  },
  {
    title: "Mitarbeiterzufriedenheit-Check",
    description: "Bewerte die wichtigsten Faktoren für Zufriedenheit in deinem Team.",
    link: "/ratgeber/mitarbeiterzufriedenheit",
    badge: "Kostenlos",
    icon: Coffee,
  },
];

const categories = [
  { name: "Recruiting", count: 12, color: "bg-sky-100 text-sky-700 hover:bg-sky-200" },
  { name: "Mitarbeiter", count: 8, color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { name: "Führung", count: 6, color: "bg-violet-100 text-violet-700 hover:bg-violet-200" },
  { name: "Recht", count: 4, color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { name: "Kultur", count: 5, color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-petrol-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="iistelle" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight text-petrol-900">
              iistelle
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-petrol-600">
            <ServiceDropdown />
            <Link href="/ratgeber" className="transition hover:text-petrol-900">Ratgeber</Link>
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

      {/* Hero */}
      <header className="relative overflow-hidden bg-petrol-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 20%, rgba(255,90,80,0.25) 0%, transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(69,144,154,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <Sparkles className="h-3.5 w-3.5 text-coral-400" />
            Kostenlose Tools & Ratgeber
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold text-white md:text-5xl">
            Wissen, das dein HR transformiert
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-petrol-300">
            Praxisnahe Ratgeber, kostenlose Tools und Expertenwissen für HR-Verantwortliche – kompakt und direkt anwendbar.
          </p>
        </div>
      </header>

      {/* Kategorien */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${cat.color}`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* HR-Ratgeber */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-8 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-petrol-900">HR-Ratgeber</h2>
          <span className="rounded-full bg-petrol-100 px-3 py-1 text-sm font-semibold text-petrol-600">
            6 Artikel
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.title}
                href={service.link}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`h-40 w-full ${service.color} flex items-center justify-center`}>
                  <IconComponent className="h-16 w-16 text-white/30" />
                </div>
                <div className="p-5">
                  <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white bg-petrol-800">
                    {service.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-petrol-900 group-hover:text-coral-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-petrol-600">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-coral-500">
                    <span>Weiterlesen</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Kostenlose Tools */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-petrol-800 to-petrol-950 shadow-xl">
          <div className="p-8 md:p-10 lg:p-12">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-500/20 text-coral-400">
                <Calculator className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">Kostenlose HR-Tools</h2>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                    Kostenlos
                  </span>
                </div>
                <p className="mt-1 text-petrol-300">
                  Praktische Rechner und Vorlagen – ohne Anmeldung sofort nutzbar.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link
                    key={tool.title}
                    href={tool.link}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/80">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-bold text-white">{tool.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-petrol-300">{tool.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-coral-400">
                      <span>Zum Tool</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-petrol-50 to-white p-8 shadow-sm border border-petrol-100">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-coral-100 text-coral-500">
            <Lightbulb className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-petrol-900">
            Erhalte neue Ratgeber direkt ins Postfach
          </h2>
          <p className="mt-3 text-petrol-600">
            Kein Spam, nur wertvolle HR-Insights. Jeden Monat ein neuer Artikel.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="deine@email.ch"
              className="input flex-1"
            />
            <button type="button" className="btn-primary whitespace-nowrap">
              Anmelden
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
