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

### ✅ Mitarbeiter-Portal (Magic-Link Flow) *(NEU)*
- Eigenständiger Portal-Bereich für Mitarbeiter (`/portal`, `/portal-login`)
- Magic-Link-basierte Einladung (kein Passwort-Setup nötig)
- Onboarding-Tour für neue Mitarbeiter
- Schneller Zugang zu Zeiterfassung, Urlaub, Zielen, Dokumenten
- Admin kann Portal-Einladungen versenden
- Self-Service Portal für Mitarbeiter (DSGVO-konform)
- Separate Auth-Session für Portal vs. Admin

### ✅ Portal-Features erweitert *(NEU)*
- **Portal-Profil-Seite**: Mitarbeiterdaten einsehen, Urlaub beantragen, Abwesenheits-Status verfolgen
- **Portal-Zeiterfassung**: Ein-/Ausstempeln, Live-Timer, Wochenübersicht mit Chart
- **Team-Kalender**: Monatskalender mit allen Abwesenheiten, Legende, anstehende Abwesenheiten
- **Portal-Landingpage**: Übersicht aller Portal-Features für neue Mitarbeiter
- **Portal-Login Button**: Separater Button auf Landingpage und PublicNav

### ✅ Portal-Login Button auf Landingpage *(NEU)*
- Separate Anmelde-Buttons für Admin-Login und Portal-Login
- Landingpage: "Portal-Login" Button prominent platziert
- PublicNav: "Portal-Login" Button integriert
- Klare Differenzierung zwischen Arbeitgeber- und Mitarbeiter-Zugang

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
✅ **Mitarbeiter-Portal** — Magic-Link Self-Service für Mitarbeiter *(NEU)*

### 1.3 Marktlücken & Differenzierungs-Chancen

| Chance | Beschreibung | Warum wichtig |
|--------|--------------|---------------|
| **Natives CH-Payroll** | Lohnabrechnung nach CH-Standard (AHV/IV/EO, BVG, Quellensteuer) | Payroll ist der grösste Pain Point im Schweizer HR |
| **Behörden-Integration** | SVA-/AHV-Meldungen, Quellensteuer-Abwicklung | Entlastet HR massiv |
| **KI-gestützte Features** | Lebenslauf-Analyse, Matching, Chatbot für Mitarbeiter | Differenzierung gegenüber Personio |
| **Besserer Self-Service für Mitarbeiter** | Mitarbeiter-Portal mit Eigenverwaltung | Erhöht Akzeptanz, reduziert HR-Aufwand |
| **Mobile App** | iOS/Android App | Schwachstelle bei fast allen Konkurrenten |
| **Multi-Company / Konzern** | Holding-Strukturen, Subsidiaries | Enterprise-Gateway |
| **API & Integrationen** | Drittanbieter-Anbindungen, Webhooks, SSO | Enterprise-Anforderung |
| **Lohntransparenz-Tool** | Gehaltsbenchmarking CH, Lohngleichheit-Reports | Gesetzliche Anforderung (rev一年的 Entgelttransparenzgesetz) |
| **Digitale Unterschrift** | DocuSign / Skribble Integration | Fehlendes Feature bei allen |
| **Mitarbeiter-Benefits Portal** | Fringe Benefits, Versicherungen, Bonus-Programme | Differenzierung, Mehrwert |
| **Learning Management (LMS)** | Schulungen, Zertifizierungen, E-Learning | Komplettes HR-Ökosystem |
| **Engagement-/Pulse-Surveys** | Anonymous Feedback, Stimmungsbild | Mitarbeiterzufriedenheit |
| **Advanced Analytics / People Analytics** | Predictive Hiring, Fluktuationsrisiko, Workforce Planning | Data-Driven HR |
| **On-Demand Payroll Reports** | Lohnausweise digital, Quellensteuer-Reports, BVG-Abrechnungen | Compliance-Vorteil |

---

## 2. Feature-Roadmap nach Phasen

