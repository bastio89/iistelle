import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, BookOpen, FileText, Users, Shield, Zap, Lightbulb, TrendingUp, Heart, Coffee } from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";

export const metadata: Metadata = {
  title: "Services & Ratgeber – iistelle HR",
  description:
    "Entdecke nützliche HR-Tools, Ratgeber und Insights für Schweizer und deutsche Unternehmen. Von der Stellenausschreibung bis zum Onboarding.",
};

const services = [
  {
    icon: Users,
    title: "Stellenausschreibung erstellen",
    description: "So schreibst du Stellenanzeigen, die qualifizierte Kandidaten anziehen – mit Tipps für jede Branche.",
    link: "/ratgeber/stellenanzeige-schreiben",
    linkText: "Zum Ratgeber",
    category: "Recruiting",
  },
  {
    icon: Zap,
    title: "Onboarding optimieren",
    description: "Der perfekte Onboarding-Prozess: Vom ersten Tag bis zur erfolgreichen Einarbeitung.",
    link: "/ratgeber/onboarding",
    linkText: "Mehr erfahren",
    category: "Mitarbeiter",
  },
  {
    icon: TrendingUp,
    title: "Performance-Gespräche führen",
    description: "So führst du erfolgreich Mitarbeitergespräche: Feedback, Ziele und Entwicklung.",
    link: "/ratgeber/feedbackgespraeche",
    linkText: "Mehr erfahren",
    category: "Führung",
  },
  {
    icon: Shield,
    title: "DSGVO-konform recruiting",
    description: "Rechtliche Anforderungen an Bewerberdaten: Was du wissen musst und wie du compliant bleibst.",
    link: "/ratgeber/dsgvo-recruiting",
    linkText: "Mehr erfahren",
    category: "Recht",
  },
  {
    icon: Heart,
    title: "Mitarbeiterzufriedenheit steigern",
    description: "Die wichtigsten Hebel für höhere Zufriedenheit und geringere Fluktuation.",
    link: "/ratgeber/mitarbeiterzufriedenheit",
    linkText: "Mehr erfahren",
    category: "Kultur",
  },
  {
    icon: Coffee,
    title: "Remote-Teams führen",
    description: "Erfolgreiche Führung von verteilten Teams: Tools, Kommunikation und Kultur.",
    link: "/ratgeber/remote-arbeit",
    linkText: "Mehr erfahren",
    category: "Führung",
  },
];

const tools = [
  {
    icon: Calculator,
    title: "Stundensatz-Rechner",
    description: "Berechne deinen optimalen Stundensatz basierend auf Lebenshaltungskosten und Gewinnmarge.",
    cta: "Zum Rechner",
    link: "/rechner/stundensatz",
    badge: "Kostenlos",
  },
  {
    icon: FileText,
    title: "Stellenbeschreibung-Vorlage",
    description: "Downloadbare Vorlage für professionelle Stellenbeschreibungen nach Schweizer Standard.",
    cta: "Zur Vorlage",
    link: "/ratgeber/stellenanzeige-schreiben",
    badge: "Kostenlos",
  },
  {
    icon: BookOpen,
    title: "Onboarding-Checkliste",
    description: "Die komplette Checkliste für erfolgreiches Onboarding – von Tag 1 bis zum 90-Tage-Gespräch.",
    cta: "Zur Checkliste",
    link: "/ratgeber/onboarding",
    badge: "Kostenlos",
  },
];

// More free tools
const moreTools = [
  {
    icon: TrendingUp,
    title: "eNPS-Rechner",
    description: "Misst die Mitarbeiterzufriedenheit und -bindung in deinem Unternehmen.",
    cta: "Zum Rechner",
    link: "/rechner/enps",
    badge: "Kostenlos",
  },
  {
    icon: Users,
    title: "Fluktuationsrechner",
    description: "Berechne deine Fluktuationsrate und vergleiche sie mit dem Branchendurchschnitt.",
    cta: "Zum Rechner",
    link: "/rechner/fluktuation",
    badge: "Kostenlos",
  },
  {
    icon: Heart,
    title: "Mitarbeiterzufriedenheit-Check",
    description: "Bewerte in 2 Minuten die wichtigsten Faktoren für Zufriedenheit in deinem Team.",
    cta: "Zum Check",
    link: "/ratgeber/mitarbeiterzufriedenheit",
    badge: "Kostenlos",
  },
];

