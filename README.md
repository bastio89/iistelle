# iistelle HR

Modernes HR-Tool mit Fokus auf Recruiting – inspiriert vom Aufbau führender HR-Plattformen, mit eigenem Branding.

## Funktionen

**Login & geschlossener Bereich:** Echte Authentifizierung über Supabase (E-Mail + Passwort), geschützte Routen via Middleware.

**Recruiting:** Stellenverwaltung mit Status und Multiposting-Kanälen, Bewerber-Pipeline als Kanban-Board mit Drag & Drop (Eingang → Screening → Interview → Angebot → Eingestellt / Abgelehnt), Kandidatenprofile mit Tabs (Profil, Interviews, Bewertungen, Notizen), Interview-Planung mit Status-Verwaltung sowie Auswertungen (Funnel, Time-to-Hire, Conversion, Quellen).

**Demo-Zugang:** `demo@iistelle.de` / `iistelle2026`

## Lokale Entwicklung

```bash
npm install
npm run dev
```

App läuft dann auf http://localhost:3000. Die Supabase-Zugangsdaten liegen in `.env.local`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase (Auth + Postgres, Region Frankfurt) · Vercel

## Hinweis zur Registrierung

Neue Konten benötigen eine E-Mail-Bestätigung (Supabase-Standard). Das lässt sich im Supabase-Dashboard unter Authentication → Providers → Email („Confirm email“) deaktivieren.
