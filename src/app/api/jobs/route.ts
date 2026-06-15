import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// =====================================================
// GET /api/jobs - List job postings
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
    const status = searchParams.get("status");
    const department = searchParams.get("department");
    const published = searchParams.get("published"); // "true" for public jobs

    let query = supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (department) {
      query = query.eq("department", department);
    }
    if (published === "true") {
      query = query.eq("status", "veroeffentlicht");
    }

    const { data: jobs, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: jobs,
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
// POST /api/jobs - Create job posting
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

    const requiredFields = ["title", "department", "location", "employment_type"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        title: body.title,
        department: body.department,
        location: body.location,
        employment_type: body.employment_type,
        seniority: body.seniority || null,
        status: body.status || "entwurf",
        description: body.description || null,
        recruiter: body.recruiter || null,
        target_hires: body.target_hires || 1,
        channels: body.channels || [],
        application_deadline: body.application_deadline || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: job }, { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}