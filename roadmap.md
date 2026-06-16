# iistelle — Roadmap zum Marktführer DACH

> Stand: Juni 2026
> Ziel: Bestes HR-Tool für Schweizer und deutsche Unternehmen
> Version: 1.1 (aktualisiert basierend auf Feature-Analyse)

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

### ✅ Dediziertes Mitarbeiterportal
- Eigenständige Portal-Route `/portal` für Mitarbeiter
- Getrennt vom Admin/HR-Bereich
- Mobile-optimiertes Design mit Sidebar
- Enthält: Zeiterfassung (Kommen/Gehen), Urlaubsplanung, Dokumente, Ziele
- Vorbereitet für zukünftige SSO/SAML-Erweiterungen
- Eigener Portal-Login unter `/portal-login`

---

## 1. Wettbewerbsanalyse

### 1.0 Bestandsaufnahme: Bereits implementierte Features (Juni 2026)

| Modul | Feature | Status |
|-------|---------|--------|
| **Recruiting** | Job-Portal & Kanban-View | ✅ Komplett |
| | Kandidaten-Verwaltung | ✅ Komplett |
| | Interview-Scheduling | ✅ Komplett |
| | E-Mail-Templates | ✅ Komplett |
| | Karriereseite | ✅ Komplett |
| **Mitarbeiter** | Mitarbeiter-Verwaltung | ✅ Komplett |
| | Onboarding/Offboarding Tasks | ✅ Komplett |
| | Organigramm | ✅ Komplett |
| | Skills-Management | ✅ Komplett |
| | Equipment/Inventar | ✅ Komplett |
| **Zeit** | Zeiterfassung mit CSV-Export | ✅ Komplett |
| **Abwesenheiten** | Urlaubs-Management | ✅ Komplett |
| | CH-Feiertage nach Kanton | ✅ Komplett |
| | Genehmigungs-Workflow | ✅ Komplett |
| **Performance** | Goals & OKRs | ✅ Komplett |
| | Review-Cycles | ✅ Komplett |
| | Peer-Feedback | ✅ Teilweise |
| **Dokumente** | Dokumenten-Management | ✅ Komplett |
| | Dokumenten-Generator | ✅ Komplett |
| **Reports** | Berichte-Dashboard | ✅ Komplett |
| **Compliance** | DSGVO-Center | ✅ Komplett |
| | Audit-Log | ✅ Komplett |
| **Integration** | Slack-Notifications | ✅ Komplett |
| **Öffentlich** | Help-Center | ✅ Komplett |
| | Rechner (Stundensatz) | ✅ Komplett |
| | Ratgeber-Artikel | ✅ Komplett |
| | Services-Seite | ✅ Komplett |
| **Abrechnung** | Plan-Verwaltung | ✅ Komplett |
| **Portal** | Mitarbeiter-Portal mit Zeiterfassung, Urlaub, Dokumenten | ✅ Komplett |

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

### Phase 1: Kern-Verbesserungen (Q3 2026) — Sofort umsetzen

> **Ziel:** Die bestehenden Features auf Marktniveau bringen und Schwächen eliminieren.

| # | Feature | Beschreibung | Aufwand | Priorität | Status |
|---|---------|--------------|---------|-----------|--------|
| 1.1 | **Mitarbeiter-Self-Service Portal** | Mitarbeiter können eigene Daten einsehen (Urlaub, Personalien, Dokumente), Abwesenheiten beantragen, Profil bearbeiten | Mittel | 🔴 Hoch | ✅ **NEU: `/portal`** |
| 1.2 | **Gleitzeit-Regelungen erweitert** | Flexible Arbeitszeiten, Kernarbeitszeiten, Gleitzeittoleranz | Mittel | 🔴 Hoch | ⚠️ Basis da |
| 1.3 | **360°-Feedback** | 360°-Feedback für Performance-Reviews | Mittel | 🔴 Hoch | ❌ Fehlt |
| 1.4 | **Dokumenten-Generator erweitert** | Erweiterte Templates für Verträge, Zeugnisse, Bescheinigungen | Mittel | 🟡 Mittel | ⚠️ Basis da |
| 1.5 | **Projekt-Zeiterfassung** | Zeitbuchungen auf Projekte/Kunden | Mittel | 🟡 Mittel | ❌ Fehlt |
| 1.6 | **API-Endpoints** | REST-API für Drittanbieter-Integrationen, Webhooks für Events | Hoch | 🟡 Mittel | ❌ Fehlt |
| 1.7 | **Kalender-Integration** | Kalender-Sync für Interviews, Abwesenheiten, Birthdays | Mittel | 🟡 Mittel | ❌ Fehlt |
| 1.8 | **Video-Interview Integration** | Zoom/Google Meet Integration für Interviews | Mittel | 🟡 Mittel | ❌ Fehlt |

