import { createServerSupabase } from "@/lib/supabase/server";
import { getActorContext, isAdmin } from "@/lib/auth/server";
import { generateApiToken, hashApiToken, apiTokenPrefix } from "@/lib/auth/api-keys";
import { NextResponse } from "next/server";

// =====================================================
// GET /api/api-keys - List API keys (metadata only, never the secret)
// =====================================================
export async function GET() {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);

  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(actor) || !actor.companyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, last_used_at, created_at")
    .eq("company_id", actor.companyId)
    .order("created_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

// =====================================================
// POST /api/api-keys - Create an API key (returns plaintext once)
// =====================================================
export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);

  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(actor) || !actor.companyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // API access is a Professional feature — enforce the plan server-side.
  const { data: company } = await supabase
    .from("companies")
    .select("plan")
    .eq("id", actor.companyId)
    .maybeSingle();

  if (!company || company.plan === "starter") {
    return NextResponse.json(
      { error: "API-Zugriff ist eine Professional-Funktion." },
      { status: 402 }
    );
  }

  let name = "API Key";
  try {
    const body = await request.json();
    if (typeof body?.name === "string" && body.name.trim()) {
      name = body.name.trim().slice(0, 120);
    }
  } catch {
    // Body is optional; fall back to default name.
  }

  const token = generateApiToken();

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      name,
      company_id: actor.companyId,
      key_hash: hashApiToken(token),
      key_prefix: apiTokenPrefix(token),
    })
    .select("id, name, key_prefix, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // The plaintext token is returned exactly once and never stored.
  return NextResponse.json({ data: { ...data, token } }, { status: 201 });
}

// =====================================================
// DELETE /api/api-keys?id=... - Revoke an API key
// =====================================================
export async function DELETE(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);

  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(actor) || !actor.companyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id)
    .eq("company_id", actor.companyId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
