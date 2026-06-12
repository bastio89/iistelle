"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STAGES } from "@/lib/types";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

interface StatusInfo {
  stage: string;
  job_title: string;
  company_name: string;
  first_name: string;
  applied_at: string;
  updated_at: string;
}

const PORTAL_STAGES = STAGES.filter((s) => s.key !== "abgelehnt");

export default function ApplicationStatusPage() {
  const { token } = useParams<{ token: string }>();
  const supabase = createClient();
  const [info, setInfo] = useState<StatusInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .rpc("get_application_status", { p_token: token })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : data;
        setInfo((row as StatusInfo) ?? null);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-petrol-400">Lade Status…</p>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <h1 className="text-2xl font-bold text-petrol-900">Link ungültig</h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Unter diesem Link wurde keine Bewerbung gefunden. Bitte prüfe die Adresse.
        </p>
      </div>
    );
  }

  const isRejected = info.stage === "abgelehnt";
  const currentIdx = PORTAL_STAGES.findIndex((s) => s.key === info.stage);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-petrol-950 px-6 py-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-400">
          Bewerbungsstatus
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
          {info.job_title}
        </h1>
        <p className="mt-1 text-petrol-200">{info.company_name}</p>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="card p-8">
          <p className="text-petrol-700">
            Hallo {info.first_name}, hier siehst du jederzeit den aktuellen Stand
            deiner Bewerbung:
          </p>

          {isRejected ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-rose-50 p-5">
              <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-500" />
              <div>
                <p className="font-bold text-petrol-900">
                  Diese Bewerbung wurde leider nicht weiterverfolgt.
                </p>
                <p className="mt-1 text-sm text-petrol-600">
                  Vielen Dank für dein Interesse und deine Zeit – wir wünschen
                  dir für deinen weiteren Weg alles Gute!
                </p>
              </div>
            </div>
          ) : (
            <ol className="mt-8 space-y-0">
              {PORTAL_STAGES.map((s, idx) => {
                const isDone = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <li key={s.key} className="relative flex gap-4 pb-8 last:pb-0">
                    {idx < PORTAL_STAGES.length - 1 && (
                      <span
                        className={`absolute left-[11px] top-7 h-full w-0.5 ${
                          isDone ? "bg-emerald-400" : "bg-petrol-100"
                        }`}
                      />
                    )}
                    {isDone ? (
                      <CheckCircle2 className="relative z-10 h-6 w-6 shrink-0 text-emerald-500" />
                    ) : isCurrent ? (
                      <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                        <span className="absolute h-6 w-6 animate-ping rounded-full bg-coral-400/40" />
                        <span className="h-4 w-4 rounded-full bg-coral-500" />
                      </span>
                    ) : (
                      <Circle className="relative z-10 h-6 w-6 shrink-0 text-petrol-200" />
                    )}
                    <div>
                      <p
                        className={`font-semibold ${
                          isCurrent
                            ? "text-petrol-900"
                            : isDone
                              ? "text-petrol-700"
                              : "text-petrol-300"
                        }`}
                      >
                        {s.label}
                      </p>
                      {isCurrent && (
                        <p className="mt-0.5 text-sm text-petrol-500">
                          Aktueller Stand · zuletzt aktualisiert am{" "}
                          {new Date(info.updated_at).toLocaleDateString("de-DE")}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <p className="mt-8 border-t border-petrol-50 pt-4 text-xs text-petrol-400">
            Eingereicht am {new Date(info.applied_at).toLocaleDateString("de-DE")}.
            Diese Seite aktualisiert sich automatisch bei jedem Aufruf.
          </p>
        </div>
      </main>
    </div>
  );
}
