import { createServerSupabase } from "@/lib/supabase/server";
import { getActorContext, isAdmin } from "@/lib/auth/server";
import { NextResponse } from "next/server";

const VALID_ROLES = ["admin", "manager", "mitarbeiter"];

// =====================================================
// PATCH /api/team/role - Change a user's role (admin only, same company)
// =====================================================
export async function PATCH(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);

  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(actor) || !actor.companyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { user_id?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { user_id, role } = body;
  if (!user_id || !role || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid user_id or role" }, { status: 400 });
  }

  // Prevent an admin from demoting themselves and locking out the company.
  if (user_id === actor.userId) {
    return NextResponse.json({ error: "Eigene Rolle kann nicht geändert werden." }, { status: 400 });
  }

  // The target must belong to the same company.
  const { data: target } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("user_id", user_id)
    .eq("company_id", actor.companyId)
    .maybeSingle();

  if (!target) {
    return NextResponse.json({ error: "Nutzer nicht gefunden." }, { status: 404 });
  }

  const { error } = await supabase
    .from("user_roles")
    .update({ role })
    .eq("user_id", user_id)
    .eq("company_id", actor.companyId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
