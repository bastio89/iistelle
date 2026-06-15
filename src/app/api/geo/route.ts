import { NextResponse } from "next/server";
import { detectCountry } from "@/lib/pricing";

export async function GET(request: Request) {
  const acceptLanguage = request.headers.get("accept-language");
  const country = detectCountry(acceptLanguage);

  return NextResponse.json({ country });
}