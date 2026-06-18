"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, ChevronRight, BookOpen, Calculator, Users, FileText, Calendar, Clock, Shield, Settings, Mail, Phone, MessageCircle, ExternalLink, ArrowRight, Sparkles, Zap } from "lucide-react";
import { ServiceDropdown } from "@/components/ServiceDropdown";

const categories = [
  { id: "all", label: "Alle" },
  { id: "start", label: "Erste Schritte" },
  { id: "recruiting", label: "Recruiting" },
  { id: "personalakte", label: "Personalakte" },
  { id: "abwesenheiten", label: "Abwesenheiten" },
  { id: "performance", label: "Performance" },
  { id: "zeiterfassung", label: "Zeiterfassung" },
  { id: "faq", label: "FAQ" },
];

const articles = [
  {
    id: "start-1",
    category: "start",
    title: "Schnellstart: iistelle in 5 Minuten einrichten",
    excerpt: "Von der Registration bis zum ersten Mitarbeiter – in fünf Minuten einsatzbereit.",
    icon: Zap,
    readTime: "3 Min.",
    featured: true,
  },
  {
    id: "start-2",
    category: "start",
    title: "Mitarbeiter einladen und Rollen zuweisen",
    excerpt: "So lädst du dein Team ein und vergibst Berechtigungen.",
    icon: Users,
    readTime: "2 Min.",
  },
  {
    id: "start-3",
    category: "start",
    title: "Dein erstes Onboarding planen",
    excerpt: "Mit Checklisten und Vorlagen den Onboarding-Prozess strukturieren.",
    icon: FileText,
    readTime: "4 Min.",
  },
  {
    id: "recruiting-1",
    category: "recruiting",
    title: "Die perfekte Stellenanzeige erstellen",
    excerpt: "Tipps für ansprechende Stellenanzeigen, die qualifizierte Kandidaten anziehen.",
    icon: FileText,
    readTime: "5 Min.",
    featured: true,
  },
  {
    id: "recruiting-2",
    category: "recruiting",
    title: "Bewerber-Pipeline effektiv nutzen",
    excerpt: "Drag & Drop, Status ändern, Notizen hinterlegen – so navigierst du durch deine Pipeline.",
    icon: Users,
    readTime: "3 Min.",
  },
  {
    id: "recruiting-3",
    category: "recruiting",
    title: "Feedback von Interviewern sammeln",
    excerpt: "Strukturiertes Feedback nach jedem Interview – für bessere Entscheidungen.",
    icon: MessageCircle,
    readTime: "3 Min.",
  },
  {
    id: "recruiting-4",
    category: "recruiting",
    title: "Eigene Karriereseite einrichten",
    excerpt: "Deine personalisierte Karriereseite – ohne technisches Wissen.",
    icon: ExternalLink,
    readTime: "2 Min.",
  },
  {
    id: "personalakte-1",
    category: "personalakte",
    title: "Personalakte anlegen und verwalten",
    excerpt: "Alle wichtigen Daten eines Mitarbeiters an einem Ort.",
    icon: FileText,
    readTime: "4 Min.",
    featured: true,
  },
  {
    id: "personalakte-2",
    category: "personalakte",
    title: "Verträge hochladen und organisieren",
    excerpt: "Dokumente sicher ablegen und jederzeit abrufen.",
    icon: FileText,
    readTime: "2 Min.",
  },
  {
    id: "personalakte-3",
    category: "personalakte",
    title: "Gehaltsdaten pflegen (Professional)",
    excerpt: "Vergütung, Boni und Lohnänderungen dokumentieren.",
    icon: Users,
    readTime: "3 Min.",
  },
  {
    id: "abwesenheiten-1",
    category: "abwesenheiten",
    title: "Urlaubsantrag stellen und genehmigen",
    excerpt: "So einfach war Urlaub nie: anfragen, genehmigen, fertig.",
    icon: Calendar,
    readTime: "2 Min.",
    featured: true,
  },
  {
    id: "abwesenheiten-2",
    category: "abwesenheiten",
    title: "Feiertage und Ferien planen",
    excerpt: "Automatische Feiertagsberechnung für CH, DE und AT.",
    icon: Calendar,
    readTime: "2 Min.",
  },
  {
    id: "abwesenheiten-3",
    category: "abwesenheiten",
    title: "Resturlaub übertragen",
    excerpt: "Wie du Resturlaub ins neue Jahr überträgst.",
    icon: Calendar,
    readTime: "2 Min.",
  },
  {
    id: "performance-1",
    category: "performance",
    title: "Ziele setzen und verfolgen",
    excerpt: "OKRs oder individuelle Ziele – für jedes Team denkbar.",
    icon: Settings,
    readTime: "4 Min.",
    featured: true,
  },
  {
    id: "performance-2",
    category: "performance",
    title: "360°-Feedback durchführen",
    excerpt: "Feedback von allen Seiten – für echte Entwicklung.",
    icon: MessageCircle,
    readTime: "5 Min.",
  },
  {
    id: "performance-3",
    category: "performance",
    title: "Feedbackgespräch vorbereiten",
    excerpt: "Strukturierte Gespräche für produktives Feedback.",
    icon: MessageCircle,
    readTime: "3 Min.",
  },
  {
    id: "zeiterfassung-1",
    category: "zeiterfassung",
    title: "Ein- und Ausstempeln",
    excerpt: "Zeiterfassung direkt im Browser – ohne额外 Hardware.",
    icon: Clock,
    readTime: "2 Min.",
    featured: true,
  },
  {
    id: "zeiterfassung-2",
    category: "zeiterfassung",
    title: "Monatsübersicht und Berichte",
    excerpt: "Arbeitszeiten auswerten und CSV exportieren.",
    icon: FileText,
    readTime: "3 Min.",
  },
  {
    id: "faq-1",
    category: "faq",
    title: "Wie sicher sind meine Daten?",
    excerpt: "DSGVO, Serverstandort, Backup-Strategie – alles erklärt.",
    icon: Shield,
    readTime: "3 Min.",
  },
  {
    id: "faq-2",
    category: "faq",
    title: "Kann ich kostenlos kündigen?",
    excerpt: "Monatliche Kündigung, Datenexport, was passiert mit meinen Daten.",
    icon: Settings,
    readTime: "2 Min.",
  },
  {
    id: "faq-3",
    category: "faq",
    title: "Welche Länder werden unterstützt?",
    excerpt: "Feiertage, Feiertage, Währungen – was wird automatisch angepasst?",
    icon: Users,
    readTime: "2 Min.",
  },
];

