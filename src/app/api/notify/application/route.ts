import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Slack-Benachrichtigung bei neuer Bewerbung.
 * Wird von der Karriereseite aufgerufen; liest die Webhook-URL der Firma
 * serverseitig (ENV: SUPABASE_SERVICE_ROLE_KEY nötig, sonst stiller Skip).
 * body: { company_id, candidate_name, job_title }
 */
export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json({ skipped: true });
  }

  const { company_id, candidate_name, job_title } = await req.json();
  if (!company_id) return NextResponse.json({ skipped: true });

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: company } = await admin
    .from("companies")
    .select("slack_webhook_url, name")
    .eq("id", company_id)
    .maybeSingle();

  const url = company?.slack_webhook_url;
  if (!url || !url.startsWith("https://hooks.slack.com/")) {
    return NextResponse.json({ skipped: true });
  }

  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `📥 Neue Bewerbung: *${candidate_name}* auf „${job_title}“ – jetzt in der Pipeline von ${company.name}.`,
    }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
