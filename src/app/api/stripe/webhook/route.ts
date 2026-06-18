import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

/**
 * Stripe-Webhook: hält den Plan der Firma aktuell.
 * Benötigte ENV-Variablen:
 *  - STRIPE_SECRET_KEY
 *  - STRIPE_WEBHOOK_SECRET    (whsec_… aus dem Stripe-Dashboard)
 *  - SUPABASE_SERVICE_ROLE_KEY (Service-Role-Key, umgeht RLS – nur serverseitig!)
 *
 * Im Stripe-Dashboard als Endpoint eintragen: https://<deine-domain>/api/stripe/webhook
 * Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!secretKey || !webhookSecret || !serviceKey || !supabaseUrl) {
    return NextResponse.json(
      { error: "Webhook noch nicht konfiguriert." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId =
        session.metadata?.company_id ?? session.client_reference_id;
      if (companyId) {
        await admin
          .from("companies")
          .update({
            plan: "professional",
            plan_status: "aktiv",
            stripe_customer_id: String(session.customer ?? ""),
            stripe_subscription_id: String(session.subscription ?? ""),
          })
          .eq("id", companyId);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const companyId = sub.metadata?.company_id;
      if (companyId) {
        const status =
          sub.status === "active" || sub.status === "trialing"
            ? "aktiv"
            : sub.cancel_at_period_end
              ? "gekuendigt"
              : "zahlung_offen";
        await admin
          .from("companies")
          .update({ plan_status: status })
          .eq("id", companyId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const companyId = sub.metadata?.company_id;
      if (companyId) {
        await admin
          .from("companies")
          .update({
            plan: "starter",
            plan_status: "aktiv",
            stripe_subscription_id: "",
          })
          .eq("id", companyId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
