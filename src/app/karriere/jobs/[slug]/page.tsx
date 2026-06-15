import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, ArrowLeft, Mail, CheckCircle, Sparkles, Send } from "lucide-react";
import Footer from "@/components/Footer";
import Image from "next/image";

const allJobs = [
  {
    title: "Full-Stack Entwickler:in",
    slug: "full-stack-entwickler",
    location: "Remote / Menziken",
    type: "Vollzeit",
    color: "from-sky-500 to-sky-600",
    colorBg: "bg-sky-500",
    description:
      "Entwickle die nächste Generation unserer HR-Plattform mit Next.js, TypeScript und Supabase.",
    responsibilities: [
      "Entwicklung neuer Features für unsere HR-Plattform iistelle",
      "Gestaltung und Umsetzung von Benutzeroberflächen mit React/Next.js",
      "Datenbankdesign und API-Entwicklung mit Supabase",
      "Zusammenarbeit mit dem Produktteam bei der Feature-Planung",
      "Code-Reviews und Mentoring von Junior-Entwicklern",
    ],
    requirements: [
      "2+ Jahre Erfahrung in der Web-Entwicklung",
      "Fundierte Kenntnisse in TypeScript und React/Next.js",
      "Erfahrung mit PostgreSQL und Supabase oder Firebase",
      "Verständnis für UI/UX-Prinzipien",
      "Selbstständige Arbeitsweise und Teamfähigkeit",
    ],
    niceToHave: [
      "Erfahrung mit Tailwind CSS",
      "Beiträge zu Open-Source-Projekten",
      "Kenntnisse in CI/CD und Deployment",
    ],
  },
  {
    title: "Product Designer:in",
    slug: "product-designer",
    location: "Remote",
    type: "Vollzeit",
    color: "from-violet-500 to-violet-600",
    colorBg: "bg-violet-500",
    description:
      "Gestalte intuitive Benutzererlebnisse für unser wachsendes Produktportfolio.",
    responsibilities: [
      "End-to-End Design von neuen Features",
      "Erstellung von Wireframes, Prototypen und hochauflösenden Designs",
      "Durchführung von Nutzerforschung und Usability-Tests",
      "Pflege und Weiterentwicklung des Design-Systems",
      "Zusammenarbeit mit Entwicklern bei der Umsetzung",
    ],
    requirements: [
      "3+ Jahre Erfahrung im Product Design",
      "Fortgeschrittene Figma-Kenntnisse",
      "Erfahrung mit Design-Systemen",
      "Starkes Verständnis für Usability und Accessibility",
      "Portfolio mit relevanten Projekten",
    ],
    niceToHave: [
      "Erfahrung mit Frontend-Entwicklung",
      "Kenntnisse in Motion Design",
      "Erfahrung im B2B/SaaS-Bereich",
    ],
  },
  {
    title: "Customer Success Manager:in",
    slug: "customer-success-manager",
    location: "Remote / Schweiz",
    type: "Vollzeit",
    color: "from-emerald-500 to-emerald-600",
    colorBg: "bg-emerald-500",
    description:
      "Begleite unsere Kunden auf dem Weg zum Erfolg mit iistelle.",
    responsibilities: [
      "Onboarding und Einarbeitung neuer Kunden",
      "Durchführung von Produkt-Schulungen",
      "Proaktive Kundenbetreuung und Beziehungsaufbau",
      "Sammlung und Weiterleitung von Kundenfeedback",
      "Unterstützung bei der Kundenbindung und -erweiterung",
    ],
    requirements: [
      "2+ Jahre Erfahrung im Customer Success oder Support",
      "Ausgeprägte Kommunikationsfähigkeiten",
      "Erfahrung mit CRM-Tools und Ticket-Systemen",
      "Verständnis für HR-Prozesse und -Software",
      "Deutsch als Muttersprache, Englisch fließend",
    ],
    niceToHave: [
      "Erfahrung mit HR-Software",
      "Kenntnisse in Salesforce oder HubSpot",
      "Consulting-Erfahrung",
    ],
  },
];

export function generateStaticParams() {
  return allJobs.map((job) => ({
    slug: job.slug,
  }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = { slug: "placeholder" }; // workaround for static generation
  return {
    title: `Jobs – iistelle Karriere`,
  };
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function IistelleJobPage({ params }: PageProps) {
  const { slug } = await params;
  const job = allJobs.find((j) => j.slug === slug);

  if (!job) {
    notFound();
  }

  const otherJobs = allJobs.filter((j) => j.slug !== slug);

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
        <div className="relative mx-auto max-w-4xl px-6 py-16">
          <Link
            href="/karriere"
            className="inline-flex items-center gap-2 text-sm font-semibold text-petrol-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Alle Stellen
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className={`inline-block h-3 w-3 rounded-full ${job.colorBg}`} />
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              {job.type}
            </span>
            <span className="flex items-center gap-1 text-sm text-petrol-300">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {job.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-petrol-300">
            {job.description}
          </p>
          <div className="mt-8">
            <a
              href={`mailto:jobs@twenty5ai.com?subject=Bewerbung%3A%20${encodeURIComponent(job.title)}`}
              className="inline-flex items-center gap-2 rounded-lg bg-coral-500 px-8 py-4 text-lg font-bold text-white transition hover:bg-coral-600"
            >
              <Mail className="h-5 w-5" />
              Jetzt bewerben
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Aufgaben */}
            <section>
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-petrol-900">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${job.colorBg} text-white`}>
                  <Sparkles className="h-4 w-4" />
                </span>
                Deine Aufgaben
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-petrol-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Anforderungen */}
            <section>
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-petrol-900">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${job.colorBg} text-white`}>
                  <CheckCircle className="h-4 w-4" />
                </span>
                Das bringst du mit
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
                    <span className="text-petrol-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Nice to have */}
            {job.niceToHave && job.niceToHave.length > 0 && (
              <section>
                <h2 className="mb-6 text-xl font-bold text-petrol-900">
                  Nice to have
                </h2>
                <ul className="space-y-3">
                  {job.niceToHave.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-petrol-400" />
                      <span className="text-petrol-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold text-petrol-900">Interessiert?</h3>
              <p className="mt-2 text-sm text-petrol-600">
                Wir freuen uns auf deine Bewerbung!
              </p>
              <a
                href={`mailto:jobs@twenty5ai.com?subject=Bewerbung%3A%20${encodeURIComponent(job.title)}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-coral-500 px-4 py-3 font-semibold text-white transition hover:bg-coral-600"
              >
                <Mail className="h-4 w-4" />
                Jetzt bewerben
              </a>
              <div className="mt-6 border-t border-petrol-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow">
                    <Image
                      src="/sebastian.webp"
                      alt="Sebastian Oczachowski"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">Sebastian Oczachowski</p>
                    <p className="text-sm text-petrol-500">Founder & CEO</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Other Jobs */}
      {otherJobs.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-petrol-900">
            Weitere offene Stellen
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherJobs.map((otherJob) => (
              <Link
                key={otherJob.slug}
                href={`/karriere/jobs/${otherJob.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`mb-4 h-1 w-full rounded-full bg-gradient-to-r ${otherJob.color}`} />
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-petrol-100 px-2 py-0.5 text-xs font-semibold text-petrol-600">
                    {otherJob.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-petrol-500">
                    <MapPin className="h-3 w-3" />
                    {otherJob.location}
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-petrol-900">
                  {otherJob.title}
                </h3>
                <p className="mt-2 text-sm text-petrol-600">
                  {otherJob.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-coral-500">
                  <span>Mehr erfahren</span>
                  <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}