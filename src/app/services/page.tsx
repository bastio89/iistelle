import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calculator, BookOpen, FileText, Users, Shield, Zap, Lightbulb, TrendingUp, Heart, Coffee, Sparkles } from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";

export const metadata: Metadata = {
  title: "Services – iistelle",
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
    image: "https://cdn.pixabay.com/photo/2017/08/01/08/44/woman-2569346_1280.jpg",
  },
  {
    icon: Zap,
    title: "Onboarding optimieren",
    description: "Der perfekte Onboarding-Prozess: Vom ersten Tag bis zur erfolgreichen Einarbeitung.",
    link: "/ratgeber/onboarding",
    linkText: "Mehr erfahren",
    category: "Mitarbeiter",
    image: "https://cdn.pixabay.com/photo/2015/01/09/11/08/hands-593393_1280.jpg",
  },
  {
    icon: TrendingUp,
    title: "Performance-Gespräche führen",
    description: "So führst du erfolgreich Mitarbeitergespräche: Feedback, Ziele und Entwicklung.",
    link: "/ratgeber/feedbackgespraeche",
    linkText: "Mehr erfahren",
    category: "Führung",
    image: "https://cdn.pixabay.com/photo/2017/10/27/15/18/teamwork-2894855_1280.jpg",
  },
  {
    icon: Shield,
    title: "DSGVO-konform recruiting",
    description: "Rechtliche Anforderungen an Bewerberdaten: Was du wissen musst und wie du compliant bleibst.",
    link: "/ratgeber/dsgvo-recruiting",
    linkText: "Mehr erfahren",
    category: "Recht",
    image: "https://cdn.pixabay.com/photo/2016/03/26/18/23/cctv-1280531_1280.jpg",
  },
  {
    icon: Heart,
    title: "Mitarbeiterzufriedenheit steigern",
    description: "Die wichtigsten Hebel für höhere Zufriedenheit und geringere Fluktuation.",
    link: "/ratgeber/mitarbeiterzufriedenheit",
    linkText: "Mehr erfahren",
    category: "Kultur",
    image: "https://cdn.pixabay.com/photo/2018/07/14/03/38/team-3535401_1280.jpg",
  },
  {
    icon: Coffee,
    title: "Remote-Teams führen",
    description: "Erfolgreiche Führung von verteilten Teams: Tools, Kommunikation und Kultur.",
    link: "/ratgeber/remote-arbeit",
    linkText: "Mehr erfahren",
    category: "Führung",
    image: "https://cdn.pixabay.com/photo/2020/07/08/04/12/work-5382501_1280.jpg",
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
    image: "https://cdn.pixabay.com/photo/1554224155-8d0d缺/1280.jpg",
  },
  {
    icon: FileText,
    title: "Stellenbeschreibung-Vorlage",
    description: "Downloadbare Vorlage für professionelle Stellenbeschreibungen nach Schweizer Standard.",
    cta: "Zur Vorlage",
    link: "/ratgeber/stellenanzeige-schreiben",
    badge: "Kostenlos",
    image: "https://cdn.pixabay.com/photo/1456324504439-367cee3b3c32_1280.jpg",
  },
  {
    icon: BookOpen,
    title: "Onboarding-Checkliste",
    description: "Die komplette Checkliste für erfolgreiches Onboarding – von Tag 1 bis zum 90-Tage-Gespräch.",
    cta: "Zur Checkliste",
    link: "/ratgeber/onboarding",
    badge: "Kostenlos",
    image: "https://cdn.pixabay.com/photo/1517048676732-d65bc937f952_1280.jpg",
  },
];

const moreTools = [
  {
    icon: TrendingUp,
    title: "eNPS-Rechner",
    description: "Misst die Mitarbeiterzufriedenheit und -bindung in deinem Unternehmen.",
    cta: "Zum Rechner",
    link: "/rechner/enps",
    badge: "Kostenlos",
    image: "https://cdn.pixabay.com/photo/1551288049-bebda4e38f71_1280.jpg",
  },
  {
    icon: Users,
    title: "Fluktuationsrechner",
    description: "Berechne deine Fluktuationsrate und vergleiche sie mit dem Branchendurchschnitt.",
    cta: "Zum Rechner",
    link: "/rechner/fluktuation",
    badge: "Kostenlos",
    image: "https://cdn.pixabay.com/photo/1552664730-d307ca884978_1280.jpg",
  },
  {
    icon: Heart,
    title: "Mitarbeiterzufriedenheit-Check",
    description: "Bewerte in 2 Minuten die wichtigsten Faktoren für Zufriedenheit in deinem Team.",
    cta: "Zum Check",
    link: "/ratgeber/mitarbeiterzufriedenheit",
    badge: "Kostenlos",
    image: "https://cdn.pixabay.com/photo/1521737711867-e3f973156f02_1280.jpg",
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
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(50% 60% at 80% 20%, rgba(255,90,80,0.2) 0%, transparent 60%), radial-gradient(40% 40% at 20% 70%, rgba(69,144,154,0.2) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <Sparkles className="h-3.5 w-3.5 text-coral-400" />
            Kostenlose Tools & Ratgeber
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Wissen, das dein HR transformiert
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-300">
            Praxisnahe Ratgeber, kostenlose Tools und Expertenwissen für HR-Verantwortliche
            in der Schweiz und Deutschland – kompakt und direkt anwendbar.
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

      {/* Services/Ratgeber */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.link}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-36 w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/70 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-petrol-800">
                  {service.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-petrol-900 group-hover:text-coral-500 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-petrol-500">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-coral-500">
                  {service.linkText} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Kostenlose Tools */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-petrol-950 px-8 py-12">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coral-500/20 text-coral-400">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Kostenlose HR-Tools
              </h2>
              <p className="mt-1 max-w-lg text-petrol-300">
                Praktische Rechner und Vorlagen, die dir sofort helfen – ohne Anmeldung.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...tools, ...moreTools].map((tool) => (
              <div key={tool.title} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10">
                {tool.badge && (
                  <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    {tool.badge}
                  </span>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-petrol-700 text-petrol-300">
                  <tool.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-white">{tool.title}</h3>
                <p className="mt-2 text-sm text-petrol-300">{tool.description}</p>
                <Link
                  href={tool.link}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-coral-400 transition hover:text-coral-300"
                >
                  {tool.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <div className="rounded-2xl bg-petrol-50 p-8">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-coral-100 text-coral-500">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-petrol-900">
            Erhalte neue Ratgeber direkt ins Postfach
          </h2>
          <p className="mt-2 text-petrol-500">
            Kein Spam, nur wertvolle HR-Insights. Jeden Monat ein neuer Artikel.
          </p>
          <form className="mt-6 flex flex-wrap gap-3 justify-center">
            <input
              type="email"
              placeholder="deine@email.ch"
              className="input max-w-sm flex-1"
            />
            <button type="button" className="btn-primary">
              Anmelden
            </button>
          </form>
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
