"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ApiKey,
  AuditLog,
  Automation,
  Company,
  Invitation,
  ROLE_META,
  STAGES,
  UserRole,
  UserRoleRow,
} from "@/lib/types";
import { logAudit } from "@/lib/audit";
import { PremiumSection } from "@/components/PremiumGate";
import { useRole } from "@/lib/useRole";
import { PageHeader, formatDate, formatDateTime } from "@/components/ui";
import {
  Building2,
  Copy,
  Globe,
  KeyRound,
  ScrollText,
  ShieldCheck,
  Trash2,
  UserCircle,
  UserPlus,
  Workflow,
} from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Company | null>(null);
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [roles, setRoles] = useState<UserRoleRow[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("mitarbeiter");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [autoForm, setAutoForm] = useState({
    trigger_stage: "angebot",
    task_title: "",
    assignee: "",
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyToken, setNewKeyToken] = useState<string | null>(null);
  const { isAdmin } = useRole();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: u }] = await Promise.all([
        supabase.from("companies").select("*").maybeSingle(),
        supabase.auth.getUser(),
      ]);
      setSettings(s as Company);
      setEmail(u.user?.email ?? "");
      setProfileName((u.user?.user_metadata?.full_name as string) ?? "");
      const [{ data: r }, { data: inv }] = await Promise.all([
        supabase.from("user_roles").select("*").order("created_at"),
        supabase.from("invitations").select("*").order("created_at", { ascending: false }),
      ]);
      setRoles((r as UserRoleRow[]) ?? []);
      setInvites((inv as Invitation[]) ?? []);
      const [{ data: autos }, { data: logs }, keysRes] = await Promise.all([
        supabase.from("automations").select("*").order("created_at"),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50),
        fetch("/api/api-keys"),
      ]);
      setAutomations((autos as Automation[]) ?? []);
      setAuditLogs((logs as AuditLog[]) ?? []);
      if (keysRes.ok) {
        const { data: keys } = await keysRes.json();
        setApiKeys((keys as ApiKey[]) ?? []);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const { error } = await supabase
      .from("companies")
      .update({
        name: settings.name,
        default_vacation_days: settings.default_vacation_days,
        probation_months: settings.probation_months,
        career_intro: settings.career_intro,
        onboarding_template: settings.onboarding_template,
        brand_color: settings.brand_color,
        slack_webhook_url: settings.slack_webhook_url,
        candidate_retention_months: settings.candidate_retention_months,
      })
      .eq("id", settings.id);
    setMsg(
      error
        ? { type: "err", text: error.message }
        : { type: "ok", text: "Unternehmenseinstellungen gespeichert." }
    );
  }

  async function addAutomation(e: React.FormEvent) {
    e.preventDefault();
    if (!autoForm.task_title.trim()) return;
    const { data, error } = await supabase
      .from("automations")
      .insert(autoForm)
      .select()
      .single();
    if (!error && data) {
      setAutomations((prev) => [...prev, data as Automation]);
      setAutoForm({ trigger_stage: "angebot", task_title: "", assignee: "" });
      setMsg({ type: "ok", text: "Automatisierung angelegt." });
    }
  }

  async function toggleAutomation(a: Automation) {
    await supabase.from("automations").update({ active: !a.active }).eq("id", a.id);
    setAutomations((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x))
    );
  }

  async function deleteAutomation(id: string) {
    await supabase.from("automations").delete().eq("id", id);
    setAutomations((prev) => prev.filter((x) => x.id !== id));
  }

  async function createApiKey() {
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Key ${apiKeys.length + 1}` }),
    });
    if (!res.ok) {
      setMsg({ type: "err", text: "API-Key konnte nicht erstellt werden." });
      return;
    }
    const { data } = await res.json();
    const { token, ...meta } = data as ApiKey & { token: string };
    setApiKeys((prev) => [...prev, meta as ApiKey]);
    setNewKeyToken(token);
    logAudit({ action: "api_key_created", category: "api", details: meta.name });
  }

  async function deleteApiKey(id: string) {
    const res = await fetch(`/api/api-keys?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setMsg({ type: "err", text: "API-Key konnte nicht gelöscht werden." });
      return;
    }
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    logAudit({ action: "api_key_deleted", category: "api" });
  }

  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    const path = `${settings.id}/logo-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("branding").upload(path, file);
    if (error) {
      setMsg({ type: "err", text: error.message });
      return;
    }
    const { data } = supabase.storage.from("branding").getPublicUrl(path);
    await supabase
      .from("companies")
      .update({ logo_url: data.publicUrl })
      .eq("id", settings.id);
    setSettings({ ...settings, logo_url: data.publicUrl });
    setMsg({ type: "ok", text: "Logo hochgeladen – es erscheint auf deiner Karriereseite." });
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: profileName },
    });
    setMsg(
      error
        ? { type: "err", text: error.message }
        : { type: "ok", text: "Profil aktualisiert." }
    );
  }

  async function changeRole(userId: string, role: UserRole) {
    const res = await fetch("/api/team/role", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user_id: userId, role }),
    });
    if (res.ok) {
      setRoles((prev) =>
        prev.map((r) => (r.user_id === userId ? { ...r, role } : r))
      );
      const target = roles.find((r) => r.user_id === userId);
      logAudit({
        action: "role_changed",
        category: "employee",
        object_type: "user_roles",
        object_id: userId,
        old_value: target?.role,
        new_value: role,
        details: `${target?.email ?? userId}: ${target?.role} → ${role}`,
      });
      setMsg({ type: "ok", text: "Rolle aktualisiert." });
    } else {
      const { error } = await res.json().catch(() => ({ error: "Fehler" }));
      setMsg({ type: "err", text: error ?? "Rolle konnte nicht geändert werden." });
    }
  }

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase
      .from("invitations")
      .insert({ email: inviteEmail.trim(), role: inviteRole })
      .select()
      .single();
    if (error) {
      setMsg({ type: "err", text: error.message });
      return;
    }
    setInvites((prev) => [data as Invitation, ...prev]);
    setInviteEmail("");
    setMsg({ type: "ok", text: "Einladung erstellt – Link kopieren und teilen." });
  }

  async function deleteInvite(id: string) {
    await supabase.from("invitations").delete().eq("id", id);
    setInvites((prev) => prev.filter((i) => i.id !== id));
  }

  async function copyInviteLink(inv: Invitation) {
    const link = `${window.location.origin}/login?einladung=${inv.token}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) setNewPassword("");
    setMsg(
      error
        ? { type: "err", text: error.message }
        : { type: "ok", text: "Passwort geändert." }
    );
  }

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Einstellungen…</p>;
  }

  return (
    <div>
      <PageHeader title="Einstellungen" subtitle="Unternehmen und dein Konto." />

      {msg && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-sm ${
            msg.type === "ok"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unternehmen */}
        <form onSubmit={saveCompany} className="card p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
              <Building2 className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-petrol-900">Unternehmen</h2>
          </div>
          {settings && (
            <div className="space-y-4">
              <div>
                <label className="label">Firmenname</label>
                <input
                  className="input"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-petrol-50 px-4 py-3 text-sm text-petrol-600">
                <Globe className="h-4 w-4 shrink-0" />
                <span>
                  Deine Karriereseite:{" "}
                  <a
                    href={`/karriere/${settings.slug}`}
                    target="_blank"
                    className="font-semibold text-petrol-800 underline"
                  >
                    /karriere/{settings.slug}
                  </a>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Logo (Karriereseite)</label>
                  <div className="flex items-center gap-3">
                    {settings.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={settings.logo_url}
                        alt="Logo"
                        className="h-10 w-10 rounded-lg bg-petrol-50 object-contain"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-petrol-50 text-xs font-bold text-petrol-400">
                        {settings.name.slice(0, 1)}
                      </div>
                    )}
                    <label className="btn-secondary cursor-pointer py-1.5">
                      Hochladen
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={uploadLogo}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="label">Markenfarbe</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.brand_color}
                      onChange={(e) =>
                        setSettings({ ...settings, brand_color: e.target.value })
                      }
                      className="h-10 w-14 cursor-pointer rounded-lg border border-petrol-200"
                    />
                    <span className="text-sm font-mono text-petrol-500">
                      {settings.brand_color}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Bewerberdaten-Löschfrist (Monate)</label>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={settings.candidate_retention_months}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        candidate_retention_months: Number(e.target.value),
                      })
                    }
                  />
                  <p className="mt-1 text-xs text-petrol-400">
                    Für das DSGVO-Center: Absagen älter als diese Frist werden
                    zur Löschung vorgeschlagen.
                  </p>
                </div>
                <div>
                  <label className="label">Slack-Webhook-URL (optional)</label>
                  <input
                    className="input"
                    value={settings.slack_webhook_url}
                    onChange={(e) =>
                      setSettings({ ...settings, slack_webhook_url: e.target.value })
                    }
                    placeholder="https://hooks.slack.com/services/…"
                  />
                  <p className="mt-1 text-xs text-petrol-400">
                    Neue Bewerbungen werden in deinen Kanal gepostet.
                  </p>
                </div>
              </div>
              <div>
                <label className="label">Karriereseiten-Begrüßung</label>
                <textarea
                  className="input min-h-20"
                  value={settings.career_intro}
                  onChange={(e) =>
                    setSettings({ ...settings, career_intro: e.target.value })
                  }
                  placeholder="Text, der Bewerber:innen auf deiner Karriereseite begrüßt"
                />
              </div>
              <div>
                <label className="label">Onboarding-Standard-Checkliste (eine Aufgabe pro Zeile)</label>
                <textarea
                  className="input min-h-32"
                  value={(settings.onboarding_template ?? []).join("\n")}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      onboarding_template: e.target.value
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Standard-Urlaubstage</label>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={settings.default_vacation_days}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        default_vacation_days: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Probezeit (Monate)</label>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={settings.probation_months}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        probation_months: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn-primary">Speichern</button>
              </div>
            </div>
          )}
        </form>

        <div className="space-y-6">
          {/* Profil */}
          <form onSubmit={saveProfile} className="card p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
                <UserCircle className="h-4 w-4" />
              </div>
              <h2 className="font-bold text-petrol-900">Mein Profil</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">E-Mail</label>
                <input className="input" value={email} disabled />
              </div>
              <div>
                <label className="label">Anzeigename</label>
                <input
                  className="input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button className="btn-primary">Speichern</button>
              </div>
            </div>
          </form>

          {/* Passwort */}
          <form onSubmit={changePassword} className="card p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
                <KeyRound className="h-4 w-4" />
              </div>
              <h2 className="font-bold text-petrol-900">Passwort ändern</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Neues Passwort</label>
                <input
                  className="input"
                  type="password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button className="btn-primary" disabled={newPassword.length < 6}>
                  Passwort ändern
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Team einladen (nur Admins) */}
      {isAdmin && (
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-petrol-900">Team einladen</h2>
              <p className="text-xs text-petrol-400">
                Erstelle einen Einladungslink und teile ihn – die Person tritt
                bei der Registrierung automatisch deiner Firma bei. Links sind
                14 Tage gültig.
              </p>
            </div>
          </div>

          <form onSubmit={createInvite} className="flex flex-wrap items-end gap-3">
            <div className="min-w-56 flex-1">
              <label className="label">E-Mail der Person</label>
              <input
                className="input"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="kollegin@firma.de"
                required
              />
            </div>
            <div>
              <label className="label">Rolle</label>
              <select
                className="input w-auto"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
              >
                <option value="mitarbeiter">Mitarbeiter</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn-primary">Einladung erstellen</button>
          </form>

          {invites.length > 0 && (
            <div className="mt-5 divide-y divide-petrol-50 border-t border-petrol-50">
              {invites.map((inv) => (
                <div key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-petrol-900">{inv.email}</p>
                    <p className="text-xs text-petrol-400">
                      {ROLE_META[inv.role].label} · erstellt am {formatDate(inv.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        inv.status === "angenommen"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.status === "angenommen" ? "Angenommen" : "Offen"}
                    </span>
                    {inv.status === "offen" && (
                      <button
                        className="btn-secondary py-1.5"
                        onClick={() => copyInviteLink(inv)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedId === inv.id ? "Kopiert ✓" : "Link kopieren"}
                      </button>
                    )}
                    <button
                      onClick={() => deleteInvite(inv.id)}
                      className="rounded-lg p-2 text-petrol-300 transition hover:bg-rose-50 hover:text-rose-500"
                      title="Einladung löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rollenverwaltung (nur Admins) */}
      {isAdmin && (
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-petrol-900">Benutzer & Rollen</h2>
              <p className="text-xs text-petrol-400">
                Admins sehen Gehaltsdaten und verwalten Rollen. Manager und
                Mitarbeiter haben keinen Zugriff auf Gehälter.
              </p>
            </div>
          </div>
          <div className="divide-y divide-petrol-50">
            {roles.map((r) => {
              const meta = ROLE_META[r.role];
              return (
                <div key={r.user_id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-petrol-900">{r.email}</p>
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <select
                    className="input w-auto py-1.5"
                    value={r.role}
                    onChange={(e) => changeRole(r.user_id, e.target.value as UserRole)}
                    disabled={r.email === email}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="mitarbeiter">Mitarbeiter</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Workflow-Automatisierungen (nur Admins, Professional) */}
      {isAdmin && (
        <PremiumSection feature="Workflow-Automatisierungen">
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
              <Workflow className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-petrol-900">Workflow-Automatisierungen</h2>
              <p className="text-xs text-petrol-400">
                Wenn eine Bewerbung in die gewählte Phase wechselt, wird automatisch
                eine Aufgabe erstellt. Platzhalter: {"{{kandidat}}, {{stelle}}"}
              </p>
            </div>
          </div>

          <form onSubmit={addAutomation} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="label">Wenn Phase wird…</label>
              <select
                className="input w-auto"
                value={autoForm.trigger_stage}
                onChange={(e) =>
                  setAutoForm({ ...autoForm, trigger_stage: e.target.value })
                }
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-64 flex-1">
              <label className="label">…erstelle Aufgabe</label>
              <input
                className="input"
                value={autoForm.task_title}
                onChange={(e) =>
                  setAutoForm({ ...autoForm, task_title: e.target.value })
                }
                placeholder="z. B. Vertrag für {{kandidat}} vorbereiten"
                required
              />
            </div>
            <div>
              <label className="label">Zuständig</label>
              <input
                className="input w-40"
                value={autoForm.assignee}
                onChange={(e) =>
                  setAutoForm({ ...autoForm, assignee: e.target.value })
                }
                placeholder="optional"
              />
            </div>
            <button className="btn-primary">Regel anlegen</button>
          </form>

          {automations.length > 0 && (
            <div className="mt-5 divide-y divide-petrol-50 border-t border-petrol-50">
              {automations.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <button
                    onClick={() => toggleAutomation(a)}
                    className={`relative h-5 w-9 rounded-full transition ${
                      a.active ? "bg-emerald-500" : "bg-petrol-200"
                    }`}
                    title={a.active ? "Aktiv" : "Pausiert"}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                        a.active ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <p className="flex-1 text-sm text-petrol-800">
                    <span className="font-semibold">
                      {STAGES.find((s) => s.key === a.trigger_stage)?.label ?? a.trigger_stage}
                    </span>{" "}
                    → „{a.task_title}“
                    {a.assignee && (
                      <span className="text-petrol-400"> · {a.assignee}</span>
                    )}
                  </p>
                  <button
                    onClick={() => deleteAutomation(a.id)}
                    className="rounded p-1.5 text-petrol-300 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </PremiumSection>
      )}

      {/* API-Keys (nur Admins, Professional) */}
      {isAdmin && (
        <PremiumSection feature="API-Zugriff">
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-bold text-petrol-900">API-Zugriff</h2>
                <p className="text-xs text-petrol-400">
                  Lese-Zugriff auf Stellen, Kandidaten und Bewerbungen via{" "}
                  <code className="rounded bg-petrol-50 px-1">/api/v1/…</code> mit
                  Bearer-Token.
                </p>
              </div>
            </div>
            <button className="btn-secondary" onClick={createApiKey}>
              Key erstellen
            </button>
          </div>
          {newKeyToken && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-semibold text-emerald-800">
                Neuer API-Key – jetzt kopieren, er wird nur einmal angezeigt:
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded bg-white px-2 py-1 text-xs text-petrol-700">
                  {newKeyToken}
                </code>
                <button
                  className="btn-secondary py-1.5"
                  onClick={async () => {
                    await navigator.clipboard.writeText(newKeyToken);
                    setCopiedId("new-token");
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedId === "new-token" ? "Kopiert ✓" : "Kopieren"}
                </button>
                <button
                  className="rounded p-1.5 text-petrol-400 hover:text-petrol-700"
                  onClick={() => setNewKeyToken(null)}
                  title="Ausblenden"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          {apiKeys.length === 0 ? (
            <p className="py-3 text-center text-sm text-petrol-400">
              Noch keine API-Keys.
            </p>
          ) : (
            <div className="divide-y divide-petrol-50">
              {apiKeys.map((k) => (
                <div key={k.id} className="flex items-center gap-3 py-3">
                  <span className="text-sm font-semibold text-petrol-900">{k.name}</span>
                  <code className="min-w-0 flex-1 truncate rounded bg-petrol-50 px-2 py-1 text-xs text-petrol-700">
                    {k.key_prefix}…
                  </code>
                  <button
                    onClick={() => deleteApiKey(k.id)}
                    className="rounded p-1.5 text-petrol-300 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </PremiumSection>
      )}

      {/* Audit-Log (nur Admins) */}
      {isAdmin && (
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
              <ScrollText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-petrol-900">Audit-Log</h2>
              <p className="text-xs text-petrol-400">
                Die letzten 50 sicherheitsrelevanten Aktionen (Rollen, Gehälter,
                Löschungen, Exporte).
              </p>
            </div>
          </div>
          {auditLogs.length === 0 ? (
            <p className="py-3 text-center text-sm text-petrol-400">
              Noch keine Einträge.
            </p>
          ) : (
            <div className="max-h-80 divide-y divide-petrol-50 overflow-y-auto">
              {auditLogs.map((l) => (
                <div key={l.id} className="py-2.5 text-sm">
                  <p className="text-petrol-800">
                    <span className="font-semibold">{l.actor}</span> · {l.action}
                    {l.details && (
                      <span className="text-petrol-500"> – {l.details}</span>
                    )}
                  </p>
                  <p className="text-xs text-petrol-400">{formatDateTime(l.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
