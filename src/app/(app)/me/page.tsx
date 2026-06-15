"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, Absence, AbsenceType, AbsenceStatus, GOAL_STATUS_META, Goal, REVIEW_TYPE_LABEL, ReviewType, Review } from "@/lib/types";
import { useRole } from "@/lib/useRole";
import { formatDate } from "@/components/ui";
import {
  Avatar,
  Modal,
  PageHeader,
  formatDate as formatDateUtil,
} from "@/components/ui";
import {
  Calendar,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plane,
  Shield,
  Target,
  Timer,
  TrendingUp,
  User,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

type Tab = "dashboard" | "urlaub" | "daten" | "dokumente" | "performance" | "zeiterfassung";

export default function SelfServicePage() {
  const supabase = createClient();
  const { company, role, loading: roleLoading } = useRole();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [showAbsence, setShowAbsence] = useState(false);

  const load = useCallback(async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Get employee by email
    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (!emp) {
      setLoading(false);
      return;
    }

    const employee = emp as Employee;
    setEmployee(employee);

    // Load absences
    const { data: abs } = await supabase
      .from("absences")
      .select("*")
      .eq("employee_id", employee.id)
      .order("start_date", { ascending: false });
    setAbsences((abs as Absence[]) ?? []);

    // Load goals
    const { data: g } = await supabase
      .from("goals")
      .select("*")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setGoals((g as Goal[]) ?? []);

    // Load reviews
    const { data: r } = await supabase
      .from("reviews")
      .select("*")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setReviews((r as Review[]) ?? []);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!roleLoading) {
      load();
    }
  }, [roleLoading, load]);

  if (roleLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-petrol-200 border-t-coral-500" />
          <p className="mt-4 text-petrol-500">Laden…</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="card p-12 text-center">
        <User className="mx-auto h-12 w-12 text-petrol-300" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Kein Mitarbeiterprofil gefunden</h2>
        <p className="mt-2 text-petrol-500">
          Dein Benutzerkonto ist keinem Mitarbeiterprofil zugeordnet.
          Bitte wende dich an deinen Administrator.
        </p>
      </div>
    );
  }

  const fullName = `${employee.first_name} ${employee.last_name}`;
  const year = new Date().getFullYear();

  // Calculate vacation stats
  const vacationEntitlement = employee.vacation_days_per_year + Number(employee.carryover_days || 0);
  const usedVacation = absences
    .filter(
      (a) =>
        a.absence_type === "urlaub" &&
        a.status === "genehmigt" &&
        new Date(a.start_date).getFullYear() === year
    )
    .reduce((s, a) => s + Number(a.days), 0);
  const pendingVacation = absences
    .filter(
      (a) =>
        a.absence_type === "urlaub" &&
        a.status === "beantragt"
    )
    .reduce((s, a) => s + Number(a.days), 0);
  const remainingVacation = vacationEntitlement - usedVacation;

  // Quick stats
  const pendingRequests = absences.filter((a) => a.status === "beantragt").length;
  const activeGoals = goals.filter((g) => g.status !== "erreicht" && g.status !== "verfehlt").length;
  const completedGoals = goals.filter((g) => g.status === "erreicht").length;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "dashboard", label: "Übersicht", icon: User },
    { key: "urlaub", label: "Urlaub", icon: Plane },
    { key: "daten", label: "Meine Daten", icon: Shield },
    { key: "dokumente", label: "Dokumente", icon: FileText },
    { key: "performance", label: "Performance", icon: TrendingUp },
    { key: "zeiterfassung", label: "Zeiterfassung", icon: Timer },
  ];

  return (
    <div>
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={fullName} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-petrol-900">{fullName}</h1>
            <p className="text-petrol-500">
              {employee.position} · {employee.department}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-petrol-500">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {employee.email}</span>
              {employee.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {employee.phone}</span>}
              {employee.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {employee.location}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-petrol-100 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "text-petrol-900 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-coral-500 relative"
                : "text-petrol-400 hover:text-petrol-700"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tab === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Resturlaub {year}</p>
                    <p className="mt-1 text-2xl font-bold text-petrol-900">{remainingVacation}</p>
                    <p className="text-xs text-petrol-400">von {vacationEntitlement} Tagen</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <Plane className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                {pendingVacation > 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {pendingVacation} Tage ausstehend
                  </p>
                )}
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Aktive Ziele</p>
                    <p className="mt-1 text-2xl font-bold text-petrol-900">{activeGoals}</p>
                    <p className="text-xs text-petrol-400">{completedGoals} erreicht</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                    <Target className="h-6 w-6 text-violet-600" />
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Offene Anträge</p>
                    <p className="mt-1 text-2xl font-bold text-petrol-900">{pendingRequests}</p>
                    <p className="text-xs text-petrol-400">Abwesenheitsanträge</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Im Unternehmen</p>
                    <p className="mt-1 text-2xl font-bold text-petrol-900">
                      {Math.floor((new Date().getTime() - new Date(employee.hire_date).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                    </p>
                    <p className="text-xs text-petrol-400">Monate</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                    <Briefcase className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="mb-4 font-bold text-petrol-900">Schnellaktionen</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => setShowAbsence(true)}
                  className="flex items-center gap-3 rounded-xl border border-petrol-100 p-4 text-left transition hover:border-coral-200 hover:bg-coral-50/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral-100 text-coral-600">
                    <Plane className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">Urlaub beantragen</p>
                    <p className="text-xs text-petrol-400">Neuen Antrag stellen</p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-petrol-300" />
                </button>

                <button
                  onClick={() => setTab("zeiterfassung")}
                  className="flex items-center gap-3 rounded-xl border border-petrol-100 p-4 text-left transition hover:border-coral-200 hover:bg-coral-50/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                    <Timer className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">Zeit erfassen</p>
                    <p className="text-xs text-petrol-400">Arbeitszeit buchen</p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-petrol-300" />
                </button>

                <button
                  onClick={() => setTab("dokumente")}
                  className="flex items-center gap-3 rounded-xl border border-petrol-100 p-4 text-left transition hover:border-coral-200 hover:bg-coral-50/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">Meine Dokumente</p>
                    <p className="text-xs text-petrol-400">Verträge & Bescheinigungen</p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-petrol-300" />
                </button>

                <button
                  onClick={() => setTab("performance")}
                  className="flex items-center gap-3 rounded-xl border border-petrol-100 p-4 text-left transition hover:border-coral-200 hover:bg-coral-50/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">Meine Ziele</p>
                    <p className="text-xs text-petrol-400">OKRs & Fortschritt</p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-petrol-300" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="mb-4 font-bold text-petrol-900">Letzte Abwesenheiten</h3>
              {absences.length === 0 ? (
                <p className="text-sm text-petrol-400">Keine Abwesenheiten erfasst.</p>
              ) : (
                <div className="space-y-3">
                  {absences.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border border-petrol-50 p-3">
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          a.absence_type === "urlaub" ? "bg-teal-100 text-teal-800" :
                          a.absence_type === "krank" ? "bg-rose-100 text-rose-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {a.absence_type === "urlaub" ? "Urlaub" :
                           a.absence_type === "krank" ? "Krank" : "Sonstige"}
                        </span>
                        <span className="text-sm font-medium text-petrol-800">
                          {formatDateUtil(a.start_date)} – {formatDateUtil(a.end_date)}
                        </span>
                        <span className="text-sm text-petrol-400">({a.days} Tage)</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        a.status === "genehmigt" ? "bg-emerald-100 text-emerald-800" :
                        a.status === "beantragt" ? "bg-amber-100 text-amber-800" :
                        "bg-rose-100 text-rose-700"
                      }`}>
                        {a.status === "genehmigt" ? "Genehmigt" :
                         a.status === "beantragt" ? "Ausstehend" : "Abgelehnt"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "urlaub" && (
          <div className="space-y-6">
            {/* Vacation Overview */}
            <div className="card p-6">
              <h3 className="mb-4 font-bold text-petrol-900">Urlaubsübersicht {year}</h3>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-petrol-500">Verbraucht</span>
                    <span className="font-semibold text-petrol-800">{usedVacation} Tage</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-petrol-100">
                    <div
                      className="h-full rounded-full bg-petrol-600 transition-all"
                      style={{ width: `${(usedVacation / vacationEntitlement) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-petrol-900">{remainingVacation}</p>
                  <p className="text-xs text-petrol-400">Tage übrig</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-petrol-50 pt-4 text-center text-sm">
                <div>
                  <p className="text-xl font-bold text-petrol-900">{employee.vacation_days_per_year}</p>
                  <p className="text-petrol-400">Jahresanspruch</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-petrol-900">{employee.carryover_days || 0}</p>
                  <p className="text-petrol-400">Übertrag</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-600">{pendingVacation}</p>
                  <p className="text-petrol-400">Ausstehend</p>
                </div>
              </div>
              <button className="btn-primary mt-4 w-full" onClick={() => setShowAbsence(true)}>
                <Plane className="h-4 w-4" />
                Neuen Urlaubsantrag stellen
              </button>
            </div>

            {/* Absence History */}
            <div className="card p-6">
              <h3 className="mb-4 font-bold text-petrol-900">Abwesenheiten</h3>
              {absences.length === 0 ? (
                <div className="rounded-xl border border-dashed border-petrol-200 p-8 text-center">
                  <Plane className="mx-auto h-10 w-10 text-petrol-300" />
                  <p className="mt-3 text-sm text-petrol-500">Keine Abwesenheiten erfasst.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {absences.map((a) => (
                    <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-petrol-100 p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            a.absence_type === "urlaub" ? "bg-teal-100 text-teal-800" :
                            a.absence_type === "krank" ? "bg-rose-100 text-rose-700" :
                            a.absence_type === "sonderurlaub" ? "bg-violet-100 text-violet-800" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {a.absence_type === "urlaub" ? "Urlaub" :
                             a.absence_type === "krank" ? "Krankheit" :
                             a.absence_type === "sonderurlaub" ? "Sonderurlaub" : "Unbezahlt"}
                          </span>
                          <span className="text-sm font-medium text-petrol-800">
                            {formatDateUtil(a.start_date)} – {formatDateUtil(a.end_date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-petrol-500">
                          {a.days} Tage {a.comment && `· ${a.comment}`}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.status === "genehmigt" ? "bg-emerald-100 text-emerald-800" :
                        a.status === "beantragt" ? "bg-amber-100 text-amber-800" :
                        "bg-rose-100 text-rose-700"
                      }`}>
                        {a.status === "genehmigt" ? "✓ Genehmigt" :
                         a.status === "beantragt" ? "⏳ Ausstehend" : "✗ Abgelehnt"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "daten" && (
          <div className="card p-6">
            <h3 className="mb-6 font-bold text-petrol-900">Meine Personalien</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Vollständiger Name</p>
                    <p className="font-medium text-petrol-800">{fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">E-Mail</p>
                    <p className="font-medium text-petrol-800">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Telefon</p>
                    <p className="font-medium text-petrol-800">{employee.phone || "–"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Standort</p>
                    <p className="font-medium text-petrol-800">{employee.location || "–"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Position</p>
                    <p className="font-medium text-petrol-800">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Eintrittsdatum</p>
                    <p className="font-medium text-petrol-800">{formatDateUtil(employee.hire_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Vorgesetzte:r</p>
                    <p className="font-medium text-petrol-800">{employee.manager || "–"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-petrol-400" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Anstellungsart</p>
                    <p className="font-medium text-petrol-800">{employee.employment_type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {(employee.emergency_contact_name || employee.emergency_contact_phone) && (
              <div className="mt-6 border-t border-petrol-100 pt-6">
                <h4 className="mb-4 font-semibold text-petrol-800">Notfallkontakt</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Name</p>
                    <p className="font-medium text-petrol-800">{employee.emergency_contact_name || "–"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-petrol-400">Telefon</p>
                    <p className="font-medium text-petrol-800">{employee.emergency_contact_phone || "–"}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-xs text-petrol-400">
              <AlertCircle className="inline h-3 w-3 mr-1" />
              Um deine Daten zu ändern, wende dich bitte an deinen Vorgesetzten oder HR-Administrator.
            </p>
          </div>
        )}

        {tab === "dokumente" && (
          <div className="card p-6">
            <h3 className="mb-6 font-bold text-petrol-900">Meine Dokumente</h3>
            <p className="text-sm text-petrol-500">
              Deine persönlichen Dokumente wie Arbeitsvertrag, Zeugnisse und Bescheinigungen werden hier angezeigt.
              Wende dich an HR, um neue Dokumente hinzuzufügen.
            </p>
            <div className="mt-6 rounded-xl border border-dashed border-petrol-200 p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-petrol-300" />
              <p className="mt-3 text-sm text-petrol-500">
                Keine persönlichen Dokumente verfügbar.
              </p>
            </div>
          </div>
        )}

        {tab === "performance" && (
          <div className="space-y-6">
            {/* Goals */}
            <div className="card p-6">
              <h3 className="mb-4 font-bold text-petrol-900">Meine Ziele</h3>
              {goals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-petrol-200 p-8 text-center">
                  <Target className="mx-auto h-10 w-10 text-petrol-300" />
                  <p className="mt-3 text-sm text-petrol-500">Keine Ziele definiert.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((g) => {
                    const meta = GOAL_STATUS_META[g.status];
                    return (
                      <div key={g.id} className="rounded-lg border border-petrol-100 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-petrol-900">{g.title}</p>
                            {g.description && (
                              <p className="mt-1 text-sm text-petrol-500">{g.description}</p>
                            )}
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
                            {meta.label}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-petrol-100">
                            <div
                              className={`h-full rounded-full transition-all ${
                                g.status === "erreicht" ? "bg-emerald-500" :
                                g.status === "verfehlt" ? "bg-rose-500" :
                                "bg-petrol-600"
                              }`}
                              style={{ width: `${g.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-petrol-700">{g.progress}%</span>
                        </div>
                        {g.due_date && (
                          <p className="mt-2 text-xs text-petrol-400">
                            Fällig: {formatDateUtil(g.due_date)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <h3 className="mb-4 font-bold text-petrol-900">Feedback & Reviews</h3>
              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-petrol-200 p-8 text-center">
                  <TrendingUp className="mx-auto h-10 w-10 text-petrol-300" />
                  <p className="mt-3 text-sm text-petrol-500">Noch keine Reviews erhalten.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-lg border border-petrol-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-petrol-900">{r.cycle}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            r.review_type === "self"
                              ? "bg-violet-100 text-violet-800"
                              : r.review_type === "peer"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-petrol-100 text-petrol-700"
                          }`}>
                            {REVIEW_TYPE_LABEL[r.review_type] ?? "Manager-Review"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon key={i} filled={i < r.score} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-petrol-400">von {r.reviewer} · {formatDateUtil(r.created_at)}</p>
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
              )}
            </div>
          </div>
        )}

        {tab === "zeiterfassung" && (
          <div className="card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-petrol-900">Meine Zeiterfassung</h3>
              <a href="/zeiterfassung" className="btn-secondary">
                <Timer className="h-4 w-4" />
                Vollständige Zeiterfassung
              </a>
            </div>
            <p className="text-sm text-petrol-500">
              Hier siehst du demnächst eine Übersicht deiner Arbeitszeiten, Überstunden und Gleitzeit-Saldo.
            </p>
            <div className="mt-6 rounded-xl border border-dashed border-petrol-200 p-8 text-center">
              <Timer className="mx-auto h-10 w-10 text-petrol-300" />
              <p className="mt-3 text-sm text-petrol-500">
                Zeiterfassung wird in Kürze verfügbar sein.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Absence Request Modal */}
      {showAbsence && employee && (
        <AbsenceRequestModal
          employee={employee}
          onClose={() => setShowAbsence(false)}
          onSaved={() => {
            setShowAbsence(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? "text-amber-400" : "text-petrol-200"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function AbsenceRequestModal({
  employee,
  onClose,
  onSaved,
}: {
  employee: Employee;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    absence_type: "urlaub" as AbsenceType,
    start_date: "",
    end_date: "",
    comment: "",
  });
  const [saving, setSaving] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);

  // Calculate days
  useEffect(() => {
    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      if (end >= start) {
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setCalculatedDays(days);
      } else {
        setCalculatedDays(0);
      }
    } else {
      setCalculatedDays(0);
    }
  }, [form.start_date, form.end_date]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (calculatedDays === 0) return;

    setSaving(true);
    await supabase.from("absences").insert({
      employee_id: employee.id,
      absence_type: form.absence_type,
      start_date: form.start_date,
      end_date: form.end_date,
      days: calculatedDays,
      status: "beantragt" as AbsenceStatus,
      comment: form.comment || null,
    });
    onSaved();
  }

  return (
    <Modal title="Urlaubsantrag stellen" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Art der Abwesenheit</label>
          <div className="grid grid-cols-2 gap-2">
            {(["urlaub", "sonderurlaub", "unbezahlt"] as AbsenceType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setForm({ ...form, absence_type: type })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  form.absence_type === type
                    ? "border-petrol-800 bg-petrol-800 text-white"
                    : "border-petrol-200 bg-white text-petrol-600 hover:bg-petrol-50"
                }`}
              >
                {type === "urlaub" ? "Urlaub" :
                 type === "sonderurlaub" ? "Sonderurlaub" : "Unbezahlt"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Von *</label>
            <input
              className="input"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              min={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <div>
            <label className="label">Bis *</label>
            <input
              className="input"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              min={form.start_date || new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
        </div>

        {calculatedDays > 0 && (
          <div className={`rounded-lg p-3 text-sm ${
            form.absence_type === "urlaub" ? "bg-teal-50 text-teal-800" : "bg-slate-50 text-slate-800"
          }`}>
            <strong>{calculatedDays} Tag{calculatedDays > 1 ? "e" : ""}</strong> werden beantragt.
          </div>
        )}

        <div>
          <label className="label">Kommentar (optional)</label>
          <textarea
            className="input min-h-20"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="z. B. Vertretung geregelt mit..."
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-petrol-50 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving || calculatedDays === 0}
          >
            {saving ? "Wird gesendet…" : "Antrag einreichen"}
          </button>
        </div>
      </form>
    </Modal>
  );
}