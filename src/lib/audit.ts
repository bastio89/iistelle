import { createClient } from "@/lib/supabase/client";

// ─── Typen ────────────────────────────────────────────────────────────────────

export type AuditActionCategory =
  | "auth"
  | "employee"
  | "candidate"
  | "application"
  | "absence"
  | "time_entry"
  | "salary"
  | "document"
  | "settings"
  | "api"
  | "data";

export interface AuditLogEntry {
  id: string;
  actor: string;
  actor_email?: string;
  action: string;
  category: AuditActionCategory;
  object_type?: string;  // z.B. "employees", "candidates"
  object_id?: string;    // ID des betroffenen Datensatzes
  details?: string;
  old_value?: string;    // JSON serialisiert
  new_value?: string;    // JSON serialisiert
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLogFilter {
  category?: AuditActionCategory;
  object_type?: string;
  object_id?: string;
  actor?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// ─── Aktions-Kategorien mit Beschreibungen ────────────────────────────────────

export const AUDIT_ACTION_META: Record<string, { label: string; category: AuditActionCategory; severity: "info" | "warning" | "critical" }> = {
  // Auth
  "login": { label: "Anmeldung", category: "auth", severity: "info" },
  "logout": { label: "Abmeldung", category: "auth", severity: "info" },
  "password_change": { label: "Passwort geändert", category: "auth", severity: "warning" },
  "password_reset": { label: "Passwort-Zurücksetzung", category: "auth", severity: "warning" },
  "mfa_enabled": { label: "MFA aktiviert", category: "auth", severity: "warning" },
  "mfa_disabled": { label: "MFA deaktiviert", category: "auth", severity: "warning" },
  "invitation_sent": { label: "Einladung gesendet", category: "auth", severity: "info" },
  "invitation_accepted": { label: "Einladung angenommen", category: "auth", severity: "info" },

  // Employee
  "employee_created": { label: "Mitarbeiter erstellt", category: "employee", severity: "info" },
  "employee_updated": { label: "Mitarbeiter aktualisiert", category: "employee", severity: "info" },
  "employee_deleted": { label: "Mitarbeiter gelöscht", category: "employee", severity: "critical" },
  "role_changed": { label: "Rolle geändert", category: "employee", severity: "warning" },

  // Candidate
  "candidate_created": { label: "Kandidat erstellt", category: "candidate", severity: "info" },
  "candidate_updated": { label: "Kandidat aktualisiert", category: "candidate", severity: "info" },
  "candidate_deleted": { label: "Kandidat gelöscht", category: "candidate", severity: "critical" },
  "candidate_export": { label: "Kandidat exportiert", category: "candidate", severity: "warning" },

  // Application
  "application_created": { label: "Bewerbung erstellt", category: "application", severity: "info" },
  "application_stage_changed": { label: "Bewerbungsphase geändert", category: "application", severity: "info" },
  "interview_scheduled": { label: "Interview geplant", category: "application", severity: "info" },
  "interview_completed": { label: "Interview abgeschlossen", category: "application", severity: "info" },

  // Absence
  "absence_created": { label: "Abwesenheit beantragt", category: "absence", severity: "info" },
  "absence_approved": { label: "Abwesenheit genehmigt", category: "absence", severity: "info" },
  "absence_rejected": { label: "Abwesenheit abgelehnt", category: "absence", severity: "info" },
  "absence_cancelled": { label: "Abwesenheit storniert", category: "absence", severity: "info" },

  // Time Entry
  "time_entry_created": { label: "Zeiteintrag erstellt", category: "time_entry", severity: "info" },
  "time_entry_edited": { label: "Zeiteintrag bearbeitet", category: "time_entry", severity: "warning" },
  "time_entry_deleted": { label: "Zeiteintrag gelöscht", category: "time_entry", severity: "warning" },

  // Salary
  "salary_viewed": { label: "Gehalt eingesehen", category: "salary", severity: "warning" },
  "salary_created": { label: "Gehalt erfasst", category: "salary", severity: "warning" },
  "salary_updated": { label: "Gehalt aktualisiert", category: "salary", severity: "critical" },

  // Document
  "document_uploaded": { label: "Dokument hochgeladen", category: "document", severity: "info" },
  "document_downloaded": { label: "Dokument heruntergeladen", category: "document", severity: "info" },
  "document_deleted": { label: "Dokument gelöscht", category: "document", severity: "warning" },
  "document_signed": { label: "Dokument unterschrieben", category: "document", severity: "warning" },

  // Settings
  "settings_updated": { label: "Einstellungen geändert", category: "settings", severity: "warning" },
  "api_key_created": { label: "API-Key erstellt", category: "api", severity: "warning" },
  "api_key_deleted": { label: "API-Key gelöscht", category: "api", severity: "warning" },
  "slack_webhook_updated": { label: "Slack-Webhook aktualisiert", category: "settings", severity: "warning" },

  // Data
  "data_export": { label: "Daten exportiert", category: "data", severity: "warning" },
  "data_import": { label: "Daten importiert", category: "data", severity: "warning" },
  "personal_data_accessed": { label: "Personaldaten eingesehen", category: "data", severity: "warning" },
  "personal_data_deleted": { label: "Personaldaten gelöscht", category: "data", severity: "critical" },
  "consent_recorded": { label: "Einwilligung dokumentiert", category: "data", severity: "info" },
  "gdpr_export_request": { label: "DSGVO-Auskunftsanfrage", category: "data", severity: "critical" },
};

// ─── Helper-Funktionen ────────────────────────────────────────────────────────

interface AuthUserData {
  user: {
    email?: string;
    user_metadata?: { full_name?: string };
  } | null;
}

function getActorName(userData: AuthUserData | null): string {
  if (!userData?.user) return "System";
  return (
    (userData.user.user_metadata?.full_name as string) ||
    userData.user.email ||
    "System"
  );
}

function getActorEmail(userData: AuthUserData | null): string | undefined {
  return userData?.user?.email;
}

// ─── Audit-Log schreiben (Client) ─────────────────────────────────────────────

interface LogAuditOptions {
  action: string;
  category?: AuditActionCategory;
  object_type?: string;
  object_id?: string;
  details?: string;
  old_value?: unknown;
  new_value?: unknown;
}

export async function logAudit(options: LogAuditOptions): Promise<void> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  const actor = getActorName(userData);
  const actor_email = getActorEmail(userData);

  // Kategorie automatisch aus Action ableiten falls nicht angegeben
  const category = options.category ||
    AUDIT_ACTION_META[options.action]?.category ||
    "data";

  await supabase.from("audit_logs").insert({
    actor,
    actor_email,
    action: options.action,
    category,
    object_type: options.object_type,
    object_id: options.object_id,
    details: options.details,
    old_value: options.old_value ? JSON.stringify(options.old_value) : null,
    new_value: options.new_value ? JSON.stringify(options.new_value) : null,
  });
}

// ─── Audit-Log schreiben (Server) ─────────────────────────────────────────────
// Für Server-seitige Nutzung (API-Routen, Server-Komponenten) bitte audit-server.ts verwenden

// ─── Audit-Log lesen ──────────────────────────────────────────────────────────

export async function getAuditLogs(
  filter: AuditLogFilter = {},
  limit = 100
): Promise<AuditLogEntry[]> {
  const supabase = createClient();

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
  if (filter.search) {
    query = query.or(`action.ilike.%${filter.search}%,details.ilike.%${filter.search}%,actor.ilike.%${filter.search}%`);
  }

  const { data } = await query;
  return (data as AuditLogEntry[]) ?? [];
}

// ─── Audit-Log für ein bestimmtes Objekt ─────────────────────────────────────

export async function getAuditLogsForObject(
  objectType: string,
  objectId: string,
  limit = 50
): Promise<AuditLogEntry[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("object_type", objectType)
    .eq("object_id", objectId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as AuditLogEntry[]) ?? [];
}

// ─── Change Tracking Helper ────────────────────────────────────────────────────

/**
 * Vergleicht zwei Objekte und gibt die geänderten Felder zurück
 */
export function getChangedFields<T extends Record<string, unknown>>(
  oldObj: T,
  newObj: Partial<T>,
  fieldsToTrack?: (keyof T)[]
): Partial<Record<keyof T, { old: unknown; new: unknown }>> {
  const changed: Partial<Record<keyof T, { old: unknown; new: unknown }>> = {};
  const keysToTrack = fieldsToTrack ?? (Object.keys(oldObj) as (keyof T)[]);

  for (const key of keysToTrack) {
    const oldVal = oldObj[key];
    const newVal = newObj[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      (changed as Record<string, { old: unknown; new: unknown }>)[key as string] = {
        old: oldVal,
        new: newVal,
      };
    }
  }

  return changed;
}

/**
 * Formatiert Changed Fields für das Audit-Log
 */
export function formatChangedFieldsForAudit(
  changed: Record<string, { old: unknown; new: unknown }>
): string {
  const entries = Object.entries(changed);
  if (entries.length === 0) return "";

  return entries
    .map(([key, values]) => {
      const displayKey = key.replace(/_/g, " ");
      const oldVal = values?.old;
      const newVal = values?.new;
      const oldDisplay = oldVal === null || oldVal === undefined ? "(leer)" : String(oldVal);
      const newDisplay = newVal === null || newVal === undefined ? "(leer)" : String(newVal);
      return `${displayKey}: ${oldDisplay} → ${newDisplay}`;
    })
    .join("; ");
}

// ─── DSGVO-spezifische Audit-Funktionen ───────────────────────────────────────

/**
 * Loggt einen DSGVO-Auskunftsantrag
 */
export async function logGdprExportRequest(userId: string, requesterEmail: string): Promise<void> {
  await logAudit({
    action: "gdpr_export_request",
    category: "data",
    object_type: "users",
    object_id: userId,
    details: `Auskunft angefordert von: ${requesterEmail}`,
  });
}

/**
 * Loggt eine Datenlöschung (DSGVO Art. 17)
 */
export async function logPersonalDataDeletion(
  objectType: string,
  objectId: string,
  reason: string
): Promise<void> {
  await logAudit({
    action: "personal_data_deleted",
    category: "data",
    object_type: objectType,
    object_id: objectId,
    details: reason,
  });
}

/**
 * Loggt eine Einwilligung (DSGVO Art. 7)
 */
export async function logConsent(
  consentType: string,
  granted: boolean,
  objectType?: string,
  objectId?: string
): Promise<void> {
  await logAudit({
    action: "consent_recorded",
    category: "data",
    object_type: objectType,
    object_id: objectId,
    details: `${consentType}: ${granted ? "erteilt" : "widerrufen"}`,
  });
}

// ─── Kompatibilität mit altem Code ────────────────────────────────────────────

/**
 * @deprecated Bitte logAudit mit options-Objekt verwenden
 */
export async function legacyLogAudit(action: string, details = ""): Promise<void> {
  return logAudit({ action, details });
}