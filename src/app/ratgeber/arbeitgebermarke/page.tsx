import RatgeberBase from "../RatgeberBase";

export default function ArbeitgebermarkePage() {
  return (
    <RatgeberBase
      title="Arbeitgebermarke aufbauen: So wirst du zum attraktiven Arbeitgeber"
      excerpt="Employer Branding ist mehr als ein Logo. Erfahre, wie du eine authentische Arbeitgebermarke schaffst, die qualifizierte Bewerber:innen anzieht und langfristig bindet."
      category="Recruiting"
      readTime="10 Min."
      date="18. Juni 2026"
      imageUrl="https://cdn.pixabay.com/photo/2014/05/02/21/50/office-336377_1280.jpg"
      imageAlt="Modernes Büro mit Mitarbeitern"
    >
      <h2>Was ist Employer Branding?</h2>
      <p>
        Employer Branding ist die strategische Gestaltung deines Unternehmens als
        Arbeitgebermarke. Es geht darum, ein authentisches Bild nach außen zu schaffen,
        das qualifizierte Talente anzieht und bestehende Mitarbeitende bindet.
      </p>
      <p>
        Gutes Employer Branding spart Recruiting-Kosten: Unternehmen mit starker
        Arbeitgebermarke erhalten bis zu 50% mehr Bewerbungen und haben eine
        50% geringere Fluktuation.
      </p>

      <h2>Die vier Säulen der Arbeitgebermarke</h2>

      <h3>1. Arbeitgeberversprechen (Employer Value Proposition)</h3>
      <p>
        Was bietest du konkret, das andere nicht bieten? Das EVP umfasst:
      </p>
      <ul>
        <li>Gehalt und Zusatzleistungen (z.B. BVG, Bonus, Aktien)</li>
        <li>Entwicklungsmöglichkeiten (Weiterbildung, Karrierepfade)</li>
        <li>Arbeitsumgebung (Büro, Remote, Hybrid)</li>
        <li>Unternehmenskultur (Werte, Team, Führungsstil)</li>
        <li>Sinn und Zweck (Mission, Impact, Nachhaltigkeit)</li>
      </ul>

      <h3>2. Arbeitgeberbotschaft (Tone of Voice)</h3>
      <p>
        Wie kommuniziert ihr nach außen? Authentizität ist entscheidend:
      </p>
      <ul>
        <li>Seid ehrlich über Stärken und Schwächen</li>
        <li>Vermeidet generische Formulierungen wie „Wir suchen Teamplayer"</li>
        <li>Zeigt echte Menschen, echte Geschichten, echte Stimmen</li>
        <li>Der Ton sollte zur Branche und Zielgruppe passen</li>
      </ul>

      <h3>3. Candidate Experience</h3>
      <p>
        Der gesamte Bewerbungsprozess prägt eure Marke:
      </p>
      <ul>
        <li>Schnelle und transparente Kommunikation</li>
        <li>Klare Zeitrahmen für Rückmeldungen</li>
        <li>Respektvoller Umgang, auch bei Absagen</li>
        <li>Professionelles Employer-Branding in Stellenanzeigen</li>
        <li>Positives Erlebnis, auch wenn es nicht zu einer Einstellung führt</li>
      </ul>

      <h3>4. Mitarbeiter-Engagement</h3>
      <p>
        Eure besten Botschafter sind die eigenen Mitarbeitenden:
      </p>
      <ul>
        <li>Ermutigt Mitarbeitende, euch als Arbeitgeber zu teilen</li>
        <li>Testimonials und Erfahrungsberichte veröffentlichen</li>
        <li>Social-Media-Präsenz mit echten Einblicken</li>
        <li>Glassdoor und Kununu aktiv pflegen</li>
      </ul>

      <h2>Employer Branding Kanäle</h2>
      <ul>
        <li><strong>Karriereseite:</strong> Herzstück jeder Employer-Branding-Strategie</li>
        <li><strong>Social Media:</strong> LinkedIn, Instagram, YouTube für Einblicke</li>
        <li><strong>Stellenbörsen:</strong> Gezielte Ansprache der richtigen Zielgruppen</li>
        <li><strong>Messen & Events:</strong> Direkter Kontakt mit potenziellen Kandidaten</li>
        <li><strong>Mitarbeiterempfehlungen:</strong> Höchste Conversion-Rate aller Kanäle</li>
      </ul>

      <h2>Quick Wins für den Start</h2>
      <ul>
        <li>Überarbeitet eure Stellenanzeigen mit konkreten Benefits</li>
        <li>Erstellt eine authentische „Über uns"-Seite für Bewerber:innen</li>
        <li>Sammelt Testimonials von aktuellen Mitarbeitenden</li>
        <li>Pflegt euer Glassdoor-Profil und reagiert auf Bewertungen</li>
        <li>Teilt Einblicke in den Arbeitsalltag auf LinkedIn</li>
      </ul>

      <div className="not-prose my-8 rounded-xl bg-sky-50 p-6">
        <h4 className="font-bold text-petrol-900">💡 Messbarkeit</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Trackt euren Employer-Branding-Erfolg mit: Bewerbungen pro Stelle,
          Time-to-Hire, Absprungsrate im Interview, Glassdoor-Rating, eNPS
          (Employee Net Promoter Score).
        </p>
      </div>
    </RatgeberBase>
  );
}