### Phase 2: Differenzierung (Q4 2026) — Schweizer Alleinstellung

> **Ziel:** Einzigartige CH-spezifische Features, die kein Konkurrent bietet.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 2.1 | **CH-Payroll-Modul (Beta)** | Lohnabrechnung nach CH-Standard: AHV/IV/EO, ALV, BVG-Beiträge, Quellensteuer | Hoch | 🔴 Hoch |
| 2.2 | **Behörden-Meldungen** | SVA-Meldungen, Unfallversicherung-Meldungen (SUVA), Familienausgleichskasse (FAK) | Hoch | 🔴 Hoch |
| 2.3 | **Digitale Unterschrift** | Integration mit Skribble/Adobe Sign für Verträge und Dokumente | Mittel | 🟡 Mittel |
| 2.4 | **Lohnbenchmarking CH** | Anonyme Gehaltsvergleiche nach Branche/Region/Position (basierend auf realen Daten) | Mittel | 🟡 Mittel |
| 2.5 | **Lohngleichheits-Report** | Automatischer Report für Pay Equity Analysis (gesetzliche Anforderung) | Niedrig | 🔴 Hoch |
| 2.6 | **Kompetenz-Matrix** | Skills-Matrix über alle Mitarbeiter, Anforderungsprofile | Mittel | 🟡 Mittel |

### Phase 3: KI & Innovation (Q1 2027) — Technologievorsprung

> **Ziel:** Modernste Technologie einsetzen, die Effizienz massiv steigern.

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 3.1 | **KI-Lebenslauf-Analyse** | Automatische Extraktion von Skills, Erfahrung, Ausbildung aus CVs (PDF/Upload) | Hoch | 🔴 Hoch |
| 3.2 | **KI-Job-Matching** | Matching-Score zwischen Kandidaten und Stellenanforderungen | Hoch | 🔴 Hoch |
| 3.3 | **KI-Job Description Generator** | Automatische Erstellung von Stellenanzeigen basierend auf Titel/Anforderungen | Mittel | 🟡 Mittel |
| 3.4 | **KI-Interview-Coach** | Vorbereitungsfragen, Bewertungshilfen für Interviewer | Mittel | 🟡 Mittel |
| 3.5 | **Mitarbeiter-Chatbot** | FAQ für Mitarbeiter (Urlaubsanspruch, Richtlinien, Prozesse) | Mittel | 🟡 Mittel |
| 3.6 | **Predictive Analytics** | Fluktuationsrisiko-Score, Hiring-Forecast, Headcount-Planning | Hoch | 🟡 Mittel |
| 3.7 | **KI-gestützte Dokumentenerstellung** | Automatische Generierung von Arbeitszeugnissen, Vertragsentwürfen | Mittel | 🟡 Mittel |

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
| 4.7 | **Audit-Log Export & Compliance-Reports** | Export-Funktionen für Behörden, DSGVO-Reports | Niedrig | 🟡 Mittel |

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
| 5.8 | **Candidate Experience Portal** | Self-Service für Bewerber: Status verfolgen, Unterlagen hochladen | Mittel | 🟡 Mittel |

---

## 3. Funktionale Lücken-Analyse

### 3.1 Vergleich: iistelle vs. Wettbewerb (Stand Juni 2026)

