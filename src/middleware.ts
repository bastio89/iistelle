import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function requireEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const KEY = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(URL, KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: object }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isPortalAuthPage = request.nextUrl.pathname.startsWith("/portal-login");
  const isPublic =
    isAuthPage ||
    isPortalAuthPage ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/karriere") ||
    request.nextUrl.pathname.startsWith("/impressum") ||
    request.nextUrl.pathname.startsWith("/datenschutz") ||
    request.nextUrl.pathname.startsWith("/agb") ||
    request.nextUrl.pathname.startsWith("/status") ||
    request.nextUrl.pathname.startsWith("/termin") ||
    request.nextUrl.pathname.startsWith("/services") ||
    request.nextUrl.pathname.startsWith("/ratgeber") ||
    request.nextUrl.pathname.startsWith("/hilfecenter") ||
    request.nextUrl.pathname.startsWith("/rechner") ||
    request.nextUrl.pathname.startsWith("/preise");

  // Portal-Route: Nur für authentifizierte Nutzer
  const isPortal = request.nextUrl.pathname.startsWith("/portal");

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Portal-Zugang: nur für authentifizierte Nutzer mit Mitarbeiterprofil.
  if (user && isPortal && !isPortalAuthPage) {
    const { data: employee } = await supabase
      .from("employees")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!employee) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return response;
  }

  if (user && (isAuthPage || isPortalAuthPage)) {
    const url = request.nextUrl.clone();
    // Bei Portal-Login: direkt zum Portal
    url.pathname = isPortalAuthPage ? "/portal" : "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};