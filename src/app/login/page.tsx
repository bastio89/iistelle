"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Briefcase, KanbanSquare, CalendarClock, BarChart3 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("demo@iistelle.de");
  const [password, setPassword] = useState("iistelle2026");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Anmeldung fehlgeschlagen: " + error.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, company_name: companyName } },
      });
      if (error) {
        setError("Registrierung fehlgeschlagen: " + error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setInfo(
          "Konto erstellt. Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach und melde dich dann an."
        );
        setMode("login");
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Linke Markenfläche */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-petrol-900 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral-500 text-lg font-black">
              ii
            </div>
            <span className="text-xl font-bold tracking-tight">iistelle HR</span>
          </div>
          <h1 className="mt-16 max-w-md text-4xl font-bold leading-tight">
            Stellen schneller besetzen. Prozesse schlank halten.
          </h1>
          <p className="mt-4 max-w-md text-petrol-200">
            Die All-in-One-Plattform für Recruiting: von der Stellenanzeige bis zur
            Einstellung – alles an einem Ort.
          </p>
          <div className="mt-12 grid max-w-md grid-cols-2 gap-4">
            {[
              { icon: Briefcase, text: "Stellen verwalten & veröffentlichen" },
              { icon: KanbanSquare, text: "Bewerber-Pipeline mit Drag & Drop" },
              { icon: CalendarClock, text: "Interviews planen & bewerten" },
              { icon: BarChart3, text: "Auswertungen in Echtzeit" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-3 rounded-xl bg-white/5 p-4 backdrop-blur"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-coral-400" />
                <span className="text-sm text-petrol-100">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-petrol-400">
          © {new Date().getFullYear()} iistelle HR · Alle Daten DSGVO-konform in Frankfurt gehostet
        </p>
      </div>

      {/* Rechtes Formular */}
      <div className="flex w-full items-center justify-center bg-surface px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral-500 text-lg font-black text-white">
              ii
            </div>
            <span className="text-xl font-bold text-petrol-900">iistelle HR</span>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-petrol-900">
              {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
            </h2>
            <p className="mt-1 text-sm text-petrol-500">
              {mode === "login"
                ? "Melde dich an, um auf dein HR-Cockpit zuzugreifen."
                : "Registriere dich mit deiner geschäftlichen E-Mail-Adresse."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "register" && (
                <>
                  <div>
                    <label className="label">Vollständiger Name</label>
                    <input
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Max Mustermann"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Firmenname</label>
                    <input
                      className="input"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="z. B. Musterfirma GmbH"
                      required
                    />
                    <p className="mt-1 text-xs text-petrol-400">
                      Für dein Unternehmen wird ein eigener, getrennter Bereich
                      inkl. Karriereseite angelegt.
                    </p>
                  </div>
                </>
              )}
              <div>
                <label className="label">E-Mail</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Passwort</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {info && (
                <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {info}
                </div>
              )}

              <button className="btn-primary w-full justify-center" disabled={loading}>
                {loading
                  ? "Bitte warten…"
                  : mode === "login"
                    ? "Anmelden"
                    : "Registrieren"}
              </button>
            </form>

            <div className="mt-6 border-t border-petrol-100 pt-4 text-center text-sm text-petrol-500">
              {mode === "login" ? (
                <>
                  Noch kein Konto?{" "}
                  <button
                    className="font-semibold text-petrol-700 hover:underline"
                    onClick={() => setMode("register")}
                  >
                    Jetzt registrieren
                  </button>
                </>
              ) : (
                <>
                  Bereits registriert?{" "}
                  <button
                    className="font-semibold text-petrol-700 hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Zur Anmeldung
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-petrol-300 bg-petrol-50 px-4 py-3 text-center text-xs text-petrol-600">
            Demo-Zugang: <strong>demo@iistelle.de</strong> / <strong>iistelle2026</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
