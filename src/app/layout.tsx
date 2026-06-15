import type { Metadata } from "next";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "iistelle – Recruiting & HR-Software",
    template: "%s | iistelle",
  },
  description:
    "Die All-in-One-HR-Plattform für kleine und mittlere Unternehmen: Recruiting, Personalakte, Abwesenheiten und Performance – alles an einem Ort.",
  keywords: ["HR-Software", "Recruiting", "Personalverwaltung", "Bewerbermanagement", "Abwesenheiten", "Performance-Reviews"],
  authors: [{ name: "Sebastian Oczachowski" }],
  creator: "iistelle",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://iistelle.de",
    siteName: "iistelle",
    title: "iistelle – Recruiting & HR-Software",
    description: "Die All-in-One-HR-Plattform für kleine und mittlere Unternehmen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
