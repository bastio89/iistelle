import { createServerSupabase } from "@/lib/supabase/server";
import { getActorContext, isAdmin } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const requestedEmployeeId = searchParams.get("employee_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const date = searchParams.get("date");

    if (!isAdmin(actor) && requestedEmployeeId && requestedEmployeeId !== actor.employeeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let query = supabase
      .from("time_entries")
      .select("*, employee:employees!inner(*)", { count: "exact" })
      .order("clock_in", { ascending: false });

    if (isAdmin(actor)) {
      if (!actor.companyId) return NextResponse.json({ error: "Company context missing" }, { status: 403 });
      query = query.eq("employee.company_id", actor.companyId);
    } else {
      if (!actor.employeeId) return NextResponse.json({ error: "Employee context missing" }, { status: 403 });
      query = query.eq("employee_id", requestedEmployeeId ?? actor.employeeId);
    }

    if (requestedEmployeeId) query = query.eq("employee_id", requestedEmployeeId);
    if (startDate) query = query.gte("clock_in", startDate);
    if (endDate) query = query.lte("clock_in", endDate + "T23:59:59");
    if (date) query = query.gte("clock_in", date).lte("clock_in", date + "T23:59:59");

    const { data: entries, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

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
      meta: { total: count || 0, total_hours: Math.round(totalMinutes / 60 * 100) / 100, total_pause_minutes: totalPauseMinutes },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const employeeId = isAdmin(actor) ? body.employee_id : actor.employeeId;
    if (!employeeId) return NextResponse.json({ error: "Employee context missing" }, { status: 403 });

    if (isAdmin(actor)) {
      const { data: employee } = await supabase.from("employees").select("id").eq("id", employeeId).eq("company_id", actor.companyId).maybeSingle();
      if (!employee) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } else if (body.employee_id && body.employee_id !== actor.employeeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pauseMin = Number(body.pause_min || 0);
    if (Number.isNaN(pauseMin) || pauseMin < 0) {
      return NextResponse.json({ error: "pause_min must be a positive number" }, { status: 400 });
    }

    const { data: existing } = await supabase.from("time_entries").select("*").eq("employee_id", employeeId).is("clock_out", null).maybeSingle();
    if (existing) return NextResponse.json({ error: "Employee already clocked in", data: existing }, { status: 409 });

    const { data: entry, error } = await supabase
      .from("time_entries")
      .insert({ employee_id: employeeId, clock_in: body.clock_in || new Date().toISOString(), pause_min: pauseMin, note: body.note || null })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Missing entry id" }, { status: 400 });

    const { data: existing } = await supabase
      .from("time_entries")
      .select("id, employee_id, employee:employees!inner(company_id)")
      .eq("id", body.id)
      .maybeSingle();

    if (!existing) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    if (!isAdmin(actor) && existing.employee_id !== actor.employeeId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const employee = Array.isArray(existing.employee) ? existing.employee[0] : existing.employee;
    if (isAdmin(actor) && (!actor.companyId || employee?.company_id !== actor.companyId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, any> = {};
    if (body.clock_out) updateData.clock_out = body.clock_out;
    if (body.pause_min !== undefined) {
      const pauseMin = Number(body.pause_min);
      if (Number.isNaN(pauseMin) || pauseMin < 0) return NextResponse.json({ error: "pause_min must be a positive number" }, { status: 400 });
      updateData.pause_min = pauseMin;
    }
    if (body.note !== undefined) updateData.note = body.note;

    const { data: entry, error } = await supabase.from("time_entries").update(updateData).eq("id", body.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: entry });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
