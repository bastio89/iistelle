import { createBrowserClient } from "@supabase/ssr";

function requireEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const KEY = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export function createClient() {
  return createBrowserClient(URL, KEY);
}
