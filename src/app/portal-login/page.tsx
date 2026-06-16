"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function PortalLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push("/portal");
      }
    });
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Anmeldung fehlgeschlagen: " + error.message);
      setLoading(false);
      return;
    }
    router.push("/portal");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-petrol-900 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="iistelle" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold tracking-tight">iistelle</span>
          </div>
          <h1 className="mt-16 max-w-md text-4xl font-bold leading-tight">
            Dein persönliches Mitarbeiterportal
          </h1>
          <p className="mt-4 max-w-md text-petrol-200">
            Erfasse deine Arbeitszeit, beantrage Urlaub und behalte deine Ziele im Blick – alles an einem Ort.
          </p>
          <div className="mt-12 space-y-4">
            {[
              { icon: "⏰", text: "Zeiterfassung mit nur einem Klick" },
              { icon: "🏖️", text: "Urlaub einfach online beantragen" },
              { icon: "📄", text: "Deine Dokumente immer griffbereit" },
              { icon: "🎯", text: "Ziele und Fortschritt verfolgen" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-petrol-100">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-petrol-400">
          © {new Date().getFullYear()} iistelle · Alle Daten DSGVO-konform in Frankfurt gehostet
        </p>
      </div>

      {/* Right Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Image src="/logo.svg" alt="iistelle" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold text-petrol-900">iistelle</span>
            <span className="ml-2 rounded bg-coral-100 px-2 py-0.5 text-xs font-medium text-coral-700">Portal</span>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-petrol-100">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-petrol-900">Mitarbeiter-Portal</h2>
              <p className="mt-1 text-sm text-petrol-500">
                Melde dich mit deinem Firmen-Account an
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-petrol-700">E-Mail</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vorname.nachname@firma.de"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-petrol-700">Passwort</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dein Passwort"
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
                className="btn-primary w-full justify-center"
                disabled={loading}
              >
                {loading ? "Bitte warten…" : "Zum Portal"}
              </button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-4 text-center text-sm text-petrol-500">
              <p>
                Noch kein Konto?{" "}
                <a href="/karriere" className="font-semibold text-petrol-700 hover:underline">
                  Karriereseite besuchen
                </a>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-petrol-400">
            <a href="/login" className="hover:underline">
              Admin-Login →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}