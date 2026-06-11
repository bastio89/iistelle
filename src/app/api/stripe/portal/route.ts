import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

/** Öffnet das Stripe-Kundenportal (Rechnungen, Kündigung, Zahlungsmethode). */
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Zahlungsanbieter noch nicht konfiguriert." },
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

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role, company_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!roleRow || roleRow.role !== "admin") {
    return NextResponse.json({ error: "Nur für Admins." }, { status: 403 });
  }

  const { data: company } = await supabase
    .from("companies")
    .select("stripe_customer_id")
    .eq("id", roleRow.company_id)
    .single();

  if (!company?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Noch kein aktives Abo vorhanden." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.billingPortal.sessions.create({
    customer: company.stripe_customer_id,
    return_url: `${req.nextUrl.origin}/abrechnung`,
  });

  return NextResponse.json({ url: session.url });
}
