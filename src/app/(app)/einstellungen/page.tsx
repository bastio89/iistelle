"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Company, Invitation, ROLE_META, UserRole, UserRoleRow } from "@/lib/types";
import { useRole } from "@/lib/useRole";
import { PageHeader, formatDate } from "@/components/ui";
import {
  Building2,
  Copy,
  Globe,
  KeyRound,
  ShieldCheck,
  Trash2,
  UserCircle,
  UserPlus,
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
      })
      .eq("id", settings.id);
    setMsg(
      error
        ? { type: "err", text: error.message }
        : { type: "ok", text: "Unternehmenseinstellungen gespeichert." }
    );
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
    const { error } = await supabase
      .from("user_roles")
      .update({ role })
      .eq("user_id", userId);
    if (!error) {
      setRoles((prev) =>
        prev.map((r) => (r.user_id === userId ? { ...r, role } : r))
      );
      setMsg({ type: "ok", text: "Rolle aktualisiert." });
    } else {
      setMsg({ type: "err", text: error.message });
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
    </div>
  );
}