const categories = [
  { name: "Recruiting", count: 12, color: "bg-sky-100 text-sky-700" },
  { name: "Mitarbeiter", count: 8, color: "bg-emerald-100 text-emerald-700" },
  { name: "Führung", count: 6, color: "bg-violet-100 text-violet-700" },
  { name: "Recht", count: 4, color: "bg-amber-100 text-amber-700" },
  { name: "Kultur", count: 5, color: "bg-rose-100 text-rose-700" },
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
              iistelle HR
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-petrol-600">
            <ServiceDropdown />
            <Link href="/services" className="text-coral-500 font-bold">Services</Link>
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
      <header className="mx-auto max-w-6xl px-6 py-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-petrol-200 bg-petrol-50 px-4 py-1.5 text-xs font-semibold text-petrol-600">
          <Lightbulb className="h-3.5 w-3.5 text-coral-500" />
          Services & Ratgeber
        </span>
        <h1 className="mt-6 text-4xl font-bold text-petrol-900 md:text-5xl">
          Wissen, das dein HR transformiert
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-500">
          Praxisnahe Ratgeber, kostenlose Tools und Expertenwissen für HR-Verantwortliche
          in der Schweiz und Deutschland – kompakt und direkt anwendbar.
        </p>
      </header>

      {/* Kategorien */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${cat.color} hover:shadow-md`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* Services/Ratgeber */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-2xl font-bold text-petrol-900">Aktuelle Ratgeber</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.link}
              className="card group p-6 transition hover:shadow-cardHover"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-petrol-800 text-white">
                  <service.icon className="h-5 w-5" />
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${service.category === "Recruiting" ? "bg-sky-100 text-sky-700" : service.category === "Mitarbeiter" ? "bg-emerald-100 text-emerald-700" : service.category === "Führung" ? "bg-violet-100 text-violet-700" : service.category === "Recht" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                  {service.category}
                </span>
              </div>
              <h3 className="font-bold text-petrol-900 group-hover:text-coral-500 transition">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-petrol-500">
                {service.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coral-500">
                {service.linkText} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Kostenlose Tools */}
      <section className="bg-petrol-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-petrol-200">
              <Calculator className="h-3.5 w-3.5 text-coral-400" />
              Kostenlose Tools
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              Nützliche HR-Tools zum sofortigen Nutzen
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-petrol-300">
              Praktische Rechner und Vorlagen, die dir sofort helfen – ohne Anmeldung.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                {tool.badge && (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    {tool.badge}
                  </span>
                )}
                <span className="mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-coral-500/20 text-coral-400">
                  <tool.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold text-white">{tool.title}</h3>
                <p className="mt-2 text-sm text-petrol-300">{tool.description}</p>
                <Link
                  href={tool.link}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {tool.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {moreTools.map((tool) => (
              <div key={tool.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                {tool.badge && (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    {tool.badge}
                  </span>
                )}
                <span className="mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-petrol-500/20 text-petrol-300">
                  <tool.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold text-white">{tool.title}</h3>
                <p className="mt-2 text-sm text-petrol-300">{tool.description}</p>
                <Link
                  href={tool.link}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {tool.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-petrol-900">
          Erhalte neue Ratgeber direkt ins Postfach
        </h2>
        <p className="mt-3 text-petrol-500">
          Kein Spam, nur wertvolle HR-Insights. Jeden Monat ein neuer Artikel.
        </p>
        <form className="mt-6 flex flex-wrap gap-3 justify-center">
          <input
            type="email"
            placeholder="deine@email.ch"
            className="input max-w-sm flex-1"
          />
          <button className="btn-primary">
            Anmelden
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-petrol-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="iistelle" width={28} height={28} className="rounded-lg" />
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