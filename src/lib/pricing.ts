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
  monthlyPrice: number | null; // null = individuell
  yearlyPrice: number | null;
  currency: "CHF" | "EUR";
  maxEmployees: number | null;
  features: string[];
  notIncluded?: string[];
  cta: string;
  ctaLink: string;
  highlight: boolean;
  badge?: string;
  plan: "starter" | "professional" | "enterprise";
}

// Schweizer Preise (CHF)
const CH_PRICING: Omit<PricingPlan, "currency" | "ctaLink">[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfekt für den Einstieg",
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxEmployees: 10,
    features: [
      "Recruiting-Pipeline",
      "Eigene Karriereseite",
      "Bewerber-Tracking (ATS)",
      "Bis 10 Mitarbeiter",
      "Abwesenheiten & Kalender",
      "5 GB Speicher",
    ],
    notIncluded: [
      "Gehaltsverwaltung",
      "Performance-Reviews",
      "API-Zugriff",
    ],
    cta: "Kostenlos starten",
    highlight: false,
    plan: "starter",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Für wachsende Teams",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    maxEmployees: null,
    features: [
      "Unbegrenzte Mitarbeiter",
      "Gehaltsverwaltung",
      "Performance-Reviews",
      "Zeiterfassung",
      "Dokumente & Verträge",
      "Rollen & Rechte",
      "API-Zugriff",
      "Slack-Integration",
      "20 GB Speicher",
      "Priority Support",
    ],
    cta: "14 Tage kostenlos testen",
    highlight: true,
    badge: "Beliebt",
    plan: "professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Massgeschneidert für Konzerne",
    monthlyPrice: null,
    yearlyPrice: null,
    maxEmployees: null,
    features: [
      "Alles aus Professional",
      "Multi-Company-Support",
      "SSO / SAML",
      "Dedizierter Support",
      "Custom Branding",
      "SLA-Garantie",
      "Onboarding-Begleitung",
      " Individuelle Schulung",
      "Unbegrenzter Speicher",
    ],
    cta: "Angebot anfordern",
    highlight: false,
    plan: "enterprise",
  },
];

// Deutsche Preise (EUR)
const DE_PRICING: Omit<PricingPlan, "currency" | "ctaLink">[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfekt für den Einstieg",
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxEmployees: 10,
    features: [
      "Recruiting-Pipeline",
      "Eigene Karriereseite",
      "Bewerber-Tracking (ATS)",
      "Bis 10 Mitarbeiter",
      "Abwesenheiten & Kalender",
      "5 GB Speicher",
    ],
    notIncluded: [
      "Gehaltsverwaltung",
      "Performance-Reviews",
      "API-Zugriff",
    ],
    cta: "Kostenlos starten",
    highlight: false,
    plan: "starter",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Für wachsende Teams",
    monthlyPrice: 129,
    yearlyPrice: 1290,
    maxEmployees: null,
    features: [
      "Unbegrenzte Mitarbeiter",
      "Gehaltsverwaltung",
      "Performance-Reviews",
      "Zeiterfassung",
      "Dokumente & Verträge",
      "Rollen & Rechte",
      "API-Zugriff",
      "Slack-Integration",
      "20 GB Speicher",
      "Priority Support",
    ],
    cta: "14 Tage kostenlos testen",
    highlight: true,
    badge: "Beliebt",
    plan: "professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Massgeschneidert für Konzerne",
    monthlyPrice: null,
    yearlyPrice: null,
    maxEmployees: null,
    features: [
      "Alles aus Professional",
      "Multi-Company-Support",
      "SSO / SAML",
      "Dedizierter Support",
      "Custom Branding",
      "SLA-Garantie",
      "Onboarding-Begleitung",
      " Individuelle Schulung",
      "Unbegrenzter Speicher",
    ],
    cta: "Angebot anfordern",
    highlight: false,
    plan: "enterprise",
  },
];

/**
 * Bestimmt die Region basierend auf dem Accept-Language Header oder Default
 */
export function detectCountry(acceptLanguage: string | null): Country {
  if (!acceptLanguage) return "DE"; // Default zu Deutschland

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
    ctaLink: plan.id === "enterprise" ? "/kontakt" : `/login?plan=${plan.id}`,
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
 * Demo: Simuliert Geo-IP für Vorschau (kann mit echter IP-basierter Lösung ersetzt werden)
 */
export function getDemoCountry(): Country {
  // In Produktion: echte Geo-IP-basierte Erkennung
  // Für Demo: Default zu Deutschland
  return "DE";
}