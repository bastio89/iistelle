import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * KI-Assistent (Claude API). Benötigt ENV: ANTHROPIC_API_KEY.
 * body: { mode: "stellenanzeige" | "zusammenfassung", input: string }
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "KI-Assistent noch nicht konfiguriert. Bitte ANTHROPIC_API_KEY als Umgebungsvariable setzen.",
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

  const { mode, input } = await req.json();

  const system =
    mode === "stellenanzeige"
      ? "Du bist HR-Texter:in. Schreibe aus den Stichpunkten eine ansprechende, strukturierte deutsche Stellenbeschreibung (Aufgaben, Profil, Benefits). Nur den Text ausgeben, keine Einleitung."
      : "Du bist Recruiting-Assistent:in. Fasse das Kandidatenprofil in 3-4 prägnanten deutschen Sätzen zusammen: Erfahrung, Stärken, Passung. Nur den Text ausgeben.";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: String(input).slice(0, 4000) }],
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "KI-Anfrage fehlgeschlagen." },
      { status: 502 }
    );
  }

  const data = await res.json();
  const text = data?.content?.[0]?.text ?? "";
  return NextResponse.json({ text });
}
