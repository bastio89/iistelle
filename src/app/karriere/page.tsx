import { redirect } from "next/navigation";

// Karriereseiten sind firmenspezifisch: /karriere/<firmen-slug>
export default function CareerIndex() {
  redirect("/karriere/iistelle");
}
