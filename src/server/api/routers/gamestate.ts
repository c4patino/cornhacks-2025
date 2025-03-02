import { on } from "events";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ee } from "@/trpc/shared";
import { GameState, GameStateSchema } from "@/lib/types";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { z } from "zod";

export const gamestateRouter = createTRPCRouter({
  send: publicProcedure.input(GameStateSchema).mutation(({ input }) => {
    ee.emit("send", input);
  }),

  getState: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await db
      .select({ current_phase: schema.games.currentPhase })
      .from(schema.games)
      .where(eq(schema.games.id, input))
      .execute();
  }),

  getLivingPlayers: publicProcedure.query(async () => {
    return await db
      .select()
      .from(schema.players)
      .where(eq(schema.players.isAlive, true))
      .execute();
  }),
});
