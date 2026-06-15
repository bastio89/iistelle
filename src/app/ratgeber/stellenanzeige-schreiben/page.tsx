import RatgeberBase from "../RatgeberBase";

export default function StellenanzeigeSchreiben() {
  return (
    <RatgeberBase
      title="Die perfekte Stellenanzeige schreiben"
      excerpt="Erfahre, welche Elemente eine Stellenanzeige haben muss, um qualifizierte Kandidaten anzuziehen. Mit konkreten Beispielen und Vorlagen für die Schweiz und Deutschland."
      category="Recruiting"
      readTime="8 Min."
      date="15. Juni 2026"
    >
      <h2>Warum gute Stellenanzeigen entscheidend sind</h2>
      <p>
        Eine Stellenanzeige ist oft der erste Kontakt mit potenziellen Kandidaten.
        Sie entscheidet, ob sich jemand bewirbt – oder weiterklickt. In Zeiten des
        Fachkräftemangels ist eine durchdachte Stellenanzeige kein Luxus, sondern
        strategische Notwendigkeit.
      </p>

      <h2>Die perfekte Struktur einer Stellenanzeige</h2>

      <h3>1. Der packende Titel</h3>
      <p>
        Der Titel ist das Erste, was gelesen wird. Er sollte präzise und ansprechend sein:
      </p>
      <ul>
        <li><strong>✓ Gut:</strong> „Senior Backend-Entwickler (m/w/d) – Remote-Option · iistelle"</li>
        <li><strong>✗ Vermeiden:</strong> „Stelle zu vergeben – bitte lesen"</li>
      </ul>

      <h3>2. Das Unternehmensporträt</h3>
      <p>
        Kandidaten wollen wissen, wer du bist. Beschreibe in 2-3 Sätzen:
      </p>
      <ul>
        <li>Was macht euer Unternehmen?</li>
        <li>Wie groß ist das Team?</li>
        <li>Was macht euch besonders als Arbeitgeber?</li>
      </ul>

      <h3>3. Die Aufgaben (Was erwartet dich?)</h3>
      <p>
        Beschreibe konkrete Aufgaben, nicht nur Schlagworte. Qualifizierte Kandidaten
        scannen nach Details:
      </p>
      <ul>
        <li>Verantworte die Backend-Architektur für unsere HR-Plattform</li>
        <li>Führe ein Team von 4 Entwicklern</li>
        <li>Gestalte technische Entscheidungen maßgeblich mit</li>
      </ul>

      <h3>4. Das Anforderungsprofil (Was bringst du mit?)</h3>
      <p>
        Hier gilt: Weniger ist mehr. Listen keine 20 Anforderungen auf – das schreckt ab.
        Fokussiere auf die 5-7 wirklich relevanten Punkte:
      </p>
      <ul>
        <li>5+ Jahre Erfahrung mit Node.js oder Python</li>
        <li>Erfahrung mit Cloud-Infrastruktur (AWS/GCP)</li>
        <li>Fließend Deutsch, Englisch für Dokumentation</li>
      </ul>

      <h3>5. Das Angebot (Was bieten wir?)</h3>
      <p>
        Hier gewinnst du Kandidaten. Sei konkret und transparent:
      </p>
      <ul>
        <li>Gehalt: 90.000–110.000 CHF je nach Erfahrung</li>
        <li>40h Woche mit Gleitzeit</li>
        <li>Remote-Work möglich (bis zu 3 Tage/Woche)</li>
        <li>30 Tage Ferien, zusätzlich bis zu 5 Unfalltage</li>
        <li> Weiterbildungsbudget von 3.000 CHF/Jahr</li>
      </ul>

      <h2>Checkliste für die perfekte Stellenanzeige</h2>
      <ul>
        <li>☐ Titel ist präzise und enthält Schlüsselworte</li>
        <li>☐ Unternehmensbeschreibung ist ansprechend und authentisch</li>
        <li>☐ Aufgaben sind konkret und abwechslungsreich beschrieben</li>
        <li>☐ Anforderungen sind realistisch (max. 7 Must-haves)</li>
        <li>☐ Gehalt und Benefits sind transparent genannt</li>
        <li>☐ Bewerbungsprozess ist klar erklärt</li>
        <li>☐ Inklusive Ansprache formuliert</li>
        <li>☐ Aufruf zum Handeln ist deutlich</li>
      </ul>

      <h2>Vermeide diese häufigen Fehler</h2>
      <ul>
        <li><strong>Vage Formulierungen:</strong> „Teamplayer" und „motiviert" sagen nichts aus</li>
        <li><strong>Zu lange Listen:</strong> Mehr als 10 Anforderungen lesen nur noch Wenige</li>
        <li><strong>Kein Gehalt:</strong> Transparenz schafft Vertrauen</li>
        <li><strong>Diskriminierende Sprache:</strong> Vermeide Genderformulierungen, die ausgrenzen</li>
        <li><strong>Copy-Paste:</strong> Jede Stelle braucht eine individuelle Anzeige</li>
      </ul>

      <h2>Kostenlose Vorlage zum Download</h2>
      <p>
        Nutze unsere kostenlose Stellenbeschreibungs-Vorlage mit praktischen
        Beispielformulierungen für verschiedene Branchen und Positionen.
      </p>
      <p>
        <strong>Tipp:</strong> Teste deine Stellenanzeige mit dem A/B-Test-Tool in unserem
        Service-Bereich, um zu sehen, welche Version mehr Bewerbungen generiert.
      </p>

      <div className="not-prose my-8 rounded-xl bg-coral-50 p-6">
        <h4 className="font-bold text-petrol-900">💡 Extra-Tipp</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Füge einen kurzen Video-Clip oder ein GIF hinzu, das euer Team zeigt.
          Stellenanzeigen mit visuellem Content erhalten bis zu 34% mehr Bewerbungen.
        </p>
      </div>
    </RatgeberBase>
  );
}