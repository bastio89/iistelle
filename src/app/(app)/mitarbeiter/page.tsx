"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EMPLOYEE_STATUS_META, Employee } from "@/lib/types";
import { Avatar, EmptyState, PageHeader, StatCard, formatDate } from "@/components/ui";
import EmployeeFormModal from "@/components/EmployeeFormModal";
import { downloadCsv } from "@/lib/csv";
import { Download, Plus, Search, Upload } from "lucide-react";

export default function EmployeesPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("alle");
  const [showForm, setShowForm] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("last_name");
    setEmployees((data as Employee[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function importCsv(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg(null);
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const delim = (lines[0]?.match(/;/g)?.length ?? 0) >= (lines[0]?.match(/,/g)?.length ?? 0) ? ";" : ",";
    const headers = lines[0].split(delim).map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
    const idx = (name: string) => headers.findIndex((h) => h.includes(name));
    const iVor = idx("vorname");
    const iNach = idx("nachname");
    const iMail = idx("mail");
    const iPos = idx("position");
    const iDept = idx("abteilung");
    const iDate = idx("eintritt");
    if (iVor < 0 || iNach < 0 || iMail < 0) {
      setImportMsg("Import fehlgeschlagen: CSV braucht mindestens die Spalten Vorname, Nachname, E-Mail.");
      setImporting(false);
      ev.target.value = "";
      return;
    }
    const rows = lines.slice(1).map((l) => l.split(delim).map((c) => c.trim().replace(/^"|"$/g, "")));
    const validRows = rows.filter((r) => r[iVor] && r[iNach] && r[iMail]);
    const skipped = rows.length - validRows.length;

    // Track which business-critical fields had to be defaulted so the import
    // is transparent instead of silently inventing employment data.
    const defaulted = { position: 0, department: 0, hire_date: 0 };
    const payload = validRows.map((r) => {
      const hasPos = iPos >= 0 && r[iPos];
      const hasDept = iDept >= 0 && r[iDept];
      const validDate = iDate >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(r[iDate] ?? "");
      if (!hasPos) defaulted.position++;
      if (!hasDept) defaulted.department++;
      if (!validDate) defaulted.hire_date++;
      return {
        first_name: r[iVor],
        last_name: r[iNach],
        email: r[iMail],
        position: hasPos ? r[iPos] : "Mitarbeiter:in",
        department: hasDept ? r[iDept] : "Operations",
        employment_type: "Vollzeit",
        status: "aktiv",
        hire_date: validDate ? r[iDate] : new Date().toISOString().slice(0, 10),
      };
    });
    if (payload.length === 0) {
      setImportMsg("Keine gültigen Zeilen in der Datei gefunden.");
    } else {
      const { error } = await supabase.from("employees").insert(payload);
      if (error) {
        setImportMsg(`Import fehlgeschlagen: ${error.message}`);
      } else {
        const notes: string[] = [];
        if (skipped > 0) notes.push(`${skipped} Zeile(n) ohne Vorname/Nachname/E-Mail übersprungen`);
        if (defaulted.position) notes.push(`${defaulted.position}× Position auf Standard gesetzt`);
        if (defaulted.department) notes.push(`${defaulted.department}× Abteilung auf Standard gesetzt`);
        if (defaulted.hire_date) notes.push(`${defaulted.hire_date}× Eintrittsdatum auf heute gesetzt`);
        setImportMsg(
          `${payload.length} Mitarbeiter:innen importiert.` +
            (notes.length ? ` Hinweis: ${notes.join(", ")}. Bitte prüfen und ggf. korrigieren.` : "")
        );
        load();
      }
    }
    setImporting(false);
    ev.target.value = "";
  }

  const departments = Array.from(new Set(employees.map((e) => e.department))).sort();

  const filtered = employees.filter((e) => {
    const matchesQuery = `${e.first_name} ${e.last_name} ${e.email} ${e.position} ${(e.skills ?? []).join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesDept = deptFilter === "alle" || e.department === deptFilter;
    return matchesQuery && matchesDept;
  });

  const active = employees.filter((e) => e.status === "aktiv").length;
  const onboarding = employees.filter((e) => e.status === "onboarding").length;

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Mitarbeiter…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Mitarbeiter"
        subtitle="Digitale Personalakte deines Teams."
        action={
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() =>
                downloadCsv(
                  "mitarbeiter.csv",
                  filtered.map((e) => ({
                    Vorname: e.first_name,
                    Nachname: e.last_name,
                    "E-Mail": e.email,
                    Position: e.position,
                    Abteilung: e.department,
                    Standort: e.location,
                    Anstellungsart: e.employment_type,
                    Status: EMPLOYEE_STATUS_META[e.status].label,
                    Eintritt: e.hire_date,
                    "Vorgesetzte:r": e.manager,
                    "Urlaubstage/Jahr": e.vacation_days_per_year,
                  }))
                )
              }
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <label className={`btn-secondary cursor-pointer ${importing ? "opacity-50" : ""}`}>
              <Upload className="h-4 w-4" /> {importing ? "Importiere…" : "CSV-Import"}
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={importCsv}
                disabled={importing}
              />
            </label>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Mitarbeiter:in anlegen
            </button>
          </div>
        }
      />

      {importMsg && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            importMsg.includes("fehlgeschlagen") || importMsg.includes("Keine gültigen")
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {importMsg}
          {importMsg.includes("Spalten") && (
            <span className="block text-xs opacity-80">
              Erwartetes Format: Vorname;Nachname;E-Mail;Position;Abteilung;Eintritt (YYYY-MM-DD)
            </span>
          )}
        </div>
      )}

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Aktiv" value={active} />
        <StatCard label="Im Onboarding" value={onboarding} accent />
        <StatCard label="Abteilungen" value={departments.length} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="card flex min-w-64 flex-1 items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 text-petrol-400" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-petrol-300"
            placeholder="Nach Name, E-Mail oder Position suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input w-auto"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="alle">Alle Abteilungen</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Keine Mitarbeiter:innen gefunden" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Position</th>
                <th className="px-5 py-3">Abteilung</th>
                <th className="px-5 py-3">Eintritt</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-50">
              {filtered.map((e) => {
                const meta = EMPLOYEE_STATUS_META[e.status];
                return (
                  <tr key={e.id} className="transition hover:bg-petrol-50/40">
                    <td className="px-5 py-3">
                      <Link href={`/mitarbeiter/${e.id}`} className="flex items-center gap-3">
                        <Avatar name={`${e.first_name} ${e.last_name}`} />
                        <div>
                          <p className="font-semibold text-petrol-900">
                            {e.first_name} {e.last_name}
                          </p>
                          <p className="text-xs text-petrol-400">{e.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-petrol-700">{e.position}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-xs font-semibold text-petrol-600">
                        {e.department}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-petrol-500">{formatDate(e.hire_date)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EmployeeFormModal onClose={() => setShowForm(false)} onSaved={load} />
      )}
    </div>
  );
}
