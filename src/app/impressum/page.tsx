import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Impressum – iistelle HR",
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-petrol-500 hover:text-petrol-800"
        >
          <ArrowLeft className="h-4 w-4" /> Zur Startseite
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-petrol-900">Impressum</h1>
        <p className="mt-1 text-sm text-petrol-400">
          Angaben gemäß schweizerischem Obligationenrecht (OR) und § 5 TMG
        </p>

        <div className="card mt-8 space-y-6 p-8 text-sm leading-relaxed text-petrol-700">
          <section>
            <h2 className="mb-2 font-bold text-petrol-900">Anbieter</h2>
            <p>
              twenty5ai
              <br />
              Sebastian Oczachowski
              <br />
              Risistrasse 19
              <br />
              5737 Menziken
              <br />
              Schweiz
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">Kontakt</h2>
            <p>
              Telefon: <a href="tel:+41762035747" className="font-semibold text-petrol-800 underline">+41 76 203 57 47</a>
              <br />
              E-Mail: <a href="mailto:hello@twenty5ai.com" className="font-semibold text-petrol-800 underline">hello@twenty5ai.com</a>
              <br />
              Website: <a href="https://www.twenty5ai.com" target="_blank" className="font-semibold text-petrol-800 underline">www.twenty5ai.com</a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">Inhaber</h2>
            <p>
              Sebastian Oczachowski (Einzelunternehmen, nicht im Handelsregister
              eingetragen)
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">Verantwortlich für den Inhalt</h2>
            <p>
              Verantwortlich gemäß Art. 18 Abs. 2 DSG (Schweiz) bzw. § 18 Abs. 2
              MStV (Deutschland):
              <br />
              Sebastian Oczachowski, Risistrasse 19, 5737 Menziken
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">Anwendbares Recht</h2>
            <p>
              Für Kunden mit Sitz in der Schweiz gilt das Schweizerische
              Obligationenrecht (OR); Gerichtsstand ist Menziken AG, Schweiz. Für
              Kunden in Deutschland oder Österreich gelten ergänzend TMG und
              MStV. Es gilt schweizerisches Recht unter Ausschluss des
              UN-Kaufrechts.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">EU-Streitschlichtung</h2>
            <p>
              Plattform der EU-Kommission zur Online-Streitbeilegung:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                className="font-semibold text-petrol-800 underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-petrol-900">Haftung und Urheberrecht</h2>
            <p>
              Für eigene Inhalte sind wir nach den allgemeinen Gesetzen
              verantwortlich. Für Inhalte externer Links sind ausschließlich
              deren Betreiber verantwortlich; bei Bekanntwerden von
              Rechtsverletzungen entfernen wir betroffene Inhalte oder Links
              umgehend. Inhalte dieser Seiten unterliegen dem anwendbaren
              Urheberrecht (URG/UrhG); jede Verwertung außerhalb der
              gesetzlichen Grenzen bedarf der schriftlichen Zustimmung.
            </p>
          </section>

          <p className="text-xs text-petrol-400">
            Stand: Juni 2026 · © {new Date().getFullYear()} twenty5ai. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  );
}
