import { on } from "events";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { games, players } from "@/server/db/schema";
import { ee } from "@/trpc/shared";

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

  join: publicProcedure.mutation(async ({ input }) => {
    ee.emit("join");
  }),
});