const faqs = [
  {
    q: "Ist iistelle wirklich 14 Tage kostenlos?",
    a: "Ja! Du kannst iistelle 14 Tage lang komplett kostenlos und unverbindlich testen. Danach wählst du einen Plan oder bleibst auf dem kostenlosen Starter-Plan.",
  },
  {
    q: "Kann ich auch mit weniger als 5 Mitarbeitern starten?",
    a: "Natürlich! Der Starter-Plan ist perfekt für Teams jeder Grösse. Du kannst jederzeit upgraden, wenn dein Team wächst.",
  },
  {
    q: "Was passiert mit meinen Daten, wenn ich kündige?",
    a: "Deine Daten bleiben 30 Tage nach Kündigung verfügbar. Du kannst jederzeit alle Daten als CSV oder JSON exportieren.",
  },
  {
    q: "Wo werden meine Daten gespeichert?",
    a: "Standardmässig auf Servern in Frankfurt (Deutschland). Auf Wunsch auch in der Schweiz oder der EU. Wir sind 100% DSGVO-konform.",
  },
  {
    q: "Kann ich die Zeiterfassung auch offline nutzen?",
    a: "Die Zeiterfassung ist aktuell online-first ausgelegt. Eine robuste Offline-Synchronisierung ist Teil der Produkt-Roadmap und wird erst aktiviert, wenn Konfliktbehandlung und Datensicherheit zuverlässig umgesetzt sind.",
  },
];

