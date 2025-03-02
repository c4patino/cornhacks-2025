import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  pgEnum,
  integer,
  timestamp,
  varchar,
  boolean,
  foreignKey,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

import { PlayerRole, GameStatus, GameStates } from "@/lib/types";

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const createTable = pgTableCreator((name) => `cornhacks-2025_${name}`);

export const gameStatusEnum = pgEnum("status", enumToPgEnum(GameStatus));
export const gameCurrentPhaseEnum = pgEnum(
  "current_phase",
  enumToPgEnum(GameStates),
);

export const games = createTable(
  "game",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    owner: integer("owner"),
    status: varchar("status", { length: 50 })
      .default(GameStatus.JOINING)
      .notNull(),
    currentPhase: gameCurrentPhaseEnum("current_phase"),
    startTime: timestamp("start_time", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    endTime: timestamp("end_time", { withTimezone: true }),
  },
  (table) => ({
    foreignKeys: [
      foreignKey({ columns: [table.owner], foreignColumns: [players.id] }),
    ],
  }),
);

export type TGame = typeof games.$inferSelect;

export const playerRoleEnum = pgEnum("role", enumToPgEnum(PlayerRole));

export const players = createTable(
  "player",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).default("asdf").notNull(),
    role: playerRoleEnum("role"),
    gameId: integer("game_id").notNull(),

    isAlive: boolean("is_alive").notNull().default(true),
    isAi: boolean("is_ai").notNull().default(false),
    lastAction: timestamp("last_action", { withTimezone: true }),
  },
  (table) => ({
    foreignKeys: [
      foreignKey({ columns: [table.gameId], foreignColumns: [games.id] }),
    ],
  }),
);

export type TPlayer = typeof players.$inferSelect;
