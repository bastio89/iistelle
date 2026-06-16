import RatgeberBase from "../RatgeberBase";

export default function DSGVORecruitingPage() {
  return (
    <RatgeberBase
      title="DSGVO im Recruiting: Was du wissen musst"
      excerpt="Bewerberdaten richtig handhaben: Von der rechtmäßigen Einwilligung bis zur sicheren Aufbewahrung. Alle Anforderungen für datenschutzkonformes Recruiting erklärt."
      category="Recht"
      readTime="10 Min."
      date="5. Juni 2026"
      imageUrl="https://cdn.pixabay.com/photo/2016/03/26/22/21/magnifying-glass-1280858_1280.jpg"
      imageAlt="Sicherheit und Datenschutz"
    >
      <h2>Warum DSGVO im Recruiting relevant ist</h2>
      <p>
        Jede Stellenanzeige, jeder Lebenslauf und jedes Vorstellungsgespräch
        erzeugt personenbezogene Daten. Diese unterliegen strengen Datenschutzregeln.
        Verstöße können mit bis zu 20 Millionen Euro oder 4% des weltweiten Jahresumsatzes
        geahndet werden – je nachdem, welcher Betrag höher ist.
      </p>

      <h2>Die wichtigsten Grundsätze</h2>

      <h3>1. Datenminimierung</h3>
      <p>
        Frage nur nach Informationen, die für die Stelle wirklich relevant sind:
      </p>
      <ul>
        <li><strong>Erlaubt:</strong> Lebenslauf, Zeugnisse, Qualifikationsnachweise</li>
        <li><strong>Problematisch:</strong> Geburtsdatum, Familienstand, Foto (sofern nicht nötig)</li>
        <li><strong>Verboten:</strong> Gesundheitsdaten, ethnische Herkunft, politische Meinung</li>
      </ul>

      <h3>2. Zweckbindung</h3>
      <p>
        Bewerberdaten dürfen nur für den Zweck verwendet werden, für den sie erhoben wurden:
      </p>
      <ul>
        <li>Daten nur für die Stellenbesetzung verwenden</li>
        <li>Nicht für andere Stellenausschreibungen ohne erneute Einwilligung</li>
        <li>Nicht an Dritte weitergeben, die nicht am Recruiting-Prozess beteiligt sind</li>
      </ul>

      <h3>3. Speicherbegrenzung</h3>
      <p>
        Bewerberdaten dürfen nicht unbegrenzt aufbewahrt werden:
      </p>
      <ul>
        <li>Bei Absage: Daten innerhalb von 6 Monaten löschen</li>
        <li>Ausnahme: Wenn du eine Einwilligung für längere Speicherung hast</li>
        <li>Dokumentiere, warum du Daten länger behältst</li>
      </ul>

      <h2>Der rechtssichere Bewerbungsprozess</h2>

      <h3>Informationen zum Datenschutz bereitstellen</h3>
      <p>
        Informiere Bewerber:innen immer über:
      </p>
      <ul>
        <li>Welche Daten erhoben werden</li>
        <li>Wie lange sie gespeichert werden</li>
        <li>Wer Zugriff auf die Daten hat</li>
        <li>Welche Rechte die Bewerber:innen haben</li>
      </ul>

      <h3>Einwilligung einholen</h3>
      <p>
        Für die Datenverarbeitung brauchst du eine Rechtsgrundlage:
      </p>
      <ul>
        <li><strong>Für die Bewerbung:</strong> Die Datenverarbeitung ist für die Entscheidung über die Beschäftigung erforderlich (Art. 88 DSGVO)</li>
        <li><strong>Für längere Aufbewahrung:</strong> Explizite Einwilligung einholen</li>
        <li><strong>Für Karrierenetzwerk:</strong> Separate Einwilligung für zukünftige Stellen</li>
      </ul>

      <h2>Checkliste für DSGVO-konformes Recruiting</h2>
      <ul>
        <li>☐ Datenschutzerklärung auf der Karriereseite vorhanden</li>
        <li>☐ Bewerber:innen werden über Datenverarbeitung informiert</li>
        <li>☐ Einwilligung für Karrierenetzwerk eingeholt</li>
        <li>☐ Löschfristen sind automatisiert oder dokumentiert</li>
        <li>☐ Zugriffsrechte sind klar geregelt</li>
        <li>☐ Datenschutzbeauftragte:r ist informiert</li>
        <li>☐ Auftragsverarbeitungsverträge mit Recruiting-Tools vorhanden</li>
        <li>☐ Datenschutzvorfall-Prozess ist definiert</li>
      </ul>

      <h2>Häufige Fehler und wie du sie vermeidest</h2>
      <ul>
        <li><strong>Unverschlüsselte E-Mails:</strong> Bewerbungen per unverschlüsselter E-Mail sind problematisch</li>
        <li><strong>Kein Löschkonzept:</strong> Automatisiere die Löschung nach der Frist</li>
        <li><strong>Zu viel abgefragt:</strong> Erhebe nur notwendige Daten</li>
        <li><strong>Fehlende Einwilligungen:</strong> Prüfe alle Formulare</li>
      </ul>

      <div className="not-prose my-8 rounded-xl bg-amber-50 p-6">
        <h4 className="font-bold text-petrol-900">⚠️ Wichtig</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Diese Informationen sind allgemeiner Natur und keine Rechtsberatung.
          Konsultiere bei spezifischen Fragen immer eine:n Datenschutzbeauftragte:n
          oder eine:n Anwält:in.
        </p>
      </div>
    </RatgeberBase>
  );
}