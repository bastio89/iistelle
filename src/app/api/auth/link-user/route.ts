import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Dieser Setup-Endpunkt wurde deaktiviert. Benutzer- und Rollenverknüpfungen müssen über einen autorisierten Admin-Workflow erfolgen.",
    },
    { status: 410 }
  );
}
