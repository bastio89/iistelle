"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Employee, Absence, ABSENCE_TYPE_META } from "@/lib/types";
import { formatDate as formatDateUtil } from "@/components/ui";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
  AlertCircle,
  Sun,
  Cloud,
  Thermometer,
  Umbrella,
  Briefcase,
} from "lucide-react";

export default function PortalKalenderPage() {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [absences, setAbsences] = useState<(Absence & { employee?: Employee })[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const [absData, empData] = await Promise.all([
      supabase
        .from("absences")
        .select("*, employee:employees(*)")
        .gte("start_date", startOfMonth.toISOString().split("T")[0])
        .lte("end_date", endOfMonth.toISOString().split("T")[0]),
      supabase.from("employees").select("*").eq("status", "aktiv").order("first_name"),
    ]);

    setAbsences(absData.data || []);
    setEmployees(empData.data || []);
    setLoading(false);
  }, [currentDate, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  function getDaysInMonth() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add padding days for week alignment (Monday = 0)
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startPadding; i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    // Add padding at the end
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }

  function getAbsencesForDate(date: Date): (Absence & { employee?: Employee })[] {
    const dateStr = date.toISOString().split("T")[0];
    return absences.filter((a) => {
      const start = a.start_date.split("T")[0];
      const end = a.end_date.split("T")[0];
      return dateStr >= start && dateStr <= end;
    });
  }

  function isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isCurrentMonth(date: Date): boolean {
    return date.getMonth() === currentDate.getMonth();
  }

  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  const absenceTypeIcon = {
    urlaub: <Sun className="h-3 w-3" />,
    krank: <Thermometer className="h-3 w-3" />,
    sonderurlaub: <Cloud className="h-3 w-3" />,
    unbezahlt: <Briefcase className="h-3 w-3" />,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-petrol-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-petrol-900">Team-Kalender</h1>
          <p className="text-petrol-500">Übersicht aller Abwesenheiten im Team</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-petrol-200 bg-white text-petrol-600 transition-all hover:bg-petrol-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[160px] text-center text-lg font-bold text-petrol-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-petrol-200 bg-white text-petrol-600 transition-all hover:bg-petrol-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="card overflow-hidden p-0">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-petrol-100 bg-petrol-50">
          {weekDays.map((day) => (
            <div
              key={day}
              className={`py-3 text-center text-sm font-bold ${day === "Sa" || day === "So" ? "text-rose-500" : "text-petrol-600"}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {getDaysInMonth().map((date, index) => {
            const dayAbsences = getAbsencesForDate(date);
            const weekend = isWeekend(date);
            const today = isToday(date);
            const currentMonth = isCurrentMonth(date);

            return (
              <div
                key={index}
                className={`min-h-[100px] border-b border-r border-petrol-50 p-2 ${
                  weekend ? "bg-rose-50/30" : currentMonth ? "bg-white" : "bg-petrol-50/30"
                }`}
              >
                <div className={`mb-1 flex items-center justify-between ${
                  today ? "font-bold" : ""
                }`}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    today
                      ? "bg-coral-500 text-white"
                      : weekend
                      ? "text-rose-500"
                      : currentMonth
                      ? "text-petrol-700"
                      : "text-petrol-300"
                  }`}>
                    {date.getDate()}
                  </span>
                </div>

                {/* Absence List */}
                <div className="space-y-1">
                  {dayAbsences.slice(0, 3).map((absence) => (
                    <div
                      key={absence.id}
                      className={`group relative flex items-center gap-1 truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${ABSENCE_TYPE_META[absence.absence_type].color}`}
                      title={`${absence.employee?.first_name} ${absence.employee?.last_name}: ${ABSENCE_TYPE_META[absence.absence_type].label}`}
                    >
                      {absenceTypeIcon[absence.absence_type]}
                      <span className="truncate">
                        {absence.employee?.first_name?.[0]}{absence.employee?.last_name?.[0]}
                      </span>
                    </div>
                  ))}
                  {dayAbsences.length > 3 && (
                    <div className="text-center text-[10px] text-petrol-400">
                      +{dayAbsences.length - 3} mehr
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4">
        <h3 className="mb-3 text-sm font-bold text-petrol-900">Legende</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(ABSENCE_TYPE_META).map(([type, meta]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded ${meta.color}`}>
                {absenceTypeIcon[type as keyof typeof absenceTypeIcon]}
              </div>
              <span className="text-sm text-petrol-600">{meta.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Absences */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-petrol-900">Anstehende Abwesenheiten</h2>
        {absences.filter(a => new Date(a.start_date) >= new Date()).length === 0 ? (
          <div className="py-6 text-center text-petrol-400">
            <Calendar className="mx-auto h-10 w-10 text-petrol-200" />
            <p className="mt-2">Keine anstehenden Abwesenheiten</p>
          </div>
        ) : (
          <div className="space-y-3">
            {absences
              .filter((a) => new Date(a.start_date) >= new Date())
              .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
              .slice(0, 5)
              .map((absence) => (
                <div
                  key={absence.id}
                  className="flex items-center justify-between rounded-lg border border-petrol-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${ABSENCE_TYPE_META[absence.absence_type].color}`}>
                      {absenceTypeIcon[absence.absence_type]}
                    </div>
                    <div>
                      <p className="font-semibold text-petrol-900">
                        {absence.employee?.first_name} {absence.employee?.last_name}
                      </p>
                      <p className="text-sm text-petrol-500">{ABSENCE_TYPE_META[absence.absence_type].label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-petrol-700">
                      {formatDateUtil(absence.start_date)} – {formatDateUtil(absence.end_date)}
                    </p>
                    <p className="text-sm text-petrol-400">{absence.days} Tage</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}