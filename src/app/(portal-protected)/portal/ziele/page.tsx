"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, Goal, GOAL_STATUS_META } from "@/lib/types";
import { formatDate } from "@/components/ui";
import {
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  Calendar,
} from "lucide-react";

export default function PortalZielePage() {
  const supabase = createClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Get employee directly via user_id
    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!emp) {
      setLoading(false);
      return;
    }

    const employee = emp as Employee;
    setEmployee(employee);

    const { data: g } = await supabase
      .from("goals")
      .select("*")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setGoals((g as Goal[]) ?? []);

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

  const activeGoals = goals.filter((g) => g.status !== "erreicht" && g.status !== "verfehlt");
  const completedGoals = goals.filter((g) => g.status === "erreicht");
  const missedGoals = goals.filter((g) => g.status === "verfehlt");

  const filteredGoals = goals.filter((g) => {
    if (filter === "active") return g.status !== "erreicht" && g.status !== "verfehlt";
    if (filter === "completed") return g.status === "erreicht";
    return true;
  });

  // Stats
  const completionRate = goals.length > 0
    ? Math.round((completedGoals.length / goals.length) * 100)
    : 0;

  const avgProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-petrol-900">Meine Ziele</h1>
        <p className="mt-1 text-petrol-500">Verfolge deine OKRs und persönliche Entwicklung</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-petrol-400">Aktive Ziele</p>
              <p className="mt-1 text-3xl font-bold text-petrol-900">{activeGoals.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
              <Target className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-petrol-400">Ø Fortschritt</p>
              <p className="mt-1 text-3xl font-bold text-petrol-900">{avgProgress}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-petrol-400">Abschlussrate</p>
              <p className="mt-1 text-3xl font-bold text-petrol-900">{completionRate}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
              <CheckCircle2 className="h-6 w-6 text-sky-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "Alle", count: goals.length },
          { key: "active", label: "Aktiv", count: activeGoals.length },
          { key: "completed", label: "Erreicht", count: completedGoals.length },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as "all" | "active" | "completed")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === f.key
                ? "bg-petrol-900 text-white"
                : "bg-white text-petrol-600 hover:bg-gray-100"
            }`}
          >
            {f.label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              filter === f.key ? "bg-white/20" : "bg-gray-100"
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <Target className="mx-auto h-12 w-12 text-petrol-300" />
          <p className="mt-4 text-petrol-500">
            {filter === "all"
              ? "Keine Ziele definiert."
              : filter === "active"
              ? "Keine aktiven Ziele."
              : "Keine erreichten Ziele."}
          </p>
          <p className="mt-2 text-sm text-petrol-400">
            Dein Vorgesetzter kann Ziele für dich anlegen.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const meta = GOAL_STATUS_META[goal.status];
            const statusColors = {
              erreicht: "bg-emerald-500",
              verfehlt: "bg-rose-500",
              in_arbeit: "bg-petrol-500",
              offen: "bg-gray-400",
            };

            return (
              <div key={goal.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                      {goal.due_date && (
                        <span className="flex items-center gap-1 text-xs text-petrol-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(goal.due_date)}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-semibold text-petrol-900">{goal.title}</h3>
                    {goal.description && (
                      <p className="mt-1 text-sm text-petrol-500">{goal.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-petrol-900">{goal.progress}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-petrol-500 mb-1">
                    <span>Fortschritt</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${statusColors[goal.status]}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}