import { createClient } from "@/lib/supabase/client";

/** Schreibt einen Eintrag ins Audit-Log (wer hat wann was geändert). */
export async function logAudit(action: string, details = "") {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const actor =
    (data.user?.user_metadata?.full_name as string) ||
    data.user?.email ||
    "Unbekannt";
  await supabase.from("audit_logs").insert({ actor, action, details });
}
