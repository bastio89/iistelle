"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CompanySettings } from "@/lib/types";
import { PageHeader } from "@/components/ui";
import { Building2, KeyRound, UserCircle } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: u }] = await Promise.all([
        supabase.from("company_settings").select("*").eq("id", 1).single(),
        supabase.auth.getUser(),
      ]);
      setSettings(s as CompanySettings);
      setEmail(u.user?.email ?? "");
      setProfileName((u.user?.user_metadata?.full_name as string) ?? "");
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const { error } = await supabase
      .from("company_settings")
      .update({
        company_name: settings.company_name,
        default_vacation_days: settings.default_vacation_days,
        probation_months: settings.probation_months,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
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
                  value={settings.company_name}
                  onChange={(e) =>
                    setSettings({ ...settings, company_name: e.target.value })
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
    </div>
  );
}
