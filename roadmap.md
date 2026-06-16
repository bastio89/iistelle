# iistelle — Roadmap zum Marktführer DACH

> Stand: Juni 2026 (aktualisiert)
> Ziel: Bestes HR-Tool für Schweizer und deutsche Unternehmen

---

## 0. Neu implementiert (Juni 2026)

### ✅ Geo-IP-basierte Preisgestaltung
- Automatische Währungserkennung basierend auf Accept-Language Header
- Schweizer User sehen CHF-Preise
- Deutsche User sehen EUR-Preise
- Implementiert in `/preise` Seite

### ✅ Landingpage mit Services & Ratgeber
- Komplette `/services` Seite mit Ratgebern und kostenlosen Tools
- Komplette `/ratgeber` Übersichtsseite
- Professionelles Design inspiriert von führenden SaaS-Landingpages

### ✅ Logo & Branding
- SVG-Favicon für iistelle
- Logo-Variante für Marketing-Materialien
- Konsistentes Branding über alle Seiten

### ✅ Erweiterte Zeiterfassung (Phase 1)
- Gleitzeit-Regelung pro Mitarbeiter
- Überstundenerfassung mit Genehmigungs-Workflow
- Pausentracker pro Eintrag
- Bearbeiten/Löschen von Einträgen
- CSV-Export

### ✅ Erweitertes Audit-Log
- Vollständige DSGVO-Compliance
- Kategorien: auth, employee, candidate, salary, document, etc.
- Change-Tracking mit alten/neuen Werten
- IP-Adressen und User-Agent Tracking

### ✅ CH-Feiertage nach Kanton
- Alle 26 Kantone mit spezifischen Feiertagen
- Bundesweite Feiertage + kantonale Feiertage
- Arbeitstage-Berechnung pro Kanton
- Brückentage-Erkennung
- Integration in Abwesenheits-Management

### ✅ Mitarbeiter-Portal (Magic-Link Flow)
- Eigenständiger Portal-Bereich für Mitarbeiter (`/portal`, `/portal-login`)
- Magic-Link-basierte Einladung (kein Passwort-Setup nötig)
- Onboarding-Tour für neue Mitarbeiter
- Schneller Zugang zu Zeiterfassung, Urlaub, Zielen, Dokumenten
- Admin kann Portal-Einladungen versenden
- Self-Service Portal für Mitarbeiter (DSGVO-konform)
- Separate Auth-Session für Portal vs. Admin

### ✅ Portal-Features implementiert
- **Portal-Profil-Seite**: Mitarbeiterdaten einsehen, Urlaub beantragen, Abwesenheits-Status verfolgen
- **Portal-Zeiterfassung**: Ein-/Ausstempeln, Live-Timer, Wochenübersicht mit Chart
- **Team-Kalender**: Monatskalender mit allen Abwesenheiten, Legende, anstehende Abwesenheiten
- **Portal-Landingpage**: Übersicht aller Portal-Features für neue Mitarbeiter
- **Portal-Login Button**: Separater Button auf Landingpage und PublicNav
- **Ziele-Seite**: Persönliche Ziele einsehen und Fortschritt tracken
- **Dokumente-Seite**: Persönliche HR-Dokumente abrufen und herunterladen

### ✅ Portal-Login Button auf Landingpage
- Separate Anmelde-Buttons für Admin-Login und Portal-Login
- Landingpage: "Portal-Login" Button prominent platziert
- PublicNav: "Portal-Login" Button integriert
- Klare Differenzierung zwischen Arbeitgeber- und Mitarbeiter-Zugang

### ✅ Hilfe-Center & FAQ
- Komplettes Hilfecenter unter `/hilfecenter`
- Kategorisierte FAQs
- Suchfunktion
- Anleitungen für alle Portal-Features

---

## 1. Wettbewerbsanalyse

### 1.1 Hauptkonkurrenten im Schweizer HR-Markt

| Anbieter | Stärken | Schwächen | Preisregion (CH) |
|----------|---------|-----------|------------------|
| **Happeo** | All-in-One, starkes Social Intranet, Google Workspace-Integration | Komplex, teuer, kein natives ATS | ab CHF 8/Monat/Nutzer |
| **Personio** | Marktführer DACH, stark im DACH-Raum, gute Compliance | Kein natives CH-Feature-Set, Support-Responsezeiten, teuer für KMU | ab CHF 8/Nutzer/Monat |
| **Kenjo** | Modernes UI, europäischer Fokus, Payroll-Integration | Weniger tiefe HR-Features, kleinere Community | ab CHF 7/Nutzer/Monat |
| **Factorial** | Stark in Spanien/Italien, günstig, gute Features | Schwache DACH-Präsenz, Support nicht auf CH-Niveau | ab CHF 5/Nutzer/Monat |
| **Swiss报酬 (lokale Anbieter)** | CH-spezifisch, Lohnabrechnung CH, Behördengänge | Veraltete UI, wenig Innovation | individuell |
| **Workday / SAP SuccessFactors** | Enterprise-Grade, global | Overkill für KMU, teuer, komplex | ab CHF 20/Nutzer/Monat |
| **Bexio** | Buchhaltung + HR, günstig | Oberflächliches HR, kein Recruiting | ab CHF 19/Monat |
| **KLARA** | Kleinunternehmen, einfach | Sehr basic HR, kein Recruiting | ab CHF 19/Monat |

