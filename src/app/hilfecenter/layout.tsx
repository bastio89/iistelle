import { Metadata } from "next";
import HelpCenterPage from "./page";

export const metadata: Metadata = {
  title: "Hilfecenter – iistelle",
  description: "Alles, was du über iistelle wissen musst – von der Einrichtung bis zur Lohnabrechnung. Hilfe, FAQs und Anleitungen.",
};

export default function Page() {
  return <HelpCenterPage />;
}