| Kategorie | Feature | iistelle | Personio | Happeo | Lücke |
|-----------|---------|----------|----------|--------|-------|
| **Recruiting** | Job-Portal | ✅ | ✅ | ✅ | — |
| | KI-Candidate Matching | ❌ | ❌ | ❌ | Gap |
| | Bewerber-Tracking (ATS) | ✅ | ✅ | ✅ | — |
| | Interview-Scheduling | ✅ | ✅ | ✅ | — |
| | Karriereseite | ✅ | ✅ | ✅ | — |
| | E-Mail-Templates | ✅ | ✅ | ❌ | Differenzierung |
| | E-Mail-Tracking | ❌ | ✅ | ❌ | Klein |
| | Video-Interview Integration | ❌ | ✅ | ❌ | Klein |
| **Mitarbeiter** | Self-Service Portal | ❌ | ✅ | ✅ | **Gross** |
| | Organigramm | ✅ | ✅ | ✅ | — |
| | Skills-Management | ✅ | ✅ | ✅ | — |
| | Kompetenz-Matrix | ❌ | ✅ | ❌ | **Gross** |
| | Onboarding/Offboarding Tasks | ✅ | ✅ | ✅ | — |
| **Payroll** | Lohnabrechnung CH | ❌ | ❌ | ❌ | **Gross** |
| | AHV/IV/EO-Abwicklung | ❌ | ❌ | ❌ | **Gross** |
| | BVG-Verwaltung | ❌ | ❌ | ❌ | **Gross** |
| | Quellensteuer | ❌ | ❌ | ❌ | **Gross** |
| **Zeit** | Zeiterfassung | ✅ (basic) | ✅ | ✅ | — |
| | Projekt-Zeiterfassung | ❌ | ✅ | ❌ | Mittel |
| | GPS-Tracking | ❌ | ❌ | ❌ | — |
| **Abwesenheiten** | Urlaubs-Management | ✅ | ✅ | ✅ | — |
| | CH-Feiertage nach Kanton | ✅ | ❌ | ❌ | Differenzierung |
| | Kalender-Integration | ❌ | ✅ | ✅ | **Gross** |
| | Genehmigungs-Workflows | ✅ | ✅ | ✅ | — |
| **Performance** | Goals & OKRs | ✅ | ✅ | ✅ | — |
| | 360° Feedback | ❌ | ✅ | ✅ | **Gross** |
| | Kalibrierungs-Sessions | ❌ | ❌ | ❌ | — |
| | Peer-Feedback | ⚠️ Teilweise | ✅ | ✅ | Klein |
| | Leistungsberichte | ✅ | ✅ | ✅ | — |
| **Dokumente** | Digitaler Vertrag | ❌ | ✅ | ❌ | **Gross** |
| | Unterschrift | ❌ | ✅ | ❌ | **Gross** |
| | Dokumenten-Templates | ✅ | ✅ | ✅ | — |
| | Dokumenten-Generator | ✅ | ✅ | ❌ | Differenzierung |
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
| | Audit-Log | ✅ | ✅ | ✅ | — |
| | CH-Feiertage | ✅ | ❌ | ❌ | Differenzierung |
| **Lern & Entwicklung** | LMS | ❌ | ❌ | ✅ | **Gross** |
| | Schulungs-Tracker | ❌ | ✅ | ✅ | **Gross** |

### 3.2 Identifizierte Lücken mit höchstem Impact

Basierend auf der Analyse wurden folgende Lücken als prioritär identifiziert:

1. **Mitarbeiter-Self-Service Portal** — HR-Abteilung wird massiv entlastet
2. **Kompetenz-Matrix** — Strategische Personalplanung
3. **360°-Feedback** — Wichtiges Performance-Feature
4. **Kalender-Integration** — Benutzerfreundlichkeit
5. **REST API** — Enterprise-Anforderung für Integrationen
6. **CH-Payroll** — Grösster Pain Point im Schweizer HR-Markt

---

## 4. Technische Roadmap

### 4.1 Architektur-Verbesserungen

