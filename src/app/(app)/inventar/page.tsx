"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Employee, EquipmentItem } from "@/lib/types";
import { Avatar, EmptyState, PageHeader, StatCard, formatDate } from "@/components/ui";
import { downloadCsv } from "@/lib/csv";
import { Download, Laptop, Search } from "lucide-react";

interface Row extends EquipmentItem {
  employee?: Employee;
}

export default function InventoryPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"alle" | "im_einsatz" | "zurueck">("im_einsatz");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("equipment")
      .select("*, employee:employees(*)")
      .order("issued_on", { ascending: false });
    setItems((data as Row[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const inUse = items.filter((i) => !i.returned_on);

  const filtered = items.filter((i) => {
    const matchesFilter =
      filter === "alle" ||
      (filter === "im_einsatz" ? !i.returned_on : Boolean(i.returned_on));
    const matchesQuery = `${i.name} ${i.serial_no ?? ""} ${i.employee?.first_name ?? ""} ${i.employee?.last_name ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Inventar…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Inventar"
        subtitle="Alle ausgegebenen Geräte und Gegenstände im Überblick."
        action={
          <button
            className="btn-secondary"
            onClick={() =>
              downloadCsv(
                "inventar.csv",
                filtered.map((i) => ({
                  Gerät: i.name,
                  Seriennummer: i.serial_no,
                  "Mitarbeiter:in": i.employee
                    ? `${i.employee.first_name} ${i.employee.last_name}`
                    : "",
                  Ausgegeben: i.issued_on,
                  Zurückgegeben: i.returned_on,
                  Notiz: i.note,
                }))
              )
            }
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Im Einsatz" value={inUse.length} accent />
        <StatCard label="Zurückgegeben" value={items.length - inUse.length} />
        <StatCard label="Einträge gesamt" value={items.length} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="card flex min-w-64 flex-1 items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 text-petrol-400" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-petrol-300"
            placeholder="Nach Gerät, Seriennummer oder Person suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(
            [
              ["im_einsatz", "Im Einsatz"],
              ["zurueck", "Zurückgegeben"],
              ["alle", "Alle"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === key
                  ? "bg-petrol-800 text-white"
                  : "bg-white text-petrol-600 shadow-card hover:bg-petrol-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Kein Equipment in dieser Ansicht"
          hint="Equipment wird in der Personalakte (Tab „Equipment“) ausgegeben."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-petrol-100 bg-petrol-50/50 text-left text-xs font-bold uppercase tracking-wide text-petrol-500">
                <th className="px-5 py-3">Gerät</th>
                <th className="px-5 py-3">Seriennummer</th>
                <th className="px-5 py-3">Mitarbeiter:in</th>
                <th className="px-5 py-3">Ausgegeben</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-petrol-50">
              {filtered.map((i) => (
                <tr key={i.id} className="transition hover:bg-petrol-50/40">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2.5 font-semibold text-petrol-900">
                      <Laptop className="h-4 w-4 text-petrol-300" /> {i.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-petrol-500">{i.serial_no || "–"}</td>
                  <td className="px-5 py-3">
                    {i.employee ? (
                      <Link
                        href={`/mitarbeiter/${i.employee_id}`}
                        className="flex items-center gap-2"
                      >
                        <Avatar
                          name={`${i.employee.first_name} ${i.employee.last_name}`}
                          size="sm"
                        />
                        <span className="font-semibold text-petrol-900">
                          {i.employee.first_name} {i.employee.last_name}
                        </span>
                      </Link>
                    ) : (
                      "–"
                    )}
                  </td>
                  <td className="px-5 py-3 text-petrol-500">{formatDate(i.issued_on)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        i.returned_on
                          ? "bg-slate-100 text-slate-600"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {i.returned_on
                        ? `zurück ${formatDate(i.returned_on)}`
                        : "Im Einsatz"}
                    </span>
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
