import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// =====================================================
// GET /api/employees/[id] - Get single employee
// =====================================================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { data: employee, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Fetch related data
    const [absences, goals, reviews, timeEntries] = await Promise.all([
      supabase.from("absences").select("*").eq("employee_id", id).order("created_at", { ascending: false }).limit(10),
      supabase.from("goals").select("*").eq("employee_id", id).order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").eq("employee_id", id).order("created_at", { ascending: false }),
      supabase.from("time_entries").select("*").eq("employee_id", id).order("clock_in", { ascending: false }).limit(50),
    ]);

    return NextResponse.json({
      data: employee,
      related: {
        absences: absences.data || [],
        goals: goals.data || [],
        reviews: reviews.data || [],
        recent_time_entries: timeEntries.data || [],
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =====================================================
// PATCH /api/employees/[id] - Update employee
// =====================================================
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = [
      "first_name", "last_name", "email", "phone", "position", "department",
      "location", "employment_type", "status", "manager", "vacation_days_per_year",
      "carryover_days", "skills", "emergency_contact_name", "emergency_contact_phone",
      "exit_date"
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: employee, error } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: employee });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

// =====================================================
// DELETE /api/employees/[id] - Delete employee
// =====================================================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Soft delete by setting status
    const { data: employee, error } = await supabase
      .from("employees")
      .update({ status: "ausgeschieden", exit_date: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: employee, message: "Employee archived successfully" });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}