| Phase | Thema | Beschreibung | Priorität |
|-------|-------|--------------|-----------|
| T1 | **Performance-Optimierung** | Caching-Strategie, DB-Indizes, Lazy Loading, Image-Optimierung | 🔴 Hoch |
| T2 | **API-First Architektur** | RESTful API für alle Features, Webhook-Events, GraphQL für komplexe Queries | 🔴 Hoch |
| T3 | **Caching-Layer** | Redis für Sessions, häufige Queries, Echtzeit-Updates | 🟡 Mittel |
| T4 | **Event-Sourcing** | Audit-Log, History-Tracking, Time-Travel | 🟡 Mittel |
| T5 | **Microservices-Vorbereitung** | Payroll, Documents, Analytics als separate Services | 🟡 Mittel |
| T6 | **Edge Computing** | Statische Generation für öffentliche Seiten, Edge-Functions | 🟡 Mittel |

### 4.2 Security & Compliance

| Phase | Thema | Beschreibung | Priorität |
|-------|-------|--------------|-----------|
| S1 | **SOC 2 Type II** | Sicherheits-Zertifizierung (Enterprise-Anforderung) | 🟡 Mittel |
| S2 | **ISO 27001** | Informationssicherheits-Managementsystem | 🟡 Mittel |
| S3 | **Penetration Testing** | Jährliches Security Audit | 🟡 Mittel |
| S4 | **Advanced RBAC** | Feature-Level Berechtigungen, Audit-Log Export | 🔴 Hoch |
| S5 | **Encryption at Rest** | Alle Daten verschlüsselt speichern | 🟡 Mittel |
| S6 | **2FA / MFA** | Multi-Faktor-Authentifizierung | 🔴 Hoch |

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

### 5.2 Preisstrategie (aktualisiert)

| Plan | Preis (CHF/Monat) | Features | Zielgruppe |
|------|-------------------|----------|------------|
| **Starter** | 149 | Recruiting, Mitarbeiter (max 10), Zeiterfassung Basic, Abwesenheiten | Startups, kleine Agenturen |
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

## 6. Neue strategische Initiativen (basierend auf Feature-Analyse)

### 6.1 Quick Wins — Schnelle Verbesserungen mit hohem Impact

| Feature | Beschreibung | Aufwand | Warum wichtig |
|---------|--------------|---------|--------------|
| **Me-/Seite erweitern** | Mitarbeiter-Self-Service Basis schaffen | Niedrig | Entlastet HR massiv |
| **E-Mail-Tracking** | Öffnungs- und Klick-Tracking für Recruiting-Mails | Niedrig | Differenzierung zu Mitbewerbern |
| **Automatisierte E-Mail-Sequenzen** | Follow-up E-Mails automatisch senden | Mittel | Candidate Experience verbessern |
| **Dashboard-Widgets** | Personalisierte Dashboards für verschiedene Rollen | Niedrig | Benutzerfreundlichkeit |
| **Quick-Actions** | Schnellaktionen für häufige Tasks | Niedrig | Effizienz |

### 6.2 Differenzierungs-Initiativen — Einzigartige CH-Vorteile

| Initiative | Beschreibung | Wettbewerbsvorteil |
|------------|--------------|---------------------|
| **CH-Payroll First** | Payroll als erstes CH-spezifisches Modul priorisieren | Einziges HR-Tool mit nativem CH-Payroll |
| **Behörden-Connector** | Direkte Schnittstelle zu SVA, SUVA, FAK | Eliminiert manuellen Aufwand |
| **Quellensteuer-Rechner** | Integrierter Quellensteuer-Rechner | Einzigartig im Markt |
| **BVG-Verwaltung** | Pensionskassen-Verwaltung direkt im Tool | Komplette HR-Abdeckung |
| **CH-Report-Generator** | Automatische CH-spezifische Reports (AHV, BVG, Quellensteuer) | Compliance-Vorteil |

### 6.3 Benutzerfreundlichkeit — UX-Verbesserungen

