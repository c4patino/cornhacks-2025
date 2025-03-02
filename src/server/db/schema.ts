// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  pgEnum,
  integer,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

import { PlayerRole, GameStatus } from "@/lib/types";

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const createTable = pgTableCreator((name) => `cornhacks-2025_${name}`);

export const gameStatusEnum = pgEnum("status", enumToPgEnum(GameStatus));

export const games = createTable("game", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  status: varchar("status", { length: 50 })
    .default(GameStatus.JOINING)
    .notNull(),
  currentPhase: varchar("current_phase", { length: 50 }),
  startTime: timestamp("start_time", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
});

export const playerRoleEnum = pgEnum("role", enumToPgEnum(PlayerRole));

export const players = createTable("player", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  role: playerRoleEnum("role"),
  game_id: integer("game_id")
    .notNull()
    .references(() => games.id),

  isAlive: boolean("is_alive").notNull().default(true),
  isAi: boolean("is_ai").notNull().default(false),
  lastAction: timestamp("last_action", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
