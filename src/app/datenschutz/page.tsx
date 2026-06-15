import Link from "next/link";
import { Shield, Eye, Lock, Users, Mail, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Datenschutz – iistelle",
  description: "Datenschutzerklärung und Informationen zur Verarbeitung Ihrer Daten bei iistelle.",
};

export default function DatenschutzPage() {
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
            <Shield className="h-3.5 w-3.5 text-coral-400" />
            DSGVO-konform
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Datenschutzerklärung
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-petrol-300">
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Overview Cards */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <Eye className="h-8 w-8 text-coral-500" />
            <h3 className="mt-3 font-bold text-petrol-900">Transparenz</h3>
            <p className="mt-1 text-sm text-petrol-600">
              Klare Informationen, welche Daten wir erheben und warum.
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <Lock className="h-8 w-8 text-coral-500" />
            <h3 className="mt-3 font-bold text-petrol-900">Sicherheit</h3>
            <p className="mt-1 text-sm text-petrol-600">
              SSL-Verschlüsselung und sichere Datenspeicherung in der Schweiz.
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <Users className="h-8 w-8 text-coral-500" />
            <h3 className="mt-3 font-bold text-petrol-900">Ihre Rechte</h3>
            <p className="mt-1 text-sm text-petrol-600">
              Auskunft, Berichtigung und Löschung – jederzeit möglich.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Datenschutz auf einen Blick */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">1. Datenschutz auf einen Blick</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-petrol-800">Wer ist verantwortlich?</h3>
                <p className="mt-1 text-petrol-600">
                  Der Websitebetreiber iistelle (Kontaktdaten im{" "}
                  <Link href="/impressum" className="text-coral-500 underline hover:text-coral-600">
                    Impressum
                  </Link>
                  ).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Wie erfassen wir Ihre Daten?</h3>
                <ul className="mt-1 space-y-1 text-petrol-600">
                  <li>• Daten, die Sie uns mitteilen (z. B. Kontaktformular, Anmeldung)</li>
                  <li>• Automatisch durch IT-Systeme (Browser, Betriebssystem, Uhrzeit des Zugriffs)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Wofür nutzen wir Ihre Daten?</h3>
                <ul className="mt-1 space-y-1 text-petrol-600">
                  <li>• Fehlerfreie Bereitstellung der Software</li>
                  <li>• Analyse des Nutzerverhaltens zur Produktverbesserung</li>
                  <li>• Kommunikation mit Ihnen</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Welche Rechte haben Sie?</h3>
                <p className="mt-1 text-petrol-600">
                  Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und
                  Einschränkung der Verarbeitung Ihrer gespeicherten Daten.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Hosting */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">2. Hosting – Externes Hosting</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Diese Website und die iistelle-Software werden bei{" "}
                <a href="https://vercel.com" target="_blank" className="text-coral-500 underline">
                  Vercel
                </a>{" "}
                (Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA) gehostet.
              </p>
              <p className="mt-3 text-petrol-700">
                Gespeicherte Daten umfassen: IP-Adressen, Kontaktanfragen, Meta- und
                Kommunikationsdaten, Vertragsdaten und Websitezugriffe.
              </p>
              <p className="mt-3 text-petrol-700">
                <strong>Rechtsgrundlagen:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
                und lit. f DSGVO (berechtigtes Interesse an der technischen Bereitstellung).
              </p>
            </div>
          </section>

          {/* 3. Allgemeine Hinweise */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-petrol-800">Verantwortliche Stelle</h3>
                <div className="mt-2 rounded-lg bg-petrol-50 p-4">
                  <p className="font-semibold text-petrol-900">iistelle / twenty5ai</p>
                  <p className="text-petrol-600">Sebastian Oczachowski</p>
                  <p className="text-petrol-600">Risistrasse 19</p>
                  <p className="text-petrol-600">5737 Menziken, Schweiz</p>
                  <p className="mt-2">
                    <a href="mailto:hello@twenty5ai.com" className="text-coral-500 underline">
                      hello@twenty5ai.com
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Speicherdauer</h3>
                <p className="mt-1 text-petrol-600">
                  Personenbezogene Daten werden nur so lange gespeichert, bis der Zweck der
                  Verarbeitung entfällt. Gesetzliche Aufbewahrungsfristen bleiben unberührt.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Widerruf Ihrer Einwilligung</h3>
                <p className="mt-1 text-petrol-600">
                  Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung
                  möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen.
                  Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt
                  davon unberührt.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Beschwerderecht</h3>
                <p className="mt-1 text-petrol-600">
                  Bei Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer
                  Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde in Deutschland ist der
                  Bundesdatenschutzbeauftragte.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Datenerfassung */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">4. Datenerfassung auf dieser Website</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-petrol-800">Kontaktformular</h3>
                <p className="mt-1 text-petrol-600">
                  Daten werden zwecks Bearbeitung der Anfrage gespeichert und nicht ohne Ihre
                  Einwilligung an Dritte weitergegeben.
                </p>
                <p className="mt-2 text-petrol-600">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Anfrage per E-Mail, Telefon oder Telefax</h3>
                <p className="mt-1 text-petrol-600">
                  Daten verbleiben bis zur Aufforderung zur Löschung, Widerruf der Einwilligung
                  oder Wegfall des Verarbeitungszwecks.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Soziale Netzwerke */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">5. Soziale Netzwerke und Drittanbieter-Integrationen</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-petrol-800">LinkedIn</h3>
                <p className="mt-1 text-petrol-600">
                  Wir betreiben eine Unternehmensseite auf LinkedIn (LinkedIn Ireland Unlimited
                  Company, Wilton Plaza, Wilton Place, Dublin 2, Irland).
                </p>
                <p className="mt-2 text-petrol-600">
                  LinkedIn verarbeitet Daten als gemeinsamer Verantwortlicher gemäß der
                  LinkedIn-Datenschutzrichtlinie.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Anthropic (Claude API)</h3>
                <p className="mt-1 text-petrol-600">
                  Für KI-gestützte Funktionen nutzen wir die Claude API von Anthropic PBC
                  (425 Mission Street, Suite 400, San Francisco, CA 94105, USA).
                </p>
                <p className="mt-2 text-petrol-600">
                  Keine personenbezogenen Daten von Website-Besuchern werden an Anthropic
                  übermittelt. Ausschließlich interne, redaktionelle Nutzung.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-petrol-800">Supabase</h3>
                <p className="mt-1 text-petrol-600">
                  Als Datenbank- und Authentifizierungsbackend nutzen wir Supabase Inc.
                  (Station, 340 Pine St, San Francisco, CA 94104, USA).
                </p>
                <p className="mt-2 text-petrol-600">
                  Kundendaten werden verschlüsselt gespeichert. Supabase verarbeitet Daten
                  als Auftragsverarbeiter gemäß unserer Datenschutzrichtlinie.
                </p>
              </div>
            </div>
          </section>

          {/* 6. SSL-Verschlüsselung */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
              <h2 className="text-lg font-bold text-petrol-900">6. SSL- bzw. TLS-Verschlüsselung</h2>
            </div>
            <div className="p-6">
              <p className="text-petrol-700">
                Diese Website nutzt aus Sicherheitsgründen eine SSL-bzw. TLS-Verschlüsselung.
                Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des
                Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in
                Ihrer Browserzeile.
              </p>
              <p className="mt-3 text-petrol-700">
                Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie
                an uns übermitteln, nicht von Dritten mitgelesen werden.
              </p>
            </div>
          </section>

          {/* Kontakt */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-petrol-800 to-petrol-900 shadow-xl">
            <div className="p-8 text-center">
              <Mail className="mx-auto h-12 w-12 text-coral-400" />
              <h3 className="mt-4 text-xl font-bold text-white">
                Fragen zum Datenschutz?
              </h3>
              <p className="mt-2 text-petrol-300">
                Kontaktieren Sie uns jederzeit für Auskünfte oder Anliegen.
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