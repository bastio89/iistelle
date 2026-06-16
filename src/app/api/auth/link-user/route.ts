import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );

  const { user_id, email } = await request.json();

  if (!user_id || !email) {
    return NextResponse.json({ error: "user_id und email erforderlich" }, { status: 400 });
  }

  // Hole Company
  const { data: companies } = await supabase
    .from("companies")
    .select("id")
    .limit(1);

  const companyId = companies?.[0]?.id;
  if (!companyId) {
    return NextResponse.json({ error: "Keine Company gefunden" }, { status: 404 });
  }

  // Erstelle oder aktualisiere user_roles
  const { error: rolesError } = await supabase
    .from("user_roles")
    .upsert({
      user_id,
      email,
      role: "admin",
      company_id: companyId,
    });

  if (rolesError) {
    return NextResponse.json({ error: rolesError.message }, { status: 500 });
  }

  // Aktualisiere auch den Mitarbeiter mit der user_id
  await supabase
    .from("employees")
    .update({ user_id })
    .eq("email", email);

  return NextResponse.json({ success: true });
}