const relatedTools = [
  { title: "Stundensatz-Rechner", desc: "Berechne deinen optimalen Stundensatz", icon: Calculator, link: "/rechner/stundensatz" },
  { title: "eNPS-Rechner", desc: "Misst die Mitarbeiterzufriedenheit", icon: Users, link: "/rechner/enps" },
  { title: "Fluktuationsrechner", desc: "Berechne deine Fluktuationsrate", icon: Users, link: "/rechner/fluktuation" },
];

const relatedGuides = [
  { title: "Onboarding: Die ersten 90 Tage", category: "Mitarbeiter", link: "/ratgeber/onboarding" },
  { title: "Die perfekte Stellenanzeige schreiben", category: "Recruiting", link: "/ratgeber/stellenanzeige-schreiben" },
  { title: "Feedbackgespräche richtig führen", category: "Führung", link: "/ratgeber/feedbackgespraeche" },
];

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openArticleIndex, setOpenArticleIndex] = useState<number | null>(null);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter((a) => a.featured);

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-petrol-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold tracking-tight text-petrol-900">iistelle</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold text-petrol-600">
            <ServiceDropdown />
            <Link href="/hilfecenter" className="text-coral-500 font-bold">Hilfecenter</Link>
            <Link href="/preise" className="transition hover:text-petrol-900">Preise</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-petrol-700 transition hover:bg-petrol-50">
              Anmelden
            </Link>
            <Link href="/login" className="btn-primary">
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden bg-petrol-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 20%, rgba(255,90,80,0.25) 0%, transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(69,144,154,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-petrol-200">
            <BookOpen className="h-3.5 w-3.5 text-coral-400" />
            Hilfe & Support
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold text-white md:text-5xl">
            Wie können wir dir helfen?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-petrol-300">
            Alles, was du über iistelle wissen musst – von der Einrichtung bis zur Lohnabrechnung.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-petrol-400" />
            <input
              type="text"
              placeholder="Suchbegriff eingeben..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-14 pr-5 text-white placeholder-petrol-400 backdrop-blur transition focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-coral-400/50"
            />
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <section className="mx-auto max-w-6xl px-6 -mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-coral-500 text-white shadow-lg shadow-coral-500/25"
                  : "bg-white text-petrol-600 shadow-sm hover:shadow-md hover:bg-petrol-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      {activeCategory === "all" && searchQuery === "" && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="mb-6 text-xl font-bold text-petrol-900">Beliebte Artikel</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/hilfecenter/${article.id}`}
                className="group card p-5 transition-all hover:shadow-cardHover hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral-100 text-coral-500 transition group-hover:bg-coral-500 group-hover:text-white">
                  <article.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-petrol-900 group-hover:text-coral-500">
                  {article.title}
                </h3>
                <p className="mt-1 text-sm text-petrol-500">{article.excerpt}</p>
                <p className="mt-3 flex items-center gap-1 text-xs text-petrol-400">
                  <Clock className="h-3 w-3" />
                  {article.readTime} Lesezeit
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-6 text-xl font-bold text-petrol-900">
          {activeCategory === "all" ? "Alle Artikel" : categories.find((c) => c.id === activeCategory)?.label}
          <span className="ml-2 text-sm font-normal text-petrol-400">({filteredArticles.length})</span>
        </h2>

        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-petrol-100 bg-white p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-petrol-300" />
            <p className="mt-4 font-semibold text-petrol-600">Keine Artikel gefunden</p>
            <p className="mt-1 text-sm text-petrol-400">Versuche einen anderen Suchbegriff.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article, index) => (
              <div key={article.id} className="overflow-hidden rounded-xl border border-petrol-100 bg-white">
                <button
                  onClick={() => setOpenArticleIndex(openArticleIndex === index ? null : index)}
                  className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-petrol-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-petrol-100 text-petrol-600">
                    <article.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-petrol-900">{article.title}</h3>
                    <p className="mt-0.5 text-sm text-petrol-500">{article.excerpt}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-petrol-400 transition-transform ${openArticleIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openArticleIndex === index && (
                  <div className="border-t border-petrol-100 bg-petrol-50 p-5">
                    <div className="prose prose-petrol max-w-none">
                      <p>Dieser Artikel enthält detaillierte Informationen zu: {article.excerpt}</p>
                      <p className="mt-4">
                        <Link href={`/hilfecenter/${article.id}`} className="inline-flex items-center gap-1 text-coral-500 font-semibold hover:underline">
                          Vollständigen Artikel lesen <ChevronRight className="h-4 w-4" />
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Tools */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl border border-petrol-100 bg-white">
          <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-petrol-900">
              <Calculator className="h-5 w-5 text-coral-500" />
              Kostenlose Tools
            </h2>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.link}
                className="group flex items-center gap-4 rounded-xl border border-petrol-100 bg-white p-4 transition hover:border-coral-200 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-petrol-100 text-petrol-600 transition group-hover:bg-coral-100 group-hover:text-coral-500">
                  <tool.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-petrol-900 group-hover:text-coral-500">{tool.title}</h3>
                  <p className="text-sm text-petrol-500">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="overflow-hidden rounded-2xl border border-petrol-100 bg-white">
          <div className="border-b border-petrol-100 bg-petrol-50 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-petrol-900">
              <BookOpen className="h-5 w-5 text-coral-500" />
              Passende Ratgeber
            </h2>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.link}
                className="group flex items-center gap-3 rounded-xl border border-petrol-100 bg-white p-4 transition hover:border-coral-200 hover:shadow-sm"
              >
                <ChevronRight className="h-5 w-5 shrink-0 text-petrol-300 transition group-hover:text-coral-500" />
                <div>
                  <h3 className="font-semibold text-petrol-900 group-hover:text-coral-500">{guide.title}</h3>
                  <p className="text-xs text-petrol-400">{guide.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-petrol-900">Häufige Fragen</h2>
          <p className="mt-2 text-petrol-500">Die wichtigsten Fragen auf einen Blick</p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map(({ q, a }, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div key={q} className="overflow-hidden rounded-xl border border-petrol-100 bg-white">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-petrol-50"
                >
                  <h3 className="pr-4 font-bold text-petrol-900">{q}</h3>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-petrol-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="px-5 pb-5 text-sm text-petrol-600">{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-petrol-800 to-petrol-900">
          <div className="p-10 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-coral-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">Du hast noch Fragen?</h2>
            <p className="mx-auto mt-2 max-w-md text-petrol-300">
              Unser Team hilft dir gerne weiter. Schreibe uns und wir melden uns innerhalb von 24 Stunden.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:support@iistelle.com"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-petrol-900 transition hover:bg-petrol-100"
              >
                <Mail className="h-5 w-5" />
                E-Mail schreiben
              </a>
              <a
                href="tel:+41762035747"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                <Phone className="h-5 w-5" />
                +41 76 203 57 47
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-petrol-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-petrol-900">iistelle</span>
            <span className="ml-2 text-xs text-petrol-400">© {new Date().getFullYear()} · twenty5ai</span>
          </div>
          <div className="flex gap-5 text-sm font-semibold text-petrol-500">
            <Link href="/impressum" className="transition hover:text-petrol-900">Impressum</Link>
            <Link href="/datenschutz" className="transition hover:text-petrol-900">Datenschutz</Link>
            <Link href="/hilfecenter" className="transition hover:text-petrol-900">Hilfecenter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}