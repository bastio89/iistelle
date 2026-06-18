import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type ActorContext = {
  userId: string;
  role: string | null;
  companyId: string | null;
  employeeId: string | null;
};

async function getActorContext(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: role }, { data: employee }] = await Promise.all([
    supabase.from("user_roles").select("role, company_id").eq("user_id", user.id).maybeSingle(),
    supabase.from("employees").select("id, company_id").eq("user_id", user.id).maybeSingle(),
  ]);

  return {
    userId: user.id,
    role: role?.role ?? null,
    companyId: role?.company_id ?? employee?.company_id ?? null,
    employeeId: employee?.id ?? null,
  } satisfies ActorContext;
}

function isAdmin(actor: ActorContext) {
  return actor.role === "admin";
}

// =====================================================
// GET /api/absences - List absences
// =====================================================
export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const actor = await getActorContext(supabase);

  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const requestedEmployeeId = searchParams.get("employee_id");
    const status = searchParams.get("status");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const pending = searchParams.get("pending"); // "true" for pending approvals

    if (!isAdmin(actor) && requestedEmployeeId && requestedEmployeeId !== actor.employeeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let query = supabase
      .from("absences")
      .select("*, employee:employees!inner(*)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (isAdmin(actor)) {
      if (!actor.companyId) {
        return NextResponse.json({ error: "Company context missing" }, { status: 403 });
      }
      query = query.eq("employee.company_id", actor.companyId);
    } else {
      if (!actor.employeeId) {
        return NextResponse.json({ error: "Employee context missing" }, { status: 403 });
      }
      query = query.eq("employee_id", requestedEmployeeId ?? actor.employeeId);
    }

    if (requestedEmployeeId) {
      query = query.eq("employee_id", requestedEmployeeId);
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
  const actor = await getActorContext(supabase);

  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const employeeId = isAdmin(actor) ? body.employee_id : actor.employeeId;

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee context missing" },
        { status: 403 }
      );
    }

    if (isAdmin(actor)) {
      const { data: employee } = await supabase
        .from("employees")
        .select("id")
        .eq("id", employeeId)
        .eq("company_id", actor.companyId)
        .maybeSingle();
      if (!employee) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (body.employee_id && body.employee_id !== actor.employeeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requiredFields = ["absence_type", "start_date", "end_date", "days"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

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
        employee_id: employeeId,
        absence_type: body.absence_type,
        start_date: body.start_date,
        end_date: body.end_date,
        days: body.days,
        status: "beantragt",
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
  const actor = await getActorContext(supabase);

  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(actor) || !actor.companyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const { data: existing } = await supabase
      .from("absences")
      .select("id, employee:employees!inner(company_id)")
      .eq("id", body.id)
      .eq("employee.company_id", actor.companyId)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Absence not found" }, { status: 404 });
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
