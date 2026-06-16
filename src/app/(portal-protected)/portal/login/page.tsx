"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, ArrowRight, ShieldCheck, Clock, Calendar, Target } from "lucide-react";

export default function PortalLoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
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
            <h1 className="text-3xl font-bold">Mitarbeiterportal</h1>
            <p className="mt-4 text-petrol-200">
              Dein persönlicher Zugang zu allen HR-Funktionen.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-500/20">
                  <Clock className="h-5 w-5 text-coral-400" />
                </div>
                <span className="text-petrol-100">Zeiterfassung mit einem Klick</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                  <Calendar className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-petrol-100">Urlaub online beantragen</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
                  <Target className="h-5 w-5 text-violet-400" />
                </div>
                <span className="text-petrol-100">Deine Ziele verfolgen</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} iistelle
          </p>
        </div>

        {/* Right Side - Success */}
        <div className="flex w-full flex-col items-center justify-center bg-gray-50 p-8 lg:w-1/2">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Mail className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-petrol-900">E-Mail gesendet! 📧</h1>
            <p className="mt-4 text-petrol-500">
              Wir haben dir einen Anmeldelink an <strong>{email}</strong> geschickt.
              Klicke auf den Link in der E-Mail, um dich anzumelden.
            </p>
            <p className="mt-6 text-sm text-petrol-400">
              Keine E-Mail erhalten?{" "}
              <button
                onClick={() => setSent(false)}
                className="font-medium text-coral-600 hover:underline"
              >
                Erneut senden
              </button>
            </p>
          </div>
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
          <h1 className="text-3xl font-bold">Mitarbeiterportal</h1>
          <p className="mt-4 text-petrol-200">
            Dein persönlicher Zugang zu allen HR-Funktionen.
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-500/20">
                <Clock className="h-5 w-5 text-coral-400" />
              </div>
              <span className="text-petrol-100">Zeiterfassung mit einem Klick</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <Calendar className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-petrol-100">Urlaub online beantragen</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
                <Target className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-petrol-100">Deine Ziele verfolgen</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/60">
          <ShieldCheck className="h-4 w-4" />
          100% DSGVO-konform · Server in der Schweiz
        </div>
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
            <h1 className="text-2xl font-bold text-petrol-900">Anmeldung</h1>
            <p className="mt-2 text-petrol-500">
              Gib deine E-Mail-Adresse ein, um einen Anmeldelink zu erhalten.
            </p>

            <form onSubmit={handleMagicLink} className="mt-8 space-y-4">
              <div>
                <label className="label">E-Mail-Adresse</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="deine@email.ch"
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
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    Anmeldelink senden
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-petrol-100 pt-6">
              <p className="text-center text-sm text-petrol-500">
                Noch kein Konto?{" "}
                <Link href="/karriere" className="font-medium text-coral-600 hover:underline">
                  Karriereseite besuchen
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}