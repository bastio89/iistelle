# iistelle

iistelle ist eine startup-grade SaaS-Plattform für Schweizer HR-Teams. Die Anwendung wird als langfristig wachsendes Produkt entwickelt – nicht als MVP, Demo, Prototyp oder Wegwerf-App.

Der Fokus liegt auf professionellen HR-Prozessen, Datenschutz, Compliance, Sicherheit, Auditierbarkeit, skalierbarer Architektur und einer glaubwürdigen Nutzererfahrung für echte Unternehmen.

## Funktionen

**Login & geschlossener Bereich:** Echte Authentifizierung über Supabase (E-Mail + Passwort), geschützte Routen via Middleware.

**Recruiting:** Stellenverwaltung mit Status, Multiposting-Kanälen, Bewerbungsfrist und Vakanz-Alter, Talent-Pool für vorgemerkte Kandidaten, Bewerber-Pipeline als Kanban-Board mit Drag & Drop (Eingang → Screening → Interview → Angebot → Eingestellt / Abgelehnt), Kandidatenprofile mit Tabs (Profil, Interviews, Bewertungen, Notizen), Interview-Planung mit Status-Verwaltung sowie Auswertungen (Funnel, Time-to-Hire, Conversion, Quellen). Eingestellte Bewerber lassen sich per Klick als Mitarbeiter übernehmen.

**Mitarbeiter:** Digitale Personalakte mit Stammdaten (inkl. Skills, Notfallkontakt, Austrittsdatum), Onboarding- und Offboarding-Checklisten, Dokumenten, Equipment, Abwesenheits-, Gehalts- und Performance-Tab, CSV-Import/-Export, Suche und Abteilungsfilter. Dazu firmenweite Inventar-Übersicht und zentrale Firmendokumente (Richtlinien, Vorlagen, Handbücher). Das Dashboard zeigt zusätzlich endende Probezeiten und die Headcount-Entwicklung.

**Abwesenheiten:** Anträge (Urlaub, Krankheit, Sonderurlaub, unbezahlt) mit Genehmigungs-Workflow, Arbeitstage-Berechnung inkl. bundesweiter Feiertage, Urlaubsübertrag aus dem Vorjahr, Team-Kalender, Urlaubskonten, Abwesenheits-Statistik (Krankheitsquote, Monatsverlauf) und „Heute abwesend“-Übersicht.

**Gehalt:** Aktuelle Vergütung pro Mitarbeiter, Gehaltshistorie mit Anpassungen, Gesamt- und Durchschnittswerte.

**Performance:** Zielvereinbarungen mit Fortschritt sowie Review-Zyklen mit Bewertung.

**Einstellungen:** Firmendaten (Name, Standard-Urlaubstage, Probezeit), Profil und Passwortänderung.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

App läuft dann auf http://localhost:3000. Die Supabase-Zugangsdaten liegen in `.env.local`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase (Auth + Postgres, Region Frankfurt) · Vercel

## Bezahlpläne (Stripe)

Die Abrechnung ist vollständig vorbereitet (Checkout, Kundenportal, Webhook, Plan-Limits). Zum Aktivieren in Vercel diese Umgebungsvariablen setzen:

```
STRIPE_SECRET_KEY=sk_live_…            # Stripe → Entwickler → API-Schlüssel
STRIPE_PRICE_PROFESSIONAL=price_…      # Preis-ID des Professional-Plans (Abo, monatlich)
STRIPE_WEBHOOK_SECRET=whsec_…          # Stripe → Webhooks → Endpoint-Secret
SUPABASE_SERVICE_ROLE_KEY=…            # Supabase → Project Settings → API (geheim halten!)
```

Im Stripe-Dashboard einen Webhook-Endpoint anlegen: `https://<deine-domain>/api/stripe/webhook` mit den Events `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

Solange die Keys fehlen, zeigt der Upgrade-Button eine Hinweismeldung — die App funktioniert normal weiter. Plan-Logik: Starter = max. 10 aktive Mitarbeiter, Professional/Enterprise = unbegrenzt.

## Hinweis zur Registrierung

Neue Konten benötigen eine E-Mail-Bestätigung (Supabase-Standard). Das lässt sich im Supabase-Dashboard unter Authentication → Providers → Email („Confirm email“) deaktivieren.
