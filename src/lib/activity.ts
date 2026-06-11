import { createClient } from "@/lib/supabase/client";

/** Schreibt einen Eintrag in den Aktivitäten-Verlauf eines Kandidaten. */
export async function logActivity(candidateId: string, description: string) {
  const supabase = createClient();
  await supabase
    .from("activities")
    .insert({ candidate_id: candidateId, description });
}
