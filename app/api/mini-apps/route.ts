import { NextResponse } from "next/server";
import { db } from "@/db";
import { miniAppsTable } from "@/db/schema";
import { createClient } from "@farcaster/quick-auth";
import { env } from "@/lib/env";
import { desc, and, lt, eq } from "drizzle-orm";

const client = createClient();
const ITEMS_PER_PAGE = 15;

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

    // Get cursor from URL
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    console.log("Cursor:", cursor);

    let whereClause = undefined;
    if (cursor) {
      const cursorItem = await db
        .select()
        .from(miniAppsTable)
        .where(eq(miniAppsTable.id, cursor))
        .limit(1);

      console.log("Cursor item:", cursorItem);

      if (cursorItem.length > 0) {
        whereClause = and(
          lt(miniAppsTable.createdAt, cursorItem[0].createdAt),
          lt(miniAppsTable.id, cursor)
        );
      }
    }

    // Fetch mini apps with pagination
    const apps = await db
      .select()
      .from(miniAppsTable)
      .where(whereClause)
      .orderBy(desc(miniAppsTable.createdAt))
      .limit(ITEMS_PER_PAGE + 1);

    // Check if there are more items
    const hasMore = apps.length > ITEMS_PER_PAGE;
    const items = hasMore ? apps.slice(0, ITEMS_PER_PAGE) : apps;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    console.log("Has more:", hasMore);
    console.log("Next cursor:", nextCursor);

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching mini apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch mini apps" },
      { status: 500 }
    );
  }
}
