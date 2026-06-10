"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/lib/types";

/** Liefert die Rolle des angemeldeten Nutzers (admin | manager | mitarbeiter). */
export function useRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      const { data: row } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();
      setRole((row?.role as UserRole) ?? "mitarbeiter");
      setLoading(false);
    });
  }, []);

  return { role, isAdmin: role === "admin", loading };
}
