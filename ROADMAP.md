# iistelle – Produkt-Roadmap

> **Vision:** Das beste HR-Tool der Schweiz – für Personalverantwortliche, die Effizienz, Compliance und Menschlichkeit vereinen wollen.

---

## 📊 Wettbewerbsanalyse Schweiz (Juni 2026)

### Hauptkonkurrenten
| Tool | Stärken | Schwächen | Preisregion |
|------|---------|-----------|-------------|
| **SAP SuccessFactors** | Globale Lösung, tief integriert, umfangreiches Modul-Ökosystem | Teuer (ab CHF 200/Mitarbeiter/Monat), komplexe Implementierung, überdimensioniert für KMU | Enterprise |
| **Workday** | Modernes UX, starke Analytics, globale Skalierung | Sehr teuer, langsame Implementierung, primär für Konzerne | Enterprise |
| **Sage HR** | Günstig, einfach, gute Zeiterfassung | Kaum Swiss-Features, begrenzte Features, kein tiefes Onboarding | CHF 8–15/Mitarbeiter |
| **Personio** | Deutschlands Marktführer, breite Features, gute Usability | Primär DE-Markt, kein echtes CH-Know-how, teuer für KMU | CHF 8–25/Mitarbeiter |
| **Kenjo** | Modern, günstig, auf CH spezialisiert | Weniger tief in HR-Prozessen, noch wachsend | CHF 6–15/Mitarbeiter |
| **Fast HR** | Schweizer Anbieter, Lohnbuchhaltung + HR integriert | Älteres UI, weniger modern, weniger Module | CHF 12–20/Mitarbeiter |
| **Abacus** | Schweizer ERP mit Lohnmodul, tief integriert | Kein reines HR-Tool, ERP-Fokus, komplex | CHF 15–40/Mitarbeiter |
| **Klara HR** | Schweizer Start-up, sehr modern, gute UX | Noch begrenzte Features, junges Produkt | CHF 10–18/Mitarbeiter |

### Marktpositionierung iistelle
✅ **Differenziatoren bereits vorhanden:**
- Schweizer Feiertage pro Kanton
- DSGVO-konform (CH-konform)
- Moderne, intuitive UI
- Integrierte Zeiterfassung
- 360° Performance Reviews
- Dokumenten-Generator
- REST API für Drittintegrationen

🎯 **Chancen für Marktführerschaft:**
- **KI-gestützte Automatisierung** (kein Konkurrent hat das wirklich)
- **Self-Service Portal** für Mitarbeiter (erhöht Nutzen massiv)
- **Mobile App** (kaum jemand hat das gut)
- **Integrations-Ökosystem** (besser als Personio)
- **Branchenspezifische Features** (IT, Pharma, Bau, Gesundheit)

---

## 🗺️ Roadmap 2026–2027

### Phase 1: Fundament & Differenzierung ✅
**Status:** Abgeschlossen (Q1 2026)

- [x] Mitarbeiter-Verwaltung mit vollständigem Profil
- [x] Abwesenheitsmanagement (Urlaub, Krankheit)
- [x] Zeiterfassung (Stempeluhr-Funktion)
- [x] Recruiting-Pipeline (Stellen, Kandidaten, Interviews)
- [x] Performance Reviews (360° Feedback, Zyklen)
- [x] Dokumenten-Generator (Verträge, Zeugnisse)
- [x] Audit-Log
- [x] Schweizer Feiertage pro Kanton
- [x] REST API Endpoints

---

### Phase 2: Employee Self-Service & Mobile (Q3 2026) 🔥
**Status:** Nächste Priorität

#### 2.1 Mitarbeiter-Self-Service Portal
- [ ] **Persönliches Dashboard** für Mitarbeiter
  - Eigenes Profil einsehen und bearbeiten
  - Urlaub beantragen und Status prüfen
  - Gearbeitete Stunden einsehen
  - Anstehende Reviews sehen
  - Dokumente herunterladen
