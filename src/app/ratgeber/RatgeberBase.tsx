import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, BookOpen } from "lucide-react";

// Base ratgeber page component
export default function RatgeberBase({
  children,
  title,
  excerpt,
  category,
  readTime,
  date,
}: {
  children: React.ReactNode;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
}) {
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
            <Link href="/services" className="transition hover:text-petrol-900">Services</Link>
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

      {/* Article Header */}
      <header className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/ratgeber"
          className="inline-flex items-center gap-2 text-sm font-semibold text-petrol-500 transition hover:text-petrol-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zum Ratgeber
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            category === "Recruiting" ? "bg-sky-100 text-sky-700" :
            category === "Mitarbeiter" ? "bg-emerald-100 text-emerald-700" :
            category === "Führung" ? "bg-violet-100 text-violet-700" :
            category === "Recht" ? "bg-amber-100 text-amber-700" :
            "bg-rose-100 text-rose-700"
          }`}>
            {category}
          </span>
          <span className="flex items-center gap-1 text-sm text-petrol-400">
            <Clock className="h-3.5 w-3.5" />
            {readTime} Lesezeit
          </span>
          <span className="flex items-center gap-1 text-sm text-petrol-400">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-petrol-900 md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-petrol-600">
          {excerpt}
        </p>
      </header>

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <div className="prose prose-petrol max-w-none">
          {children}
        </div>
      </article>

      {/* CTA */}
      <section className="border-t border-petrol-100 bg-petrol-50">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coral-100 text-coral-500">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-petrol-900">Mehr HR-Wissen gefällig?</h3>
              <p className="mt-1 text-sm text-petrol-600">
                Entdecke weitere kostenlose Ratgeber und Tools für dein HR-Management.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/ratgeber" className="btn-primary text-sm">
                  Alle Ratgeber
                </Link>
                <Link href="/services" className="btn-secondary text-sm">
                  Kostenlose Tools
                </Link>
              </div>
            </div>
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
