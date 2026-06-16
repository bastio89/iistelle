import RatgeberBase from "../RatgeberBase";

export default function OnboardingPage() {
  return (
    <RatgeberBase
      title="Onboarding: Die ersten 90 Tage meistern"
      excerpt="Ein strukturierter Onboarding-Prozess reduziert die Einarbeitungszeit um bis zu 40% und steigert die Mitarbeiterbindung nachhaltig. Hier ist der komplette Leitfaden."
      category="Mitarbeiter"
      readTime="12 Min."
      date="10. Juni 2026"
      imageUrl="https://cdn.pixabay.com/photo/2017/07/31/11/34/people-2555032_1280.jpg"
      imageAlt="Team bei Besprechung im Büro"
    >
      <h2>Warum Onboarding so wichtig ist</h2>
      <p>
        Der erste Eindruck zählt – besonders bei neuen Mitarbeitenden. Studien zeigen:
        20% der Fluktuation passiert innerhalb der ersten 45 Tage. Ein gutes Onboarding
        kann dies drastisch reduzieren und spart Recruiting-Kosten von durchschnittlich
        3-5 Monatsgehältern pro Neuanstellung.
      </p>

      <h2>Die drei Phasen des Onboardings</h2>

      <h3>Phase 1: Vor dem ersten Tag (Vorbereitung)</h3>
      <p>
        Die Vorbereitung beginnt lange vor dem Starttermin. Was du vorher erledigen solltest:
      </p>
      <ul>
        <li>Arbeitsplatz einrichten und Technik bereitstellen</li>
        <li>Zugänge zu allen notwendigen Systemen vorbereiten</li>
        <li>Einführungsmappe mit den wichtigsten Informationen zusammenstellen</li>
        <li>Patin/Paten für die erste Zeit benennen</li>
        <li>Team über den Neuzugang informieren und Willkommen-Heißen vorbereiten</li>
      </ul>

      <h3>Phase 2: Die erste Woche</h3>
      <p>
        Die ersten fünf Tage sind entscheidend für das Ankommen. Strukturierte Einführung:
      </p>
      <ul>
        <li><strong>Tag 1:</strong> Begrüßung, Büro-Rundgang, Technik-Setup, Erstgespräch mit Teamleiter</li>
        <li><strong>Tag 2:</strong> Kennenlernen der wichtigsten Stakeholder, Einführung in Kernprozesse</li>
        <li><strong>Tag 3:</strong> Erste kleine Aufgaben, Buddy-System aktiv</li>
        <li><strong>Tag 4:</strong> Vertiefung der Systeme, erste Projekte zuweisen</li>
        <li><strong>Tag 5:</strong> Erstes Feedback-Gespräch, Fragen klären, Wochenplanung</li>
      </ul>

      <h3>Phase 3: Die ersten 90 Tage</h3>
      <p>
        Nach der Einführung beginnt die eigentliche Integration. Meilensteine setzen:
      </p>
      <ul>
        <li><strong>30 Tage:</strong> Erste Projekte selbstständig übernehmen, Stand-up-Rhythmus finden</li>
        <li><strong>60 Tage:</strong> Erste eigenständige Entscheidungen, Feedback-Gespräch mit Vorgesetztem</li>
        <li><strong>90 Tage:</strong> Probezeit-Gespräch, Ziele für das erste Jahr definieren</li>
      </ul>

      <h2>Die perfekte Onboarding-Checkliste</h2>
      <ul>
        <li>☐ Willkommens-E-Mail vor dem Start versendet</li>
        <li>☐ Arbeitsplatz vollständig vorbereitet</li>
        <li>☐ Alle Zugänge funktionieren (E-Mail, Slack, Systeme)</li>
        <li>☐ Patin/Paten wurde informiert und steht bereit</li>
        <li>☐ Einführungsplan für die erste Woche erstellt</li>
        <li>☐ Team wurde über Neuzugang informiert</li>
        <li>☐ Mentor für die ersten 3 Monate bestimmt</li>
        <li>☐ 30-60-90-Tage-Ziele definiert</li>
        <li>☐ Regelmäßige Check-ins eingeplant</li>
      </ul>

      <h2>Typische Onboarding-Fehler vermeiden</h2>
      <ul>
        <li><strong>Zu viel auf einmal:</strong> Überfordere neue Mitarbeitende nicht mit allen Informationen auf einmal</li>
        <li><strong>Keine klare Ansprechperson:</strong> Wer ist der erste Kontakt bei Fragen?</li>
        <li><strong>Isolation:</strong> Stelle sicher, dass neue Kolleg:innen integriert werden</li>
        <li><strong>Kein Feedback:</strong> Regelmäßige Check-ins sind essentiell</li>
        <li><strong>Unrealistische Erwartungen:</strong> Klare Kommunikation über den Einarbeitungsplan</li>
      </ul>

      <h2>Remote-Onboarding: Besonderheiten</h2>
      <p>
        Bei Remote-Mitarbeitenden braucht es besondere Maßnahmen:
      </p>
      <ul>
        <li>Video-Call für persönliches Kennenlernen (nicht nur Chat)</li>
        <li>Digitale Einführung in alle Tools mit Screensharing</li>
        <li>Feste virtuelle Kaffeepausen zum Team-Kennenlernen</li>
        <li>Onboarding-Paket physisch per Post zuschicken</li>
        <li>Regelmäßige 1:1s in den ersten Wochen</li>
      </ul>

      <div className="not-prose my-8 rounded-xl bg-emerald-50 p-6">
        <h4 className="font-bold text-petrol-900">💡 Extra-Tipp</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Nutze eine Onboarding-Software, um den gesamten Prozess zu automatisieren
          und keine Schritte zu vergessen. iistelle bietet hierfür integrierte Templates.
        </p>
      </div>
    </RatgeberBase>
  );
}