import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// =====================================================
// GET /api/employees - List all employees
// =====================================================
export async function GET(request: Request) {
  const supabase = await createServerSupabase();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check API key or session
  const apiKey = request.headers.get("x-api-key");
  const companyId = request.headers.get("x-company-id");

  try {
    // Build query based on authentication
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const department = searchParams.get("department");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("employees")
      .select("*", { count: "exact" })
      .order("last_name")
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }
    if (department) {
      query = query.eq("department", department);
    }

    const { data: employees, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: employees,
      meta: {
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =====================================================
// POST /api/employees - Create new employee
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
    const requiredFields = ["first_name", "last_name", "email", "position", "department", "hire_date"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create employee
    const { data: employee, error } = await supabase
      .from("employees")
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone || null,
        position: body.position,
        department: body.department,
        location: body.location || null,
        employment_type: body.employment_type || "Vollzeit",
        hire_date: body.hire_date,
        birth_date: body.birth_date || null,
        manager: body.manager || null,
        vacation_days_per_year: body.vacation_days_per_year || 25,
        carryover_days: body.carryover_days || 0,
        skills: body.skills || [],
        emergency_contact_name: body.emergency_contact_name || "",
        emergency_contact_phone: body.emergency_contact_phone || "",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: employee }, { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}