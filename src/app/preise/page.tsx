import { Metadata } from "next";
import { headers } from "next/headers";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Preise – iistelle HR",
  description:
    "Faire und transparente Preise für Recruiting und HR. Starter kostenlos, Professional ab 129 €/Monat. Keine versteckten Kosten.",
};

export default async function PricingPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  const { detectCountry, getPricingPlans, getPricingConfig } = await import("@/lib/pricing");

  const country = detectCountry(acceptLanguage);
  const plans = getPricingPlans(country);
  const config = getPricingConfig(country);

  return <PricingClient plans={plans} config={config} />;
}