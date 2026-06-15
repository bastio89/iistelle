import RatgeberBase from "../RatgeberBase";

export default function GehaltsverhandlungPage() {
  return (
    <RatgeberBase
      title="Gehaltsverhandlung meistern: Tipps für faire und transparente Vergütung"
      excerpt="Wie du Gehaltsverhandlungen professionell führst – sowohl intern mit bestehenden Mitarbeitenden als auch mit Bewerber:innen. Mit Praxisbeispielen und Strategien."
      category="Mitarbeiter"
      readTime="8 Min."
      date="12. Juni 2026"
    >
      <h2>Warum Gehaltstransparenz wichtig ist</h2>
      <p>
        Transparente Gehaltsstrukturen werden immer wichtiger – sowohl rechtlich
        (Equal Pay) als auch kulturell. Mitarbeitende erwarten Offenheit, und
        Unternehmen mit transparenter Vergütung haben nachweislich höhere
        Mitarbeiterzufriedenheit und geringere Fluktuation.
      </p>

      <h2>Gehaltsverhandlung mit Bewerber:innen</h2>

      <h3>Vor dem Gespräch: Recherche und Vorbereitung</h3>
      <p>
        Als Arbeitgeber solltest du vorbereitet sein:
      </p>
      <ul>
        <li>Marktübliche Gehälter für die Position kennen (BFS, Glassdoor, Branchenreports)</li>
        <li>Gehaltsband für die Stelle definieren</li>
        <li>Budget für Verhandlungsspielraum einplanen</li>
        <li>Zusatzleistungen als Verhandlungsmasse kennen</li>
      </ul>

      <h3>Im Gespräch: Struktur und Fairness</h3>
      <p>
        So führst du professionelle Gehaltsgespräche:
      </p>
      <ol>
        <li>Erfrage die Gehaltsvorstellung offen und respektvoll</li>
        <li>Erkläre deine Gehaltsstruktur transparent</li>
        <li>Biete eine Bandbreite an, nicht eine feste Zahl</li>
        <li>Berücksichtige Erfahrung, Qualifikation und Markt</li>
        <li>Habe Zusatzleistungen als Alternative parat</li>
      </ol>

      <h2>Gehaltsgespräche mit bestehenden Mitarbeitenden</h2>

      <h3>Wann ist der richtige Zeitpunkt?</h3>
      <ul>
        <li>Jährliches Gehaltsgespräch als Standard</li>
        <li>Nach besonderen Leistungen oder Meilensteinen</li>
        <li>Bei Beförderungen oder Verantwortungswechsel</li>
        <li>Bei Ungleichgewichten in der Gehaltsstruktur</li>
        <li>Auf Anfrage – niemals abwimmeln!</li>
      </ul>

      <h3>Die richtige Vorbereitung</h3>
      <p>
        Für Mitarbeitende und Führungskräfte:
      </p>
      <ul>
        <li>Dokumentiere Leistungen und Erfolge des letzten Jahres</li>
        <li>Recherchiere Marktgehälter für deine Position/Stufe</li>
        <li>Bereite konkrete Argumente vor</li>
        <li>Überlege dir auch Zusatzleistungen als Alternative</li>
      </ul>

      <h2>Praxisbeispiele: Gehaltsargumente</h2>
      <p>
        Argumente, die bei Gehaltsverhandlungen wirken:
      </p>
      <ul>
        <li>„In den letzten 12 Monaten habe ich X erreicht, was zu Y Umsatz/Minderung von Z geführt hat"</li>
        <li>„Nach meiner Recherche liegen vergleichbare Positionen bei 85-95k, ich erwarte eine Anpassung in diesem Rahmen"</li>
        <li>„Ich übernehme ab sofort zusätzlich die Verantwortung für A und B"</li>
      </ul>

      <h2>Gehaltsnebenleistungen als Verhandlungsmasse</h2>
      <p>
        Nicht alles muss Gehalt sein:
      </p>
      <ul>
        <li>Zusätzliche Ferientage (statt 25 -> 27+)</li>
        <li>Weiterbildungsbudget</li>
        <li>Homeoffice-Regelung</li>
        <li>BVG-Beiträge des Arbeitgebers erhöhen</li>
        <li>Bonus-Regelung</li>
        <li>Company Car oder Mobilitätszuschuss</li>
        <li>Aktienoptionen oder Gewinnbeteiligung</li>
      </ul>

      <div className="not-prose my-8 rounded-xl bg-emerald-50 p-6">
        <h4 className="font-bold text-petrol-900">💡 Tipp für Führungskräfte</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Führe jährliche Gehaltsgespräche proaktiv – warte nicht, bis Mitarbeitende
          fragen. Das zeigt Wertschätzung und vermeidet Unzufriedenheit.
        </p>
      </div>
    </RatgeberBase>
  );
}