### Phase 0: Portal-Optimierung (Q2 2026) — *Gerade abgeschlossen*
> **Ziel:** Mitarbeiter-Self-Service ohne Passwort-Hürde.

| # | Feature | Beschreibung | Status |
|---|---------|--------------|--------|
| 0.1 | **Magic-Link Portal-Einladung** | Admin kann mit einem Klick Einladungs-Link per E-Mail senden | ✅ Abgeschlossen |
| 0.2 | **Onboarding-Tour** | Schritt-für-Schritt-Einführung für neue Portal-Nutzer | ✅ Abgeschlossen |
| 0.3 | **Portal-Dashboard** | Schneller Zugriff auf Zeiterfassung, Urlaub, Ziele, Dokumente | ✅ Abgeschlossen |
| 0.4 | **Separate Auth-Sessions** | Portal-Nutzer haben eigenen Login-Bereich | ✅ Abgeschlossen |
| 0.5 | **Portal-Profil-Seite** | Mitarbeiterdaten einsehen, Urlaub beantragen, Abwesenheits-Status | ✅ Abgeschlossen |
| 0.6 | **Portal-Zeiterfassung** | Ein-/Ausstempeln, Live-Timer, Wochenübersicht | ✅ Abgeschlossen |
| 0.7 | **Team-Kalender** | Monatskalender mit allen Team-Abwesenheiten | ✅ Abgeschlossen |
| 0.8 | **Portal-Login Button** | Separater Button auf Landingpage und PublicNav | ✅ Abgeschlossen |

### Phase 0.5: Portal-Verbesserungen (Q3 2026) — *Als nächstes*
> **Ziel:** Das Portal weiter verbessern und Feinschliff.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 0.5.1 | **Persönliche Dokumente** | Verträge, Zeugnisse im Portal abrufen | Mittel | 🔴 Hoch |
| 0.5.2 | **Ziele & Performance** | Ziele im Portal einsehen und Fortschritt tracken | Mittel | 🟡 Mittel |
| 0.5.3 | **Notifications** | Benachrichtigungen über neue Urlaubsanträge, Genehmigungen | Niedrig | 🟡 Mittel |
| 0.5.4 | **Urlaubskalender-Export** | ICAL-Feed für eigenen Kalender | Niedrig | 🟡 Mittel |
| 0.5.5 | **Mobile-Optimierung** | Portal für mobile Geräte optimieren | Mittel | 🟡 Mittel |

### Phase 1: Kern-Verbesserungen (Q3 2026) — Sofort umsetzen

> **Ziel:** Die bestehenden Features auf Marktniveau bringen und Schwächen eliminieren.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 1.1 | **Persönliche Dokumente im Portal** | Verträge, Zeugnisse, Bescheinigungen abrufen | Mittel | 🔴 Hoch |
| 1.2 | **Ziele & Performance im Portal** | Ziele einsehen, Fortschritt tracken, Feedback geben | Mittel | 🟡 Mittel |
| 1.3 | **Verlängerte Zeiterfassung** | Gleitzeit, Überstundenerfassung, Export, Pausen-Tracker, Genehmigungs-Workflow | Mittel | 🔴 Hoch |
| 1.4 | **Erweiterte Performance-Reviews** | 360°-Feedback, automatisierte Review-Zyklen, Zielverknüpfung, Kalibrierungs-Sessions | Mittel | 🔴 Hoch |
| 1.5 | **Dokumenten-Generator** | Verträge, Zeugnisse, Bescheinigungen aus Templates generieren | Mittel | 🟡 Mittel |
| 1.6 | **Audit-Log Erweiterung** | Vollständiges Audit-Trail für alle HR-Aktionen (DSGVO-Compliance) | Niedrig | 🔴 Hoch |
| 1.7 | **API-Endpoints** | REST-API für Drittanbieter-Integrationen, Webhooks für Events | Hoch | 🟡 Mittel |

