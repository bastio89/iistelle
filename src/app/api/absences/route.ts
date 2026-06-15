import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// =====================================================
// GET /api/absences - List absences
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
    const status = searchParams.get("status");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const pending = searchParams.get("pending"); // "true" for pending approvals

    let query = supabase
      .from("absences")
      .select("*, employee:employees(*)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (employeeId) {
      query = query.eq("employee_id", employeeId);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (startDate) {
      query = query.gte("start_date", startDate);
    }
    if (endDate) {
      query = query.lte("end_date", endDate);
    }
    if (pending === "true") {
      query = query.eq("status", "beantragt");
    }

    const { data: absences, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: absences,
      meta: {
        total: count || 0,
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =====================================================
// POST /api/absences - Create absence request
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

    // Validate required fields
    const requiredFields = ["employee_id", "absence_type", "start_date", "end_date", "days"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate absence type
    const validTypes = ["urlaub", "krank", "sonderurlaub", "unbezahlt"];
    if (!validTypes.includes(body.absence_type)) {
      return NextResponse.json(
        { error: `Invalid absence_type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const { data: absence, error } = await supabase
      .from("absences")
      .insert({
        employee_id: body.employee_id,
        absence_type: body.absence_type,
        start_date: body.start_date,
        end_date: body.end_date,
        days: body.days,
        status: "beantragt", // Always start as pending
        comment: body.comment || null,
        attachment_path: body.attachment_path || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: absence }, { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

// =====================================================
// PATCH /api/absences - Approve/reject absence
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
      return NextResponse.json({ error: "Missing absence id" }, { status: 400 });
    }

    if (!body.status || !["genehmigt", "abgelehnt"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'genehmigt' or 'abgelehnt'" },
        { status: 400 }
      );
    }

    const { data: absence, error } = await supabase
      .from("absences")
      .update({ status: body.status })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: absence });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}