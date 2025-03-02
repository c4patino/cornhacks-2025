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

  getRole: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx, signal }) => {
      const player = await ctx.db.query.players
        .findFirst({
          where: (player, { eq }) => eq(player.id, input),
        })
        .execute();

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "That player was not found, please check your join code and try again.",
        });
      }

      return player;
    }),

  getPlayerByRole: publicProcedure.input(z.string()).query(async function* ({
    input,
    ctx,
    signal,
  }) {
    const player = await ctx.db.query.players
      .findFirst({
        where: (player, { eq }) => eq(player.role, input),
      })
      .execute();

    if (!player) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "That player was not found, please check your join code and try again.",
      });
    }

    for await (const _ of on(ee, "game_state", { signal })) {
      const player = await ctx.db.query.players
        .findMany({
          where: (player, { eq }) => eq(player.role, input),
        })
        .execute();

      yield player;
    }
  }),

  changeRole: publicProcedure
    .input(z.object({ role: z.string(), id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const player: any = await ctx.db.query.players
        .findFirst({
          where: (players, { eq }) => eq(players.id, input.id),
        })
        .execute();

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "That player was not found, please check your join code and try again.",
        });
      }

      await ctx.db
        .update(players)
        .set({ role: input.role })
        .where(eq(player.id, input.id));

      ee.emit("game_state");
    }),

  removePlayer: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const player: any = await ctx.db.query.players
        .findFirst({
          where: (player, { eq }) => eq(player.id, input),
        })
        .execute();

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "That player was not found, please check your join code and try again.",
        });
      }

      await ctx.db
        .update(players)
        .set({ isAlive: false })
        .where(eq(player.id, input));

      ee.emit("game_state");
    }),

  getLobbyPlayers: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const player = await ctx.db.query.players.findMany({
        where: (player, { eq }) => eq(player.gameId, input),
      });

      return player;
    }),
});
