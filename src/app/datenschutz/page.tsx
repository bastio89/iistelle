import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Datenschutz – iistelle HR",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-petrol-500 hover:text-petrol-800"
        >
          <ArrowLeft className="h-4 w-4" /> Zur Startseite
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-petrol-900">Datenschutzerklärung</h1>
        <p className="mt-1 text-sm text-petrol-400">
          Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO und
          schweizerischem DSG
        </p>

        <div className="card mt-8 space-y-6 p-8 text-sm leading-relaxed text-petrol-700">
          <section>
            <h2 className="mb-2 font-bold text-petrol-900">1. Verantwortlicher</h2>
            <p>
              twenty5ai, Sebastian Oczachowski, Risistrasse 19, 5737 Menziken,
              Schweiz · E-Mail:{" "}
              <a href="mailto:hello@twenty5ai.com" className="font-semibold text-petrol-800 underline">
                hello@twenty5ai.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">2. Welche Daten wir verarbeiten</h2>
            <p>
              Beim Besuch dieser Website werden technisch notwendige Daten
              (z.&nbsp;B. IP-Adresse, Datum und Uhrzeit des Zugriffs)
              verarbeitet. Bei der Registrierung verarbeiten wir Name,
              E-Mail-Adresse und Firmenname. Innerhalb der Anwendung verarbeiten
              wir die von dir bzw. deinem Unternehmen eingegebenen HR-Daten
              (z.&nbsp;B. Stellen, Bewerbungen, Mitarbeiterdaten, Dokumente).
              Bewerber:innen, die sich über eine Karriereseite bewerben,
              übermitteln Kontaktdaten, ein Kurzprofil und optional einen
              Lebenslauf.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">3. Zwecke und Rechtsgrundlagen</h2>
            <p>
              Die Verarbeitung erfolgt zur Bereitstellung der Plattform und
              ihrer Funktionen (Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung),
              zur Wahrung berechtigter Interessen wie Sicherheit und
              Stabilität (Art. 6 Abs. 1 lit. f DSGVO) sowie im
              Bewerbungskontext zur Durchführung vorvertraglicher Maßnahmen
              (Art. 6 Abs. 1 lit. b DSGVO, § 26 BDSG analog).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">4. Hosting und Auftragsverarbeitung</h2>
            <p>
              Die Anwendung wird bei Vercel Inc. gehostet; Datenbank und
              Dateispeicher werden über Supabase betrieben, wobei die Daten in
              Frankfurt am Main (Deutschland, AWS eu-central-1) gespeichert
              werden. Mit den eingesetzten Dienstleistern bestehen
              Vereinbarungen zur Auftragsverarbeitung nach Art. 28 DSGVO.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">5. Datentrennung zwischen Unternehmen</h2>
            <p>
              Daten verschiedener Unternehmen werden technisch strikt getrennt
              verarbeitet (mandantenbezogene Zugriffskontrolle auf
              Datenbankebene). Ein Zugriff auf Daten anderer Unternehmen ist
              ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">6. Speicherdauer</h2>
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie es für die
              genannten Zwecke erforderlich ist oder gesetzliche
              Aufbewahrungspflichten bestehen. Unternehmen können Bewerber- und
              Mitarbeiterdaten jederzeit selbst löschen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">7. Deine Rechte</h2>
            <p>
              Du hast das Recht auf Auskunft, Berichtigung, Löschung,
              Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
              Widerspruch gegen die Verarbeitung deiner personenbezogenen
              Daten. Außerdem besteht ein Beschwerderecht bei einer
              Datenschutzaufsichtsbehörde. Wende dich dazu jederzeit an die
              oben genannte Kontaktadresse.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">8. Cookies</h2>
            <p>
              Die Anwendung verwendet ausschließlich technisch notwendige
              Cookies zur Anmeldung und Sitzungsverwaltung. Es findet kein
              Tracking zu Werbezwecken statt.
            </p>
          </section>

          <p className="text-xs text-petrol-400">
            Stand: Juni 2026 · twenty5ai, Menziken
          </p>
        </div>
      </div>
    </div>
  );
}
