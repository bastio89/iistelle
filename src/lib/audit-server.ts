/**
 * Server-seitiges Audit-Log für API-Routen und Server-Komponenten
 * Nur für Verwendung in Server-Kontext (API-Routen, Server-Komponenten)
 */

import { createServerSupabase } from "@/lib/supabase/server";
import { AuditActionCategory, AuditLogEntry, AuditLogFilter } from "./audit";

// ─── Audit-Log schreiben (Server) ─────────────────────────────────────────────

interface LogAuditServerOptions {
  action: string;
  category?: AuditActionCategory;
  object_type?: string;
  object_id?: string;
  details?: string;
  old_value?: unknown;
  new_value?: unknown;
  request?: Request;
}

export async function logAuditServer(options: LogAuditServerOptions): Promise<void> {
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();

  const actor =
    (userData?.user?.user_metadata?.full_name as string) ||
    userData?.user?.email ||
    "System";

  const actor_email = userData?.user?.email;

  // IP-Adresse aus Request extrahieren
  let ip_address: string | undefined;
  let user_agent: string | undefined;

  if (options.request) {
    ip_address =
      options.request.headers.get("x-forwarded-for") ||
      options.request.headers.get("x-real-ip") ||
      undefined;
    user_agent = options.request.headers.get("user-agent") || undefined;
  }

  await supabase.from("audit_logs").insert({
    actor,
    actor_email,
    action: options.action,
    category: options.category || "data",
    object_type: options.object_type,
    object_id: options.object_id,
    details: options.details,
    old_value: options.old_value ? JSON.stringify(options.old_value) : null,
    new_value: options.new_value ? JSON.stringify(options.new_value) : null,
    ip_address,
    user_agent,
  });
}

// ─── Audit-Log lesen (Server) ─────────────────────────────────────────────────

export async function getAuditLogsServer(
  filter: AuditLogFilter = {},
  limit = 100
): Promise<AuditLogEntry[]> {
  const supabase = await createServerSupabase();

  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filter.category) {
    query = query.eq("category", filter.category);
  }
  if (filter.object_type) {
    query = query.eq("object_type", filter.object_type);
  }
  if (filter.object_id) {
    query = query.eq("object_id", filter.object_id);
  }
  if (filter.actor) {
    query = query.eq("actor", filter.actor);
  }
  if (filter.date_from) {
    query = query.gte("created_at", filter.date_from);
  }
  if (filter.date_to) {
    query = query.lte("created_at", filter.date_to);
  }

  const { data } = await query;
  return (data as AuditLogEntry[]) ?? [];
}

// ─── Audit-Log für ein bestimmtes Objekt (Server) ─────────────────────────────

export async function getAuditLogsForObjectServer(
  objectType: string,
  objectId: string,
  limit = 50
): Promise<AuditLogEntry[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("object_type", objectType)
    .eq("object_id", objectId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as AuditLogEntry[]) ?? [];
}