import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function requireEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const KEY = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

/** Server-Client für Route-Handler (liest die Auth-Session aus Cookies). */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(URL, KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // In Route-Handlern nicht benötigt
      },
    },
  });
}
