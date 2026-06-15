import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * E-Mail-Versand über Resend. Benötigt ENV: RESEND_API_KEY
 * Optional: EMAIL_FROM (Standard: onboarding@resend.dev für Tests)
 * body: { to: string, subject: string, body: string }
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "E-Mail-Versand noch nicht konfiguriert. Bitte RESEND_API_KEY als Umgebungsvariable setzen.",
      },
      { status: 503 }
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { to, subject, body } = await req.json();
  if (!to || !subject) {
    return NextResponse.json({ error: "Empfänger und Betreff fehlen." }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "iistelle <onboarding@resend.dev>",
      to: [to],
      subject,
      text: body ?? "",
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json(
      { error: `Versand fehlgeschlagen: ${detail.slice(0, 200)}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
