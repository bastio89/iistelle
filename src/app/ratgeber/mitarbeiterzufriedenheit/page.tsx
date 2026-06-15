import RatgeberBase from "../RatgeberBase";

export default function MitarbeiterzufriedenheitPage() {
  return (
    <RatgeberBase
      title="Mitarbeiterzufriedenheit messen und nachhaltig verbessern"
      excerpt="Mit diesen Strategien erhöhst du die Zufriedenheit in deinem Team, reduzierst die Fluktuation und schaffst eine positive Unternehmenskultur."
      category="Kultur"
      readTime="7 Min."
      date="1. Juni 2026"
    >
      <h2>Warum Mitarbeiterzufriedenheit entscheidend ist</h2>
      <p>
        Zufriedene Mitarbeitende sind produktiver, kreativer und bleiben länger im Unternehmen.
        Die Zahlen sprechen für sich: Unternehmen mit hoher Mitarbeiterzufriedenheit
        haben eine bis zu 21% höhere Produktivität und eine um 41% niedrigere Fluktuation.
      </p>

      <h2>Die fünf Säulen der Mitarbeiterzufriedenheit</h2>

      <h3>1. Sinn und Zweck</h3>
      <p>
        Mitarbeitende wollen wissen, dass ihre Arbeit bedeutsam ist:
      </p>
      <ul>
        <li>Verbinde tägliche Aufgaben mit der übergeordneten Vision</li>
        <li>Erzähle Erfolgsgeschichten von Kund:innen und Impact</li>
        <li>Feiere Meilensteine und Erfolge des Teams öffentlich</li>
      </ul>

      <h3>2. Wertschätzung und Anerkennung</h3>
      <p>
        Anerkennung ist einer der wichtigsten Faktoren für Zufriedenheit:
      </p>
      <ul>
        <li>Sage regelmäßig „Danke" – nicht nur einmal im Jahr</li>
        <li>Erkenne gute Leistungen sofort und spezifisch an</li>
        <li>Biete konstruktives Feedback, das entwickelt statt kritisiert</li>
        <li>Praxis: Wöchentliche Kudos-Sessions im Team</li>
      </ul>

      <h3>3. Work-Life-Balance</h3>
      <p>
        Moderne Mitarbeitende erwarten Flexibilität:
      </p>
      <ul>
        <li>Flexible Arbeitszeiten und Remote-Optionen</li>
        <li>Vertrauensarbeitszeit statt Stechuhr</li>
        <li>Mindestens 25 Tage Ferien (Schweiz/DACH-Standard)</li>
        <li>Sabbatical-Optionen für längere Auszeiten</li>
      </ul>

      <h3>4. Entwicklungsmöglichkeiten</h3>
      <p>
        Stagnation ist ein Zufriedenheitskiller:
      </p>
      <ul>
        <li>Jährliches Entwicklungsgespräch mit konkreten Zielen</li>
        <li>Weiterbildungsbudget für jeden Mitarbeitenden</li>
        <li>Interne Karrieremöglichkeiten kommunizieren</li>
        <li>Mentoring-Programme anbieten</li>
      </ul>

      <h3>5. Unternehmenskultur</h3>
      <p>
        Die Art, wie wir zusammenarbeiten, prägt die Zufriedenheit:
      </p>
      <ul>
        <li>Flache Hierarchien und offene Kommunikation</li>
        <li>Psychologische Sicherheit für Ideen und Fehler</li>
        <li>Teambuilding, das wirklich verbindet</li>
        <li>Transparente Entscheidungsprozesse</li>
      </ul>

      <h2>Zufriedenheit messen: Die richtigen KPIs</h2>
      <p>
        Was du tracken solltest:
      </p>
      <ul>
        <li><strong>eNPS (Employee Net Promoter Score):</strong> „Wie wahrscheinlich würdest du iistelle als Arbeitgeber weiterempfehlen?"</li>
        <li><strong>Fluktuation:</strong> Quote der Mitarbeitenden, die das Unternehmen verlassen</li>
        <li><strong>Krankenquote:</strong> Hohe Werte können auf Unzufriedenheit hindeuten</li>
        <li><strong>Initiativquote:</strong> Wie viele Mitarbeitende bringen eigene Ideen ein?</li>
      </ul>

      <h2>Der Employee Experience Zyklus</h2>
      <p>
        Verbessere jeden Touchpoint der Mitarbeiterreise:
      </p>
      <ol>
        <li><strong>Recruiting:</strong> Positiver Bewerbungsprozess, transparente Kommunikation</li>
        <li><strong>Onboarding:</strong> Strukturierte Einarbeitung, schnelle Integration ins Team</li>
        <li><strong>Tägliches Erleben:</strong> Arbeitsumgebung, Tools, Zusammenarbeit</li>
        <li><strong>Entwicklung:</strong> Feedback, Coaching, Karrierechancen</li>
        <li><strong>Retention:</strong> Regelmäßige Pulse Surveys, Anpassung der Bedürfnisse</li>
      </ol>

      <div className="not-prose my-8 rounded-xl bg-rose-50 p-6">
        <h4 className="font-bold text-petrol-900">💡 Quick Wins</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Die größten Zufriedenheitssteigerungen kommen oft aus kleinen Veränderungen:
          bessere Beleuchtung, ein Pflanzen im Büro, regelmäßige Team-Lunches oder
          flexible Mittagspausen kosten wenig und wirken sofort.
        </p>
      </div>
    </RatgeberBase>
  );
}