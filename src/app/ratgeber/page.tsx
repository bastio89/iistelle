import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Search, Sparkles } from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";

export const metadata: Metadata = {
  title: "Ratgeber – iistelle",
  description:
    "Praxisnahe Ratgeber für HR-Verantwortliche: Recruiting, Mitarbeiterführung, Onboarding und rechtliche Grundlagen.",
};

const guides = [
  {
    title: "Die perfekte Stellenanzeige schreiben",
    excerpt: "Erfahre, welche Elemente eine Stellenanzeige haben muss, um qualifizierte Kandidaten anzuziehen. Mit konkreten Beispielen und Vorlagen.",
    category: "Recruiting",
    readTime: "8 Min.",
    date: "15. Juni 2026",
    slug: "stellenanzeige-schreiben",
    featured: true,
    color: "bg-gradient-to-br from-sky-500 to-sky-600",
  },
  {
    title: "Onboarding: Die ersten 90 Tage",
    excerpt: "Ein strukturierter Onboarding-Prozess reduziert die Einarbeitungszeit um bis zu 40%. Hier ist der komplette Leitfaden.",
    category: "Mitarbeiter",
    readTime: "12 Min.",
    date: "10. Juni 2026",
    slug: "onboarding",
    featured: true,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  },
  {
    title: "DSGVO im Recruiting: Was du wissen musst",
    excerpt: "Bewerberdaten richtig handhaben: Von der Einwilligung bis zur sicheren Aufbewahrung. Alle rechtlichen Anforderungen erklärt.",
    category: "Recht",
    readTime: "10 Min.",
    date: "5. Juni 2026",
    slug: "dsgvo-recruiting",
    color: "bg-gradient-to-br from-amber-500 to-amber-600",
  },
  {
    title: "Mitarbeiterzufriedenheit messen und verbessern",
    excerpt: "Mit diesen Strategien erhöhst du die Zufriedenheit in deinem Team und reduzierst die Fluktuation nachhaltig.",
    category: "Kultur",
    readTime: "7 Min.",
    date: "1. Juni 2026",
    slug: "mitarbeiterzufriedenheit",
    color: "bg-gradient-to-br from-rose-500 to-rose-600",
  },
  {
    title: "Führung auf Distanz: Remote-Teams erfolgreich leiten",
    excerpt: "Tools, Kommunikationsregeln und kulturelle Aspekte für die erfolgreiche Führung von verteilten Teams.",
    category: "Führung",
    readTime: "9 Min.",
    date: "25. Mai 2026",
    slug: "remote-arbeit",
    color: "bg-gradient-to-br from-violet-500 to-violet-600",
  },
  {
    title: "Feedbackgespräche: So formulierst du konstruktives Feedback",
    excerpt: "Der richtige Rahmen, die richtigen Worte: So führst du Feedbackgespräche, die wirklich etwas bewirken.",
    category: "Führung",
    readTime: "6 Min.",
    date: "20. Mai 2026",
    slug: "feedbackgespraeche",
    color: "bg-gradient-to-br from-violet-500 to-violet-600",
  },
  {
    title: "Arbeitgebermarke aufbauen: So wirst du zum attraktiven Arbeitgeber",
    excerpt: "Employer Branding ist mehr als ein Logo. Erfahre, wie du eine authentische Arbeitgebermarke schaffst.",
    category: "Recruiting",
    readTime: "10 Min.",
    date: "18. Juni 2026",
    slug: "arbeitgebermarke",
    color: "bg-gradient-to-br from-sky-500 to-sky-600",
  },
  {
    title: "Gehaltsverhandlung meistern: Tipps für faire und transparente Vergütung",
    excerpt: "Wie du Gehaltsverhandlungen professionell führst – sowohl intern als auch mit Bewerber:innen.",
    category: "Mitarbeiter",
    readTime: "8 Min.",
    date: "12. Juni 2026",
    slug: "gehaltsverhandlung",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  },
  {
    title: "Kündigungsgespräch führen: So trennst du dich fair und professionell",
    excerpt: "Ein gutes Offboarding ist genauso wichtig wie ein gutes Onboarding. Wie du Kündigungen respektvoll gestaltest.",
    category: "Führung",
    readTime: "7 Min.",
    date: "8. Juni 2026",
    slug: "kuendigungsgespraech",
    color: "bg-gradient-to-br from-violet-500 to-violet-600",
  },
];

const categories = [
  { name: "Alle", count: guides.length, active: true },
  { name: "Recruiting", count: 2, color: "bg-sky-100 text-sky-700 hover:bg-sky-200" },
  { name: "Mitarbeiter", count: 2, color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { name: "Führung", count: 3, color: "bg-violet-100 text-violet-700 hover:bg-violet-200" },
  { name: "Recht", count: 1, color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { name: "Kultur", count: 1, color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
];

export default function RatgeberPage() {
  const featuredGuides = guides.filter(g => g.featured);
  const regularGuides = guides.filter(g => !g.featured);

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
      <header className="relative overflow-hidden bg-petrol-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(50% 50% at 80% 20%, rgba(255,90,80,0.2) 0%, transparent 60%), radial-gradient(40% 40% at 20% 70%, rgba(69,144,154,0.2) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <Sparkles className="h-3.5 w-3.5 text-coral-400" />
            HR-Wissen kompakt
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Ratgeber für modernes HR
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-300">
            Praxisnahe Artikel, Expertenwissen und umsetzbare Tipps für HR-Verantwortliche –
            geschrieben von Praktikern, für Praktiker.
          </p>
        </div>
      </header>

      {/* Suchleiste */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-petrol-400" />
          <input
            type="text"
            placeholder="Ratgeber durchsuchen..."
            className="input pl-12"
          />
        </div>
      </section>

      {/* Featured Articles */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-6 md:grid-cols-2">
          {featuredGuides.map((guide, index) => (
            <Link
              key={guide.slug}
              href={`/ratgeber/${guide.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`h-52 w-full ${guide.color} flex items-center justify-center`}>
                <span className="text-6xl font-bold text-white/30">
                  {index + 1}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`rounded-full px-3 py-0.5 text-xs font-semibold text-white ${guide.color}`}>
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-petrol-400">
                    <Clock className="h-3 w-3" />
                    {guide.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-petrol-900 group-hover:text-coral-500 transition">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-petrol-600 line-clamp-2">
                  {guide.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-coral-500">
                  <span>Weiterlesen</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Alle Artikel */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 text-xl font-bold text-petrol-900">Alle Ratgeber</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regularGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/ratgeber/${guide.slug}`}
              className="group rounded-xl bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${guide.color}`}>
                  <span className="text-lg font-bold">
                    {guide.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-petrol-500">
                      {guide.category}
                    </span>
                    <span className="text-xs text-petrol-400">
                      · {guide.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-petrol-900 group-hover:text-coral-500 transition line-clamp-2">
                    {guide.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-petrol-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="iistelle" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-petrol-900">iistelle</span>
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
