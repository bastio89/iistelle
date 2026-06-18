import { createServerSupabase } from "@/lib/supabase/server";
import { getActorContext, isAdmin } from "@/lib/auth/server";
import { NextResponse } from "next/server";

// =====================================================
// POST /api/recruiting/merge-candidates
// Merges duplicate candidates into a primary record.
// Admin-only. Runs through the user's session so RLS scopes
// the records to the caller's company.
// body: { primary_id: string, duplicate_ids: string[] }
// =====================================================
export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);

  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { primary_id?: string; duplicate_ids?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { primary_id, duplicate_ids } = body;
  if (!primary_id || !Array.isArray(duplicate_ids) || duplicate_ids.length === 0) {
    return NextResponse.json({ error: "primary_id und duplicate_ids erforderlich" }, { status: 400 });
  }
  if (duplicate_ids.includes(primary_id)) {
    return NextResponse.json({ error: "primary_id darf kein Duplikat sein" }, { status: 400 });
  }

  // Verify all candidates are visible to the caller (RLS-scoped) and share
  // the same email before merging — guards against merging across tenants.
  const ids = [primary_id, ...duplicate_ids];
  const { data: candidates, error: loadError } = await supabase
    .from("candidates")
    .select("id, email")
    .in("id", ids);

  if (loadError) return NextResponse.json({ error: loadError.message }, { status: 400 });
  if (!candidates || candidates.length !== ids.length) {
    return NextResponse.json({ error: "Nicht alle Kandidaten gefunden oder zugänglich." }, { status: 404 });
  }

  const primaryEmail = candidates.find((c) => c.id === primary_id)?.email?.toLowerCase().trim();
  const allSameEmail = candidates.every(
    (c) => (c.email?.toLowerCase().trim() ?? "") === primaryEmail
  );
  if (!allSameEmail) {
    return NextResponse.json({ error: "Kandidaten haben unterschiedliche E-Mail-Adressen." }, { status: 409 });
  }

  // Re-point related records, then remove duplicates. Each step is checked so
  // a failure stops the merge before deleting anything.
  for (const dupId of duplicate_ids) {
    const { error: appErr } = await supabase
      .from("applications")
      .update({ candidate_id: primary_id })
      .eq("candidate_id", dupId);
    if (appErr) return NextResponse.json({ error: appErr.message }, { status: 400 });

    const { error: actErr } = await supabase
      .from("activities")
      .update({ candidate_id: primary_id })
      .eq("candidate_id", dupId);
    if (actErr) return NextResponse.json({ error: actErr.message }, { status: 400 });
  }

  const { error: delErr } = await supabase
    .from("candidates")
    .delete()
    .in("id", duplicate_ids);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 });

  // Audit the destructive operation.
  await supabase.from("audit_logs").insert({
    actor: actor.email ?? actor.userId,
    actor_email: actor.email,
    action: "candidates_merged",
    category: "candidate",
    object_type: "candidates",
    object_id: primary_id,
    details: `${duplicate_ids.length} Duplikat(e) zusammengeführt`,
  });

  return NextResponse.json({ success: true, merged: duplicate_ids.length });
}
