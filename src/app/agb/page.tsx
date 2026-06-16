import Link from "next/link";
import { FileText, Mail, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AGB – iistelle",
  description: "Allgemeine Geschäftsbedingungen für die Nutzung von iistelle.",
};

export default function AGBPage() {
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
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 20%, rgba(255,90,80,0.25) 0%, transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(69,144,154,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <FileText className="h-3.5 w-3.5 text-coral-400" />
            Rechtliche Grundlagen
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold text-white md:text-5xl">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-petrol-300">
            Die AGB regeln das Rechtsverhältnis zwischen dem Kunden und twenty5ai
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-6">
          {/* 1. Anwendungsbereich */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">1. Anwendungsbereich und Vertragsgrundlage</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Diese Allgemeinen Geschäftsbedingungen (AGB) regeln das Rechtsverhältnis zwischen
                dem Kunden und Sebastian Oczachowski (Risistrasse 19, 5737 Menziken), handelnd
                unter „twenty5ai" und „iistelle".
              </p>
              <p className="mt-3 text-petrol-700">
                Die AGB gelten für alle Vertragsbeziehungen und umfassen auch die
                Datenverarbeitung durch Subprozessoren wie Make.com und OpenAI. Mit der
                Annahme eines Angebots akzeptiert der Kunde diese Bedingungen einschließlich
                der Anhänge.
              </p>
            </div>
          </section>

          {/* 2. Gegenstand und Vertragsschluss */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">2. Gegenstand und Vertragsschluss</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                iistelle bietet HR-Softwarelösungen (Recruiting, Personalverwaltung,
                Zeiterfassung und Performance-Management) für kleine und mittlere Unternehmen.
              </p>
              <p className="mt-3 text-petrol-700">
                Ein Vertrag kommt durch Annahme einer Offerte zustande, die Leistungsumfang,
                Preis und projektspezifische Details enthält.
              </p>
            </div>
          </section>

          {/* 3. Nutzungsrechte */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">3. Nutzungsrechte</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Kunden erhalten ein nicht exklusives, unübertragbares Nutzungsrecht an der
                bereitgestellten Software im Rahmen des gebuchten Abonnements.
              </p>
              <p className="mt-3 text-petrol-700">
                Sämtliche geistigen Eigentumsrechte verbleiben bei twenty5ai. Der Kunde erwirbt
                keine Rechte an der Software, dem Sprachmodell oder dem Know-how.
              </p>
              <p className="mt-3 text-petrol-700">
                Die Nutzung ist auf die im Angebot angegebene Anzahl von Benutzern beschränkt.
              </p>
            </div>
          </section>

          {/* 4. Zahlungskonditionen */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">4. Zahlungskonditionen</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Die Preise werden individuell festgelegt (monatliche oder jährliche
                Abonnementsgebühren). Zusätzliche Anpassungen werden nach Aufwand
                verrechnet.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-petrol-50 p-4">
                  <h4 className="font-semibold text-petrol-900">Zahlungsfrist</h4>
                  <p className="mt-1 text-petrol-600">30 Tage nach Rechnungsstellung</p>
                </div>
                <div className="rounded-lg bg-petrol-50 p-4">
                  <h4 className="font-semibold text-petrol-900">Verzug</h4>
                  <p className="mt-1 text-petrol-600">
                    Bei Zahlungsverzug über 30 Tage kann iistelle die Leistung aussetzen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Gewährleistung */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">5. Gewährleistung</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Mängel sind innerhalb von sieben Werktagen zu melden. iistelle bietet
                zunächst Nachbesserung an. Bei wiederholtem Mangel oder wenn die
                Nachbesserung fehlschlägt, kann der Kunde den Vertrag kündigen.
              </p>
              <p className="mt-3 text-petrol-700">
                Die Verfügbarkeit der Software beträgt 99,5% im Jahresmittel
                (Wartungsfenster ausgenommen).
              </p>
            </div>
          </section>

          {/* 6. Haftung */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">6. Haftung</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500" />
                <p className="text-petrol-700">
                  <strong>Unbeschränkt:</strong> Bei grober Fahrlässigkeit oder Vorsatz
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500" />
                <p className="text-petrol-700">
                  <strong>Verdeckte Mängel:</strong> Haftung für die versprochene Beschaffenheit
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-petrol-400" />
                <p className="text-petrol-600">
                  <strong>Keine Haftung:</strong> Für indirekte Schäden, Folgeschäden oder
                  entgangenen Gewinn
                </p>
              </div>
            </div>
          </section>

          {/* 7. Vertragsdauer */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">7. Vertragsdauer und Kündigung</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Der Vertrag wird auf unbestimmte Zeit abgeschlossen. Ordentliche Kündigung
                erstmals zum Ende des ersten Vertragsjahres mit einer Frist von sechs Wochen.
                Danach kann der Vertrag jederzeit mit einer Frist von sechs Wochen gekündigt
                werden.
              </p>
              <p className="mt-3 text-petrol-700">
                Das monatliche Abonnement kann jederzeit zum Monatsende gekündigt werden.
                Jahresabonnements können mit einer Frist von 30 Tagen zum Ablauf der
                Vertragsperiode gekündigt werden.
              </p>
            </div>
          </section>

          {/* 8. Gerichtsstand */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">8. Gerichtsstand und anwendbares Recht</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Gerichtsstand ist Menziken AG, Schweiz. Es gilt schweizerisches Recht unter
                Ausschluss des UN-Kaufrechts (CISG).
              </p>
              <p className="mt-3 text-petrol-700">
                Für Verbraucher mit Wohnsitz in der EU gilt zusätzlich das Recht des
                jeweiligen Wohnsitzlandes, soweit zwingende Verbraucherschutzbestimmungen
                dem entgegenstehen.
              </p>
            </div>
          </section>

          {/* Kontakt */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-petrol-800 to-petrol-900 shadow-xl">
            <div className="p-8 text-center">
              <Mail className="mx-auto h-12 w-12 text-coral-400" />
              <h3 className="mt-4 text-xl font-bold text-white">
                Fragen zu den AGB?
              </h3>
              <p className="mt-2 text-petrol-300">
                Kontaktieren Sie uns für individuelle Vereinbarungen.
              </p>
              <a
                href="mailto:hello@twenty5ai.com"
                className="btn-primary mt-6 inline-block"
              >
                hello@twenty5ai.com
              </a>
            </div>
          </section>

          {/* Stand */}
          <p className="text-center text-sm text-petrol-400">
            Stand: Juni 2026 · © {new Date().getFullYear()} twenty5ai. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}