### Phase 2: Differenzierung (Q4 2026) — Schweizer Alleinstellung

> **Ziel:** Einzigartige CH-spezifische Features, die kein Konkurrent bietet.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 2.1 | **CH-Payroll-Modul (Beta)** | Lohnabrechnung nach CH-Standard: AHV/IV/EO, ALV, BVG-Beiträge, Quellensteuer | Hoch | 🔴 Hoch |
| 2.2 | **Behörden-Meldungen** | SVA-Meldungen, Unfallversicherung-Meldungen (SUVA), Familienausgleichskasse (FAK) | Hoch | 🔴 Hoch |
| 2.3 | **Digitale Unterschrift** | Integration mit Skribble/Adobe Sign für Verträge und Dokumente | Mittel | 🟡 Mittel |
| 2.4 | **Lohnbenchmarking CH** | Anonyme Gehaltsvergleiche nach Branche/Region/Position (basierend auf realen Daten) | Mittel | 🟡 Mittel |
| 2.5 | **Lohngleichheits-Report** | Automatischer Report für Pay Equity Analysis (gesetzliche Anforderung) | Niedrig | 🔴 Hoch |
| 2.6 | **CH-Feiertags-Engine** | Automatische Feiertags-Erkennung pro Kanton, Brücken-/Feiertage-Tracker | Niedrig | 🟡 Mittel |

### Phase 3: KI & Innovation (Q1 2027) — Technologievorsprung

> **Ziel:** Modernste Technologie einsetzen, die Effizienz massiv steigern.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 3.1 | **KI-Lebenslauf-Analyse** | Automatische Extraktion von Skills, Erfahrung, Ausbildung aus CVs (PDF/UPLOAD) | Hoch | 🔴 Hoch |
| 3.2 | **KI-Job-Matching** | Matching-Score zwischen Kandidaten und Stellenanforderungen | Hoch | 🔴 Hoch |
| 3.3 | **KI-Job Description Generator** | Automatische Erstellung von Stellenanzeigen basierend auf Titel/Anforderungen | Mittel | 🟡 Mittel |
| 3.4 | **KI-Interview-Coach** | Vorbereitungsfragen, Bewertungshilfen für Interviewer | Mittel | 🟡 Mittel |
| 3.5 | **Mitarbeiter-Chatbot** | FAQ für Mitarbeiter (Urlaubsanspruch, Richtlinien, Prozesse) | Mittel | 🟡 Mittel |
| 3.6 | **Predictive Analytics** | Fluktuationsrisiko-Score, Hiring-Forecast, Headcount-Planning | Hoch | 🟡 Mittel |

### Phase 4: Enterprise & Skalierung (Q2 2027) — Grosskunden-fähig

> **Ziel:** Enterprise-Features für Konzerne und Holding-Strukturen.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 4.1 | **Multi-Company-Support** | Holding-/Tochtergesellschaften in einer Instanz verwalten | Hoch | 🟡 Mittel |
| 4.2 | **SSO / SAML** | Single Sign-On (Google, Microsoft, Okta, Azure AD) | Mittel | 🔴 Hoch |
| 4.3 | **Role-Based Access Control (RBAC) erweitert** | Fein granulare Berechtigungen pro Modul/Feature | Mittel | 🔴 Hoch |
| 4.4 | **Advanced SSO / SCIM** | User Provisioning, automatisches Account-Management | Mittel | 🟡 Mittel |
| 4.5 | **White-Label Karriereseite** | Vollständig anpassbare Karriereseite für Enterprise-Kunden | Mittel | 🟡 Mittel |
| 4.6 | **Custom Branding erweitert** | Eigene Farben, Logos, E-Mail-Templates für Unternehmen | Niedrig | 🟡 Mittel |

### Phase 5: Ökosystem & Plattform (Q3-Q4 2027) — Plattform werden

