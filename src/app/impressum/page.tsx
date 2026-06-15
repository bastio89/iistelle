import Link from "next/link";
import { ArrowLeft, MapPin, Mail, Phone, Globe, Sparkles } from "lucide-react";

export const metadata = {
  title: "Impressum – iistelle",
  description: "Impressum und rechtliche Anbieterkennung von iistelle.",
};

export default function ImpressumPage() {
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
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <Sparkles className="h-3.5 w-3.5 text-coral-400" />
            Rechtliche Informationen
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Impressum
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-300">
            Angaben gemäß schweizerischem Obligationenrecht (OR) und § 5 TMG
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-8">
          {/* Anbieter */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">Anbieter</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-petrol-900">iistelle</p>
                  <p className="mt-2 text-petrol-600">
                    Ein Produkt von twenty5ai
                  </p>
                </div>
                <div className="flex items-start gap-3 text-petrol-600">
                  <MapPin className="mt-1 h-5 w-5 text-coral-500" />
                  <div>
                    <p className="font-semibold text-petrol-800">twenty5ai</p>
                    <p>Sebastian Oczachowski</p>
                    <p>Risistrasse 19</p>
                    <p>5737 Menziken, Schweiz</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Kontakt */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">Kontakt</h2>
            </div>
            <div className="flex flex-wrap gap-6 p-6">
              <a href="tel:+41762035747" className="flex items-center gap-3 rounded-lg bg-petrol-50 px-4 py-3 transition hover:bg-petrol-100">
                <Phone className="h-5 w-5 text-coral-500" />
                <span className="font-semibold text-petrol-800">+41 76 203 57 47</span>
              </a>
              <a href="mailto:hello@twenty5ai.com" className="flex items-center gap-3 rounded-lg bg-petrol-50 px-4 py-3 transition hover:bg-petrol-100">
                <Mail className="h-5 w-5 text-coral-500" />
                <span className="font-semibold text-petrol-800">hello@twenty5ai.com</span>
              </a>
              <a href="https://www.twenty5ai.com" target="_blank" className="flex items-center gap-3 rounded-lg bg-petrol-50 px-4 py-3 transition hover:bg-petrol-100">
                <Globe className="h-5 w-5 text-coral-500" />
                <span className="font-semibold text-petrol-800">www.twenty5ai.com</span>
              </a>
            </div>
          </section>

          {/* Inhaber */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">Inhaber</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Sebastian Oczachowski (Einzelunternehmen, nicht im Handelsregister eingetragen)
              </p>
            </div>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">Verantwortlich für den Inhalt</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Verantwortlich gemäß Art. 18 Abs. 2 DSG (Schweiz) bzw. § 18 Abs. 2 MStV (Deutschland):
              </p>
              <p className="mt-2 font-semibold text-petrol-900">
                Sebastian Oczachowski
              </p>
              <p className="text-petrol-600">Risistrasse 19, 5737 Menziken</p>
            </div>
          </section>

          {/* Anwendbares Recht */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">Anwendbares Recht</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Für Kunden mit Sitz in der Schweiz gilt das Schweizerische Obligationenrecht (OR);
                Gerichtsstand ist Menziken AG, Schweiz. Für Kunden in Deutschland oder Österreich
                gelten ergänzend TMG und MStV. Es gilt schweizerisches Recht unter Ausschluss des
                UN-Kaufrechts.
              </p>
            </div>
          </section>

          {/* EU-Streitschlichtung */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">EU-Streitschlichtung</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Plattform der EU-Kommission zur Online-Streitbeilegung:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  className="font-semibold text-coral-500 underline hover:text-coral-600"
                >
                  ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="mt-3 text-petrol-600">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Haftung und Urheberrecht */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">Haftung und Urheberrecht</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Für eigene Inhalte sind wir nach den allgemeinen Gesetzen verantwortlich. Für
                Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich; bei
                Bekanntwerden von Rechtsverletzungen entfernen wir betroffene Inhalte oder Links
                umgehend.
              </p>
              <p className="mt-3 text-petrol-700">
                Inhalte dieser Seiten unterliegen dem anwendbaren Urheberrecht (URG/UrhG); jede
                Verwertung außerhalb der gesetzlichen Grenzen bedarf der schriftlichen Zustimmung.
              </p>
            </div>
          </section>

          {/* Stand */}
          <p className="text-center text-sm text-petrol-400">
            Stand: Juni 2026 · © {new Date().getFullYear()} twenty5ai. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>

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
