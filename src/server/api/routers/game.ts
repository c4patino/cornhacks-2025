import { on } from "events";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { games, players } from "@/server/db/schema";
import { ee } from "@/trpc/shared";
import { GameStatus, PlayerRole } from "@/lib/types";

export const gameRouter = createTRPCRouter({
  create: publicProcedure.mutation(async ({ input }) => {
    console.log(input);

    const [game] = await db
      .insert(games)
      .values({})
      .returning({ id: games.id });

    if (!game) throw new Error("Error creating game");

    const [player] = await db
      .insert(players)
      .values({ gameId: game.id })
      .returning({ id: games.id });

    if (!player) throw new Error("Error creating player");

    await db
      .update(games)
      .set({ owner: player.id })
      .where(eq(games.id, game.id));

    return { game, player };
  }),

  playersList: publicProcedure.input(z.number()).subscription(async function* ({
    ctx,
    input,
    signal,
  }) {
    const joinedPlayers = await ctx.db
      .select()
      .from(players)
      .where(eq(players.gameId, input))
      .execute();

    yield joinedPlayers;

    for await (const _ of on(ee, "join", { signal })) {
      const joinedPlayers = await ctx.db
        .select()
        .from(players)
        .where(eq(players.gameId, input))
        .execute();

      yield joinedPlayers;
    }
  }),

  join: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    const [player] = await db
      .insert(players)
      .values({ gameId: input })
      .returning({ id: players.id });

    ee.emit("join");

    return { player };
  }),

  start: publicProcedure
    .input(z.object({ playerId: z.number(), gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
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

      if (game.owner !== input.playerId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to do that.",
        });
      }

      await ctx.db
        .update(games)
        .set({ status: GameStatus.IN_PROGRESS })
        .where(eq(games.id, game.id));
    }),
});