| Initiative | Beschreibung |
|------------|--------------|
| **Onboarding-Flow** | Schritt-für-Schritt-Anleitung für neue Benutzer |
| **Tooltips & Walkthroughs** | Kontextbezogene Hilfestellung |
| **Keyboard-Shortcuts** | Power-User Effizienz |
| **Bulk-Aktionen** | Massenoperationen für Kandidaten, Mitarbeiter |
| **Favoriten** | Schnellzugriff auf häufig genutzte Seiten |
| **Dark Mode** | Augenfreundlicher Modus |
| **Responsive Mobile** | Optimierte mobile Ansicht (vor nativer App) |

---

## 7. Priorisierte Umsetzungsreihenfolge

### Empfohlene Reihenfolge (nach Impact & Effort)

```
Phase 1 (Q3 2026):
├── 1.1 Mitarbeiter-Self-Service Portal          [Impact: Hoch, Effort: Mittel]
├── 1.3 360°-Feedback                            [Impact: Hoch, Effort: Mittel]
├── 1.8 Kalender-Integration                     [Impact: Mittel, Effort: Mittel]
├── 1.4 Dokumenten-Generator erweitern           [Impact: Mittel, Effort: Niedrig]
└── 1.6 API-Endpoints                            [Impact: Hoch, Effort: Hoch]

Phase 2 (Q4 2026):
├── 2.5 Lohngleichheits-Report                   [Impact: Hoch, Effort: Niedrig]
├── 2.3 Digitale Unterschrift                    [Impact: Mittel, Effort: Mittel]
├── 2.6 Kompetenz-Matrix                         [Impact: Mittel, Effort: Mittel]
├── 2.1 CH-Payroll-Modul (Beta)                  [Impact: Hoch, Effort: Hoch]
└── 2.2 Behörden-Meldungen                       [Impact: Hoch, Effort: Hoch]

Phase 3 (Q1 2027):
├── 3.1 KI-Lebenslauf-Analyse                    [Impact: Hoch, Effort: Hoch]
├── 3.2 KI-Job-Matching                          [Impact: Hoch, Effort: Hoch]
├── 3.3 KI-Job Description Generator             [Impact: Mittel, Effort: Mittel]
└── 3.5 Mitarbeiter-Chatbot                      [Impact: Mittel, Effort: Mittel]

Phase 4 (Q2 2027):
├── 4.2 SSO / SAML                               [Impact: Hoch, Effort: Mittel]
├── 4.3 Erweiterte RBAC                          [Impact: Hoch, Effort: Mittel]
├── 4.1 Multi-Company-Support                    [Impact: Mittel, Effort: Hoch]
└── S6 2FA / MFA                                 [Impact: Hoch, Effort: Mittel]

Phase 5 (Q3-Q4 2027):
├── 5.6 Mobile App                               [Impact: Hoch, Effort: Hoch]
├── 5.1 App Marketplace                          [Impact: Hoch, Effort: Hoch]
└── 5.2 LMS                                      [Impact: Mittel, Effort: Hoch]
```

### Quick Wins Reihenfolge (1-2 Wochen pro Feature)

1. **Dashboard personalisieren** — Anpassbare Widgets
2. **Bulk-Aktionen** — Massenoperationen für Recruiting
3. **E-Mail-Tracking** — Öffnungs-Tracking für Bewerber-Mails
4. **Tooltips & Hilfetexte** — Kontextbezogene Hilfe
5. **Quick-Actions** — Schnellaktionen in der Sidebar
6. **Dark Mode** — Theme-Switcher
7. **Keyboard-Shortcuts** — Alt+1 für Navigation, etc.

---

## 8. Metriken & Erfolgskriterien

### 8.1 Produkt-Metriken

| Metrik | Ziel (12 Monate) | Ziel (24 Monate) |
|--------|------------------|------------------|
| **NPS Score** | > 40 | > 60 |
| **Feature Adoption Rate** | > 60% Features genutzt | > 80% Features genutzt |
| **Time-to-Value** | < 2 Stunden | < 30 Minuten |
| **Support Response Time** | < 4 Stunden | < 1 Stunde |
| **System Uptime** | > 99.5% | > 99.9% |

### 8.2 Geschäfts-Metriken