### 1.2 Wettbewerbsvorteile von iistelle (bereits vorhanden)

✅ **Recruiting-Pipeline** — Kanban-View mit 6 Stufen, besser als viele Konkurrenten  
✅ **Onboarding/Offboarding-Tasks** — Strukturiert und trackbar  
✅ **Karriereseite** — Self-Service für Bewerber, integriert  
✅ **CH-spezifische Features** — Schweizer Feiertage, CH-Workflows  
✅ **Moderne UI** — Besser als Personio, Happeo, Factorial  
✅ **DSGVO-Center** — Datenschutz-Compliance integriert  
✅ **Slack-Integration** — Benachrichtigungen  
✅ **Plan-System** — Starter/Professional/Enterprise  
✅ **Organigramm** — Visuell  
✅ **Zeiterfassung** — Basis vorhanden  
✅ **Performance & Goals** — Review-Cycles  
✅ **Mitarbeiter-Portal** — Magic-Link Self-Service für Mitarbeiter  
✅ **Hilfe-Center** — Integrierte Dokumentation und FAQs  

### 1.3 Marktlücken & Differenzierungs-Chancen

| Chance | Beschreibung | Warum wichtig |
|--------|--------------|---------------|
| **Natives CH-Payroll** | Lohnabrechnung nach CH-Standard (AHV/IV/EO, BVG, Quellensteuer) | Payroll ist der grösste Pain Point im Schweizer HR |
| **Behörden-Integration** | SVA-/AHV-Meldungen, Quellensteuer-Abwicklung | Entlastet HR massiv |
| **KI-gestützte Features** | Lebenslauf-Analyse, Matching, Chatbot für Mitarbeiter | Differenzierung gegenüber Personio |
| **Besserer Self-Service für Mitarbeiter** | Mitarbeiter-Portal mit Eigenverwaltung | Erhöht Akzeptanz, reduziert HR-Aufwand |
| **PWA / Mobile-optimiert** | Progressive Web App für mobile Geräte | Schwachstelle bei fast allen Konkurrenten |
| **Multi-Company / Konzern** | Holding-Strukturen, Subsidiaries | Enterprise-Gateway |
| **API & Integrationen** | Drittanbieter-Anbindungen, Webhooks, SSO | Enterprise-Anforderung |
| **Lohntransparenz-Tool** | Gehaltsbenchmarking CH, Lohngleichheit-Reports | Gesetzliche Anforderung |
| **Digitale Unterschrift** | DocuSign / Skribble Integration | Fehlendes Feature bei allen |
| **Mitarbeiter-Benefits Portal** | Fringe Benefits, Versicherungen, Bonus-Programme | Differenzierung, Mehrwert |
| **Learning Management (LMS)** | Schulungen, Zertifizierungen, E-Learning | Komplettes HR-Ökosystem |
| **Engagement-/Pulse-Surveys** | Anonymous Feedback, Stimmungsbild | Mitarbeiterzufriedenheit |
| **Advanced Analytics / People Analytics** | Predictive Hiring, Fluktuationsrisiko, Workforce Planning | Data-Driven HR |
| **Social Intranet Features** | Activity Feed, Team-Messaging, Kudos | Community-Gefühl, Engagement |
| **On-Demand Payroll Reports** | Lohnausweise digital, Quellensteuer-Reports, BVG-Abrechnungen | Compliance-Vorteil |
| **Mitarbeiter-Urlaubsplaner** | Visuelle Urlaubsplanung mit Team-Kalender | Bessere Planung |

---

## 2. Feature-Roadmap nach Phasen

### Phase 0: Portal-Optimierung (Q2 2026) — *Abgeschlossen*
> **Ziel:** Mitarbeiter-Self-Service ohne Passwort-Hürde.

