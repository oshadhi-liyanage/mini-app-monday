import { NextResponse } from "next/server";
import { db } from "@/db";
import { miniAppsTable } from "@/db/schema";
import { createClient } from "@farcaster/quick-auth";
import { env } from "@/lib/env";

const client = createClient();

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    // Verify the Quick Auth token
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: env.APP_DOMAIN,
    });

    const fid = payload.sub;
    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 401 });
    }

    // Fetch mini apps
    const apps = await db.select().from(miniAppsTable);
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching mini apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch mini apps" },
      { status: 500 }
    );
  }
}