- [ ] **Meine Daten** – Eigenständige Aktualisierung von:
  - Kontaktdaten (E-Mail, Telefon)
  - Notfallkontakt
  - Bankverbindung
  - Skills/Fähigkeiten
- [ ] **Zeiterfassung Self-Service**
  - Stempeln via Web/App
  - Korrekturen beantragen
  - Monatsübersicht einsehen
  - Gleitzeitkonto anzeigen
- [ ] **Urlaubsantrag Self-Service**
  - Antrag mit Kalenderauswahl
  - Vertretung definieren
  - Status verfolgen
  - Vorgesetzten-Benachrichtigung

#### 2.2 Mobile App (React Native)
- [ ] **iOS App** (App Store)
- [ ] **Android App** (Play Store)
- [ ] Kernfunktionen Mobile:
  - Zeiterfassung (Clock In/Out)
  - Urlaubsantrag
  - Profil einsehen
  - Push-Benachrichtigungen (Urlaub genehmigt, Birthday, etc.)
  - Dokumentenansicht

#### 2.3 Manager-App
- [ ] **Team-Übersicht** unterwegs
- [ ] **Urlaubsgesuche genehmigen/ablehnen**
- [ ] **Timesheets prüfen**
- [ ] **Teampersonaldaten einsehen**

---

### Phase 3: Intelligente Automation (Q4 2026) 🤖
**Status:** Geplant

#### 3.1 Workflow-Engine
- [ ] **Visueller Workflow-Builder**
  - Drag & Drop Trigger
  - Bedingte Verzweigungen
  - Genehmigungsflüsse konfigurieren
- [ ] **Vordefinierte Workflows**
  - Urlaubsantrag → Genehmigung → Kalender-Update → Benachrichtigung
  - Onboarding-Workflow (automatische Task-Erstellung)
  - Offboarding-Workflow (automatische Deaktivierung)
  - Probezeit-Erinnerungen
  - Geburtstagsgrüsse

#### 3.2 KI-gestützte Features
- [ ] **Recruiting AI**
  - Lebenslauf-Zusammenfassung (automatisch)
  - Match-Score gegen Stellenanforderungen
  - KI-generierte Interview-Fragen
  - Stimmungserkennung aus Feedback
- [ ] **Smart Analytics**
  - Fluktuationsvorhersage
  - Burnout-Risiko-Erkennung (basierend auf Zeiterfassung)
  - Empfehlungen für Personalplanung
- [ ] **Intelligente Dokumentenerstellung**
  - Variablen-basierte Templates
  - Automatische Befüllung aus Mitarbeiterdaten
  - KI-gestützte Zeugnis-Texte

#### 3.3 Automatische Benachrichtigungen
- [ ] **Slack/Teams Integration**
- [ ] **E-Mail Automatisierung**
- [ ] **WhatsApp/SMS für kritische Alerts**
- [ ] **Kalender-Sync** (Google Calendar, Outlook)

---

### Phase 4: Compliance & Security (Q1 2027) 🔒
**Status:** Geplant

#### 4.1 Erweiterte DSGVO/CH-Features
- [ ] **Datenlöschungsanfragen** (Art. 17 DSGVO)
- [ ] **Einwilligungsmanagement** (Cookie Banner, Datenverarbeitung)
- [ ] **Export-Tool** für Mitarbeiterdaten
- [ ] **Verarbeitungsverzeichnis** (Art. 30 DSGVO)
- [ ] **Datenschutz-Folgenabschätzung** (DPIA)

#### 4.2 Audit & Compliance
- [ ] **Erweiterter Audit-Trail** mit Filter
- [ ] **Compliance-Reports** für Geschäftsleitung
- [ ] **ISO 27001 Readiness** Module
- [ ] **Branchenspezifische Compliance**
  - FINMA-Anforderungen (Banken)
  - FDA-konforme Dokumentation (Pharma)
  - SUVA-konforme Arbeitssicherheit (Bau)

