"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { HrTask } from "@/lib/types";
import { EmptyState, PageHeader, StatCard, formatDate } from "@/components/ui";
import { Plus, Trash2 } from "lucide-react";

export default function TasksPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<HrTask[]>([]);
  const [filter, setFilter] = useState<"offen" | "erledigt" | "alle">("offen");
  const [form, setForm] = useState({ title: "", assignee: "", due_date: "" });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("hr_tasks")
      .select("*")
      .order("done")
      .order("due_date", { ascending: true, nullsFirst: false });
    setTasks((data as HrTask[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await supabase.from("hr_tasks").insert({
      title: form.title.trim(),
      assignee: form.assignee,
      due_date: form.due_date || null,
    });
    setForm({ title: "", assignee: "", due_date: "" });
    load();
  }

  async function toggle(task: HrTask) {
    await supabase.from("hr_tasks").update({ done: !task.done }).eq("id", task.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("hr_tasks").delete().eq("id", id);
    load();
  }

  const today = new Date().toISOString().slice(0, 10);
  const open = tasks.filter((t) => !t.done);
  const overdue = open.filter((t) => t.due_date && t.due_date < today);

  const filtered =
    filter === "alle"
      ? tasks
      : filter === "offen"
        ? open
        : tasks.filter((t) => t.done);

  if (loading) {
    return <p className="py-20 text-center text-petrol-400">Lade Aufgaben…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Aufgaben"
        subtitle="HR-To-dos mit Fälligkeit und Zuständigkeit – nichts geht mehr unter."
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Offen" value={open.length} />
        <StatCard label="Überfällig" value={overdue.length} accent={overdue.length > 0} />
        <StatCard label="Erledigt" value={tasks.length - open.length} />
      </div>

      <form onSubmit={addTask} className="card mb-6 flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-64 flex-1">
          <label className="label">Neue Aufgabe</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="z. B. Arbeitsvertrag versenden"
            required
          />
        </div>
        <div>
          <label className="label">Zuständig</label>
          <input
            className="input w-44"
            value={form.assignee}
            onChange={(e) => setForm({ ...form, assignee: e.target.value })}
            placeholder="Name"
          />
        </div>
        <div>
          <label className="label">Fällig am</label>
          <input
            className="input w-40"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" /> Hinzufügen
        </button>
      </form>

      <div className="mb-4 flex gap-2">
        {(
          [
            ["offen", "Offen"],
            ["erledigt", "Erledigt"],
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

      {filtered.length === 0 ? (
        <EmptyState title="Keine Aufgaben in dieser Ansicht" />
      ) : (
        <div className="card divide-y divide-petrol-50">
          {filtered.map((t) => {
            const isOverdue = !t.done && t.due_date && t.due_date < today;
            return (
              <div key={t.id} className="group flex items-center gap-3 px-5 py-3.5">
                <button
                  onClick={() => toggle(t)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                    t.done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-petrol-300 bg-white hover:border-petrol-500"
                  }`}
                >
                  {t.done && <span className="text-[10px] font-black">✓</span>}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      t.done
                        ? "text-petrol-300 line-through"
                        : "font-semibold text-petrol-900"
                    }`}
                  >
                    {t.title}
                  </p>
                  <p className="text-xs text-petrol-400">
                    {t.assignee && `${t.assignee} · `}
                    {t.due_date ? (
                      <span className={isOverdue ? "font-bold text-rose-500" : ""}>
                        fällig {formatDate(t.due_date)}
                        {isOverdue && " (überfällig)"}
                      </span>
                    ) : (
                      "ohne Frist"
                    )}
                  </p>
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded p-1.5 text-petrol-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                  title="Aufgabe löschen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
