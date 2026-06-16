"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, Absence, AbsenceType, AbsenceStatus } from "@/lib/types";
import { formatDate } from "@/components/ui";
import {
  Plane,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export default function PortalUrlaubPage() {
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

    const { data: abs } = await supabase
      .from("absences")
      .select("*")
      .eq("employee_id", employee.id)
      .order("start_date", { ascending: false });
    setAbsences((abs as Absence[]) ?? []);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-petrol-200 border-t-coral-500" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-petrol-300" />
        <h2 className="mt-4 text-xl font-bold text-petrol-900">Kein Mitarbeiterprofil</h2>
      </div>
    );
  }

  const year = new Date().getFullYear();
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

  const statusFilter = [
    { key: "all", label: "Alle" },
    { key: "beantragt", label: "Ausstehend" },
    { key: "genehmigt", label: "Genehmigt" },
    { key: "abgelehnt", label: "Abgelehnt" },
  ];

  const [filter, setFilter] = useState("all");
  const filteredAbsences = filter === "all" ? absences : absences.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-petrol-900">Urlaub & Abwesenheiten</h1>
          <p className="mt-1 text-petrol-500">Verwalte deine Abwesenheiten und Urlaubstage</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-petrol-900 px-4 py-2.5 font-semibold text-white transition hover:bg-petrol-800"
        >
          <Plus className="h-5 w-5" />
          Neuer Antrag
        </button>
      </div>

      {/* Vacation Overview Card */}
      <div className="rounded-2xl bg-gradient-to-br from-petrol-800 to-petrol-900 p-6 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">Resturlaub {year}</p>
            <p className="mt-2 text-5xl font-bold">{remainingVacation}</p>
            <p className="mt-1 text-white/70">von {vacationEntitlement} Tagen</p>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{usedVacation}</p>
              <p className="text-xs text-white/60">Verbraucht</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{pendingVacation}</p>
              <p className="text-xs text-white/60">Ausstehend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{employee.carryover_days || 0}</p>
              <p className="text-xs text-white/60">Übertrag</p>
            </div>
          </div>

          <div className="w-full lg:w-48">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Verbraucht</span>
              <span>{Math.round((usedVacation / vacationEntitlement) * 100)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-coral-500 transition-all"
                style={{ width: `${(usedVacation / vacationEntitlement) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilter.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === f.key
                ? "bg-petrol-900 text-white"
                : "bg-white text-petrol-600 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Absence List */}
      <div className="rounded-2xl bg-white shadow-sm">
        {filteredAbsences.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-petrol-300" />
            <p className="mt-4 text-petrol-500">Keine Abwesenheiten erfasst.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm font-medium text-coral-600 hover:underline"
            >
              Ersten Urlaubsantrag stellen
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAbsences.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    a.absence_type === "urlaub" ? "bg-teal-100 text-teal-600" :
                    a.absence_type === "krank" ? "bg-rose-100 text-rose-600" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {a.absence_type === "urlaub" ? <Plane className="h-5 w-5" /> :
                     a.absence_type === "krank" ? <XCircle className="h-5 w-5" /> :
                     <Calendar className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-petrol-900">
                      {a.absence_type === "urlaub" ? "Urlaub" :
                       a.absence_type === "krank" ? "Krankheit" :
                       a.absence_type === "sonderurlaub" ? "Sonderurlaub" : "Unbezahlt"}
                    </p>
                    <p className="text-sm text-petrol-500">
                      {formatDate(a.start_date)} – {formatDate(a.end_date)}
                      <span className="ml-2 text-petrol-400">({a.days} Tage)</span>
                    </p>
                  </div>
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

      {/* Request Modal */}
      {showModal && employee && (
        <AbsenceRequestModal
          employee={employee}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-petrol-900">Neuer Abwesenheitsantrag</h2>

        <form onSubmit={save} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-petrol-700">Art der Abwesenheit</label>
            <div className="grid grid-cols-3 gap-2">
              {(["urlaub", "sonderurlaub", "unbezahlt"] as AbsenceType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setForm({ ...form, absence_type: type })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    form.absence_type === type
                      ? "border-petrol-800 bg-petrol-800 text-white"
                      : "border-gray-200 text-petrol-600 hover:bg-gray-50"
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
              <label className="mb-2 block text-sm font-medium text-petrol-700">Von *</label>
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
              <label className="mb-2 block text-sm font-medium text-petrol-700">Bis *</label>
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
            <div className="rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
              <strong>{calculatedDays} Tag{calculatedDays > 1 ? "e" : ""}</strong> werden beantragt
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-petrol-700">Kommentar (optional)</label>
            <textarea
              className="input min-h-20"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="z. B. Vertretung geregelt mit..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 font-medium text-petrol-600 hover:bg-gray-50">
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving || calculatedDays === 0}
              className="flex-1 rounded-xl bg-petrol-900 py-2.5 font-semibold text-white hover:bg-petrol-800 disabled:opacity-50"
            >
              {saving ? "Wird gesendet…" : "Antrag einreichen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}