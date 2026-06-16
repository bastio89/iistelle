"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, ABSENCE_TYPE_META, ABSENCE_STATUS_META, Absence, AbsenceType, AbsenceStatus } from "@/lib/types";
import { formatDate as formatDateUtil } from "@/components/ui";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  LogOut,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function PortalProfilePage() {
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  const [absenceForm, setAbsenceForm] = useState({
    absence_type: "urlaub" as AbsenceType,
    start_date: "",
    end_date: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("employee_profiles")
      .select("employee_id")
      .eq("user_id", user.id)
      .single();

    if (profile?.employee_id) {
      const [emp, abs] = await Promise.all([
        supabase.from("employees").select("*").eq("id", profile.employee_id).single(),
        supabase.from("absences").select("*").eq("employee_id", profile.employee_id).order("start_date", { ascending: false }).limit(10),
      ]);
      setEmployee(emp.data);
      setAbsences(abs.data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/portal-login";
  }

  async function submitAbsence(e: React.FormEvent) {
    e.preventDefault();
    if (!employee) return;
    setSubmitting(true);

    const { error } = await supabase.from("absences").insert({
      employee_id: employee.id,
      absence_type: absenceForm.absence_type,
      start_date: absenceForm.start_date,
      end_date: absenceForm.end_date,
      days: calculateDays(absenceForm.start_date, absenceForm.end_date),
      status: "beantragt",
      comment: absenceForm.comment || null,
    });

    if (!error) {
      setAbsenceForm({ absence_type: "urlaub", start_date: "", end_date: "", comment: "" });
      setShowAbsenceForm(false);
      load();
    }
    setSubmitting(false);
  }

  function calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-petrol-400" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl border border-petrol-100 bg-white p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Profil nicht gefunden</h2>
        <p className="mt-2 text-petrol-500">Dein Mitarbeiterprofil konnte nicht geladen werden.</p>
      </div>
    );
  }

  const statusIcon = {
    beantragt: <AlertCircle className="h-4 w-4 text-amber-500" />,
    genehmigt: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    abgelehnt: <XCircle className="h-4 w-4 text-rose-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-petrol-100 text-xl font-bold text-petrol-700">
            {employee.first_name[0]}{employee.last_name[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-petrol-900">{employee.first_name} {employee.last_name}</h1>
            <p className="text-petrol-500">{employee.position}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg border border-petrol-200 px-4 py-2 text-sm font-semibold text-petrol-600 transition-all hover:bg-petrol-50"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-petrol-400">E-Mail</p>
            <p className="text-sm font-semibold text-petrol-900 truncate">{employee.email}</p>
          </div>
        </div>

        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-petrol-400">Telefon</p>
            <p className="text-sm font-semibold text-petrol-900">{employee.phone || "—"}</p>
          </div>
        </div>

        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-petrol-400">Standort</p>
            <p className="text-sm font-semibold text-petrol-900">{employee.location || "—"}</p>
          </div>
        </div>

        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-petrol-50 text-petrol-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-petrol-400">Eintrittsdatum</p>
            <p className="text-sm font-semibold text-petrol-900">{formatDateUtil(employee.hire_date)}</p>
          </div>
        </div>
      </div>

      {/* Vacation Balance */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-petrol-900">Urlaubskonto</h2>
            <p className="text-sm text-petrol-500">Dein verfügbarer Urlaub für {new Date().getFullYear()}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-petrol-900">{employee.vacation_days_per_year - (employee.carryover_days || 0)}</p>
            <p className="text-sm text-petrol-400">Tage verfügbar</p>
          </div>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-petrol-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${Math.min(100, ((employee.vacation_days_per_year - (employee.carryover_days || 0)) / employee.vacation_days_per_year) * 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-petrol-400">
          <span>0 Tage</span>
          <span>{employee.carryover_days} Tage Übertrag</span>
          <span>{employee.vacation_days_per_year} Tage Gesamt</span>
        </div>
      </div>

      {/* Absence Requests */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-petrol-900">Abwesenheiten</h2>
          <button
            onClick={() => setShowAbsenceForm(!showAbsenceForm)}
            className="btn-primary text-sm"
          >
            + Urlaub beantragen
          </button>
        </div>

        {showAbsenceForm && (
          <form onSubmit={submitAbsence} className="mb-6 rounded-xl border border-petrol-100 bg-petrol-50/50 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Art der Abwesenheit</label>
                <select
                  value={absenceForm.absence_type}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, absence_type: e.target.value as AbsenceType })}
                  className="input"
                >
                  <option value="urlaub">Urlaub</option>
                  <option value="krank">Krankheit</option>
                  <option value="sonderurlaub">Sonderurlaub</option>
                  <option value="unbezahlt">Unbezahlt</option>
                </select>
              </div>
              <div>
                <label className="label">Startdatum</label>
                <input
                  type="date"
                  value={absenceForm.start_date}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, start_date: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Enddatum</label>
                <input
                  type="date"
                  value={absenceForm.end_date}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, end_date: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Kommentar (optional)</label>
                <input
                  type="text"
                  value={absenceForm.comment}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, comment: e.target.value })}
                  className="input"
                  placeholder="z.B. Familienfeier"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAbsenceForm(false)}
                className="rounded-lg border border-petrol-200 px-4 py-2 text-sm font-semibold text-petrol-600 transition-all hover:bg-petrol-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-sm"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Antrag einreichen"}
              </button>
            </div>
          </form>
        )}

        {absences.length === 0 ? (
          <div className="py-8 text-center text-petrol-400">
            <Calendar className="mx-auto h-12 w-12 text-petrol-200" />
            <p className="mt-2">Noch keine Abwesenheiten beantragt</p>
          </div>
        ) : (
          <div className="space-y-3">
            {absences.map((absence) => (
              <div key={absence.id} className="flex items-center justify-between rounded-lg border border-petrol-100 p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${ABSENCE_TYPE_META[absence.absence_type].color}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-petrol-900">{ABSENCE_TYPE_META[absence.absence_type].label}</p>
                    <p className="text-sm text-petrol-500">
                      {formatDateUtil(absence.start_date)} – {formatDateUtil(absence.end_date)} ({absence.days} Tage)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ABSENCE_STATUS_META[absence.status].color}`}>
                    {statusIcon[absence.status]}
                    {ABSENCE_STATUS_META[absence.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}