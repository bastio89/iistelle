import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Users, TrendingUp, Shield, Heart, Coffee, Lightbulb } from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";

export const metadata: Metadata = {
  title: "Ratgeber – iistelle HR",
  description:
    "Praxisnahe Ratgeber für HR-Verantwortliche: Recruiting, Mitarbeiterführung, Onboarding und rechtliche Grundlagen.",
};

const guides = [
  {
    icon: Users,
    title: "Die perfekte Stellenanzeige schreiben",
    excerpt: "Erfahre, welche Elemente eine Stellenanzeige haben muss, um qualifizierte Kandidaten anzuziehen. Mit konkreten Beispielen und Vorlagen.",
    category: "Recruiting",
    readTime: "8 Min.",
    date: "15. Juni 2026",
    slug: "stellenanzeige-schreiben",
  },
  {
    icon: TrendingUp,
    title: "Onboarding: Die ersten 90 Tage",
    excerpt: "Ein strukturierter Onboarding-Prozess reduziert die Einarbeitungszeit um bis zu 40%. Hier ist der komplette Leitfaden.",
    category: "Mitarbeiter",
    readTime: "12 Min.",
    date: "10. Juni 2026",
    slug: "onboarding",
  },
  {
    icon: Shield,
    title: "DSGVO im Recruiting: Was du wissen musst",
    excerpt: "Bewerberdaten richtig handhaben: Von der Einwilligung bis zur sicheren Aufbewahrung. Alle rechtlichen Anforderungen erklärt.",
    category: "Recht",
    readTime: "10 Min.",
    date: "5. Juni 2026",
    slug: "dsgvo-recruiting",
  },
  {
    icon: Heart,
    title: "Mitarbeiterzufriedenheit messen und verbessern",
    excerpt: "Mit diesen Strategien erhöhst du die Zufriedenheit in deinem Team und reduzierst die Fluktuation nachhaltig.",
    category: "Kultur",
    readTime: "7 Min.",
    date: "1. Juni 2026",
    slug: "mitarbeiterzufriedenheit",
  },
  {
    icon: Coffee,
    title: "Führung auf Distanz: Remote-Teams erfolgreich leiten",
    excerpt: "Tools, Kommunikationsregeln und kulturelle Aspekte für die erfolgreiche Führung von verteilten Teams.",
    category: "Führung",
    readTime: "9 Min.",
    date: "25. Mai 2026",
    slug: "remote-arbeit",
  },
  {
    icon: TrendingUp,
    title: "Feedbackgespräche: So formulierst du konstruktives Feedback",
    excerpt: "Der richtige Rahmen, die richtigen Worte: So führst du Feedbackgespräche, die wirklich etwas bewirken.",
    category: "Führung",
    readTime: "6 Min.",
    date: "20. Mai 2026",
    slug: "feedbackgespraeche",
  },
];

const allGuides = [...guides, ...additionalGuides];

const categories = [
  { name: "Alle", count: allGuides.length, active: true },
  { name: "Recruiting", count: 3 },
  { name: "Mitarbeiter", count: 2 },
  { name: "Führung", count: 3 },
  { name: "Recht", count: 1 },
  { name: "Kultur", count: 1 },
];

export default function RatgeberPage() {
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
            <Link href="/ratgeber" className="text-coral-500 font-bold">Ratgeber</Link>
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
          <BookOpen className="h-3.5 w-3.5 text-coral-500" />
          HR-Wissen kompakt
        </span>
        <h1 className="mt-6 text-4xl font-bold text-petrol-900 md:text-5xl">
          Ratgeber für modernes HR
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-500">
          Praxisnahe Artikel, Expertenwissen und umsetzbare Tipps für HR-Verantwortliche –
          geschrieben von Praktikern, für Praktiker.
        </p>
      </header>

      {/* Kategorien */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                cat.active
                  ? "bg-petrol-800 text-white"
                  : "bg-white text-petrol-600 border border-petrol-200 hover:bg-petrol-50"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* Guides Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {allGuides.map((guide) => (
            <Link
              key={guide.title}
              href={`/ratgeber/${guide.slug}`}
              className="card group p-6 transition hover:shadow-cardHover"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-petrol-800 text-white">
                  <guide.icon className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      guide.category === "Recruiting" ? "bg-sky-100 text-sky-700" :
                      guide.category === "Mitarbeiter" ? "bg-emerald-100 text-emerald-700" :
                      guide.category === "Führung" ? "bg-violet-100 text-violet-700" :
                      guide.category === "Recht" ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-petrol-400">
                      <Clock className="h-3 w-3" />
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-petrol-900 group-hover:text-coral-500 transition">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-petrol-500 line-clamp-2">
                    {guide.excerpt}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-coral-500">
                    Weiterlesen <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-petrol-800 to-petrol-900 px-8 py-12">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <Lightbulb className="h-full w-full text-white" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white">
              Verpasse keinen neuen Ratgeber
            </h2>
            <p className="mt-2 text-petrol-200">
              Erhalte die neuesten Artikel direkt in dein Postfach – kostenlos und ohne Spam.
            </p>
            <form className="mt-6 flex flex-wrap gap-3">
              <input
                type="email"
                placeholder="deine@email.de"
                className="input max-w-sm flex-1"
              />
              <button className="btn-danger">
                Newsletter abonnieren
              </button>
            </form>
          </div>
        </div>
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