| # | Feature | Beschreibung | Status |
|---|---------|--------------|--------|
| 0.1 | **Magic-Link Portal-Einladung** | Admin kann mit einem Klick Einladungs-Link per E-Mail senden | ✅ |
| 0.2 | **Onboarding-Tour** | Schritt-für-Schritt-Einführung für neue Portal-Nutzer | ✅ |
| 0.3 | **Portal-Dashboard** | Schneller Zugriff auf Zeiterfassung, Urlaub, Ziele, Dokumente | ✅ |
| 0.4 | **Separate Auth-Sessions** | Portal-Nutzer haben eigenen Login-Bereich | ✅ |
| 0.5 | **Portal-Profil-Seite** | Mitarbeiterdaten einsehen, Urlaub beantragen, Abwesenheits-Status | ✅ |
| 0.6 | **Portal-Zeiterfassung** | Ein-/Ausstempeln, Live-Timer, Wochenübersicht | ✅ |
| 0.7 | **Team-Kalender** | Monatskalender mit allen Team-Abwesenheiten | ✅ |
| 0.8 | **Portal-Login Button** | Separater Button auf Landingpage und PublicNav | ✅ |
| 0.9 | **Hilfe-Center** | Integrierte FAQs und Anleitungen | ✅ |

### Phase 0.5: Portal-Verbesserungen (Q3 2026) — *Als nächstes*
> **Ziel:** Das Portal weiter verbessern und Feinschliff.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 0.5.1 | **Echtzeit-Benachrichtigungen** | Push-Benachrichtigungen über neue Urlaubsanträge, Genehmigungen | Mittel | 🔴 Hoch |
| 0.5.2 | **Urlaubsantrag-Status verfolgen** | Live-Status-Updates während Genehmigungs-Workflow | Niedrig | 🔴 Hoch |
| 0.5.3 | **iCal-Export** | ICAL-Feed für eigenen Kalender (Google, Apple, Outlook) | Niedrig | 🟡 Mittel |
| 0.5.4 | **PWA-Optimierung** | Portal als Progressive Web App für Desktop/Mobile | Mittel | 🟡 Mittel |
| 0.5.5 | **Resturlaub-Warnung** | Automatische Benachrichtigung bei Resturlaub < 5 Tage | Niedrig | 🟡 Mittel |
| 0.5.6 | **Dokumenten-Upload** | Mitarbeiter können eigene Dokumente hochladen | Mittel | 🟡 Mittel |
| 0.5.7 | **Passwort-Änderung** | Self-Service Passwort-Reset im Portal | Niedrig | 🟡 Mittel |
| 0.5.8 | **Abwesenheits-Kalender Export** | Team-Abwesenheiten als ICS exportieren | Niedrig | 🟢 Niedrig |

### Phase 1: Kern-Verbesserungen (Q3 2026) — Sofort umsetzen

> **Ziel:** Die bestehenden Features auf Marktniveau bringen und Schwächen eliminieren.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 1.1 | **REST API** | Öffentliche API für Drittanbieter-Integrationen | Hoch | 🔴 Hoch |
| 1.2 | **Webhook-System** | Event-basierte Benachrichtigungen für externe Systeme | Mittel | 🔴 Hoch |
| 1.3 | **Verlängerte Zeiterfassung** | Gleitzeit, Überstundenerfassung, Projekt-Zeiterfassung | Mittel | 🔴 Hoch |
| 1.4 | **Erweiterte Performance-Reviews** | 360°-Feedback, automatisierte Review-Zyklen, Zielverknüpfung | Mittel | 🔴 Hoch |
| 1.5 | **Kompetenz-Matrix** | Skills-Matrix für Teams, Identifikation von Lücken | Mittel | 🟡 Mittel |
| 1.6 | **Dokumenten-Generator** | Verträge, Zeugnisse, Bescheinigungen aus Templates generieren | Mittel | 🟡 Mittel |
| 1.7 | **Audit-Log UI** | Durchsuchbare Audit-Log-Oberfläche im Admin | Niedrig | 🔴 Hoch |
| 1.8 | **Video-Interview Integration** | Integration mit Zoom/Teams/Google Meet | Mittel | 🟡 Mittel |

### Phase 2: Differenzierung (Q4 2026) — Schweizer Alleinstellung

> **Ziel:** Einzigartige CH-spezifische Features, die kein Konkurrent bietet.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 2.1 | **CH-Payroll-Modul (Beta)** | Lohnabrechnung nach CH-Standard: AHV/IV/EO, ALV, BVG-Beiträge, Quellensteuer | Hoch | 🔴 Hoch |
| 2.2 | **Behörden-Meldungen** | SVA-Meldungen, SUVA, Familienausgleichskasse (FAK) | Hoch | 🔴 Hoch |
| 2.3 | **Digitale Unterschrift** | Integration mit Skribble/Adobe Sign für Verträge | Mittel | 🟡 Mittel |
| 2.4 | **Lohnbenchmarking CH** | Anonyme Gehaltsvergleiche nach Branche/Region/Position | Mittel | 🟡 Mittel |
| 2.5 | **Lohngleichheits-Report** | Automatischer Report für Pay Equity Analysis | Niedrig | 🔴 Hoch |
| 2.6 | **Urlaubsplaner (Visuell)** | Team-Urlaubsplanung mit drag & drop | Mittel | 🟡 Mittel |
| 2.7 | **Lohnabrechnungs-Übersicht (Portal)** | Mitarbeiter sehen Lohnabrechnungen im Portal | Mittel | 🟡 Mittel |

