import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Calendar,
  Target,
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function PortalLandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="border-b border-petrol-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-petrol-900">iistelle Portal</span>
          </div>
          <Link href="/" className="text-sm font-semibold text-petrol-600 hover:text-petrol-900">
            Zurück zur Website
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="badge-pop inline-flex items-center gap-2 rounded-full border border-coral-200 bg-coral-50 px-4 py-1.5 text-sm font-semibold text-coral-600">
              <Star className="h-4 w-4 fill-current" />
              Mitarbeiterportal
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-petrol-900 md:text-5xl">
              Dein persönlicher HR-Bereich
            </h1>
            <p className="mt-4 text-lg text-petrol-600">
              Beantrage Urlaub, erfasse deine Arbeitszeit und behalte deine Ziele im Blick – alles an einem Ort, 24/7 verfügbar.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/portal-login" className="btn-primary inline-flex items-center gap-2">
                Jetzt einloggen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-4">
            {[
              {
                icon: Clock,
                title: "Zeiterfassung",
                desc: "Ein- und Ausstempeln direkt im Browser. Live-Tracking und Wochenübersicht.",
                color: "bg-coral-500",
              },
              {
                icon: Calendar,
                title: "Urlaub beantragen",
                desc: "Abwesenheiten online beantragen und den Status verfolgen.",
                color: "bg-emerald-500",
              },
              {
                icon: Target,
                title: "Ziele & Performance",
                desc: "Deine persönlichen Ziele einsehen und Fortschritt tracken.",
                color: "bg-violet-500",
              },
              {
                icon: FileText,
                title: "Dokumente",
                desc: "Persönliche Dokumente wie Arbeitsvertrag und Zeugnisse abrufen.",
                color: "bg-petrol-500",
              },
            ].map((feature) => (
              <div key={feature.title} className="card flex items-start gap-4 p-5">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-petrol-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-petrol-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-b border-petrol-100 bg-petrol-50/50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-petrol-900">Vorteile für Mitarbeiter</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "Zeitersparnis",
                desc: "Keine E-Mails mehr für Urlaubsanträge. Alles digital in Sekunden erledigt.",
              },
              {
                icon: ShieldCheck,
                title: "Transparenz",
                desc: "Immer sehen, wie viele Urlaubstage du noch hast und welche Anträge ausstehen.",
              },
              {
                icon: Users,
                title: "Team-Übersicht",
                desc: "Im Kalender sehen, wer wann abwesend ist – für bessere Planung.",
              },
            ].map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <benefit.icon className="h-8 w-8 text-petrol-600" />
                </div>
                <h3 className="mt-4 font-bold text-petrol-900">{benefit.title}</h3>
                <p className="mt-2 text-petrol-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-petrol-900">Bereit einzuloggen?</h2>
        <p className="mx-auto mt-3 max-w-md text-petrol-500">
          Wenn du bereits einen Zugang hast, kannst du dich direkt einloggen.
        </p>
        <Link href="/portal-login" className="btn-primary mt-6 inline-flex items-center gap-2">
          Zum Portal-Login
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-petrol-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-petrol-400">
          <p>© {new Date().getFullYear()} iistelle · 100% DSGVO-konform · Server in der Schweiz</p>
        </div>
      </footer>
    </div>
  );
}