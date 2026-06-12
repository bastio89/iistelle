import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Öffentliche Lese-API (v1).
 * GET /api/v1/jobs | /api/v1/candidates | /api/v1/applications
 * Auth: Authorization: Bearer <API-Key aus den Einstellungen>
 * Benötigt ENV: SUPABASE_SERVICE_ROLE_KEY
 */
const RESOURCES: Record<string, string> = {
  jobs: "id,title,department,location,employment_type,status,created_at",
  candidates: "id,first_name,last_name,email,city,source,tags,created_at",
  applications: "id,job_id,candidate_id,stage,rating,applied_at,updated_at",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const columns = RESOURCES[resource];
  if (!columns) {
    return NextResponse.json({ error: "Unbekannte Ressource." }, { status: 404 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://afmjpjwipjsgvvrfrojo.supabase.co";
  if (!serviceKey) {
    return NextResponse.json(
      { error: "API noch nicht konfiguriert (SUPABASE_SERVICE_ROLE_KEY fehlt)." },
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token.startsWith("iist_")) {
    return NextResponse.json({ error: "API-Key fehlt." }, { status: 401 });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: keyRow } = await admin
    .from("api_keys")
    .select("company_id")
    .eq("key", token)
    .maybeSingle();

  if (!keyRow) {
    return NextResponse.json({ error: "Ungültiger API-Key." }, { status: 401 });
  }

  const { data, error } = await admin
    .from(resource)
    .select(columns)
    .eq("company_id", keyRow.company_id)
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
