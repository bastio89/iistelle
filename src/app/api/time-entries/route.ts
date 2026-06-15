import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// =====================================================
// GET /api/time-entries - List time entries
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
    const employeeId = searchParams.get("employee_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const date = searchParams.get("date"); // Single date for daily view

    let query = supabase
      .from("time_entries")
      .select("*, employee:employees(*)", { count: "exact" })
      .order("clock_in", { ascending: false });

    if (employeeId) {
      query = query.eq("employee_id", employeeId);
    }
    if (startDate) {
      query = query.gte("clock_in", startDate);
    }
    if (endDate) {
      query = query.lte("clock_in", endDate + "T23:59:59");
    }
    if (date) {
      query = query.gte("clock_in", date).lte("clock_in", date + "T23:59:59");
    }

    const { data: entries, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Calculate totals
    let totalMinutes = 0;
    let totalPauseMinutes = 0;
    for (const entry of entries || []) {
      if (entry.clock_out) {
        const diff = new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime();
        totalMinutes += diff / 60000 - entry.pause_min;
        totalPauseMinutes += entry.pause_min;
      }
    }

    return NextResponse.json({
      data: entries,
      meta: {
        total: count || 0,
        total_hours: Math.round(totalMinutes / 60 * 100) / 100,
        total_pause_minutes: totalPauseMinutes,
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =====================================================
// POST /api/time-entries - Create time entry (clock in)
// =====================================================
export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.employee_id) {
      return NextResponse.json(
        { error: "Missing required field: employee_id" },
        { status: 400 }
      );
    }

    // Check if already clocked in
    const { data: existing } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", body.employee_id)
      .is("clock_out", null)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Employee already clocked in", data: existing },
        { status: 409 }
      );
    }

    const { data: entry, error } = await supabase
      .from("time_entries")
      .insert({
        employee_id: body.employee_id,
        clock_in: body.clock_in || new Date().toISOString(),
        pause_min: body.pause_min || 0,
        note: body.note || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

// =====================================================
// PATCH /api/time-entries - Clock out or update entry
// =====================================================
export async function PATCH(request: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Missing entry id" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};

    // Clock out
    if (body.clock_out) {
      updateData.clock_out = body.clock_out;
    }

    // Update pause
    if (body.pause_min !== undefined) {
      updateData.pause_min = body.pause_min;
    }

    // Update note
    if (body.note !== undefined) {
      updateData.note = body.note;
    }

    const { data: entry, error } = await supabase
      .from("time_entries")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: entry });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}