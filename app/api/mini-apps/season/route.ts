import { NextResponse } from "next/server";
import { db } from "@/db";
import { miniAppsTable, seasonsTable, miniAppSeasonsTable } from "@/db/schema";
import { createClient } from "@farcaster/quick-auth";
import { env } from "@/lib/env";
import { desc, and, lt, eq, gte } from "drizzle-orm";

const client = createClient();
const ITEMS_PER_PAGE = 15;

// Helper to get most recent Monday (local time)
function getMostRecentMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Sunday: -6, Monday: 0, etc.
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const seasonType = searchParams.get("season"); // "this-week", "last-week", "all"

    // Helper function to format date as YYYY-MM-DD in local timezone
    const formatDateLocal = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let whereClause = undefined;
    let seasonWhereClause = undefined;

    // Build season filter based on type
    if (seasonType === "this-week") {
      const thisWeekMonday = getMostRecentMonday();
      seasonWhereClause = eq(
        seasonsTable.startDate,
        formatDateLocal(thisWeekMonday)
      );
    } else if (seasonType === "last-week") {
      const lastWeekMonday = getMostRecentMonday();
      lastWeekMonday.setDate(lastWeekMonday.getDate() - 7);
      seasonWhereClause = eq(
        seasonsTable.startDate,
        formatDateLocal(lastWeekMonday)
      );
    }
    // For "all" or any other value, no season filter is applied

    // Build cursor filter
    if (cursor) {
      const cursorItem = await db
        .select()
        .from(miniAppsTable)
        .where(eq(miniAppsTable.id, cursor))
        .limit(1);

      if (cursorItem.length > 0) {
        whereClause = and(
          lt(miniAppsTable.createdAt, cursorItem[0].createdAt),
          lt(miniAppsTable.id, cursor)
        );
      }
    }

    let apps;

    // Build the main query based on season type
    if (seasonType === "all") {
      // For "all", just query mini apps directly without season filtering
      apps = await db
        .select({
          id: miniAppsTable.id,
          appId: miniAppsTable.appId,
          title: miniAppsTable.title,
          description: miniAppsTable.description,
          frameUrl: miniAppsTable.frameUrl,
          image: miniAppsTable.image,
          frame: miniAppsTable.frame,
          createdAt: miniAppsTable.createdAt,
        })
        .from(miniAppsTable)
        .where(whereClause)
        .orderBy(desc(miniAppsTable.createdAt))
        .limit(ITEMS_PER_PAGE + 1);
    } else {
      // For "this-week" and "last-week", join with seasons
      apps = await db
        .select({
          id: miniAppsTable.id,
          appId: miniAppsTable.appId,
          title: miniAppsTable.title,
          description: miniAppsTable.description,
          frameUrl: miniAppsTable.frameUrl,
          image: miniAppsTable.image,
          frame: miniAppsTable.frame,
          createdAt: miniAppsTable.createdAt,
        })
        .from(miniAppsTable)
        .innerJoin(
          miniAppSeasonsTable,
          eq(miniAppsTable.id, miniAppSeasonsTable.miniAppId)
        )
        .innerJoin(
          seasonsTable,
          eq(miniAppSeasonsTable.seasonId, seasonsTable.id)
        )
        .where(and(whereClause, seasonWhereClause))
        .orderBy(desc(miniAppsTable.createdAt))
        .limit(ITEMS_PER_PAGE + 1);
    }

    // Check if there are more items
    const hasMore = apps.length > ITEMS_PER_PAGE;
    const items = hasMore ? apps.slice(0, ITEMS_PER_PAGE) : apps;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching mini apps by season:", error);
    return NextResponse.json(
      { error: "Failed to fetch mini apps" },
      { status: 500 }
    );
  }
}