### Phase 3: KI & Innovation (Q1 2027) — Technologievorsprung

> **Ziel:** Modernste Technologie einsetzen, die Effizienz massiv steigern.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 3.1 | **KI-Lebenslauf-Analyse** | Automatische Extraktion von Skills aus CVs (PDF/UPLOAD) | Hoch | 🔴 Hoch |
| 3.2 | **KI-Job-Matching** | Matching-Score zwischen Kandidaten und Stellenanforderungen | Hoch | 🔴 Hoch |
| 3.3 | **KI-Job Description Generator** | Automatische Erstellung von Stellenanzeigen | Mittel | 🟡 Mittel |
| 3.4 | **KI-Interview-Coach** | Vorbereitungsfragen, Bewertungshilfen für Interviewer | Mittel | 🟡 Mittel |
| 3.5 | **Mitarbeiter-Chatbot** | FAQ für Mitarbeiter (Urlaubsanspruch, Richtlinien, Prozesse) | Mittel | 🟡 Mittel |
| 3.6 | **KI-Stellenanzeigen-Analyse** | Optimierung von Stellenanzeigen für mehr Bewerber | Mittel | 🟡 Mittel |
| 3.7 | **Predictive Analytics** | Fluktuationsrisiko-Score, Hiring-Forecast, Headcount-Planning | Hoch | 🟡 Mittel |

### Phase 4: Enterprise & Skalierung (Q2 2027) — Grosskunden-fähig

> **Ziel:** Enterprise-Features für Konzerne und Holding-Strukturen.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 4.1 | **Multi-Company-Support** | Holding-/Tochtergesellschaften in einer Instanz | Hoch | 🟡 Mittel |
| 4.2 | **SSO / SAML** | Single Sign-On (Google, Microsoft, Okta, Azure AD) | Mittel | 🔴 Hoch |
| 4.3 | **Erweiterte RBAC** | Fein granulare Berechtigungen pro Modul/Feature | Mittel | 🔴 Hoch |
| 4.4 | **SCIM User Provisioning** | Automatisches Account-Management via SCIM | Mittel | 🟡 Mittel |
| 4.5 | **White-Label Karriereseite** | Vollständig anpassbare Karriereseite | Mittel | 🟡 Mittel |
| 4.6 | **Custom Branding erweitert** | Eigene Farben, Logos, E-Mail-Templates | Niedrig | 🟡 Mittel |
| 4.7 | **SOC 2 / ISO 27001 Vorbereitung** | Security-Zertifizierungen für Enterprise | Mittel | 🟡 Mittel |

### Phase 5: Ökosystem & Plattform (Q3-Q4 2027) — Plattform werden

> **Ziel:** Ökosystem aufbauen, Integrationen, Partner-Programm.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 5.1 | **App Marketplace** | Partner-Integrationen: Slack, Teams, Google, Indeed, LinkedIn | Hoch | 🔴 Hoch |
| 5.2 | **Learning Management System (LMS)** | E-Learning, Schulungen, Zertifizierungen, Compliance | Hoch | 🟡 Mittel |
| 5.3 | **Benefits Portal** | Mitarbeiter-Benefits, Versicherungen, Fringe Benefits | Mittel | 🟡 Mittel |
| 5.4 | **Engagement Surveys** | Pulse Surveys, Anonymous Feedback, Stimmungsbilder | Mittel | 🟡 Mittel |
| 5.5 | **Partner-API Programm** | Offizielle Partner-API für Payroll-Provider | Mittel | 🟡 Mittel |
| 5.6 | **Native Mobile App (iOS/Android)** | Natives Mobile App für Mitarbeiter und Manager | Hoch | 🔴 Hoch |
| 5.7 | **WhatsApp / SMS Notifications** | Kandidaten-Benachrichtigungen via WhatsApp/SMS | Niedrig | 🟡 Mittel |
| 5.8 | **Social Intranet** | Activity Feed, Kudos, Team-Messaging | Mittel | 🟢 Niedrig |

---

## 3. Funktionale Lücken-Analyse

### 3.1 Vergleich: iistelle vs. Wettbewerb (Stand Juni 2026)

