"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Company, UserRole } from "@/lib/types";

/** Liefert Rolle und Firma des angemeldeten Nutzers. */
export function useRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
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
        .select("role, company_id")
        .eq("user_id", data.user.id)
        .maybeSingle();
      setRole((row?.role as UserRole) ?? "mitarbeiter");
      if (row?.company_id) {
        const { data: c } = await supabase
          .from("companies")
          .select("*")
          .eq("id", row.company_id)
          .maybeSingle();
        setCompany((c as Company) ?? null);
      }
      setLoading(false);
    });
  }, []);

  return { role, isAdmin: role === "admin", company, loading };
}
