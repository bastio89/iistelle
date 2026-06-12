"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CalendarClock, CheckCircle2 } from "lucide-react";

interface SlotRow {
  title: string;
  interviewer: string;
  duration_min: number;
  status: string;
  company_name: string;
  job_title: string;
  slot_id: string | null;
  starts_at: string | null;
  taken: boolean | null;
}

export default function BookingPage() {
  const { token } = useParams<{ token: string }>();
  const supabase = createClient();
  const [rows, setRows] = useState<SlotRow[]>([]);
  const [booking, setBooking] = useState(false);
  const [bookedAt, setBookedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.rpc("get_scheduling_link", { p_token: token });
    setRows((data as SlotRow[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function book(slotId: string, startsAt: string) {
    setBooking(true);
    setError(null);
    const { data } = await supabase.rpc("book_slot", {
      p_token: token,
      p_slot_id: slotId,
    });
    if (data === true) {
      setBookedAt(startsAt);
    } else {
      setError("Dieser Termin ist leider nicht mehr verfügbar. Bitte wähle einen anderen.");
      load();
    }
    setBooking(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-petrol-400">Lade Terminvorschläge…</p>
      </div>
    );
  }

  const meta = rows[0];

  if (!meta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <h1 className="text-2xl font-bold text-petrol-900">Link ungültig</h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Unter diesem Link wurde keine Terminbuchung gefunden.
        </p>
      </div>
    );
  }

  if (bookedAt || meta.status === "gebucht") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h1 className="mt-5 text-2xl font-bold text-petrol-900">
          Termin bestätigt!
        </h1>
        <p className="mt-2 max-w-md text-petrol-600">
          {bookedAt
            ? `Dein ${meta.title} bei ${meta.company_name} findet am ${new Date(bookedAt).toLocaleString("de-DE", { dateStyle: "full", timeStyle: "short" })} Uhr statt.`
            : `Für diesen Link wurde bereits ein Termin gebucht.`}
        </p>
        <p className="mt-1 text-sm text-petrol-400">
          Alle Details bekommst du von {meta.interviewer || "deinem Gesprächspartner"} – wir freuen uns auf dich!
        </p>
      </div>
    );
  }

  const freeSlots = rows.filter((r) => r.slot_id && !r.taken);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-petrol-950 px-6 py-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-400">
          Terminbuchung
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
          {meta.title} – {meta.job_title}
        </h1>
        <p className="mt-1 text-petrol-200">
          {meta.company_name} · {meta.duration_min} Minuten
          {meta.interviewer && ` · mit ${meta.interviewer}`}
        </p>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="card p-8">
          <p className="text-petrol-700">
            Wähle den Termin, der dir am besten passt – die Buchung ist sofort
            verbindlich bestätigt:
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-2.5">
            {freeSlots.length === 0 ? (
              <p className="py-6 text-center text-sm text-petrol-400">
                Aktuell sind keine freien Termine verfügbar. Bitte melde dich
                direkt beim Unternehmen.
              </p>
            ) : (
              freeSlots.map((s) => (
                <button
                  key={s.slot_id}
                  disabled={booking}
                  onClick={() => book(s.slot_id!, s.starts_at!)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-petrol-200 bg-white px-5 py-4 text-left transition hover:border-petrol-600 hover:shadow-cardHover disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-petrol-500" />
                    <span>
                      <span className="block font-semibold text-petrol-900">
                        {new Date(s.starts_at!).toLocaleDateString("de-DE", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                        })}
                      </span>
                      <span className="text-sm text-petrol-500">
                        {new Date(s.starts_at!).toLocaleTimeString("de-DE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        Uhr · {meta.duration_min} Min
                      </span>
                    </span>
                  </span>
                  <span className="text-sm font-bold text-coral-500">Buchen →</span>
                </button>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