| Kategorie | Feature | iistelle | Personio | Happeo | Lücke |
|-----------|---------|----------|----------|--------|-------|
| **Recruiting** | Job-Portal | ✅ | ✅ | ✅ | — |
| | KI-Candidate Matching | ❌ | ❌ | ❌ | Gap |
| | Bewerber-Tracking (ATS) | ✅ | ✅ | ✅ | — |
| | Interview-Scheduling | ✅ | ✅ | ✅ | — |
| | E-Mail-Tracking | ❌ | ✅ | ❌ | Klein |
| | Video-Interview Integration | ❌ | ✅ | ❌ | Klein |
| **Mitarbeiter** | Self-Service Portal | ✅ (Magic-Link) | ✅ | ✅ | Differenzierung |
| | Organigramm | ✅ | ✅ | ✅ | — |
| | Skills-Management | ✅ | ✅ | ✅ | — |
| | Kompetenz-Matrix | ❌ | ✅ | ✅ | **Gross** |
| **Payroll** | Lohnabrechnung CH | ❌ | ❌ | ❌ | **Gross** |
| | AHV/IV/EO-Abwicklung | ❌ | ❌ | ❌ | **Gross** |
| | BVG-Verwaltung | ❌ | ❌ | ❌ | **Gross** |
| | Quellensteuer | ❌ | ❌ | ❌ | **Gross** |
| **Zeit** | Zeiterfassung | ✅ (erweitert) | ✅ | ✅ | — |
| | Projekt-Zeiterfassung | ❌ | ✅ | ❌ | Mittel |
| | GPS-Tracking | ❌ | ❌ | ❌ | — |
| **Abwesenheiten** | Urlaubs-Management | ✅ | ✅ | ✅ | — |
| | Visueller Urlaubsplaner | ❌ | ✅ | ✅ | **Gross** |
| | Kalender-Integration (iCal) | ❌ | ✅ | ✅ | Mittel |
| | Genehmigungs-Workflows | ✅ | ✅ | ✅ | — |
| **Performance** | Goals & OKRs | ✅ | ✅ | ✅ | — |
| | 360° Feedback | ❌ | ✅ | ✅ | **Gross** |
| | Kalibrierungs-Sessions | ❌ | ❌ | ❌ | — |
| | Leistungsberichte | ✅ | ✅ | ✅ | — |
| **Dokumente** | Digitaler Vertrag | ❌ | ✅ | ❌ | **Gross** |
| | Unterschrift | ❌ | ✅ | ❌ | **Gross** |
| | Dokumenten-Templates | ✅ | ✅ | ✅ | — |
| **Analytics** | Standard-Reports | ✅ | ✅ | ✅ | — |
| | People Analytics | ❌ | ✅ | ✅ | **Gross** |
| | Predictive Analytics | ❌ | ❌ | ❌ | **Gross** |
| **Integration** | REST API | ❌ | ✅ | ✅ | **Gross** |
| | SSO | ❌ | ✅ | ✅ | **Gross** |
| | Slack/Teams | ✅ | ✅ | ✅ | — |
| | Indeed/LinkedIn | ❌ | ✅ | ✅ | **Gross** |
| **Mobile** | iOS App | ❌ | ✅ | ✅ | **Gross** |
| | Android App | ❌ | ✅ | ✅ | **Gross** |
| **Social** | Activity Feed | ❌ | ❌ | ✅ | **Gross** |
| | Kudos / Anerkennung | ❌ | ❌ | ❌ | Gap |
| **Compliance** | DSGVO | ✅ | ✅ | ✅ | — |
| | CH-spezifische Compliance | ✅ | ❌ | ❌ | Differenzierung |
| | Audit-Log | ✅ | ✅ | ✅ | — |
| **Lern & Entwicklung** | LMS | ❌ | ❌ | ✅ | **Gross** |
| | Schulungs-Tracker | ❌ | ✅ | ✅ | **Gross** |

---

## 4. Technische Roadmap

### 4.1 Architektur-Verbesserungen

| Phase | Thema | Beschreibung |
|-------|-------|--------------|
| T1 | **REST API entwickeln** | Öffentliche API für alle Module |
| T2 | **Webhook-System** | Event-basierte Benachrichtigungen implementieren |
| T3 | **PWA-Optimierung** | Service Worker, Offline-Support, Installability |
| T4 | **Performance-Optimierung** | Caching-Strategie, DB-Indizes, Lazy Loading |
| T5 | **Caching-Layer** | Redis für Sessions, häufige Queries |
| T6 | **Event-Sourcing** | Audit-Log, History-Tracking, Time-Travel |
| T7 | **Microservices-Vorbereitung** | Payroll, Documents, Analytics als separate Services |

### 4.2 Security & Compliance

| Phase | Thema | Beschreibung |
|-------|-------|--------------|
| S1 | **SOC 2 Type II** | Sicherheits-Zertifizierung (Enterprise-Anforderung) |
| S2 | **ISO 27001** | Informationssicherheits-Managementsystem |
| S3 | **Penetration Testing** | Jährliches Security Audit |
| S4 | **Advanced RBAC** | Feature-Level Berechtigungen |
| S5 | **Encryption at Rest** | Alle Daten verschlüsselt speichern |
| S6 | **2FA für Admin** | Zwei-Faktor-Authentifizierung für Administratoren |

### 4.3 Portal-Architektur

