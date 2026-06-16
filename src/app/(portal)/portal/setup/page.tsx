"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function PortalSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [settingPassword, setSettingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Kein gültiger Link. Bitte wende dich an deinen Administrator.");
        setLoading(false);
        return;
      }

      // Verify the token via API
      const { data, error } = await supabase.rpc("verify_employee_setup_token", { token });

      if (error || !data) {
        setError("Der Link ist ungültig oder abgelaufen. Bitte wende dich an deinen Administrator.");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    verifyToken();
  }, [token, supabase]);

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setSettingPassword(true);

    try {
      // Verify token and set password
      const { data, error } = await supabase.rpc("complete_employee_setup", {
        token,
        new_password: password,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirect to onboarding after 2 seconds
      setTimeout(() => {
        router.push("/portal/onboarding");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setSettingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-coral-500" />
          <p className="mt-4 text-petrol-500">Link wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <AlertCircle className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="text-xl font-bold text-petrol-900">Ein Problem</h1>
          <p className="mt-3 text-petrol-500">{error}</p>
          <a href="/portal-login" className="btn-secondary mt-6 inline-block">
            Zurück zur Anmeldung
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-petrol-900">Passwort gesetzt! ✓</h1>
          <p className="mt-3 text-petrol-500">
            Willkommen! Wir leiten dich gleich weiter...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-petrol-900 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold tracking-tight">iistelle</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Willkommen im Team!</h1>
          <p className="mt-4 text-petrol-200">
            Richte jetzt dein persönliches Passwort ein, um auf das Mitarbeiterportal zuzugreifen.
          </p>
          <ul className="mt-8 space-y-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-petrol-100">Sichere Anmeldung</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-petrol-100">Zugriff auf deine Daten</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-petrol-100">Urlaub online beantragen</span>
            </li>
          </ul>
        </div>

        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} iistelle
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="iistelle" width={32} height={32} className="rounded" />
              <span className="font-bold text-petrol-900">iistelle</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-petrol-900">Passwort einrichten</h1>
            <p className="mt-2 text-petrol-500">
              Wähle ein sicheres Passwort für deinen Zugang zum Mitarbeiterportal.
            </p>

            <form onSubmit={handleSetPassword} className="mt-8 space-y-4">
              <div>
                <label className="label">Neues Passwort</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Mindestens 6 Zeichen"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="label">Passwort bestätigen</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Passwort wiederholen"
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={settingPassword}
                className="btn-primary w-full justify-center"
              >
                {settingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird eingerichtet...
                  </>
                ) : (
                  "Passwort setzen"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-petrol-400">
              Bereit ein Passwort? <a href="/portal-login" className="font-medium text-coral-600">Zurück zur Anmeldung</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}