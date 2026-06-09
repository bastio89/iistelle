import { createBrowserClient } from "@supabase/ssr";

const URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://afmjpjwipjsgvvrfrojo.supabase.co";
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbWpwandpcGpzZ3Z2cmZyb2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzA5MTIsImV4cCI6MjA5NjYwNjkxMn0.kAgOQotAWFv0euTUP4GL52dyQuo9OMk6V41xofDmPAY";

export function createClient() {
  return createBrowserClient(URL, KEY);
}