| Feature | Status | Beschreibung |
|---------|--------|--------------|
| Magic-Link Flow | ✅ | Passwortloser Zugang für Mitarbeiter |
| Onboarding-Tour | ✅ | Schritt-für-Schritt-Einführung |
| Separate Auth | ✅ | Portal-User != Admin-User |
| DB-Migration | ✅ | employee_profiles, setup_tokens |
| Echtzeit-Updates | ❌ | Supabase Realtime für Live-Daten |
| Push-Benachrichtigungen | ❌ | Service Worker + Web Push |
| PWA-Support | ❌ | Manifest, Service Worker |

---

## 5. Go-to-Market & Wachstum

### 5.1 Marktpositionierung

> **Positionierung:** "Das einzige HR-Tool, das wirklich für die Schweiz gemacht ist."

| Differenziator | Message |
|----------------|---------|
| **CH-Payroll** | "Kein separates Payroll-Tool mehr — alles in einem." |
| **Behörden-Integration** | "Automatische SVA- und AHV-Meldungen direkt aus dem System." |
| **KI-Unterstützung** | "Intelligenteres Recruiting und weniger manueller Aufwand." |
| **Datenschutz** | "DSGVO-konform, Server in der Schweiz, kein US-Cloud-Zwang." |
| **Mitarbeiter-Portal** | "Ihr Team liebt es — passwortloser Zugang in Sekunden." |
| **Magic-Link** | "Keine Passwörter — Einladungs-Link genügt." |

### 5.2 Preisstrategie (harmonisiert mit Implementierung)

| Plan | Preis CH (CHF/Monat) | Preis DE (EUR/Monat) | Features | Zielgruppe |
|------|---------------------|---------------------|----------|------------|
| **Starter** | 0 (kostenlos) | 0 (kostenlos) | Bis 5 Mitarbeiter, Recruiting-Basis, Karriereseite, Abwesenheiten | Startups, kleine Agenturen |
| **Professional** | 129 | 99 | Alles inkl., unbegrenzte Mitarbeiter, Zeiterfassung, Performance, Audit-Log, Portal | Wachstums-Unternehmen |
| **Business** | 299 | 229 | + API, Webhooks, Erweiterte Reports, Dokumenten-Generator | Mittlere Unternehmen |
| **Enterprise** | Individuell | Individuell | Multi-Company, SSO, dedizierter Support, Custom Branding, SLA | Konzerne, Holdings |

> **Jährliche Abrechnung:** 2 Monate gratis (ca. 17% Rabatt)
> **Geo-IP:** Automatische Währungserkennung (CHF für CH, EUR für DE/AT)

### 5.3 Partnerschaften

| Partner-Typ | Beispiele | Nutzen |
|-------------|-----------|--------|
| **Payroll-Provider** | Lohn & Gehalt AG, Dayforce | Integration für nahtloses Payroll |
| **Beratungen** | HR-Beratungen, Treuhänder | Reseller, Consulting-Partner |
| **Technologie** | Skribble, Indeed, LinkedIn, Zoom | Integrationen |
| **Verbände** | Swissmem, Arbeitgeberverband | Glaubwürdigkeit, Leads |
| **KI-Provider** | Anthropic (Claude), OpenAI | KI-Features |

---

## 6. Priorisierte Umsetzungsreihenfolge

### Empfohlene Reihenfolge (nach Impact & Effort)

