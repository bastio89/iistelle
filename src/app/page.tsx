import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  FileText,
  Globe,
  KanbanSquare,
  Lock,
  Plane,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "iistelle HR – Recruiting & HR, schlank gemacht",
  description:
    "Die All-in-One-HR-Plattform für kleine und mittlere Unternehmen: Stellen schneller besetzen, Personalakte, Abwesenheiten und Performance – alles an einem Ort.",
};

const features = [
  {
    icon: KanbanSquare,
    title: "Bewerber-Pipeline",
    text: "Kanban-Board mit Drag & Drop von Eingang bis Einstellung. Jede Bewerbung immer im Blick, keine Kandidaten mehr verlieren.",
  },
  {
    icon: Globe,
    title: "Eigene Karriereseite",
    text: "Jede Firma erhält automatisch eine öffentliche Karriereseite. Bewerbungen inkl. Lebenslauf landen direkt in der Pipeline.",
  },
  {
    icon: Users,
    title: "Digitale Personalakte",
    text: "Stammdaten, Dokumente, Gehalt, Ziele und Onboarding-Checklisten – pro Person gebündelt statt in zehn Ordnern verstreut.",
  },
  {
    icon: Plane,
    title: "Abwesenheiten",
    text: "Anträge in Sekunden gestellt und genehmigt. Team-Kalender, Resturlaub und Wer-ist-heute-da? auf einen Blick.",
  },
  {
    icon: CalendarClock,
    title: "Interviews & Bewertungen",
    text: "Gespräche planen, Feedback strukturiert einsammeln und Entscheidungen gemeinsam treffen – ohne E-Mail-Pingpong.",
  },
  {
    icon: BarChart3,
    title: "Auswertungen",
    text: "Time-to-Hire, Conversion, Kanal-Performance und CSV-Exporte. Entscheidungen auf Basis von Zahlen statt Bauchgefühl.",
  },
];

const steps = [
  {
    n: "01",
    title: "Registrieren",
    text: "Konto anlegen, Firmenname eintragen – dein eigener, komplett getrennter HR-Bereich steht in unter einer Minute.",
  },
  {
    n: "02",
    title: "Stelle veröffentlichen",
    text: "Stelle anlegen, Kanäle wählen, auf deiner automatisch erstellten Karriereseite live schalten.",
  },
  {
    n: "03",
    title: "Schneller einstellen",
    text: "Bewerbungen laufen direkt in die Pipeline. Interviewen, bewerten, einstellen – und per Klick ins Onboarding übernehmen.",
  },
];

const trustItems = [
  { icon: Zap, text: "Startklar in 1 Minute" },
  { icon: Lock, text: "Strikte Datentrennung pro Firma" },
  { icon: ShieldCheck, text: "DSGVO-konform, Hosting in Frankfurt" },
  { icon: FileText, text: "CV-Upload & Dokumentenablage" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-petrol-100/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="iistelle HR Logo"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-lg font-bold tracking-tight text-petrol-900">
              iistelle HR
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-petrol-600 md:flex">
            {[
              { href: "/services", label: "Services" },
              { href: "/ratgeber", label: "Ratgeber" },
              { href: "#funktionen", label: "Funktionen" },
              { href: "/preise", label: "Preise" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="link-hover transition-colors hover:text-petrol-900"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-petrol-700 transition-all hover:bg-petrol-50"
            >
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
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
          {/* Badge with animation */}
          <div className="badge-pop inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <Sparkles className="h-3.5 w-3.5 text-coral-400" />
            Recruiting + HR in einer Plattform
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
              Kostenlos starten
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="/karriere/iistelle"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Live-Demo ansehen
            </a>
          </div>

          <p className="hero-note mt-4 text-xs text-petrol-400">
            Keine Kreditkarte nötig · In unter einer Minute startklar · Daten in Frankfurt gehostet
          </p>

          {/* Produkt-Mockup */}
          <div className="hero-mockup relative mx-auto mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
              {/* Fenster-Kopf with traffic lights */}
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
                    <span className="text-[10px] font-bold text-white">iistelle HR</span>
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

      {/* Vorteils-Leiste */}
      <section className="border-b border-petrol-100 bg-white">
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
            Alles, was dein HR-Alltag braucht
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-petrol-500">
            Vom ersten Bewerbungseingang bis zum Mitarbeitergespräch – ohne
            Tool-Wechsel, ohne Excel-Chaos.
          </p>
        </div>

        <div className="fade-in-stagger mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card group p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-petrol-800 text-white transition-transform group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-petrol-900 transition-colors group-hover:text-coral-500">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-petrol-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ablauf */}
      <section id="ablauf" className="bg-petrol-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-coral-400">So funktioniert's</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Von der Anmeldung zur ersten Einstellung
            </h2>
          </div>

          <div className="fade-in-stagger mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
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
            Fair und transparent
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-petrol-500">
            Starte kostenlos und wachse mit deinem Team. Keine Einrichtungsgebühr,
            monatlich kündbar.
          </p>
        </div>

        <div className="fade-in-stagger mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              name: "Starter",
              price: "0 €",
              sub: "für immer",
              highlight: false,
              items: ["Bis 10 Mitarbeiter", "Recruiting-Pipeline", "Eigene Karriereseite", "Abwesenheiten & Kalender"],
              cta: "Kostenlos starten",
            },
            {
              name: "Professional",
              price: "ab 129 €",
              sub: "pro Monat, pro Firma",
              highlight: true,
              items: ["Unbegrenzte Mitarbeiter", "Dokumente & CV-Upload", "Gehalt & Performance", "Rollen & Rechte", "CSV-Exporte", "API-Zugriff"],
              cta: "14 Tage testen",
            },
            {
              name: "Enterprise",
              price: "Individuell",
              sub: "auf Anfrage",
              highlight: false,
              items: ["Alles aus Professional", "Onboarding-Begleitung", "Individuelle Anpassungen", "Persönlicher Support"],
              cta: "Kontakt aufnehmen",
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`card relative flex flex-col p-7 transition-all ${
                plan.highlight ? "border-2 border-coral-500 shadow-cardHover scale-in-spring" : ""
              }`}
            >
              {plan.highlight && (
                <span className="badge-pop absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral-500 px-3 py-1 text-xs font-bold text-white">
                  Beliebt
                </span>
              )}

              <h3 className="font-bold text-petrol-900">{plan.name}</h3>
              <p className="mt-3 text-4xl font-black text-petrol-900">{plan.price}</p>
              <p className="text-sm text-petrol-400">{plan.sub}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-petrol-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`${plan.highlight ? "btn-danger" : "btn-secondary"} mt-6 justify-center`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="group relative overflow-hidden rounded-3xl bg-petrol-900 px-8 py-14 text-center transition-all hover:shadow-2xl">
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
              Registriere dich, trag deinen Firmennamen ein und veröffentliche
              deine erste Stelle – heute noch.
            </p>
            <Link href="/login" className="btn-danger group mt-7 inline-flex px-6 py-3 text-base">
              Jetzt kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-petrol-900">iistelle HR</span>
            <span className="ml-2 text-xs text-petrol-400">
              © {new Date().getFullYear()} · twenty5ai · Sebastian Oczachowski
            </span>
          </div>

          <div className="flex gap-5 text-sm font-semibold text-petrol-500">
            <Link href="/impressum" className="link-hover transition-colors hover:text-petrol-900">
              Impressum
            </Link>
            <Link href="/datenschutz" className="link-hover transition-colors hover:text-petrol-900">
              Datenschutz
            </Link>
            <Link href="/login" className="link-hover transition-colors hover:text-petrol-900">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}