> **Ziel:** Ökosystem aufbauen, Integrationen, Partner-Programm.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 5.1 | **App Marketplace / Integration Hub** | Partner-Integrationen: Slack, Microsoft Teams, Google Workspace, Indeed, LinkedIn | Hoch | 🔴 Hoch |
| 5.2 | **Learning Management System (LMS)** | E-Learning, Schulungen, Zertifizierungen, Compliance-Trainings | Hoch | 🟡 Mittel |
| 5.3 | **Benefits Portal** | Mitarbeiter-Benefits, Versicherungen, Fringe Benefits verwalten | Mittel | 🟡 Mittel |
| 5.4 | **Engagement Surveys** | Pulse Surveys, Anonymous Feedback, Stimmungsbilder | Mittel | 🟡 Mittel |
| 5.5 | **Partner-API Programm** | Offizielle Partner-API für Payroll-Provider, Zeitmess-Systeme | Mittel | 🟡 Mittel |
| 5.6 | **Mobile App (iOS/Android)** | Natives Mobile App für Mitarbeiter und Manager | Hoch | 🔴 Hoch |
| 5.7 | **WhatsApp / SMS Notifications** | Kandidaten-Benachrichtigungen via WhatsApp/SMS | Niedrig | 🟡 Mittel |

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
| **Mitarbeiter** | Self-Service Portal | ✅ (Magic-Link) | ✅ | ✅ | — |
| | Organigramm | ✅ | ✅ | ✅ | — |
| | Skills-Management | ✅ | ✅ | ✅ | — |
| | Kompetenz-Matrix | ❌ | ✅ | ❌ | **Gross** |
| **Payroll** | Lohnabrechnung CH | ❌ | ❌ | ❌ | **Gross** |
| | AHV/IV/EO-Abwicklung | ❌ | ❌ | ❌ | **Gross** |
| | BVG-Verwaltung | ❌ | ❌ | ❌ | **Gross** |
| | Quellensteuer | ❌ | ❌ | ❌ | **Gross** |
| **Zeit** | Zeiterfassung | ✅ (basic) | ✅ | ✅ | — |
| | Projekt-Zeiterfassung | ❌ | ✅ | ❌ | Mittel |
| | GPS-Tracking | ❌ | ❌ | ❌ | — |
| **Abwesenheiten** | Urlaubs-Management | ✅ | ✅ | ✅ | — |
| | Kalender-Integration | ❌ | ✅ | ✅ | **Gross** |
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
| **Compliance** | DSGVO | ✅ | ✅ | ✅ | — |
| | CH-spezifische Compliance | ✅ | ❌ | ❌ | Differenzierung |
| | Audit-Log | ✅ (basic) | ✅ | ✅ | — |
| **Lern & Entwicklung** | LMS | ❌ | ❌ | ✅ | **Gross** |
| | Schulungs-Tracker | ❌ | ✅ | ✅ | **Gross** |

---

## 4. Technische Roadmap

### 4.1 Architektur-Verbesserungen

| Phase | Thema | Beschreibung |
|-------|-------|--------------|
| T1 | **Performance-Optimierung** | Caching-Strategie, DB-Indizes, Lazy Loading |
| T2 | **API-First Architektur** | RESTful API für alle Features, GraphQL für komplexe Queries |
| T3 | **Caching-Layer** | Redis für Sessions, häufige Queries, Echtzeit-Updates |
| T4 | **Event-Sourcing** | Audit-Log, History-Tracking, Time-Travel |
| T5 | **Microservices-Vorbereitung** | Payroll, Documents, Analytics als separate Services |

### 4.2 Security & Compliance

| Phase | Thema | Beschreibung |
|-------|-------|--------------|
| S1 | **SOC 2 Type II** | Sicherheits-Zertifizierung (Enterprise-Anforderung) |
| S2 | **ISO 27001** | Informationssicherheits-Managementsystem |
| S3 | **Penetration Testing** | Jährliches Security Audit |
| S4 | **Advanced RBAC** | Feature-Level Berechtigungen |
| S5 | **Encryption at Rest** | Alle Daten verschlüsselt speichern |