| Metrik | Ziel (12 Monate) | Ziel (24 Monate) |
|--------|------------------|------------------|
| **Kunden** | 100 aktive Kunden | 500 aktive Kunden |
| **MRR** | CHF 50'000 | CHF 200'000 |
| **Logo Retention** | > 90% | > 95% |
| **Net Revenue Retention** | > 100% | > 120% |
| **Enterprise Deals** | 5 | 20 |

---

## 9. Risiken & Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigationsstrategie |
|--------|-------------------|--------|---------------------|
| CH-Payroll zu komplex | Mittel | Hoch | Partner mit bestehendem Payroll-Anbieter, keine Eigenentwicklung |
| KI-Qualität nicht ausreichend | Mittel | Mittel | Iterative Entwicklung, User Feedback, humane Fallbacks |
| Enterprise Sales Zyklus zu lang | Hoch | Mittel | Enterprise-ready Features priorisieren, dedizierter Sales |
| Wettbewerber holt auf | Mittel | Mittel | Kontinuierliche Innovation, CH-First Strategie |
| Datenmigration bei Payroll | Hoch | Hoch | Sanfte Migration, Parallelphasen, Partner-Support |
| Maintenance-Kosten steigen | Mittel | Mittel | Automatisierte Tests, CI/CD Pipeline |
| Feature-Creep | Hoch | Mittel | Klare Priorisierung, MVP-First Ansatz |

---

## 10. Nächste Schritte

### Sofort (diese Woche):
1. [x] **Bestandsaufnahme** — Analyse der bereits implementierten Features
2. [x] **Roadmap aktualisiert** — Neue strategische Initiativen ergänzt
3. [ ] **Quick Wins identifizieren** — Top 3 Features für sofortige Umsetzung wählen

### Nächster Sprint (2 Wochen):
1. [ ] **Dashboard personalisieren** — Anpassbare Widgets implementieren
2. [ ] **Bulk-Aktionen** — Massenoperationen für Kandidaten/Mitarbeiter
3. [ ] **E-Mail-Tracking** — Öffnungs-Tracking für Recruiting-Mails

### Nächster Monat:
1. [ ] **Mitarbeiter-Self-Service Portal** — MVP-Entwicklung
2. [ ] **360°-Feedback** — Feature-Definition und Basis-Implementierung
3. [ ] **Kalender-Integration** — Google Calendar / Outlook Sync

---

*Letztes Update: Juni 2026*  
*Verantwortlich: Sebastian Oczachowski*  
*Version: 1.1*

---

## 8. Risiken & Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigationsstrategie |
|--------|-------------------|--------|---------------------|
| CH-Payroll zu komplex | Mittel | Hoch | Partner mit bestehendem Payroll-Anbieter, keine Eigenentwicklung |
| KI-Qualität nicht ausreichend | Mittel | Mittel | Iterative Entwicklung, User Feedback, humaine Fallbacks |
| Enterprise Sales Zyklus zu lang | Hoch | Mittel | Enterprise-ready Features priorisieren, dedizierter Sales |
| Wettbewerber holt auf | Mittel | Mittel | Kontinuierliche Innovation, CH-First Strategie |
| Datenmigration bei Payroll | Hoch | Hoch | Sanfte Migration, Parallelphasen, Partner-Support |

---

## 9. Nächste Schritte

### Sofort (diese Woche):
1. [ ] **Self-Service Portal** — Konzept ausarbeiten, User Stories schreiben
2. [ ] **Audit-Log Erweiterung** — Anforderungen definieren
3. [ ] **Lohngleichheits-Report** — Research CH-Gesetzgebung

### Nächster Sprint (2 Wochen):
1. [ ] **Self-Service Portal** — Erste Implementierung
2. [ ] **CH-Feiertags-Engine** — Basis-Implementierung
3. [ ] **Zeiterfassung-Verbesserung** — Feature-Liste erstellen

### Nächster Monat:
1. [ ] **Phase 1 Features** — MVP-Entwicklung
2. [ ] **Payroll-Partner** — Gespräche starten
3. [ ] **KI-Provider** — Evaluation für CV-Analyse

---

*Letztes Update: Juni 2026*  
*Verantwortlich: Sebastian Oczachowski*  
*Version: 1.0*