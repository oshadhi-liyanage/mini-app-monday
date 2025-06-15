import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const usersTable = sqliteTable("users", {
  fid: integer("fid").primaryKey(),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  pfpUrl: text("pfp_url").notNull(),
  custodyAddress: text("custody_address").notNull(),
  verifications: text("verifications", { mode: "json" }).notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const miniAppsTable = sqliteTable("mini_apps", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`(lower(hex(randomblob(16))))`),
  appId: text("app_id").unique(),
  title: text("title").notNull(),
  description: text("description"),
  frameUrl: text("frame_url").notNull(),
  image: text("image"),
  frame: text("frame_json").notNull(), // store the whole frame object as JSON string
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const seasonsTable = sqliteTable("seasons", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`(lower(hex(randomblob(16))))`),
  startDate: text("start_date").notNull().unique(), // Ensure unique dates
});

export const miniAppRelations = relations(miniAppsTable, ({ many }) => ({
  miniAppSeasonsTable: many(miniAppSeasonsTable),
}));

export const seasonsRelations = relations(seasonsTable, ({ many }) => ({
  miniAppSeasonsTable: many(miniAppSeasonsTable),
}));

export const miniAppSeasonsTable = sqliteTable(
  "mini_app_seasons",
  {
    miniAppId: text("mini_app_id")
      .notNull()
      .references(() => miniAppsTable.id, { onDelete: "cascade" }),
    seasonId: text("season_id")
      .notNull()
      .references(() => seasonsTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.miniAppId, table.seasonId] })]
);

export const miniAppSeasonsRelations = relations(
  miniAppSeasonsTable,
  ({ one }) => ({
    miniApp: one(miniAppsTable, {
      fields: [miniAppSeasonsTable.miniAppId],
      references: [miniAppsTable.id],
    }),
    season: one(seasonsTable, {
      fields: [miniAppSeasonsTable.seasonId],
      references: [seasonsTable.id],
    }),
  })
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertMiniApp = typeof miniAppsTable.$inferInsert;
export type SelectMiniApp = typeof miniAppsTable.$inferSelect;

export type InsertSeason = typeof seasonsTable.$inferInsert;
export type SelectSeason = typeof seasonsTable.$inferSelect;
export type InsertMiniAppSeason = typeof miniAppSeasonsTable.$inferInsert;
export type SelectMiniAppSeason = typeof miniAppSeasonsTable.$inferSelect;
