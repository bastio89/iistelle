"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ABSENCE_STATUS_META,
  ABSENCE_TYPE_META,
  Absence,
  DEFAULT_ONBOARDING_TASKS,
  EMPLOYEE_STATUS_META,
  Employee,
  GOAL_STATUS_META,
  Goal,
  OnboardingTask,
  Review,
  Salary,
  formatEuro,
} from "@/lib/types";
import {
  Avatar,
  Modal,
  PageHeader,
  RatingStars,
  formatDate,
} from "@/components/ui";
import EmployeeFormModal from "@/components/EmployeeFormModal";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
} from "lucide-react";

type Tab = "profil" | "onboarding" | "abwesenheiten" | "gehalt" | "performance";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [obTasks, setObTasks] = useState<OnboardingTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [tab, setTab] = useState<Tab>("profil");
  const [showEdit, setShowEdit] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [e, a, s, g, r, ob] = await Promise.all([
      supabase.from("employees").select("*").eq("id", id).single(),
      supabase.from("absences").select("*").eq("employee_id", id).order("start_date", { ascending: false }),
      supabase.from("salaries").select("*").eq("employee_id", id).order("effective_from", { ascending: false }),
      supabase.from("goals").select("*").eq("employee_id", id).order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").eq("employee_id", id).order("created_at", { ascending: false }),
      supabase.from("onboarding_tasks").select("*").eq("employee_id", id).order("sort_order"),
    ]);
    setObTasks((ob.data as OnboardingTask[]) ?? []);
    setEmployee(e.data as Employee);
    setAbsences((a.data as Absence[]) ?? []);
    setSalaries((s.data as Salary[]) ?? []);
    setGoals((g.data as Goal[]) ?? []);
    setReviews((r.data as Review[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleTask(task: OnboardingTask) {
    await supabase
      .from("onboarding_tasks")
      .update({ done: !task.done })
      .eq("id", task.id);
    load();
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    await supabase.from("onboarding_tasks").insert({
      employee_id: id,
      title: newTask.trim(),
      sort_order: obTasks.length,
    });
    setNewTask("");
    load();
  }

  async function deleteTask(taskId: string) {
    await supabase.from("onboarding_tasks").delete().eq("id", taskId);
    load();
  }

  async function insertDefaultChecklist() {
    await supabase.from("onboarding_tasks").insert(
      DEFAULT_ONBOARDING_TASKS.map((title, i) => ({
        employee_id: id,
        title,
        sort_order: obTasks.length + i,
      }))
    );
    load();
  }

  async function deleteEmployee() {
    if (!confirm("Mitarbeiter:in und alle zugehörigen Daten wirklich löschen?")) return;
    await supabase.from("employees").delete().eq("id", id);
    router.push("/mitarbeiter");
  }

  if (loading || !employee) {
    return <p className="py-20 text-center text-petrol-400">Lade Personalakte…</p>;
  }

  const fullName = `${employee.first_name} ${employee.last_name}`;
  const statusMeta = EMPLOYEE_STATUS_META[employee.status];
  const year = new Date().getFullYear();
  const usedVacation = absences
    .filter(
      (a) =>
        a.absence_type === "urlaub" &&
        a.status === "genehmigt" &&
        new Date(a.start_date).getFullYear() === year
    )
    .reduce((s, a) => s + Number(a.days), 0);
  const currentSalary = salaries[0];

  const doneCount = obTasks.filter((t) => t.done).length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "profil", label: "Profil" },
    {
      key: "onboarding",
      label: obTasks.length
        ? `Onboarding (${doneCount}/${obTasks.length})`
        : "Onboarding",
    },
    { key: "abwesenheiten", label: "Abwesenheiten" },
    { key: "gehalt", label: "Gehalt" },
    { key: "performance", label: "Performance" },
  ];

  return (
    <div>
      <Link
        href="/mitarbeiter"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-petrol-500 hover:text-petrol-800"
      >
        <ArrowLeft className="h-4 w-4" /> Zurück zur Übersicht
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={fullName} size="lg" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-petrol-900">{fullName}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}>
                  {statusMeta.label}
                </span>
              </div>
              <p className="mt-0.5 text-petrol-500">
                {employee.position} · {employee.department}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-petrol-500">
                <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {employee.email}</span>
                {employee.phone && (
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {employee.phone}</span>
                )}
                {employee.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {employee.location}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setShowEdit(true)}>
              <Pencil className="h-4 w-4" /> Bearbeiten
            </button>
            <button
              className="rounded-lg border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50"
              onClick={deleteEmployee}
              title="Löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-petrol-50 pt-5 md:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase text-petrol-400">Eintritt</p>
            <p className="mt-1 font-semibold text-petrol-800">{formatDate(employee.hire_date)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-petrol-400">Resturlaub {year}</p>
            <p className="mt-1 font-semibold text-petrol-800">
              {employee.vacation_days_per_year - usedVacation} / {employee.vacation_days_per_year} Tage
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-petrol-400">Vorgesetzte:r</p>
            <p className="mt-1 font-semibold text-petrol-800">{employee.manager || "–"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-petrol-400">Aktuelles Gehalt</p>
            <p className="mt-1 font-semibold text-petrol-800">
              {currentSalary
                ? `${formatEuro(currentSalary.amount)} / ${currentSalary.pay_interval === "monatlich" ? "Monat" : "Jahr"}`
                : "–"}
            </p>
          </div>
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
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "profil" && (
          <div className="card p-6">
            <h3 className="mb-4 font-bold text-petrol-900">Stammdaten</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:grid-cols-3">
              {[
                [User, "Name", fullName],
                [Mail, "E-Mail", employee.email],
                [Phone, "Telefon", employee.phone || "–"],
                [Briefcase, "Anstellungsart", employee.employment_type],
                [MapPin, "Standort", employee.location || "–"],
                [CalendarDays, "Eintrittsdatum", formatDate(employee.hire_date)],
              ].map(([Icon, label, value]) => {
                const I = Icon as React.ElementType;
                return (
                  <div key={label as string} className="flex items-start gap-2.5">
                    <I className="mt-0.5 h-4 w-4 text-petrol-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase text-petrol-400">{label as string}</p>
                      <p className="mt-0.5 font-medium text-petrol-800">{value as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {employee.candidate_id && (
              <p className="mt-5 border-t border-petrol-50 pt-4 text-sm text-petrol-500">
                Aus dem Recruiting übernommen ·{" "}
                <Link
                  href={`/recruiting/kandidaten/${employee.candidate_id}`}
                  className="font-semibold text-coral-500 hover:text-coral-600"
                >
                  Bewerbungsprofil ansehen →
                </Link>
              </p>
            )}
          </div>
        )}

        {tab === "onboarding" && (
          <div className="card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-petrol-900">Onboarding-Checkliste</h3>
              {obTasks.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-36 overflow-hidden rounded-full bg-petrol-50">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${obTasks.length ? (doneCount / obTasks.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-petrol-600">
                    {doneCount}/{obTasks.length} erledigt
                  </span>
                </div>
              )}
            </div>

            {obTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-petrol-200 p-8 text-center">
                <p className="text-sm text-petrol-500">
                  Noch keine Checkliste vorhanden.
                </p>
                <button className="btn-primary mt-4" onClick={insertDefaultChecklist}>
                  Standard-Checkliste einfügen
                </button>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {obTasks.map((t) => (
                  <li
                    key={t.id}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-petrol-50/60"
                  >
                    <button
                      onClick={() => toggleTask(t)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                        t.done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-petrol-300 bg-white hover:border-petrol-500"
                      }`}
                    >
                      {t.done && <span className="text-[10px] font-black">✓</span>}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        t.done
                          ? "text-petrol-300 line-through"
                          : "font-medium text-petrol-800"
                      }`}
                    >
                      {t.title}
                    </span>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="rounded p-1 text-petrol-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                      title="Aufgabe entfernen"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={addTask} className="mt-4 flex gap-2 border-t border-petrol-50 pt-4">
              <input
                className="input"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Neue Aufgabe hinzufügen…"
              />
              <button className="btn-primary shrink-0" disabled={!newTask.trim()}>
                <Plus className="h-4 w-4" /> Hinzufügen
              </button>
            </form>
          </div>
        )}

        {tab === "abwesenheiten" && (
          <div className="space-y-3">
            {absences.length === 0 ? (
              <div className="card p-8 text-center text-sm text-petrol-400">
                Keine Abwesenheiten erfasst. Anträge werden über das Modul „Abwesenheiten“ gestellt.
              </div>
            ) : (
              absences.map((a) => {
                const typeMeta = ABSENCE_TYPE_META[a.absence_type];
                const stMeta = ABSENCE_STATUS_META[a.status];
                return (
                  <div key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeMeta.color}`}>
                          {typeMeta.label}
                        </span>
                        <span className="text-sm font-semibold text-petrol-900">
                          {formatDate(a.start_date)} – {formatDate(a.end_date)}
                        </span>
                        <span className="text-sm text-petrol-400">({a.days} Tage)</span>
                      </div>
                      {a.comment && <p className="mt-1 text-sm text-petrol-500">{a.comment}</p>}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stMeta.color}`}>
                      {stMeta.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "gehalt" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button className="btn-primary" onClick={() => setShowSalary(true)}>
                <Plus className="h-4 w-4" /> Gehaltsanpassung
              </button>
            </div>
            {salaries.length === 0 ? (
              <div className="card p-8 text-center text-sm text-petrol-400">
                Noch keine Gehaltsdaten hinterlegt.
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                      <th className="px-5 py-3">Gültig ab</th>
                      <th className="px-5 py-3">Betrag</th>
                      <th className="px-5 py-3">Intervall</th>
                      <th className="px-5 py-3">Anlass</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-petrol-50">
                    {salaries.map((s, idx) => (
                      <tr key={s.id} className={idx === 0 ? "bg-emerald-50/40" : ""}>
                        <td className="px-5 py-3 font-medium text-petrol-800">
                          {formatDate(s.effective_from)}
                          {idx === 0 && (
                            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              AKTUELL
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 font-semibold text-petrol-900">{formatEuro(s.amount)}</td>
                        <td className="px-5 py-3 text-petrol-500">
                          {s.pay_interval === "monatlich" ? "Monatlich" : "Jährlich"}
                        </td>
                        <td className="px-5 py-3 text-petrol-500">{s.note || "–"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "performance" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-petrol-900">Ziele</h3>
                <button className="btn-secondary" onClick={() => setShowGoal(true)}>
                  <Plus className="h-4 w-4" /> Ziel
                </button>
              </div>
              <div className="space-y-3">
                {goals.length === 0 && (
                  <div className="card p-6 text-center text-sm text-petrol-400">Keine Ziele definiert.</div>
                )}
                {goals.map((g) => {
                  const meta = GOAL_STATUS_META[g.status];
                  return (
                    <div key={g.id} className="card p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-petrol-900">{g.title}</p>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>
                      {g.description && <p className="mt-1 text-sm text-petrol-500">{g.description}</p>}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-petrol-50">
                          <div
                            className="h-full rounded-full bg-petrol-600"
                            style={{ width: `${g.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-petrol-700">{g.progress}%</span>
                      </div>
                      {g.due_date && (
                        <p className="mt-2 text-xs text-petrol-400">Fällig: {formatDate(g.due_date)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-bold text-petrol-900">Reviews</h3>
              <div className="space-y-3">
                {reviews.length === 0 && (
                  <div className="card p-6 text-center text-sm text-petrol-400">Noch keine Reviews.</div>
                )}
                {reviews.map((r) => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-petrol-900">{r.cycle}</p>
                      <RatingStars value={r.score} size={14} />
                    </div>
                    <p className="mt-1 text-xs text-petrol-400">von {r.reviewer} · {formatDate(r.created_at)}</p>
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showEdit && (
        <EmployeeFormModal employee={employee} onClose={() => setShowEdit(false)} onSaved={load} />
      )}

      {showSalary && (
        <SalaryModal
          employeeId={employee.id}
          onClose={() => setShowSalary(false)}
          onSaved={() => {
            setShowSalary(false);
            load();
          }}
        />
      )}

      {showGoal && (
        <GoalModal
          employeeId={employee.id}
          onClose={() => setShowGoal(false)}
          onSaved={() => {
            setShowGoal(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function SalaryModal({
  employeeId,
  onClose,
  onSaved,
}: {
  employeeId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    amount: "",
    pay_interval: "jaehrlich",
    effective_from: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("salaries").insert({
      employee_id: employeeId,
      amount: Number(form.amount),
      pay_interval: form.pay_interval,
      effective_from: form.effective_from,
      note: form.note,
    });
    onSaved();
  }

  return (
    <Modal title="Gehaltsanpassung erfassen" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Betrag (€) *</label>
            <input className="input" type="number" min={0} value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div>
            <label className="label">Intervall</label>
            <select className="input" value={form.pay_interval}
              onChange={(e) => setForm({ ...form, pay_interval: e.target.value })}>
              <option value="jaehrlich">Jährlich</option>
              <option value="monatlich">Monatlich</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Gültig ab</label>
          <input className="input" type="date" value={form.effective_from}
            onChange={(e) => setForm({ ...form, effective_from: e.target.value })} required />
        </div>
        <div>
          <label className="label">Anlass</label>
          <input className="input" value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="z. B. Beförderung, jährliche Anpassung" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="btn-primary" disabled={saving}>{saving ? "Speichern…" : "Speichern"}</button>
        </div>
      </form>
    </Modal>
  );
}

function GoalModal({
  employeeId,
  onClose,
  onSaved,
}: {
  employeeId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    progress: 0,
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("goals").insert({
      employee_id: employeeId,
      title: form.title,
      description: form.description,
      due_date: form.due_date || null,
      progress: Number(form.progress),
      status: "in_arbeit",
    });
    onSaved();
  }

  return (
    <Modal title="Neues Ziel" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Titel *</label>
          <input className="input" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label className="label">Beschreibung</label>
          <textarea className="input min-h-20" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label className="label">Fällig am</label>
          <input className="input" type="date" value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="btn-primary" disabled={saving}>{saving ? "Speichern…" : "Ziel anlegen"}</button>
        </div>
      </form>
    </Modal>
  );
}