#### 4.3 Sicherheits-Features
- [ ] **Single Sign-On (SSO)** – SAML, OIDC
- [ ] **2-Faktor-Authentifizierung**
- [ ] **IP-Based Zugriffsbeschränkung**
- [ ] **Session-Management**
- [ ] **Verschlüsselte Datenbank-Backups**

---

### Phase 5: Ecosystem & Integrationen (Q2 2027) 🔌
**Status:** Geplant

#### 5.1 Integration Hub
- [ ] **REST API erweitern**
  - Webhooks für Events
  - Batch-Import/Export
  - GraphQL Alternative
- [ ] **Native Integrationen**
  - Google Workspace
  - Microsoft 365
  - Slack / Microsoft Teams
  - Xero / Sage / Abacus (Lohnbuchhaltung)
  - BambooHR Import
  - Personio Import

#### 5.2 Marketplace
- [ ] **Partner-Apps** (offene Plattform)
- [ ] **Template-Bibliothek** für Workflows
- [ ] **Custom Fields SDK**

#### 5.3 Power-Ups
- [ ] **OrgChart Export** (Visio, Lucidchart)
- [ ] **OrgChart Animations** (Zeitraffer bei Änderungen)
- [ ] **Mitarbeiter-Benefits Portal** (Beteiligung an Versicherungen, Gym, etc.)

---

### Phase 6: Advanced Analytics & BI (Q2–Q3 2027) 📈
**Status:** Geplant

#### 6.1 Dashboard Builder
- [ ] **Customizable Dashboards**
  - Drag & Drop Widgets
  - KPI-Konfiguration
  - Farben und Branding
- [ ] **Vorgefertigte Dashboards**
  - CEO-Dashboard (High-Level)
  - HR-Manager Dashboard
  - Recruiting Dashboard
  - Finance Dashboard (Personalkosten)

#### 6.2 Deep Analytics
- [ ] **Predictive People Analytics**
  - Fluktuationsvorhersage
  - Nachfolgeplanung
  - Talent-Pipeline-Analyse
- [ ] **Benchmarking** (anonymisiert, CH-weit)
- [ ] **Sentiment Analysis** aus Feedbacks

#### 6.3 Reporting
- [ ] **PDF/Excel Reports** on-demand
- [ ] **Scheduled Reports** per E-Mail
- [ ] **Live Embedding** in externe Portale

---

### Phase 7: Skalierung & Enterprise (Q3–Q4 2027) 🚀
**Status:** Geplant

#### 7.1 Multi-Company / Konzerne
- [ ] **Mutter-Tochter-Struktur**
- [ ] **Globale Policies** mit lokalen Anpassungen
- [ ] **Konzernweites Reporting**
- [ ] **Zentrales Talent Pool**

#### 7.2 Self-Onboarding
- [ ] **Digitaler Vertrag** (Signatur)
- [ ] **Automatisierter Onboarding-Flow**
- [ ] **Buddy-System** mit Matching
- [ ] **Gamification** für Onboarding

#### 7.3 Skalierung
- [ ] **Multi-Tenant Architektur** (Performance)
- [ ] **CDN & Caching** für globale Verfügbarkeit
- [ ] **Read-Replicas** für Reporting

---

## 📋 Priorisierte Features nach Wert

### Quick Wins (1–2 Wochen)
| Feature | Aufwand | Impact | Konkurrenz hat das |
|---------|---------|--------|-------------------|
| E-Mail-Benachrichtigungen bei Urlaubsantrag | 1 Woche | ⭐⭐⭐⭐ | ✅ Personio, Sage |
| Vorgesetzten-Genehmigung für Überstunden | 1 Woche | ⭐⭐⭐⭐ | ❌ |
| Mitarbeiter-Geburtstags-Kalender | 2 Tage | ⭐⭐⭐ | ❌ |
| Company News / Feed | 1 Woche | ⭐⭐⭐⭐ | ✅ Personio |
| OrgChart mit Abteilungsfotos | 1 Woche | ⭐⭐⭐⭐ | ✅ Personio |

