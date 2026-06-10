"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Employee, Salary, formatEuro } from "@/lib/types";
import { useRole } from "@/lib/useRole";
import { Avatar, EmptyState, PageHeader, StatCard, formatDate } from "@/components/ui";
import { downloadCsv } from "@/lib/csv";
import { Download, ShieldAlert } from "lucide-react";

export default function SalariesPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: roleLoading } = useRole();

  useEffect(() => {
    async function load() {
      const [e, s] = await Promise.all([
        supabase.from("employees").select("*").neq("status", "ausgeschieden").order("last_name"),
        supabase.from("salaries").select("*").order("effective_from", { ascending: false }),
      ]);
      setEmployees((e.data as Employee[]) ?? []);
      setSalaries((s.data as Salary[]) ?? []);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || roleLoading) {
    return <p className="py-20 text-center text-petrol-400">Lade Gehaltsdaten…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-petrol-50 text-petrol-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-petrol-900">Kein Zugriff</h1>
        <p className="mt-2 max-w-md text-sm text-petrol-500">
          Gehaltsdaten sind nur für Admins sichtbar. Bitte wende dich an eine
          Administratorin oder einen Administrator, falls du Zugriff benötigst.
        </p>
      </div>
    );
  }

  // Aktuelles Gehalt pro Mitarbeiter (jüngster Eintrag)
  const current = employees.map((emp) => {
    const empSalaries = salaries.filter((s) => s.employee_id === emp.id);
    return { emp, salary: empSalaries[0] ?? null, history: empSalaries.length };
  });

  const annualTotal = current.reduce((sum, { salary }) => {
    if (!salary) return sum;
    return sum + (salary.pay_interval === "monatlich" ? salary.amount * 12 : Number(salary.amount));
  }, 0);

  const withSalary = current.filter((c) => c.salary);
  const avg = withSalary.length ? annualTotal / withSalary.length : 0;

  return (
    <div>
      <PageHeader
        title="Gehalt"
        subtitle="Aktuelle Vergütung und Historie. Anpassungen erfasst du in der Personalakte."
        action={
          <button
            className="btn-secondary"
            onClick={() =>
              downloadCsv(
                "gehaelter.csv",
                current.map(({ emp, salary }) => ({
                  Vorname: emp.first_name,
                  Nachname: emp.last_name,
                  Position: emp.position,
                  Abteilung: emp.department,
                  Betrag: salary?.amount ?? "",
                  Intervall: salary
                    ? salary.pay_interval === "monatlich"
                      ? "Monatlich"
                      : "Jährlich"
                    : "",
                  "Gültig ab": salary ? formatDate(salary.effective_from) : "",
                }))
              )
            }
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Jährliche Gesamtvergütung" value={formatEuro(annualTotal)} />
        <StatCard label="Ø Jahresgehalt" value={formatEuro(avg)} />
        <StatCard label="Mitarbeiter mit Gehaltsdaten" value={`${withSalary.length} / ${employees.length}`} />
      </div>

      {current.length === 0 ? (
        <EmptyState title="Keine Mitarbeiter:innen vorhanden" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                <th className="px-5 py-3">Mitarbeiter:in</th>
                <th className="px-5 py-3">Position</th>
                <th className="px-5 py-3">Aktuelles Gehalt</th>
                <th className="px-5 py-3">Gültig ab</th>
                <th className="px-5 py-3">Historie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-50">
              {current.map(({ emp, salary, history }) => (
                <tr key={emp.id} className="transition hover:bg-petrol-50/40">
                  <td className="px-5 py-3">
                    <Link href={`/mitarbeiter/${emp.id}`} className="flex items-center gap-3">
                      <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                      <span className="font-semibold text-petrol-900">
                        {emp.first_name} {emp.last_name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-petrol-600">{emp.position}</td>
                  <td className="px-5 py-3 font-semibold text-petrol-900">
                    {salary
                      ? `${formatEuro(salary.amount)} / ${salary.pay_interval === "monatlich" ? "Monat" : "Jahr"}`
                      : "–"}
                  </td>
                  <td className="px-5 py-3 text-petrol-500">
                    {salary ? formatDate(salary.effective_from) : "–"}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/mitarbeiter/${emp.id}`}
                      className="text-sm font-semibold text-coral-500 hover:text-coral-600"
                    >
                      {history} {history === 1 ? "Eintrag" : "Einträge"} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
