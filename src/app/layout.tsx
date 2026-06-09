import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iistelle HR – Recruiting",
  description:
    "Modernes HR-Tool für schlankes Recruiting: Stellen, Bewerber-Pipeline, Interviews und Auswertungen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
