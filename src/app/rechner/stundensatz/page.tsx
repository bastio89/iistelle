import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calculator, DollarSign, Coffee, Home, Car, Briefcase } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Stundensatz-Rechner – iistelle",
  description: "Berechne deinen optimalen Stundensatz basierend auf Lebenshaltungskosten und Gewinnmarge. Kostenlos und ohne Anmeldung.",
};

export default function StundensatzRechnerPage() {
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
      <header className="mx-auto max-w-6xl px-6 py-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-petrol-200 bg-petrol-50 px-4 py-1.5 text-xs font-semibold text-petrol-600">
          <Calculator className="h-3.5 w-3.5 text-coral-500" />
          Kostenloses Tool
        </span>
        <h1 className="mt-6 text-3xl font-bold text-petrol-900 md:text-4xl">
          Stundensatz-Rechner
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-500">
          Berechne in wenigen Schritten deinen optimalen Stundensatz – basierend auf
          deinen Lebenshaltungskosten und der gewünschten Gewinnmarge.
        </p>
      </header>

      {/* Calculator */}
      <section className="mx-auto max-w-2xl px-6 pb-20">
        <div className="rounded-2xl border border-petrol-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-petrol-900">Deine Lebenshaltungskosten</h2>

          <div className="space-y-6">
            {/* Country Selection */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-petrol-700">
                Region
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 rounded-lg border-2 border-petrol-200 bg-white px-4 py-3 cursor-pointer has-[:checked]:border-petrol-800 has-[:checked]:bg-petrol-50">
                  <input type="radio" name="region" value="ch" defaultChecked className="accent-petrol-800" />
                  <span className="text-sm font-medium">Schweiz (CHF)</span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border-2 border-petrol-200 bg-white px-4 py-3 cursor-pointer has-[:checked]:border-petrol-800 has-[:checked]:bg-petrol-50">
                  <input type="radio" name="region" value="de" className="accent-petrol-800" />
                  <span className="text-sm font-medium">Deutschland (EUR)</span>
                </label>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-petrol-700">
                  <Home className="mr-1 inline h-4 w-4" />
                  Wohnkosten (mtl.)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-petrol-400">CHF</span>
                  <input
                    type="number"
                    placeholder="1'800"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-petrol-700">
                  <Coffee className="mr-1 inline h-4 w-4" />
                  Lebensunterhalt (mtl.)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-petrol-400">CHF</span>
                  <input
                    type="number"
                    placeholder="1'200"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-petrol-700">
                  <Car className="mr-1 inline h-4 w-4" />
                  Mobilität (mtl.)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-petrol-400">CHF</span>
                  <input
                    type="number"
                    placeholder="400"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-petrol-700">
                  <Briefcase className="mr-1 inline h-4 w-4" />
                  Sonstiges (mtl.)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-petrol-400">CHF</span>
                  <input
                    type="number"
                    placeholder="600"
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-petrol-700">
                Tatsächliche Arbeitsstunden pro Woche ( abrechenbar)
              </label>
              <input
                type="number"
                placeholder="32"
                className="input max-w-xs"
              />
              <p className="mt-1 text-xs text-petrol-400">
                Nur fakturierbare Stunden. Puffer für Admin, Akquise etc. abziehen.
              </p>
            </div>

            {/* Profit Margin */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-petrol-700">
                Gewinnmarge (%)
              </label>
              <input
                type="number"
                placeholder="20"
                className="input max-w-xs"
              />
              <p className="mt-1 text-xs text-petrol-400">
                Empfehlung: 15-25% für nachhaltiges Wachstum.
              </p>
            </div>

            {/* Calculate Button */}
            <button className="btn-primary w-full py-4 text-base">
              Stundensatz berechnen
            </button>
          </div>
        </div>

        {/* Result Placeholder - Shown after calculation */}
        <div className="mt-6 rounded-2xl border border-petrol-200 bg-gradient-to-br from-petrol-800 to-petrol-900 p-8 text-center">
          <p className="text-sm font-medium text-petrol-200">Dein empfohlener Stundensatz</p>
          <p className="mt-2 text-4xl font-bold text-white">CHF 125.–</p>
          <p className="mt-2 text-sm text-petrol-200">
            bei 32 fakturierbaren Stunden/Woche und 20% Marge
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/ratgeber/stellenanzeige-schreiben" className="btn-secondary">
              Zur Stellenanzeige-Vorlage
            </Link>
            <Link href="/preise" className="btn-outline border-white/30 text-white hover:bg-white/10">
              iistelle kostenlos testen
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl bg-petrol-50 p-8">
          <h2 className="text-xl font-bold text-petrol-900">💡 So wird gerechnet</h2>
          <p className="mt-4 text-petrol-600">
            Der Stundensatz setzt sich zusammen aus:
          </p>
          <ol className="mt-4 space-y-2 text-petrol-700">
            <li className="flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-petrol-800 text-xs font-bold text-white">1</span>
              <span>Monatliche Kosten × 12 (Jahreskosten)</span>
            </li>
            <li className="flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-petrol-800 text-xs font-bold text-white">2</span>
              <span>÷ (Wochenstunden × 48) + Urlaubswochen</span>
            </li>
            <li className="flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-petrol-800 text-xs font-bold text-white">3</span>
              <span>+ Gewinnmarge</span>
            </li>
          </ol>
          <p className="mt-4 text-sm text-petrol-500">
            In der Praxis kommen noch Steuern, Versicherungen und Rücklagen hinzu.
            Dieser Rechner gibt dir einen ersten Anhaltspunkt.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-coral-500 to-coral-600 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-white">
            Automatisiere dein HR mit iistelle
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-coral-100">
            Verwalte Mitarbeitende, Abwesenheiten und Zeiterfassung an einem Ort –
            mit kostenlosem Starter-Tarif.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-coral-600 transition hover:bg-coral-50">
            Jetzt kostenlos starten
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}