```
Phase 0 (Q2 2026): ✅ ABGESCHLOSSEN
├── 0.1 Magic-Link Portal-Einladung               [Impact: Hoch, Effort: Niedrig] ✅
├── 0.2 Onboarding-Tour                           [Impact: Mittel, Effort: Niedrig] ✅
├── 0.3 Portal-Dashboard                         [Impact: Hoch, Effort: Mittel] ✅
├── 0.4 Separate Auth-Sessions                   [Impact: Hoch, Effort: Mittel] ✅
└── 0.5 Hilfe-Center                             [Impact: Mittel, Effort: Niedrig] ✅

Phase 0.5 (Q3 2026):
├── 0.5.1 Echtzeit-Benachrichtigungen            [Impact: Hoch, Effort: Mittel]
├── 0.5.2 REST API (Basis)                       [Impact: Hoch, Effort: Hoch]
├── 0.5.3 Webhook-System                         [Impact: Hoch, Effort: Mittel]
├── 0.5.4 iCal-Export                            [Impact: Mittel, Effort: Niedrig]
└── 0.5.5 PWA-Optimierung                        [Impact: Mittel, Effort: Mittel]

Phase 1 (Q3-Q4 2026):
├── 1.3 Zeiterfassung-Verbesserung               [Impact: Hoch, Effort: Mittel]
├── 1.4 Performance-Reviews erweitern            [Impact: Hoch, Effort: Mittel]
├── 1.5 Kompetenz-Matrix                         [Impact: Mittel, Effort: Mittel]
├── 1.7 Audit-Log UI                             [Impact: Hoch, Effort: Niedrig]
└── 1.8 Video-Interview Integration              [Impact: Mittel, Effort: Mittel]

Phase 2 (Q4 2026 - Q1 2027):
├── 2.5 Lohngleichheits-Report                   [Impact: Hoch, Effort: Niedrig]
├── 2.7 Urlaubsplaner (Visuell)                  [Impact: Mittel, Effort: Mittel]
├── 2.3 Digitale Unterschrift                    [Impact: Mittel, Effort: Mittel]
├── 2.1 CH-Payroll-Modul (Beta)                  [Impact: Hoch, Effort: Hoch]
└── 2.2 Behörden-Meldungen                       [Impact: Hoch, Effort: Hoch]

Phase 3 (Q1-Q2 2027):
├── 3.1 KI-Lebenslauf-Analyse                     [Impact: Hoch, Effort: Hoch]
├── 3.2 KI-Job-Matching                          [Impact: Hoch, Effort: Hoch]
├── 3.3 KI-Job Description Generator              [Impact: Mittel, Effort: Mittel]
└── 3.5 KI-Mitarbeiter-Chatbot                   [Impact: Mittel, Effort: Mittel]

Phase 4 (Q2-Q3 2027):
├── 4.2 SSO / SAML                               [Impact: Hoch, Effort: Mittel]
├── 4.3 Erweiterte RBAC                          [Impact: Hoch, Effort: Mittel]
└── 4.1 Multi-Company-Support                     [Impact: Mittel, Effort: Hoch]

Phase 5 (Q3-Q4 2027):
├── 5.6 Mobile App                               [Impact: Hoch, Effort: Hoch]
├── 5.1 App Marketplace                          [Impact: Hoch, Effort: Hoch]
├── 5.2 LMS                                      [Impact: Mittel, Effort: Hoch]
└── 5.3 Benefits Portal                          [Impact: Mittel, Effort: Mittel]
```

---

## 7. Metriken & Erfolgskriterien

### 7.1 Produkt-Metriken

| Metrik | Ziel (12 Monate) | Ziel (24 Monate) |
|--------|------------------|------------------|
| **NPS Score** | > 40 | > 60 |
| **Feature Adoption Rate** | > 60% Features genutzt | > 80% Features genutzt |
| **Portal Adoption** | > 70% Mitarbeiter nutzen Portal | > 90% aktive Nutzer |
| **API-Nutzung** | > 10 Integrationen pro Kunde | > 50 Integrationen |
| **Time-to-Value** | < 2 Stunden | < 30 Minuten |
| **Support Response Time** | < 4 Stunden | < 1 Stunde |
| **System Uptime** | > 99.5% | > 99.9% |

### 7.2 Geschäfts-Metriken

| Metrik | Ziel (12 Monate) | Ziel (24 Monate) |
|--------|------------------|------------------|
| **Kunden** | 100 aktive Kunden | 500 aktive Kunden |
| **MRR** | CHF 50'000 | CHF 200'000 |
| **Logo Retention** | > 90% | > 95% |
| **Net Revenue Retention** | > 100% | > 120% |
| **Enterprise Deals** | 5 | 20 |
| **API-Partner** | 10 | 50 |

---

## 8. Risiken & Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigationsstrategie |
|--------|-------------------|--------|---------------------|
| CH-Payroll zu komplex | Mittel | Hoch | Partner mit bestehendem Payroll-Anbieter, keine Eigenentwicklung |
| KI-Qualität nicht ausreichend | Mittel | Mittel | Iterative Entwicklung, User Feedback, humaine Fallbacks |
| Enterprise Sales Zyklus zu lang | Hoch | Mittel | Enterprise-ready Features priorisieren, dedizierter Sales |
| Portal Adoption zu niedrig | Niedrig | Hoch | Onboarding optimieren, Push-Benachrichtigungen, Management-Support |
| Wettbewerber holt auf | Mittel | Mittel | Kontinuierliche Innovation, CH-First Strategie |
| Datenmigration bei Payroll | Hoch | Hoch | Sanfte Migration, Parallelphasen, Partner-Support |
| API-Nutzung zu gering | Mittel | Mittel | Developer Relations, Dokumentation, Beispiele |

---

## 9. Nächste Schritte

### Sofort (diese Woche):
1. [x] **Portal Magic-Link Flow** — Implementiert
2. [x] **Onboarding-Tour** — Implementiert
3. [x] **Hilfe-Center** — Implementiert
4. [ ] **REST API planen** — OpenAPI-Spec erstellen
5. [ ] **Webhook-System designen** — Event-Typen definieren

### Nächster Sprint (2 Wochen):
1. [ ] **REST API Basis-Implementierung** — Auth, Employees, Time Entries
2. [ ] **Webhook-System** — Event-Benachrichtigungen
3. [ ] **iCal-Export** — Urlaubskalender
4. [ ] **Audit-Log UI** — Durchsuchbare Oberfläche

