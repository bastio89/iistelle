import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { employee_id, email } = await request.json();

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Nicht autorisiert" }, { status: 401 });
  }

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (role?.role !== "admin") {
    return NextResponse.json({ success: false, error: "Nur Admins können Einladungen senden" }, { status: 403 });
  }

  // Generate setup token
  const token = crypto.randomUUID().replace(/-/g, "");

  // Store token in database
  const { error: tokenError } = await supabase
    .from("employee_setup_tokens")
    .insert({
      employee_id,
      email,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

  if (tokenError) {
    console.error("Token error:", tokenError);
    return NextResponse.json({ success: false, error: "Token konnte nicht erstellt werden" }, { status: 500 });
  }

  // Send email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    const setupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/portal-login?token=${token}`;

    await resend.emails.send({
      from: "iistelle <noreply@iistelle.ch>",
      to: email,
      subject: "Du wurdest zum iistelle Portal eingeladen",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a3c5e;">Willkommen beim iistelle Portal</h1>
          <p>Du wurdest eingeladen, auf das Mitarbeiter-Portal zuzugreifen.</p>
          <p>Klicke auf den folgenden Button, um dich anzumelden:</p>
          <a href="${setupUrl}" style="display: inline-block; background: #e85d3b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">Zum Portal</a>
          <p style="color: #666; font-size: 14px;">Dieser Link ist 7 Tage gültig.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ success: true, token });
}