### Must-Haves (2–4 Wochen)
| Feature | Aufwand | Impact | Konkurrenz hat das |
|---------|---------|--------|-------------------|
| **Self-Service Portal** | 4 Wochen | ⭐⭐⭐⭐⭐ | ✅ Personio, Kenjo |
| **Urlaubstage-Kalender** (Team-Sicht) | 2 Wochen | ⭐⭐⭐⭐ | ✅ Personio |
| **API Webhooks** | 2 Wochen | ⭐⭐⭐⭐ | ❌ |
| **Excel Import/Export** | 1 Woche | ⭐⭐⭐ | ✅ alle |
| **Kündigungsfristen-Rechner** | 1 Woche | ⭐⭐⭐ | ❌ |

### Differentiators (4–8 Wochen)
| Feature | Aufwand | Impact | Konkurrenz hat das |
|---------|---------|--------|-------------------|
| **KI-Lebenslauf-Analyse** | 6 Wochen | ⭐⭐⭐⭐⭐ | ❌ (kaum jemand) |
| **Predictive Turnover** | 8 Wochen | ⭐⭐⭐⭐⭐ | ❌ |
| **Slack Integration** | 4 Wochen | ⭐⭐⭐⭐ | ✅ Personio |
| **Branchen-Templates** (IT, Pharma, Bau) | 4 Wochen | ⭐⭐⭐⭐ | ❌ |
| **Smart Goals (OKR)** | 6 Wochen | ⭐⭐⭐⭐ | ✅ |

---

## 🎯 OKRs für 2026

### O1: Marktführerschaft in der Schweiz etablieren
- **KR1:** 500 aktive Unternehmen bis Ende 2026
- **KR2:** NPS Score ≥ 50
- **KR3:** Top 3 Suchergebnisse für "HR Software Schweiz"

### O2: Produkt-Performance optimieren
- **KR1:** Page Load Time < 2 Sekunden
- **KR2:** 99.9% Uptime
- **KR3:** Mobile Nutzung ≥ 30% aller Sessions

### O3: Enterprise-Readiness
- **KR1:** SSO Integration (Okta, Azure AD)
- **KR2:** 5 Unternehmenskunden mit 100+ Mitarbeitern
- **KR3:** DSGVO-Audit bestanden

---

## 📝 Changelog

### Version 1.0 (Q1 2026) ✅
- Basis-HR-Funktionen
- Recruiting
- Zeiterfassung
- Performance Reviews
- Dokumenten-Generator
- Schweizer Feiertage

### Version 1.1 (Q2 2026) 🔄
- [ ] Audit-Log Erweiterungen
- [ ] API Webhooks
- [ ] Quick Win Features (siehe oben)

### Version 1.2 (Q3 2026) 📋
- [ ] Self-Service Portal
- [ ] Mobile App Beta

### Version 2.0 (Q4 2026) 📋
- [ ] KI-Features
- [ ] Workflow Engine
- [ ] Advanced Analytics

---

## 💡 Anmerkungen

- **Branchenschwerpunkt:** Für die Schweiz besonders relevant sind die Branchen Pharma, Banken/Fintech, IT und Bau. Branchenspezifische Features sind ein echter Differentiator.
- **Preisstrategie:** Gegenüber Personio (ab CHF 8) und Kenjo (ab CHF 6) kann iistelle mit besserer Usability und mehr Features punkten. Enterprise-Preise erst ab CHF 15+.
- **KI-Vorsprung:** Keiner der Konkurrenten hat echte KI-Integration. Das ist die Chance, als erster "AI-native HR Tool CH" positioniert zu werden.
- **Support:** Schweizer Kunden erwarten Schweizer Support (Deutsch, Französisch, Italienisch). Das ist ein klarer Vorteil gegenüber Personio DE oder Workday.

---

*Zuletzt aktualisiert: Juni 2026*
*Verantwortlich: Sebastian Oczachowski*