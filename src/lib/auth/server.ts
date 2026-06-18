import { createServerSupabase } from "@/lib/supabase/server";

export type ActorContext = {
  userId: string;
  email: string | null;
  role: string | null;
  companyId: string | null;
  employeeId: string | null;
};

type SupabaseServer = Awaited<ReturnType<typeof createServerSupabase>>;

/**
 * Resolves the authenticated user together with their role, company and
 * employee record. Returns null when no user is authenticated.
 *
 * This is the single source of truth for server-side authorization context.
 * Route handlers must derive company/role/employee scope from here instead of
 * trusting client-supplied identifiers.
 */
export async function getActorContext(
  supabase: SupabaseServer
): Promise<ActorContext | null> {
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
    email: user.email ?? null,
    role: role?.role ?? null,
    companyId: role?.company_id ?? employee?.company_id ?? null,
    employeeId: employee?.id ?? null,
  };
}

export function isAdmin(actor: ActorContext): boolean {
  return actor.role === "admin";
}