### 4.3 Portal-Optimierungen (Phase 0 abgeschlossen)

| Feature | Status | Beschreibung |
|---------|--------|--------------|
| Magic-Link Flow | ✅ Abgeschlossen | Passwortloser Zugang für Mitarbeiter |
| Onboarding-Tour | ✅ Abgeschlossen | Schritt-für-Schritt-Einführung |
| Separate Auth | ✅ Abgeschlossen | Portal-User != Admin-User |
| DB-Migration | ✅ Abgeschlossen | employee_profiles, setup_tokens |

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
| **Mitarbeiter-Portal** | "Ihr Team liebt es — passwortloser Zugang in Sekunden." *(NEU)* |

### 5.2 Preisstrategie (aktualisiert)

| Plan | Preis (CHF/Monat) | Features | Zielgruppe |
|------|-------------------|----------|------------|
| **Starter** | 149 | Recruiting, Mitarbeiter (max 10), Zeiterfassung Basic, Abwesenheiten, Portal | Startups, kleine Agenturen |
| **Professional** | 399 | Alles inkl., bis 50 Mitarbeiter, Self-Service, Performance | Wachstums-Unternehmen |
| **Business** | 799 | Alles inkl., unbegrenzte Mitarbeiter, API, erweiterte Reports, Payroll Beta | Mittlere Unternehmen |
| **Enterprise** | Individuell | Multi-Company, SSO, dedizierter Support, Custom Branding, SLA | Konzerne, Holdings |

### 5.3 Partnerschaften

| Partner-Typ | Beispiele | Nutzen |
|-------------|-----------|--------|
| **Payroll-Provider** | Lohn & Gehalt AG, Dayforce | Integration für nahtloses Payroll |
| **Beratungen** | HR-Beratungen, Treuhänder | Reseller, Consulting-Partner |
| **Technologie** | Skribble, Indeed, LinkedIn | Integrationen |
| **Verbände** | Swissmem, Arbeitgeberverband | Glaubwürdigkeit, Leads |

---

## 6. Priorisierte Umsetzungsreihenfolge

### Empfohlene Reihenfolge (nach Impact & Effort)

```
Phase 0 (Q2 2026): ✅ ABGESCHLOSSEN
├── 0.1 Magic-Link Portal-Einladung               [Impact: Hoch, Effort: Niedrig] ✅
├── 0.2 Onboarding-Tour                           [Impact: Mittel, Effort: Niedrig] ✅
├── 0.3 Portal-Dashboard                          [Impact: Hoch, Effort: Mittel] ✅
└── 0.4 Separate Auth-Sessions                    [Impact: Hoch, Effort: Mittel] ✅

Phase 1 (Q3 2026):
├── 1.1 Self-Service Portal erweitern             [Impact: Hoch, Effort: Mittel]
├── 1.5 Audit-Log Erweiterung                     [Impact: Hoch, Effort: Niedrig]
├── 1.2 Zeiterfassung-Verbesserung                [Impact: Hoch, Effort: Mittel]
└── 1.3 Performance-Reviews erweitern             [Impact: Hoch, Effort: Mittel]

Phase 2 (Q4 2026):
├── 2.5 Lohngleichheits-Report                    [Impact: Hoch, Effort: Niedrig]
├── 2.3 Digitale Unterschrift                     [Impact: Mittel, Effort: Mittel]
├── 2.6 CH-Feiertags-Engine                       [Impact: Mittel, Effort: Niedrig]
└── 2.1 CH-Payroll-Modul (Beta)                   [Impact: Hoch, Effort: Hoch]

Phase 3 (Q1 2027):
├── 3.1 KI-Lebenslauf-Analyse                     [Impact: Hoch, Effort: Hoch]
├── 3.2 KI-Job-Matching                           [Impact: Hoch, Effort: Hoch]
└── 3.3 KI-Job Description Generator              [Impact: Mittel, Effort: Mittel]

Phase 4 (Q2 2027):
├── 4.2 SSO / SAML                                [Impact: Hoch, Effort: Mittel]
├── 4.3 Erweiterte RBAC                          [Impact: Hoch, Effort: Mittel]
└── 4.1 Multi-Company-Support                     [Impact: Mittel, Effort: Hoch]

Phase 5 (Q3-Q4 2027):
├── 5.6 Mobile App                                [Impact: Hoch, Effort: Hoch]
├── 5.1 App Marketplace                           [Impact: Hoch, Effort: Hoch]
└── 5.2 LMS                                       [Impact: Mittel, Effort: Hoch]
```