### Nächster Monat:
1. [ ] **Echtzeit-Benachrichtigungen** — Supabase Realtime
2. [ ] **PWA-Optimierung** — Service Worker
3. [ ] **Zeiterfassung erweitern** — Projekt-Zeiterfassung
4. [ ] **Payroll-Partner** — Gespräche starten
5. [ ] **KI-Provider** — Evaluation für CV-Analyse

---

## 10. Strategische Überlegungen für die Zukunft

### 10.1 Produktstrategie

| Bereich | Fokus | Begründung |
|---------|-------|------------|
| **API First** | REST API priorisieren | Integrationen sind Enterprise-Anforderung |
| **PWA vor Native** | Progressive Web App entwickeln | Schneller, billiger als Native App |
| **Mobile** | iOS-optimiertes PWA | Schweizer nutzen überdurchschnittlich iOS |
| **KI** | Ethnisches KI-Deployment | Differenzierung, nicht als Spielerei |
| **Compliance** | CH-spezifische Automatisierung | Wettbewerbsvorteil, schwer kopierbar |
| **Portal** | Mitarbeiter-Experience optimieren | Höchste Nutzungsfrequenz |

### 10.2 Technologie-Entscheidungen

| Entscheidung | Empfehlung | Begründung |
|-------------|-----------|------------|
| **Frontend** | Next.js 14 (App Router) | Stabil, gute Performance |
| **Datenbank** | Supabase (PostgreSQL) | CH-Server, einfache Auth, RLS |
| **KI-Provider** | Claude API via Anthropic | Beste Qualität, CH-konform |
| **Payments** | Stripe | Standard, gute Integration |
| **E-Mail** | Resend | Transactional E-Mails, gute Deliverability |
| **SMS** | Twilio | Globale Abdeckung, WhatsApp |
| **API-Dokumentation** | Scalar oder Swagger | Für Developer Experience |

### 10.3 Wachstumsstrategie

1. **Inbound Lead Generation** optimieren
   - SEO für "HR Software Schweiz", "Payroll CH"
   - Content Marketing (Ratgeber ausbauen)
   - Free Tools (Stundensatz-Rechner, etc.)

2. **Partner-Programm** starten
   - Treuhänder als Reseller
   - HR-Beratungen als Integration-Partner
   - Payroll-Provider als White-Label

3. **Community aufbauen**
   - HR-Professional Netzwerk in CH
   - User Groups, Webinare
   - Case Studies & Testimonials

4. **API-Ökosystem** fördern
   - Developer Portal erstellen
   - Code-Beispiele und SDKs
   - Partner-Integrationen fördern

---

## 11. Neue Features (vorgeschlagen für zukünftige Versionen)

### 11.1 Community-Features (Social Intranet)

| Feature | Beschreibung | Warum |
|---------|--------------|-------|
| **Activity Feed** | Team-Aktivitäten, Geburtstage, Jubiläen | Community-Gefühl |
| **Kudos / Anerkennung** | Kollegen öffentlich loben | Mitarbeiterzufriedenheit |
| **Team-Messaging** | Chat für Teams/Abteilungen | Engagement |
| **Anonymous Feedback** | Mitarbeiter können anonym Feedback geben |psychologische Sicherheit |

### 11.2 Erweiterte Recruiting-Features

| Feature | Beschreibung | Warum |
|---------|--------------|-------|
| **Talent-Pipeline** | Talent-Pool für zukünftige Stellen | Effizienz |
| **Mitarbeiter-Empfehlungen** | Mitarbeiter können Kandidaten empfehlen | Referral-Programm |
| **Automatisierte Antworten** | KI-generierte Antworten auf Bewerbungen | Zeitersparnis |
| **Background-Check Integration** | Drittanbieter für Background Checks | Enterprise |

### 11.3 Erweiterte Portal-Features

| Feature | Beschreibung | Warum |
|---------|--------------|-------|
| **Lohnabrechnungen** | Mitarbeiter sehen Lohnabrechnungen | Self-Service |
| **Steuererklärung-Hilfe** | Anleitung für CH-Steuererklärung | Mehrwert |
| **Benefit-Auswahl** | Mitarbeiter können Benefits wählen | Flexibilität |
| **Fitness-/Wellness-Tracker** | Integration mit Fitness-Apps | Engagement |

---

*Letztes Update: Juni 2026*  
*Verantwortlich: Sebastian Oczachowski*  
*Version: 1.2*

**Änderungen gegenüber V1.1:**
- Phase 0.5 (Portal-Verbesserungen) hinzugefügt
- Phase 1 um REST API und Webhooks erweitert
- Neue Features: Kompetenz-Matrix, Visueller Urlaubsplaner
- Kapitel 11 (Neue Features) mit Social Intranet und erweiterten Recruiting-Features
- Preisstrategie um Business Plan erweitert
- API-Nutzung als neue Metrik
- Community-Features vorgeschlagen