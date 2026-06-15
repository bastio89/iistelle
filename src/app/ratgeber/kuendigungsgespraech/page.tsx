import RatgeberBase from "../RatgeberBase";

export default function KuendigungsgespraechPage() {
  return (
    <RatgeberBase
      title="Kündigungsgespräch führen: So trennst du dich fair und professionell"
      excerpt="Ein gutes Offboarding ist genauso wichtig wie ein gutes Onboarding. Wie du Kündigungen respektvoll gestaltest und die Tür für zukünftige Zusammenarbeiten offen lässt."
      category="Führung"
      readTime="7 Min."
      date="8. Juni 2026"
    >
      <h2>Warum gutes Offboarding wichtig ist</h2>
      <p>
        Eine Kündigung ist für beide Seiten unangenehm – aber sie muss nicht
        destruktiv enden. Ein professionelles Offboarding hat viele Vorteile:
      </p>
      <ul>
        <li><strong>Reputation:</strong> Kündigungen werden in sozialen Netzwerken geteilt</li>
        <li><strong>Verbleibende Mitarbeitende:</strong> Beobachten, wie mit ausscheidenden Kolleg:innen umgegangen wird</li>
        <li><strong>Wiedereinstellung:</strong> Gute Mitarbeitende können in Zukunft zurückkehren</li>
        <li><strong>Referenzen:</strong> Saubere Trennung ermöglicht gute Referenzen</li>
        <li><strong>Rechtliches:</strong> Reduziert das Risiko von Rechtsstreitigkeiten</li>
      </ul>

      <h2>Die Vorbereitung</h2>

      <h3>Rechtliches beachten</h3>
      <p>
        Vor dem Gespräch sicherstellen:
      </p>
      <ul>
        <li>Kündigungsfristen und Formvorschriften kennen</li>
        <li>Arbeitszeugnis vorbereitet haben</li>
        <li>Abfindung wenn rechtlich/üblich geprüft</li>
        <li>Freistellung und Resturlaub klären</li>
        <li>Bei größeren Kündigungen: Rechtsberatung einholen</li>
      </ul>

      <h3>Persönliche Vorbereitung</h3>
      <p>
        Emotionale Vorbereitung ist entscheidend:
      </p>
      <ul>
        <li>Bereite sachliche, konkrete Gründe vor</li>
        <li>Sei ehrlich, aber respektvoll</li>
        <li>Erwarte emotionale Reaktionen – diese sind normal</li>
        <li>Habe Gehör für die andere Seite</li>
        <li>Klare nächsten Schritte definieren</li>
      </ul>

      <h2>Der Gesprächsablauf</h2>

      <h3>1. Einleitung (2-3 Minuten)</h3>
      <p>
        Offen und direkt, aber respektvoll:
      </p>
      <p className="bg-petrol-50 p-4 rounded-lg">
        „Vielen Dank, dass du gekommen bist. Ich muss dir leider mitteilen, dass wir
        uns von dir trennen werden. Das ist keine leichte Nachricht für mich, und ich
        möchte diesen Prozess so fair wie möglich gestalten."
      </p>

      <h3>2. Begründung (3-5 Minuten)</h3>
      <p>
        Sachlich und konkret:
      </p>
      <ul>
        <li>Keine Schuldzuweisungen oder persönliche Angriffe</li>
        <li>Konkrete Beispiele nennen, wenn nötig</li>
        <li>Bei betriebsbedingten Kündigungen: wirtschaftliche Gründe erklären</li>
        <li>Bei verhaltensbedingten Kündigungen: konkrete Vorfälle benennen</li>
      </ul>

      <h3>3. Austausch ermöglichen (5-10 Minuten)</h3>
      <p>
        Raum für Fragen und Reaktion geben:
      </p>
      <ul>
        <li>„Was möchtest du noch wissen?"</li>
        <li>„Wie fühlst du dich damit?"</li>
        <li>Aktiv zuhören, nicht nur abspulen</li>
      </ul>

      <h3>4. Nächste Schritte (5 Minuten)</h3>
      <p>
        Klar und konkret:
      </p>
      <ul>
        <li>Kündigungsfrist und letzter Arbeitstag</li>
        <li>Resturlaub und Abgeltung</li>
        <li>Zeugnis und Arbeitsbestätigung</li>
        <li>Übergabeprozess</li>
        <li>Freistellung wenn zutreffend</li>
      </ul>

      <h2>Was du vermeiden solltest</h2>
      <ul>
        <li><strong>Drumherum-Reden:</strong> Komm direkt zur Sache</li>
        <li><strong>Schuldzuweisungen:</strong> „Du hast versagt" hilft niemandem</li>
        <li><strong>Vergleiche mit anderen:</strong> „Andere machen das besser"</li>
        <li><strong>Überraschungseffekt:</strong> Eine Ankündigung am Freitagnachmittag ist unfair</li>
        <li><strong>Rechtfertigungen:</strong> Zu viel Erklären wirkt unsicher</li>
        <li><strong>Leere Versprechen:</strong> Zusagen einhalten oder nicht machen</li>
      </ul>

      <h2>Das Exit-Gespräch</h2>
      <p>
        Nach der Kündigung: ein strukturiertes Exit-Interview kann wertvolle Insights liefern:
      </p>
      <ul>
        <li>Was hat zum Abschied geführt?</li>
        <li>Was hätte die Situation ändern können?</li>
        <li>Was können wir als Unternehmen verbessern?</li>
        <li>Würdest du uns weiterempfehlen?</li>
      </ul>

      <div className="not-prose my-8 rounded-xl bg-rose-50 p-6">
        <h4 className="font-bold text-petrol-900">⚠️ Wichtig</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Bei Massenkündigungen oder betriebsbedingten Kündigungen gelten besondere
          Regeln. Konsultiere rechtzeitig eine Rechtsberatung, um Fehler zu vermeiden.
        </p>
      </div>
    </RatgeberBase>
  );
}