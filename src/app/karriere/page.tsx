import Link from "next/link";
import { Users, Sparkles, Mail, MapPin, ArrowRight, Send, Heart } from "lucide-react";

export const metadata = {
  title: "Karriere – iistelle",
  description: "Werde Teil des iistelle-Teams und gestalte die Zukunft des HR-Managements.",
};

const openPositions = [
  {
    title: "Full-Stack Entwickler:in",
    location: "Remote / Menziken",
    type: "Vollzeit",
    color: "from-sky-500 to-sky-600",
    description:
      "Entwickle die nächste Generation unserer HR-Plattform mit Next.js, TypeScript und Supabase.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
  },
  {
    title: "Product Designer:in",
    location: "Remote",
    type: "Vollzeit",
    color: "from-violet-500 to-violet-600",
    description:
      "Gestalte intuitive Benutzererlebnisse für unser wachsendes Produktportfolio.",
    tags: ["Figma", "UX/UI", "Design Systems"],
  },
  {
    title: "Customer Success Manager:in",
    location: "Remote / Schweiz",
    type: "Vollzeit",
    color: "from-emerald-500 to-emerald-600",
    description:
      "Begleite unsere Kunden auf dem Weg zum Erfolg mit iistelle.",
    tags: ["B2B", "SaaS", "Kundenbetreuung"],
  },
];

const benefits = [
  {
    title: "Remote-First",
    description: "Arbeite von überall aus – ob Homeoffice, Coworking oder unser Büro in Menziken.",
    icon: MapPin,
  },
  {
    title: "Flexible Arbeitszeiten",
    description: "Wir vertrauen auf deine Selbstorganisation und bieten flexible Kernarbeitszeiten.",
    icon: Sparkles,
  },
  {
    title: "Steile Lernkurve",
    description: "Arbeite mit modernsten Technologien und lerne jeden Tag etwas Neues.",
    icon: Users,
  },
  {
    title: "Startup-Kultur",
    description: "Kurze Entscheidungswege, viel Eigenverantwortung und echter Impact.",
    icon: Heart,
  },
];

export default function KarrierePage() {
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
            <Link href="/services" className="transition hover:text-petrol-900">Services</Link>
            <Link href="/ratgeber" className="transition hover:text-petrol-900">Ratgeber</Link>
            <Link href="/preise" className="transition hover:text-petrol-900">Preise</Link>
          </div>
          <Link href="/login" className="btn-primary">
            Kostenlos starten
          </Link>
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
            Wir wachsen
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Deine Karriere bei iistelle
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-petrol-300">
            Wir gestalten die Zukunft des HR-Managements für kleine und mittlere Unternehmen.
            Werde Teil unseres Teams und entwickle innovative Lösungen, die wirklich einen
            Unterschied machen.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#jobs" className="btn-primary">
              Offene Stellen ansehen
            </a>
            <a href="#spontaneous" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              <Send className="h-4 w-4" />
              Initiativbewerbung
            </a>
          </div>
        </div>
      </header>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-petrol-900 md:text-3xl">
          Warum iistelle?
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral-100 text-coral-500">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-petrol-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-petrol-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Open Positions */}
      <section id="jobs" className="mx-auto max-w-6xl px-6 py-8 pb-20">
        <div className="mb-10 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-petrol-900 md:text-3xl">
            Offene Stellen
          </h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            {openPositions.length} Positionen
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {openPositions.map((position) => (
            <div
              key={position.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${position.color}`} />
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-petrol-100 px-2 py-0.5 text-xs font-semibold text-petrol-600">
                    {position.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-petrol-500">
                    <MapPin className="h-3 w-3" />
                    {position.location}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-petrol-900">
                  {position.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-petrol-600">
                  {position.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {position.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-petrol-50 px-2 py-1 text-xs font-medium text-petrol-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-coral-500">
                  <span>Bewerben</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Initiativbewerbung */}
      <section id="spontaneous" className="mx-auto max-w-4xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-petrol-800 to-petrol-950 shadow-xl">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-coral-500/20 text-coral-400">
                <Send className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">
                  Keine passende Stelle gefunden?
                </h2>
                <p className="mt-3 leading-relaxed text-petrol-300">
                  Wir sind immer auf der Suche nach talentierten Menschen, die mit uns
                  die Zukunft des HR-Managements gestalten wollen. Sende uns eine
                  Initiativbewerbung – wir freuen uns von dir zu hören!
                </p>
                <div className="mt-6">
                  <a
                    href="mailto:jobs@twenty5ai.com"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-petrol-800 transition hover:bg-petrol-100"
                  >
                    <Mail className="h-4 w-4" />
                    jobs@twenty5ai.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-petrol-900 md:text-3xl">
          Lerne das Team kennen
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-petrol-100 text-petrol-800">
              <span className="text-3xl font-bold">SO</span>
            </div>
            <h3 className="mt-4 font-bold text-petrol-900">Sebastian Oczachowski</h3>
            <p className="text-sm text-petrol-500">Founder & CEO</p>
          </div>
        </div>
        <p className="mt-6 text-center text-petrol-600">
          Ein kleines, fokussiertes Team mit großer Leidenschaft für innovative HR-Lösungen.
        </p>
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
            <Link href="/agb" className="transition hover:text-petrol-900">AGB</Link>
            <Link href="/karriere" className="transition hover:text-petrol-900">Karriere</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}