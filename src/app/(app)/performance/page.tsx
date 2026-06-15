"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  GOAL_STATUS_META,
  Goal,
  Review,
  REVIEW_TYPE_LABEL,
  ReviewType,
  REVIEW_CYCLE_STATUS_META,
  ReviewCycle,
  PeerFeedbackRequest,
  PeerFeedback,
  Employee,
} from "@/lib/types";
import { useRole } from "@/lib/useRole";
import {
  Avatar,
  EmptyState,
  Modal,
  PageHeader,
  RatingStars,
  StatCard,
  formatDate,
} from "@/components/ui";
import {
  Plus,
  Target,
  Users,
  Calendar,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

type Tab = "ziele" | "reviews" | "360" | "zyklen";

export default function PerformancePage() {
  const supabase = createClient();
  const { isAdmin } = useRole();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cycles, setCycles] = useState<ReviewCycle[]>([]);
  const [peerRequests, setPeerRequests] = useState<PeerFeedbackRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("ziele");
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<PeerFeedbackRequest | null>(null);

  const load = async () => {
    const [g, r, c, p, e] = await Promise.all([
      supabase
        .from("goals")
        .select("*, employee:employees(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select("*, employee:employees(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("review_cycles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("peer_feedback_requests")
        .select("*, from_employee:employees!from_employee_id(*), to_employee:employees!to_employee_id(*), cycle:review_cycles(*)")
        .order("created_at", { ascending: false }),
      supabase.from("employees").select("*").order("last_name"),
    ]);
    setGoals((g.data as Goal[]) ?? []);
    setReviews((r.data as Review[]) ?? []);
    setCycles((c.data as ReviewCycle[]) ?? []);
    setPeerRequests((p.data as PeerFeedbackRequest[]) ?? []);
    setEmployees((e.data as Employee[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Performance-Daten…</p>;
  }

  const achieved = goals.filter((g) => g.status === "erreicht").length;
  const avgProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
    : 0;
  const avgScore = reviews.length
    ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1)
    : "–";

  const activeCycle = cycles.find((c) => c.status === "aktiv");
  const pendingRequests = peerRequests.filter((r) => r.status === "ausstehend").length;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "ziele", label: "Ziele" },
    { key: "reviews", label: "Reviews" },
    { key: "360", label: "360° Feedback", count: pendingRequests > 0 ? pendingRequests : undefined },
    { key: "zyklen", label: "Zyklen", count: cycles.length },
  ];

  return (
    <div>
      <PageHeader
        title="Performance"
        subtitle="Ziele, Reviews und 360°-Feedback im Überblick."
        action={
          isAdmin ? (
            <button className="btn-primary" onClick={() => setShowCycleModal(true)}>
              <Plus className="h-4 w-4" /> Neuer Zyklus
            </button>
          ) : undefined
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Aktive Ziele" value={goals.length} sub={`${achieved} erreicht`} />
        <StatCard label="Ø Zielfortschritt" value={`${avgProgress}%`} accent />
        <StatCard label="Ø Review-Score" value={avgScore} sub={`${reviews.length} Reviews`} />
        <StatCard
          label="360° Anfragen"
          value={pendingRequests}
          sub={activeCycle ? `im Zyklus ${activeCycle.name}` : "Kein aktiver Zyklus"}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-petrol-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "text-petrol-900 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-coral-500"
                : "text-petrol-400 hover:text-petrol-700"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-500 px-1.5 text-xs font-bold text-white">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "ziele" && (
        <div className="space-y-3">
          {goals.length === 0 ? (
            <EmptyState title="Keine Ziele definiert" />
          ) : (
            goals.map((g) => {
              const meta = GOAL_STATUS_META[g.status];
              return (
                <div key={g.id} className="card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/mitarbeiter/${g.employee_id}`}
                      className="flex items-center gap-2.5"
                    >
                      <Avatar
                        name={`${g.employee?.first_name} ${g.employee?.last_name}`}
                        size="sm"
                      />
                      <span className="text-sm font-semibold text-petrol-900">
                        {g.employee?.first_name} {g.employee?.last_name}
                      </span>
                    </Link>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold text-petrol-800">{g.title}</p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-petrol-50">
                      <div
                        className="h-full rounded-full bg-petrol-600"
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-petrol-700">{g.progress}%</span>
                  </div>
                  {g.due_date && (
                    <p className="mt-1.5 text-xs text-petrol-400">
                      Fällig: {formatDate(g.due_date)}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <EmptyState title="Noch keine Reviews" />
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/mitarbeiter/${r.employee_id}`}
                    className="flex items-center gap-2.5"
                  >
                    <Avatar
                      name={`${r.employee?.first_name} ${r.employee?.last_name}`}
                      size="sm"
                    />
                    <span className="text-sm font-semibold text-petrol-900">
                      {r.employee?.first_name} {r.employee?.last_name}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        r.review_type === "self"
                          ? "bg-violet-100 text-violet-800"
                          : r.review_type === "peer"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-petrol-100 text-petrol-700"
                      }`}
                    >
                      {REVIEW_TYPE_LABEL[r.review_type] ?? "Manager-Review"}
                    </span>
                    <RatingStars value={r.score} size={14} />
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-petrol-400">
                  {r.cycle} · von {r.reviewer} · {formatDate(r.created_at)}
                </p>
                {r.strengths && (
                  <p className="mt-2 text-sm text-petrol-700">
                    <span className="font-semibold text-emerald-700">Stärken:</span> {r.strengths}
                  </p>
                )}
                {r.improvements && (
                  <p className="mt-1 text-sm text-petrol-700">
                    <span className="font-semibold text-amber-700">Entwicklung:</span> {r.improvements}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "360" && (
        <div className="space-y-6">
          {/* Active Cycle Banner */}
          {activeCycle ? (
            <div className="card flex items-center justify-between bg-gradient-to-r from-petrol-800 to-petrol-900 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-petrol-300">Aktiver Zyklus</p>
                  <p className="text-lg font-bold">{activeCycle.name}</p>
                  <p className="text-sm text-petrol-300">
                    {formatDate(activeCycle.start_date)}
                    {activeCycle.end_date && ` – ${formatDate(activeCycle.end_date)}`}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <Link
                  href="/mitarbeiter"
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
                >
                  Kollegen nominieren <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="card flex items-center justify-between border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">Kein aktiver 360°-Zyklus</p>
                  <p className="text-sm text-amber-700">
                    Starte einen neuen Zyklus, um 360°-Feedback zu sammeln.
                  </p>
                </div>
              </div>
              {isAdmin && (
                <button className="btn-primary" onClick={() => setShowCycleModal(true)}>
                  <Plus className="h-4 w-4" /> Zyklus starten
                </button>
              )}
            </div>
          )}

          {/* Peer Feedback Requests */}
          <div className="card p-6">
            <h3 className="mb-4 font-bold text-petrol-900">Peer-Feedback Anfragen</h3>
            {peerRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-petrol-200 p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-petrol-300" />
                <p className="mt-3 text-sm text-petrol-500">
                  Noch keine Peer-Feedback-Anfragen.
                </p>
                {isAdmin && (
                  <p className="mt-1 text-xs text-petrol-400">
                    Nominieren Sie Kollegen für gegenseitiges Feedback.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {peerRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-lg border border-petrol-100 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {req.from_employee && (
                          <Avatar
                            name={`${req.from_employee.first_name} ${req.from_employee.last_name}`}
                            size="sm"
                          />
                        )}
                        {req.to_employee && (
                          <Avatar
                            name={`${req.to_employee.first_name} ${req.to_employee.last_name}`}
                            size="sm"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-petrol-900">
                          {req.from_employee?.first_name} → {req.to_employee?.first_name}
                        </p>
                        <p className="text-xs text-petrol-400">
                          {req.cycle?.name || "Kein Zyklus"} · angefordert am{" "}
                          {formatDate(req.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          req.status === "ausstehend"
                            ? "bg-amber-100 text-amber-800"
                            : req.status === "eingereicht"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {req.status === "ausstehend"
                          ? "⏳ Ausstehend"
                          : req.status === "eingereicht"
                            ? "✓ Eingereicht"
                            : "✗ Abgelehnt"}
                      </span>
                      {req.status === "ausstehend" && isAdmin && (
                        <button
                          onClick={() => setShowFeedbackModal(req)}
                          className="btn-secondary !px-3 !py-1.5"
                        >
                          Feedback geben
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="card p-6">
            <h3 className="mb-3 font-bold text-petrol-900">So funktioniert 360°-Feedback</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-petrol-800">Kollegen nominieren</p>
                  <p className="text-sm text-petrol-500">
                    Als Admin bestimmst du, wer wem Feedback gibt.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-petrol-800">Feedback geben</p>
                  <p className="text-sm text-petrol-500">
                    Kollegen bewerten Stärken und Entwicklungsfelder.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-petrol-800">Auswertung</p>
                  <p className="text-sm text-petrol-500">
                    Ergebnisse werden anonymisiert in Reviews übernommen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "zyklen" && (
        <div className="space-y-6">
          {cycles.length === 0 ? (
            <div className="card p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-petrol-300" />
              <h3 className="mt-4 text-lg font-bold text-petrol-900">Keine Review-Zyklen</h3>
              <p className="mt-2 text-petrol-500">
                Erstelle einen Zyklus, um Reviews und 360°-Feedback zu verwalten.
              </p>
              {isAdmin && (
                <button className="btn-primary mt-4" onClick={() => setShowCycleModal(true)}>
                  <Plus className="h-4 w-4" /> Ersten Zyklus erstellen
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {cycles.map((cycle) => {
                const meta = REVIEW_CYCLE_STATUS_META[cycle.status];
                const cycleReviews = reviews.filter((r) => r.cycle === cycle.name).length;
                const cycleRequests = peerRequests.filter((r) => r.cycle_id === cycle.id).length;
                return (
                  <div key={cycle.id} className="card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            cycle.status === "aktiv"
                              ? "bg-emerald-100 text-emerald-600"
                              : cycle.status === "geplant"
                                ? "bg-sky-100 text-sky-600"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-petrol-900">{cycle.name}</p>
                          <p className="text-sm text-petrol-500">
                            {formatDate(cycle.start_date)}
                            {cycle.end_date && ` – ${formatDate(cycle.end_date)}`}
                          </p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-petrol-50 pt-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-petrol-900">{cycleReviews}</p>
                        <p className="text-xs text-petrol-400">Reviews</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-petrol-900">{cycleRequests}</p>
                        <p className="text-xs text-petrol-400">Feedback-Anfragen</p>
                      </div>
                    </div>
                    {cycle.status === "aktiv" && isAdmin && (
                      <button className="btn-secondary mt-4 w-full">
                        Zyklus abschliessen
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCycleModal && (
        <CreateCycleModal
          onClose={() => setShowCycleModal(false)}
          onSaved={() => {
            setShowCycleModal(false);
            load();
          }}
        />
      )}

      {showFeedbackModal && (
        <FeedbackModal
          request={showFeedbackModal}
          onClose={() => setShowFeedbackModal(null)}
          onSaved={() => {
            setShowFeedbackModal(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateCycleModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const { company } = useRole();
  const [form, setForm] = useState({
    name: `H${new Date().getMonth() < 6 ? 1 : 2} ${new Date().getFullYear()}`,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: "",
    status: "geplant" as ReviewCycle["status"],
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    await supabase.from("review_cycles").insert({
      company_id: company.id,
      name: form.name,
      start_date: form.start_date,
      end_date: form.end_date || null,
      status: form.status,
    });
    onSaved();
  }

  return (
    <Modal title="Review-Zyklus erstellen" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Name (z.B. H1 2026)</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Startdatum</label>
            <input
              className="input"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Enddatum (optional)</label>
            <input
              className="input"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ReviewCycle["status"] })}
          >
            <option value="geplant">Geplant</option>
            <option value="aktiv">Aktiv</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 border-t border-petrol-50 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Erstellen…" : "Erstellen"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function FeedbackModal({
  request,
  onClose,
  onSaved,
}: {
  request: PeerFeedbackRequest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    score: 3,
    strengths: "",
    improvements: "",
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("peer_feedbacks").insert({
      request_id: request.id,
      from_employee_id: request.from_employee_id,
      to_employee_id: request.to_employee_id,
      score: form.score,
      strengths: form.strengths,
      improvements: form.improvements,
    });
    await supabase
      .from("peer_feedback_requests")
      .update({ status: "eingereicht" })
      .eq("id", request.id);
    onSaved();
  }

  return (
    <Modal
      title={`Feedback für ${request.to_employee?.first_name} ${request.to_employee?.last_name}`}
      onClose={onClose}
    >
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Gesamtbewertung</label>
          <RatingStars value={form.score} onChange={(v) => setForm({ ...form, score: v })} size={28} />
        </div>
        <div>
          <label className="label">Was läuft besonders gut?</label>
          <textarea
            className="input min-h-24"
            value={form.strengths}
            onChange={(e) => setForm({ ...form, strengths: e.target.value })}
            placeholder="Beschreibe die Stärken dieser Person..."
          />
        </div>
        <div>
          <label className="label">Wo siehst du Entwicklungs-potenzial?</label>
          <textarea
            className="input min-h-24"
            value={form.improvements}
            onChange={(e) => setForm({ ...form, improvements: e.target.value })}
            placeholder="Beschreibe Bereiche, die verbessert werden könnten..."
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-petrol-50 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Wird gesendet…" : "Feedback einreichen"}
          </button>
        </div>
      </form>
    </Modal>
  );
}