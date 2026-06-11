import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Startet eine Stripe-Checkout-Session für den Professional-Plan.
 * Benötigte ENV-Variablen:
 *  - STRIPE_SECRET_KEY        (sk_live_… / sk_test_…)
 *  - STRIPE_PRICE_PROFESSIONAL (price_… des Professional-Plans)
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_PROFESSIONAL;

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error:
          "Zahlungsanbieter noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY und STRIPE_PRICE_PROFESSIONAL als Umgebungsvariablen setzen.",
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

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role, company_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!roleRow || roleRow.role !== "admin") {
    return NextResponse.json(
      { error: "Nur Admins können den Plan ändern." },
      { status: 403 }
    );
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", roleRow.company_id)
    .single();

  if (!company) {
    return NextResponse.json({ error: "Firma nicht gefunden." }, { status: 404 });
  }

  const stripe = new Stripe(secretKey);
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: company.stripe_customer_id || undefined,
    customer_email: company.stripe_customer_id ? undefined : user.email,
    client_reference_id: company.id,
    metadata: { company_id: company.id },
    subscription_data: { metadata: { company_id: company.id } },
    success_url: `${origin}/abrechnung?status=erfolg`,
    cancel_url: `${origin}/abrechnung?status=abgebrochen`,
  });

  return NextResponse.json({ url: session.url });
}
