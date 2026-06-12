import { createClient } from "@/lib/supabase/client";

/**
 * Führt Workflow-Automatisierungen aus: legt für alle aktiven Regeln der
 * Zielphase eine HR-Aufgabe an. Platzhalter: {{kandidat}}, {{stelle}}.
 */
export async function runAutomations(
  stage: string,
  candidateName: string,
  jobTitle: string
) {
  const supabase = createClient();
  const { data } = await supabase
    .from("automations")
    .select("*")
    .eq("trigger_stage", stage)
    .eq("active", true);

  const rules = data ?? [];
  if (rules.length === 0) return;

  await supabase.from("hr_tasks").insert(
    rules.map((r) => ({
      title: r.task_title
        .replaceAll("{{kandidat}}", candidateName)
        .replaceAll("{{stelle}}", jobTitle),
      assignee: r.assignee ?? "",
      due_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    }))
  );
}
