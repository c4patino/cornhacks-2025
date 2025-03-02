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

import { PlayerRole, GameStatus, GameStates } from "@/lib/types";

export function enumToPgEnum<T extends Record<string, string>>(
  myEnum: T,
): readonly [string, ...string[]] {
  const values = Object.values(myEnum) as string[];

  if (values.length === 0) {
    throw new Error("Enum is empty, canno convert to PgEnum.");
  }

  return [values[0]!, ...values.slice(1)] as const;
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
    ownerForeignKey: foreignKey({
      columns: [table.owner],
      foreignColumns: [players.id],
    }),
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
  //() => ({
  //  gamePlayerForeignKey: foreignKey(playersFKConstraint),
  //}),
);

//const playersFKConstraint: {
//  columns: [AnyPgColumn<{ tableName: "players" }>];
//  foreignColumns: ColumnsWithTable<
//    "game",
//    "players",
//    [AnyPgColumn<{ tableName: "game" }>]
//  >;
//} = {
//  columns: [players.gameId],
//  foreignColumns: [games.id],
//};

export type TPlayer = typeof players.$inferSelect;
