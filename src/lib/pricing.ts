/**
 * Preis-Konfiguration mit Geo-IP-basierter Währung
 *
 * Zeigt automatisch CHF für Schweizer Besucher und EUR für deutsche Besucher.
 */

export type Country = "CH" | "DE" | "AT" | "LI" | "OTHER";

export interface PricingConfig {
  currency: "CHF" | "EUR";
  currencySymbol: "CHF" | "€";
  locale: "de-CH" | "de-DE";
  country: Country;
  countryName: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  nameShort?: string;
  tagline: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  currency: "CHF" | "EUR";
  maxEmployees: number | null;
  features: string[];
  notIncluded?: string[];
  cta: string;
  ctaLink: string;
  highlight: boolean;
  badge?: string;
  plan: "starter" | "professional";
}

// Schweizer Preise (CHF) – Starter: 49 CHF, Professional: 129 CHF
const CH_PRICING: Omit<PricingPlan, "currency" | "ctaLink">[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Für Kleinunternehmen, die Recruiting und Abwesenheiten effizient managen",
    monthlyPrice: 49,
    yearlyPrice: 490,
    maxEmployees: 5,
    features: [
      "Bis 5 Mitarbeiter",
      "Bewerber-Pipeline (Kanban)",
      "Eigene Karriereseite",
      "CV-Upload & Dokumente",
      "Abwesenheiten & Kalender",
      "E-Mail-Benachrichtigungen",
    ],
    notIncluded: [
      "Gehaltsdaten & Vergütung",
      "Performance-Gespräche",
      "Zeiterfassung",
      "Rollen & Berechtigungen",
      "API-Zugriff",
      "CSV-Exporte",
    ],
    cta: "14 Tage kostenlos testen",
    highlight: false,
    plan: "starter",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Für wachsende Unternehmen, die alle HR-Prozesse an einem Ort brauchen",
    monthlyPrice: 129,
    yearlyPrice: 1290,
    maxEmployees: null,
    features: [
      "Unbegrenzte Mitarbeiter",
      "Alles aus Starter",
      "Gehaltsdaten & Vergütung",
      "Performance-Gespräche (360°)",
      "Zeiterfassung",
      "Rollen & Berechtigungen",
      "CSV-Exporte & API-Zugriff",
      "Audit-Log",
    ],
    cta: "14 Tage kostenlos testen",
    highlight: true,
    badge: "Empfohlen",
    plan: "professional",
  },
];

// Deutsche Preise (EUR) – Starter: 39 €, Professional: 99 €
const DE_PRICING: Omit<PricingPlan, "currency" | "ctaLink">[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Für Kleinunternehmen, die Recruiting und Abwesenheiten effizient managen",
    monthlyPrice: 39,
    yearlyPrice: 390,
    maxEmployees: 5,
    features: [
      "Bis 5 Mitarbeiter",
      "Bewerber-Pipeline (Kanban)",
      "Eigene Karriereseite",
      "CV-Upload & Dokumente",
      "Abwesenheiten & Kalender",
      "E-Mail-Benachrichtigungen",
    ],
    notIncluded: [
      "Gehaltsdaten & Vergütung",
      "Performance-Gespräche",
      "Zeiterfassung",
      "Rollen & Berechtigungen",
      "API-Zugriff",
      "CSV-Exporte",
    ],
    cta: "14 Tage kostenlos testen",
    highlight: false,
    plan: "starter",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Für wachsende Unternehmen, die alle HR-Prozesse an einem Ort brauchen",
    monthlyPrice: 99,
    yearlyPrice: 990,
    maxEmployees: null,
    features: [
      "Unbegrenzte Mitarbeiter",
      "Alles aus Starter",
      "Gehaltsdaten & Vergütung",
      "Performance-Gespräche (360°)",
      "Zeiterfassung",
      "Rollen & Berechtigungen",
      "CSV-Exporte & API-Zugriff",
      "Audit-Log",
    ],
    cta: "14 Tage kostenlos testen",
    highlight: true,
    badge: "Empfohlen",
    plan: "professional",
  },
];

/**
 * Bestimmt die Region basierend auf dem Accept-Language Header oder Default
 */
export function detectCountry(acceptLanguage: string | null): Country {
  if (!acceptLanguage) return "DE";

  const langs = acceptLanguage.toLowerCase();

  if (langs.includes("de-ch") || langs.includes("ch")) return "CH";
  if (langs.includes("de")) return "DE";
  if (langs.includes("at")) return "AT";
  if (langs.includes("li")) return "LI";

  return "DE";
}

/**
 * Gibt die Preis-Konfiguration für die aktuelle Region zurück
 */
export function getPricingConfig(country: Country = "DE"): PricingConfig {
  const configs: Record<Country, PricingConfig> = {
    CH: {
      currency: "CHF",
      currencySymbol: "CHF",
      locale: "de-CH",
      country: "CH",
      countryName: "Schweiz",
    },
    DE: {
      currency: "EUR",
      currencySymbol: "€",
      locale: "de-DE",
      country: "DE",
      countryName: "Deutschland",
    },
    AT: {
      currency: "EUR",
      currencySymbol: "€",
      locale: "de-DE",
      country: "AT",
      countryName: "Österreich",
    },
    LI: {
      currency: "CHF",
      currencySymbol: "CHF",
      locale: "de-CH",
      country: "LI",
      countryName: "Liechtenstein",
    },
    OTHER: {
      currency: "EUR",
      currencySymbol: "€",
      locale: "de-DE",
      country: "OTHER",
      countryName: "International",
    },
  };

  return configs[country];
}

/**
 * Gibt die Preispläne für die aktuelle Region zurück
 */
export function getPricingPlans(country: Country = "DE"): PricingPlan[] {
  const basePlans = country === "CH" ? CH_PRICING : DE_PRICING;
  const config = getPricingConfig(country);

  return basePlans.map((plan) => ({
    ...plan,
    currency: config.currency,
    ctaLink: `/login?plan=${plan.id}`,
  }));
}

/**
 * Formatiert einen Preis für die Anzeige
 */
export function formatPrice(amount: number | null, currency: "CHF" | "EUR"): string {
  if (amount === null) return "Individuell";

  const locale = currency === "CHF" ? "de-CH" : "de-DE";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Berechnet den Jahrespreis mit Rabatt
 */
export function calculateYearlyPrice(monthlyPrice: number, discount = 0): number {
  return Math.round(monthlyPrice * 12 * (1 - discount));
}

/**
 * Demo: Simuliert Geo-IP für Vorschau
 */
export function getDemoCountry(): Country {
  return "DE";
}