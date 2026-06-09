"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Search, Bell } from "lucide-react";

export default function Topbar() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setName((data.user?.user_metadata?.full_name as string) ?? "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (name || email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-petrol-100 bg-white/90 px-6 backdrop-blur">
      <div className="flex items-center gap-2 rounded-lg border border-petrol-100 bg-surface px-3 py-1.5 text-sm text-petrol-400">
        <Search className="h-4 w-4" />
        <span>Suchen…</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-petrol-500 transition hover:bg-petrol-50">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-petrol-800 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-petrol-900">
              {name || "Nutzer"}
            </p>
            <p className="text-xs leading-tight text-petrol-400">{email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Abmelden"
          className="rounded-lg p-2 text-petrol-500 transition hover:bg-coral-500 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
