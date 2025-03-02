import { on } from "events";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ee } from "@/trpc/shared";
import { GameStateMessage, GameStateSchema } from "@/lib/types";
import { db } from "@/server/db";
import { games, players } from "@/server/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const gamestateRouter = createTRPCRouter({
  send: publicProcedure.input(GameStateSchema).mutation(({ input }) => {
    ee.emit("send", input);
  }),

  getState: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await db
      .select({ current_phase: games.currentPhase })
      .from(games)
      .where(eq(games.id, input))
      .execute();
  }),

  getLivingPlayers: publicProcedure.query(async () => {
    return await db
      .select()
      .from(players)
      .where(eq(players.isAlive, true))
      .execute();
  }),

  advanceState: publicProcedure
    .input(z.object({ gameId: z.number(), state: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.db.query.games
        .findFirst({
          where: (game, { eq }) => eq(game.id, input.gameId),
        })
        .execute();

      console.log(game);

      if (!game) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "That game was not found, please check your join code and try again.",
        });
      }

      await ctx.db
        .update(games)
        .set({ currentPhase: input.state })
        .where(eq(games.id, game.id));

      ee.emit("game_state");
    }),

  getGameState: publicProcedure
    .input(z.number())
    .subscription(async function* ({ input, ctx, signal }) {
      const game = await ctx.db.query.games
        .findFirst({
          where: (game, { eq }) => eq(game.id, input),
        })
        .execute();

      if (!game) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "That game was not found, please check your join code and try again.",
        });
      }

      for await (const _ of on(ee, "game_state", { signal })) {
        const game = await ctx.db.query.games
          .findFirst({
            where: (game, { eq }) => eq(game.id, input),
          })
          .execute();

        yield game;
      }
    }),
});
