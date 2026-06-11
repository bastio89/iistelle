"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Activity,
  Application,
  Candidate,
  DEFAULT_ONBOARDING_TASKS,
  EmailTemplate,
  Employee,
  Evaluation,
  INTERVIEW_TYPE_LABEL,
  Interview,
  STAGES,
  Stage,
} from "@/lib/types";
import { logActivity } from "@/lib/activity";
import {
  Avatar,
  Modal,
  RatingStars,
  StageBadge,
  formatDate,
  formatDateTime,
} from "@/components/ui";
import CandidateFormModal from "@/components/CandidateFormModal";
import {
  ArrowLeft,
  CalendarPlus,
  FileText,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Send,
  Star,
  UserPlus,
} from "lucide-react";
import { useRole } from "@/lib/useRole";

type Tab = "profil" | "interviews" | "bewertungen" | "notizen" | "verlauf";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tab, setTab] = useState<Tab>("profil");
  const [showEdit, setShowEdit] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [showEval, setShowEval] = useState(false);
  const [notes, setNotes] = useState("");
  const [employeeRecord, setEmployeeRecord] = useState<Employee | null>(null);
  const [converting, setConverting] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [c, a, emp] = await Promise.all([
      supabase.from("candidates").select("*").eq("id", id).single(),
      supabase
        .from("applications")
        .select("*, job:jobs(*)")
        .eq("candidate_id", id),
      supabase.from("employees").select("*").eq("candidate_id", id).maybeSingle(),
    ]);
    setEmployeeRecord((emp.data as Employee) ?? null);
    const candApps = (a.data as Application[]) ?? [];
    setCandidate(c.data as Candidate);
    setApps(candApps);
    setNotes(candApps[0]?.notes ?? "");

    if (candApps.length > 0) {
      const appIds = candApps.map((x) => x.id);
      const [iv, ev] = await Promise.all([
        supabase
          .from("interviews")
          .select("*")
          .in("application_id", appIds)
          .order("scheduled_at", { ascending: false }),
        supabase
          .from("evaluations")
          .select("*")
          .in("application_id", appIds)
          .order("created_at", { ascending: false }),
      ]);
      setInterviews((iv.data as Interview[]) ?? []);
      setEvals((ev.data as Evaluation[]) ?? []);
    }
    const { data: act } = await supabase
      .from("activities")
      .select("*")
      .eq("candidate_id", id)
      .order("created_at", { ascending: false });
    setActivities((act as Activity[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStage(appId: string, stage: Stage) {
    await supabase
      .from("applications")
      .update({ stage, updated_at: new Date().toISOString() })
      .eq("id", appId);
    const label = STAGES.find((s) => s.key === stage)?.label ?? stage;
    await logActivity(id, `Phase geändert auf „${label}“`);
    load();
  }

  async function updateRating(appId: string, rating: number) {
    await supabase.from("applications").update({ rating }).eq("id", appId);
    load();
  }

  async function saveNotes() {
    if (apps[0]) {
      await supabase.from("applications").update({ notes }).eq("id", apps[0].id);
      load();
    }
  }

  async function openCv() {
    if (!candidate?.cv_path) return;
    const { data } = await supabase.storage
      .from("bewerbungen")
      .createSignedUrl(candidate.cv_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function convertToEmployee() {
    if (!candidate) return;
    const hiredApp = apps.find((a) => a.stage === "eingestellt");
    setConverting(true);
    const { data, error } = await supabase
      .from("employees")
      .insert({
        first_name: candidate.first_name,
        last_name: candidate.last_name,
        email: candidate.email,
        phone: candidate.phone ?? "",
        position: hiredApp?.job?.title ?? "Neue Position",
        department: hiredApp?.job?.department ?? "Allgemein",
        location: hiredApp?.job?.location ?? candidate.city ?? "",
        employment_type: hiredApp?.job?.employment_type ?? "Vollzeit",
        status: "onboarding",
        hire_date: new Date().toISOString().slice(0, 10),
        manager: hiredApp?.job?.recruiter ?? "",
        candidate_id: candidate.id,
      })
      .select()
      .single();
    setConverting(false);
    if (!error && data) {
      // Standard-Onboarding-Checkliste anlegen
      await supabase.from("onboarding_tasks").insert(
        DEFAULT_ONBOARDING_TASKS.map((title, i) => ({
          employee_id: (data as Employee).id,
          title,
          sort_order: i,
        }))
      );
      await logActivity(id, "Als Mitarbeiter:in übernommen – Onboarding gestartet");
      setEmployeeRecord(data as Employee);
      load();
    }
  }

  if (loading || !candidate) {
    return <p className="py-20 text-center text-petrol-400">Lade Profil…</p>;
  }

  const fullName = `${candidate.first_name} ${candidate.last_name}`;
  const avgScore =
    evals.length > 0
      ? (evals.reduce((s, e) => s + e.score, 0) / evals.length).toFixed(1)
      : null;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "profil", label: "Profil" },
    { key: "interviews", label: "Interviews", count: interviews.length },
    { key: "bewertungen", label: "Bewertungen", count: evals.length },
    { key: "notizen", label: "Notizen" },
    { key: "verlauf", label: "Verlauf", count: activities.length },
  ];

  return (
    <div>
      <Link
        href="/recruiting/kandidaten"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-petrol-500 hover:text-petrol-800"
      >
        <ArrowLeft className="h-4 w-4" /> Zurück zu den Kandidaten
      </Link>

      {/* Kopfbereich */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={fullName} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-petrol-900">{fullName}</h1>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-petrol-500">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {candidate.email}
                </span>
                {candidate.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> {candidate.phone}
                  </span>
                )}
                {candidate.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {candidate.city}
                  </span>
                )}
                {candidate.linkedin && (
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    className="flex items-center gap-1 text-petrol-600 hover:underline"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {avgScore && (
              <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {avgScore} / 5
              </span>
            )}
            {candidate.cv_path && (
              <button className="btn-secondary" onClick={openCv}>
                <FileText className="h-4 w-4" /> Lebenslauf
              </button>
            )}
            {employeeRecord ? (
              <Link href={`/mitarbeiter/${employeeRecord.id}`} className="btn-secondary">
                <UserPlus className="h-4 w-4" /> Zur Personalakte
              </Link>
            ) : (
              apps.some((a) => a.stage === "eingestellt") && (
                <button
                  className="btn-primary"
                  onClick={convertToEmployee}
                  disabled={converting}
                >
                  <UserPlus className="h-4 w-4" />
                  {converting ? "Übernehme…" : "Als Mitarbeiter übernehmen"}
                </button>
              )
            )}
            <button className="btn-secondary" onClick={() => setShowEmail(true)}>
              <Send className="h-4 w-4" /> E-Mail
            </button>
            <button className="btn-secondary" onClick={() => setShowEdit(true)}>
              <Pencil className="h-4 w-4" /> Bearbeiten
            </button>
          </div>
        </div>

        {/* Bewerbungen mit Phasen-Steuerung */}
        <div className="mt-6 space-y-3 border-t border-petrol-50 pt-5">
          {apps.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-petrol-50/60 px-4 py-3"
            >
              <div>
                <Link
                  href={`/recruiting/jobs/${a.job_id}`}
                  className="font-semibold text-petrol-900 hover:text-petrol-600"
                >
                  {a.job?.title}
                </Link>
                <p className="text-xs text-petrol-400">
                  Beworben am {formatDate(a.applied_at)}
                  {a.salary_expectation && ` · Gehaltswunsch: ${a.salary_expectation}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <RatingStars
                  value={a.rating}
                  onChange={(v) => updateRating(a.id, v)}
                />
                <select
                  className="input w-auto py-1.5"
                  value={a.stage}
                  onChange={(e) => updateStage(a.id, e.target.value as Stage)}
                >
                  {STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {apps.length === 0 && (
            <p className="text-sm text-petrol-400">
              Noch keine Bewerbung vorhanden. Füge diese Person über eine Stellen-Detailseite
              einer Stelle hinzu.
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-petrol-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "text-petrol-900 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-coral-500"
                : "text-petrol-400 hover:text-petrol-700"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1.5 rounded-full bg-petrol-100 px-1.5 py-0.5 text-[10px] font-bold text-petrol-600">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "profil" && (
          <div className="card p-6">
            <h3 className="mb-2 font-bold text-petrol-900">Kurzprofil</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-petrol-700">
              {candidate.cv_summary || "Noch keine Zusammenfassung hinterlegt."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-petrol-50 pt-4 text-sm md:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase text-petrol-400">Quelle</p>
                <p className="mt-1 font-medium text-petrol-800">{candidate.source}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-petrol-400">Im Pool seit</p>
                <p className="mt-1 font-medium text-petrol-800">
                  {formatDate(candidate.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "interviews" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                className="btn-primary"
                onClick={() => setShowInterview(true)}
                disabled={apps.length === 0}
              >
                <CalendarPlus className="h-4 w-4" /> Interview planen
              </button>
            </div>
            {interviews.length === 0 ? (
              <div className="card p-8 text-center text-sm text-petrol-400">
                Noch keine Interviews geplant.
              </div>
            ) : (
              interviews.map((iv) => (
                <div key={iv.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold text-petrol-900">{iv.title}</p>
                    <p className="text-sm text-petrol-500">
                      {formatDateTime(iv.scheduled_at)} · {iv.duration_min} Min ·{" "}
                      {INTERVIEW_TYPE_LABEL[iv.interview_type]} · {iv.interviewer}
                    </p>
                    {iv.notes && (
                      <p className="mt-1 text-sm italic text-petrol-500">„{iv.notes}“</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      iv.status === "geplant"
                        ? "bg-sky-100 text-sky-800"
                        : iv.status === "abgeschlossen"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {iv.status === "geplant"
                      ? "Geplant"
                      : iv.status === "abgeschlossen"
                        ? "Abgeschlossen"
                        : "Abgesagt"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "bewertungen" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                className="btn-primary"
                onClick={() => setShowEval(true)}
                disabled={apps.length === 0}
              >
                <Star className="h-4 w-4" /> Bewertung abgeben
              </button>
            </div>
            {evals.length === 0 ? (
              <div className="card p-8 text-center text-sm text-petrol-400">
                Noch keine Bewertungen vorhanden.
              </div>
            ) : (
              evals.map((ev) => (
                <div key={ev.id} className="card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar name={ev.interviewer} size="sm" />
                      <p className="font-semibold text-petrol-900">{ev.interviewer}</p>
                      <RatingStars value={ev.score} size={14} />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        ev.recommendation === "einstellen"
                          ? "bg-emerald-100 text-emerald-800"
                          : ev.recommendation === "ablehnen"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ev.recommendation === "einstellen"
                        ? "Einstellen"
                        : ev.recommendation === "ablehnen"
                          ? "Ablehnen"
                          : "Unentschieden"}
                    </span>
                  </div>
                  {ev.comments && (
                    <p className="mt-2 text-sm text-petrol-600">{ev.comments}</p>
                  )}
                  <p className="mt-2 text-xs text-petrol-400">{formatDate(ev.created_at)}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "verlauf" && (
          <div className="card p-6">
            <h3 className="mb-4 font-bold text-petrol-900">Aktivitäten-Verlauf</h3>
            {activities.length === 0 ? (
              <p className="py-6 text-center text-sm text-petrol-400">
                Noch keine Aktivitäten protokolliert. Phasenwechsel, Interviews
                und Bewertungen erscheinen hier automatisch.
              </p>
            ) : (
              <ol className="relative space-y-5 border-l-2 border-petrol-100 pl-6">
                {activities.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-petrol-500" />
                    <p className="text-sm font-medium text-petrol-800">
                      {a.description}
                    </p>
                    <p className="mt-0.5 text-xs text-petrol-400">
                      {formatDateTime(a.created_at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {tab === "notizen" && (
          <div className="card p-6">
            <h3 className="mb-3 font-bold text-petrol-900">Interne Notizen</h3>
            <textarea
              className="input min-h-36"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notizen zu dieser Person…"
              disabled={apps.length === 0}
            />
            <div className="mt-3 flex justify-end">
              <button className="btn-primary" onClick={saveNotes} disabled={apps.length === 0}>
                Notizen speichern
              </button>
            </div>
          </div>
        )}
      </div>

      {showEdit && (
        <CandidateFormModal
          candidate={candidate}
          onClose={() => setShowEdit(false)}
          onSaved={load}
        />
      )}

      {showInterview && apps.length > 0 && (
        <InterviewModal
          apps={apps}
          onClose={() => setShowInterview(false)}
          onSaved={() => {
            setShowInterview(false);
            load();
          }}
        />
      )}

      {showEval && apps.length > 0 && (
        <EvalModal
          apps={apps}
          onClose={() => setShowEval(false)}
          onSaved={() => {
            setShowEval(false);
            load();
          }}
        />
      )}

      {showEmail && (
        <EmailModal
          candidate={candidate}
          apps={apps}
          onClose={() => setShowEmail(false)}
        />
      )}
    </div>
  );
}

function EmailModal({
  candidate,
  apps,
  onClose,
}: {
  candidate: Candidate;
  apps: Application[];
  onClose: () => void;
}) {
  const supabase = createClient();
  const { company } = useRole();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [appId, setAppId] = useState<string>(apps[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase
      .from("email_templates")
      .select("*")
      .order("created_at")
      .then(({ data }) => setTemplates((data as EmailTemplate[]) ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fill(text: string) {
    const app = apps.find((a) => a.id === appId);
    return text
      .replaceAll("{{vorname}}", candidate.first_name)
      .replaceAll("{{nachname}}", candidate.last_name)
      .replaceAll("{{stelle}}", app?.job?.title ?? "")
      .replaceAll("{{firma}}", company?.name ?? "unser Unternehmen")
      .replaceAll("{{absender}}", app?.job?.recruiter || "Dein Recruiting-Team");
  }

  function applyTemplate(tid: string) {
    setTemplateId(tid);
    const t = templates.find((x) => x.id === tid);
    if (t) {
      setSubject(fill(t.subject));
      setBody(fill(t.body));
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(`Betreff: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const mailto = `mailto:${candidate.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <Modal title={`E-Mail an ${candidate.first_name}`} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Vorlage</label>
            <select
              className="input"
              value={templateId}
              onChange={(e) => applyTemplate(e.target.value)}
            >
              <option value="">– Vorlage wählen –</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Bezug auf Stelle</label>
            <select
              className="input"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
            >
              {apps.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.job?.title}
                </option>
              ))}
              {apps.length === 0 && <option value="">Keine Bewerbung</option>}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Betreff</label>
          <input
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Text</label>
          <textarea
            className="input min-h-56"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-xs text-petrol-400">An: {candidate.email}</span>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={copy}>
              {copied ? "Kopiert ✓" : "Text kopieren"}
            </button>
            <a className="btn-primary" href={mailto}>
              <Send className="h-4 w-4" /> Im Mail-Programm öffnen
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function InterviewModal({
  apps,
  onClose,
  onSaved,
}: {
  apps: Application[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    application_id: apps[0].id,
    title: "Erstgespräch",
    interview_type: "video",
    scheduled_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    duration_min: 60,
    interviewer: "",
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("interviews").insert({
      ...form,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      duration_min: Number(form.duration_min),
    });
    onSaved();
  }

  return (
    <Modal title="Interview planen" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Stelle</label>
          <select
            className="input"
            value={form.application_id}
            onChange={(e) => setForm({ ...form, application_id: e.target.value })}
          >
            {apps.map((a) => (
              <option key={a.id} value={a.id}>
                {a.job?.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Titel</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Art</label>
            <select
              className="input"
              value={form.interview_type}
              onChange={(e) => setForm({ ...form, interview_type: e.target.value })}
            >
              <option value="telefon">Telefon</option>
              <option value="video">Video-Call</option>
              <option value="vor_ort">Vor Ort</option>
            </select>
          </div>
          <div>
            <label className="label">Dauer (Min)</label>
            <input
              className="input"
              type="number"
              min={15}
              step={15}
              value={form.duration_min}
              onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="label">Datum & Uhrzeit</label>
          <input
            className="input"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Interviewer:in</label>
          <input
            className="input"
            value={form.interviewer}
            onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
            placeholder="z. B. Sarah Klein"
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-primary" disabled={saving}>
            {saving ? "Speichern…" : "Interview planen"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EvalModal({
  apps,
  onClose,
  onSaved,
}: {
  apps: Application[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    application_id: apps[0].id,
    interviewer: "",
    score: 3,
    recommendation: "unentschieden",
    comments: "",
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("evaluations").insert(form);
    onSaved();
  }

  return (
    <Modal title="Bewertung abgeben" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Stelle</label>
          <select
            className="input"
            value={form.application_id}
            onChange={(e) => setForm({ ...form, application_id: e.target.value })}
          >
            {apps.map((a) => (
              <option key={a.id} value={a.id}>
                {a.job?.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Dein Name</label>
          <input
            className="input"
            value={form.interviewer}
            onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Bewertung</label>
          <RatingStars
            value={form.score}
            onChange={(v) => setForm({ ...form, score: v })}
            size={24}
          />
        </div>
        <div>
          <label className="label">Empfehlung</label>
          <div className="flex gap-2">
            {(
              [
                ["einstellen", "Einstellen"],
                ["unentschieden", "Unentschieden"],
                ["ablehnen", "Ablehnen"],
              ] as const
            ).map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() => setForm({ ...form, recommendation: key })}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  form.recommendation === key
                    ? "border-petrol-800 bg-petrol-800 text-white"
                    : "border-petrol-200 bg-white text-petrol-600 hover:bg-petrol-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Kommentar</label>
          <textarea
            className="input min-h-24"
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
            placeholder="Eindruck, Stärken, Bedenken…"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-primary" disabled={saving}>
            {saving ? "Speichern…" : "Bewertung speichern"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
