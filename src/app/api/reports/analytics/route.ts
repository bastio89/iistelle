import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// =====================================================
// GET /api/reports/analytics - Get HR analytics
// =====================================================
export async function GET(request: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || new Date().getFullYear().toString();

    // Fetch all data in parallel
    const [
      employeesResult,
      absencesResult,
      timeEntriesResult,
      goalsResult,
      reviewsResult,
    ] = await Promise.all([
      supabase.from("employees").select("status, department, hire_date"),
      supabase
        .from("absences")
        .select("absence_type, status, days, start_date")
        .gte("start_date", `${year}-01-01`)
        .lte("start_date", `${year}-12-31`),
      supabase
        .from("time_entries")
        .select("clock_in, clock_out, pause_min")
        .gte("clock_in", `${year}-01-01`)
        .lte("clock_in", `${year}-12-31`),
      supabase.from("goals").select("status").gte("created_at", `${year}-01-01`),
      supabase.from("reviews").select("score").gte("created_at", `${year}-01-01`),
    ]);

    const employees = employeesResult.data || [];
    const absences = absencesResult.data || [];
    const timeEntries = timeEntriesResult.data || [];
    const goals = goalsResult.data || [];
    const reviews = reviewsResult.data || [];

    // Calculate metrics
    const activeEmployees = employees.filter((e) => e.status === "aktiv").length;
    const totalEmployees = employees.length;
    const newHiresThisYear = employees.filter((e) => {
      if (!e.hire_date) return false;
      return e.hire_date.startsWith(year);
    }).length;

    // Department breakdown
    const deptBreakdown: Record<string, number> = {};
    for (const emp of employees.filter((e) => e.status === "aktiv")) {
      deptBreakdown[emp.department] = (deptBreakdown[emp.department] || 0) + 1;
    }

    // Absence breakdown by type
    const absenceBreakdown: Record<string, number> = {};
    const approvedAbsences = absences.filter((a) => a.status === "genehmigt");
    for (const absence of approvedAbsences) {
      absenceBreakdown[absence.absence_type] =
        (absenceBreakdown[absence.absence_type] || 0) + absence.days;
    }

    // Working hours
    let totalHoursWorked = 0;
    for (const entry of timeEntries) {
      if (entry.clock_out) {
        const diff =
          new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime();
        totalHoursWorked += diff / 3600000 - entry.pause_min / 60;
      }
    }

    // Goals
    const goalsAchieved = goals.filter((g) => g.status === "erreicht").length;
    const goalsInProgress = goals.filter((g) => g.status === "in_arbeit").length;

    // Reviews
    const avgReviewScore =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((s, r) => s + r.score, 0) / reviews.length) * 10
          ) / 10
        : 0;

    return NextResponse.json({
      data: {
        employees: {
          total: totalEmployees,
          active: activeEmployees,
          new_hires_this_year: newHiresThisYear,
          by_department: deptBreakdown,
        },
        absences: {
          by_type: absenceBreakdown,
          total_days: approvedAbsences.reduce((s, a) => s + a.days, 0),
        },
        time_tracking: {
          total_hours: Math.round(totalHoursWorked * 100) / 100,
          avg_daily_hours:
            timeEntries.length > 0
              ? Math.round((totalHoursWorked / 52 / 5) * 100) / 100
              : 0,
        },
        performance: {
          goals_achieved: goalsAchieved,
          goals_in_progress: goalsInProgress,
          total_goals: goals.length,
          avg_review_score: avgReviewScore,
          total_reviews: reviews.length,
        },
      },
      meta: {
        year,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}