import { on } from "events";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { games, players } from "@/server/db/schema";
import { ee } from "@/trpc/shared";
import { GameStatus, PlayerRole } from "@/lib/types";
import { shuffle } from "@/lib/utils";

export const gameRouter = createTRPCRouter({
  create: publicProcedure.mutation(async ({ ctx, input }) => {
    console.log(input);

    const [game] = await ctx.db
      .insert(games)
      .values({})
      .returning({ id: games.id });

    if (!game) throw new Error("Error creating game");

    const [player] = await ctx.db
      .insert(players)
      .values({ gameId: game.id })
      .returning({ id: games.id });

    if (!player) throw new Error("Error creating player");

    await ctx.db
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

  join: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
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

    const [player] = await ctx.db
      .insert(players)
      .values({ gameId: game.id })
      .returning({ id: players.id });

    if (!player) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Oops! Something went wrong!",
      });
    }

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

      const playerList = await ctx.db.query.players
        .findMany({
          where: (player, { eq }) => eq(player.gameId, game.id),
        })
        .execute();

      if (playerList.length == 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No players found in this game",
        });
      }

      const availableRoles: PlayerRole[] = Object.values(PlayerRole);

      if (availableRoles.length < players.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough roles for the number of players.",
        });
      }

      // Shuffle roles and assign a subset matching the number of players
      const assignedRoles = shuffle(availableRoles).slice(0, players.length);

      // Assign roles without replacement
      await Promise.all(
        playerList.map((player, index) =>
          ctx.db
            .update(players)
            .set({ role: assignedRoles[index] })
            .where(eq(players.id, player.id)),
        ),
      );
    }),
});