---

## 7. Metriken & Erfolgskriterien

### 7.1 Produkt-Metriken

| Metrik | Ziel (12 Monate) | Ziel (24 Monate) |
|--------|------------------|------------------|
| **NPS Score** | > 40 | > 60 |
| **Feature Adoption Rate** | > 60% Features genutzt | > 80% Features genutzt |
| **Portal Adoption** | > 70% Mitarbeiter nutzen Portal | > 90% aktive Nutzer |
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

---

## 9. Nächste Schritte

### Sofort (diese Woche):
1. [x] **Portal Magic-Link Flow** — Implementiert
2. [x] **Onboarding-Tour** — Implementiert
3. [ ] **Portal-Dashboard verfeinern** — Urlaub, Ziele, Dokumente integrieren
4. [ ] **Portal-Migration ausführen** — SQL in Supabase ausführen

### Nächster Sprint (2 Wochen):
1. [ ] **Self-Service Portal** — MVP-Implementierung
2. [ ] **CH-Feiertags-Engine** — Basis-Implementierung
3. [ ] **Zeiterfassung-Verbesserung** — Feature-Liste erstellen
4. [ ] **Audit-Log Erweiterung** — Anforderungen definieren

### Nächster Monat:
1. [ ] **Phase 1 Features** — MVP-Entwicklung
2. [ ] **Payroll-Partner** — Gespräche starten
3. [ ] **KI-Provider** — Evaluation für CV-Analyse
4. [ ] **Lohngleichheits-Report** — Research CH-Gesetzgebung

---

## 10. Strategische Überlegungen für die Zukunft

### 10.1 Produktstrategie

| Bereich | Fokus | Begründung |
|---------|-------|------------|
| **Portal First** | Mitarbeiter-Experience priorisieren | Höchste Nutzungsfrequenz, direktester Impact |
| **Mobile** | iOS App entwickeln | Schweizer nutzen überdurchschnittlich iOS |
| **KI** | Ethnisches KI-Deployment | Differenzierung, nicht als Spielerei |
| **Compliance** | CH-spezifische Automatisierung | Wettbewerbsvorteil, schwer kopierbar |

### 10.2 Technologie-Entscheidungen

| Entscheidung | Empfehlung | Begründung |
|-------------|-----------|------------|
| **Frontend-Framework** | Next.js 14 (App Router) beibehalten | Stabil, gute Performance |
| **Datenbank** | Supabase (PostgreSQL) | CH-Server, einfache Auth, RLS |
| **KI-Provider** | Claude API via Anthropic | Beste Qualität, CH-konform |
| **Payments** | Stripe | Standard, gute Integration |
| **E-Mail** | Resend | Transactional E-Mails, gute Deliverability |
| **SMS** | Twilio | Globale Abdeckung, WhatsApp |

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

---

*Letztes Update: Juni 2026*  
*Verantwortlich: Sebastian Oczachowski*  
*Version: 1.1*

**Änderungen gegenüber V1.0:**
- Phase 0 (Portal-Optimierung) hinzugefügt ✅
- Magic-Link Flow dokumentiert
- Neue Features im Überblick
- Strategische Überlegungen (Kapitel 10) hinzugefügt
- Preisstrategie aktualisiert (Portal in allen Plänen)
- Portal-Metriken in 7.1 hinzugefügt