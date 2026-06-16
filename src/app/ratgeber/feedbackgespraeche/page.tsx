import RatgeberBase from "../RatgeberBase";

export default function FeedbackgespraechePage() {
  return (
    <RatgeberBase
      title="Feedbackgespräche: So formulierst du konstruktives Feedback"
      excerpt="Der richtige Rahmen, die richtigen Worte: So führst du Feedbackgespräche, die wirklich etwas bewirken – ohne zu verletzen oder zu demotivieren."
      category="Führung"
      readTime="6 Min."
      date="20. Mai 2026"
      imageUrl="https://cdn.pixabay.com/photo/2015/01/08/18/30/entrepreneur-593371_1280.jpg"
      imageAlt="Zwei Personen im Gespräch"
    >
      <h2>Warum gutes Feedback so schwer ist</h2>
      <p>
        Die meisten Führungskräfte wissen, dass Feedback wichtig ist – und trotzdem
        scheuen viele das Gespräch. Entweder aus Angst, zu hart zu wirken, oder aus
        Unsicherheit, wie man es „richtig" macht. Dabei ist gutes Feedback
        eine der effektivsten Führungsinstrumente.
      </p>

      <h2>Die Sandwich-Methode? Bitte nicht!</h2>
      <p>
        Der klassische „Sandwich" (Lob – Kritik – Lob) funktioniert nicht:
      </p>
      <ul>
        <li>Mitarbeitende lernen, das erste und letzte Lob auszublenden</li>
        <li>Die Kritik wird nicht ernst genommen</li>
        <li>Es wirkt manipulative und wenig authentisch</li>
      </ul>

      <h2>Das SBI-Modell: Struktur für klares Feedback</h2>
      <p>
        SBI steht für <strong>Situation – Behavior – Impact</strong>:
      </p>

      <h3>Situation</h3>
      <p>
        Beschreibe den konkreten Moment:
      </p>
      <p className="bg-petrol-50 p-4 rounded-lg">
        „In der Teamsitzung gestern, als wir über das Projektbudget gesprochen haben..."
      </p>

      <h3>Behavior</h3>
      <p>
        Beschreibe das beobachtete Verhalten (neutral, nicht interpretiert):
      </p>
      <p className="bg-petrol-50 p-4 rounded-lg">
        „...hast du die Berechnungen des Teams in Frage gestellt und mehrmals gesagt, dass die Zahlen nicht stimmen können."
      </p>

      <h3>Impact</h3>
      <p>
        Beschreibe die Auswirkung auf dich oder andere:
      </p>
      <p className="bg-petrol-50 p-4 rounded-lg">
        „Das hat das Team verunsichert und ich hatte das Gefühl, dass die anschließende Diskussion nicht mehr so offen war."
      </p>

      <h2>Positives Feedback: Nicht weniger wichtig</h2>
      <p>
        Gutes Feedback ist nicht nur kritisch – positives Feedback ist genauso essentiell:
      </p>
      <ul>
        <li>Sei spezifisch: Nicht „gut gemacht", sondern „die Präsentation war klar strukturiert und die Zeit perfekt eingehalten"</li>
        <li>Sei zeitnah: Feedback unmittelbar nach dem Ereignis wirkt am besten</li>
        <li>Sei ehrlich: Authentisches Lob wird von Floskeln unterschieden</li>
      </ul>

      <h2>Der perfekte Feedback-Rahmen</h2>
      <ol>
        <li><strong>Vereinbare einen Termin:</strong> Überraschendes negatives Feedback ist unfair</li>
        <li><strong>Schaffe eine ruhige Atmosphäre:</strong> Blickkontakt, keine Ablenkungen</li>
        <li><strong>Beginne neutral:</strong> „Ich möchte mit dir über ein Thema sprechen"</li>
        <li><strong>Nutze SBI:</strong> Struktur hilft beiden Seiten</li>
        <li><strong>Höre zu:</strong> Nach deinem Feedback braucht es Raum für Reaktion</li>
        <li><strong>Schließe mit Klarheit:</strong> Was passiert als nächstes?</li>
      </ol>

      <h2>Feedback-Killer vermeiden</h2>
      <ul>
        <li><strong>„Du bist..."</strong> → Besser: „Ich habe beobachtet, dass..."</li>
        <li><strong>Verallgemeinerungen</strong> → Besser: Konkrete Situationen nennen</li>
        <li><strong>Charakterbewertungen</strong> → Besser: Verhaltensbezogenes Feedback</li>
        <li><strong>Passiv-aggressive Formulierungen</strong> → Besser: Direkt und respektvoll</li>
      </ul>

      <div className="not-prose my-8 rounded-xl bg-violet-50 p-6">
        <h4 className="font-bold text-petrol-900">💡 Profi-Tipp</h4>
        <p className="mt-2 text-sm text-petrol-700">
          Frage nach dem Feedback-Gespräch: „Was könntest du dir von mir als Führungskraft
          wünschen?" Diese eine Frage zeigt, dass du dich weiterentwickeln willst –
          und gibt dir wertvolle Einblicke.
        </p>
      </div>
    </RatgeberBase>
  );
}