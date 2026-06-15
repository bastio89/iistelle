# iistelle HR — Roadmap zum Marktführer DACH

> Stand: Juni 2026
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

| # | Feature | Beschreibung | Aufwand | Priorität |
|---|---------|--------------|---------|-----------|
| 1.1 | **Mitarbeiter-Self-Service Portal** | Mitarbeiter können eigene Daten einsehen (Urlaub, Personalien, Dokumente), Abwesenheiten beantragen, Profil bearbeiten | Mittel | 🔴 Hoch |
| 1.2 | **Verlängerte Zeiterfassung** | Fehlende Features: Gleitzeit, Überstundenerfassung, Export, Pausen-Tracker, Genehmigungs-Workflow | Mittel | 🔴 Hoch |
| 1.3 | **Erweiterte Performance-Reviews** | 360°-Feedback, automatisierte Review-Zyklen, Zielverknüpfung, Kalibrierungs-Sessions | Mittel | 🔴 Hoch |
| 1.4 | **Dokumenten-Generator** | Verträge, Zeugnisse, Bescheinigungen aus Templates generieren | Mittel | 🟡 Mittel |
| 1.5 | **Audit-Log Erweiterung** | Vollständiges Audit-Trail für alle HR-Aktionen (DSGVO-Compliance) | Niedrig | 🔴 Hoch |
| 1.6 | **API-Endpoints** | REST-API für Drittanbieter-Integrationen, Webhooks für Events | Hoch | 🟡 Mittel |

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
| **Mitarbeiter** | Self-Service Portal | ❌ | ✅ | ✅ | **Gross** |
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

## 6. Priorisierte Umsetzungsreihenfolge

### Empfohlene Reihenfolge (nach Impact & Effort)

```
Phase 1 (Q3 2026):
├── 1.1 Mitarbeiter-Self-Service Portal          [Impact: Hoch, Effort: Mittel]
├── 1.5 Audit-Log Erweiterung                    [Impact: Hoch, Effort: Niedrig]
├── 1.2 Zeiterfassung-Verbesserung               [Impact: Hoch, Effort: Mittel]
└── 1.3 Performance-Reviews erweitern            [Impact: Hoch, Effort: Mittel]

Phase 2 (Q4 2026):
├── 2.5 Lohngleichheits-Report                   [Impact: Hoch, Effort: Niedrig]
├── 2.3 Digitale Unterschrift                    [Impact: Mittel, Effort: Mittel]
├── 2.6 CH-Feiertags-Engine                      [Impact: Mittel, Effort: Niedrig]
└── 2.1 CH-Payroll-Modul (Beta)                  [Impact: Hoch, Effort: Hoch]

Phase 3 (Q1 2027):
├── 3.1 KI-Lebenslauf-Analyse                    [Impact: Hoch, Effort: Hoch]
├── 3.2 KI-Job-Matching                          [Impact: Hoch, Effort: Hoch]
└── 3.3 KI-Job Description Generator             [Impact: Mittel, Effort: Mittel]

Phase 4 (Q2 2027):
├── 4.2 SSO / SAML                               [Impact: Hoch, Effort: Mittel]
├── 4.3 Erweiterte RBAC                          [Impact: Hoch, Effort: Mittel]
└── 4.1 Multi-Company-Support                    [Impact: Mittel, Effort: Hoch]

Phase 5 (Q3-Q4 2027):
├── 5.6 Mobile App                               [Impact: Hoch, Effort: Hoch]
├── 5.1 App Marketplace                          [Impact: Hoch, Effort: Hoch]
└── 5.2 LMS                                      [Impact: Mittel, Effort: Hoch]
```

---

## 7. Metriken & Erfolgskriterien

### 7.1 Produkt-Metriken

| Metrik | Ziel (12 Monate) | Ziel (24 Monate) |
|--------|------------------|------------------|
| **NPS Score** | > 40 | > 60 |
| **Feature Adoption Rate** | > 60% Features genutzt | > 80% Features genutzt |
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