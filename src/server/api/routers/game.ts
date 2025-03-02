import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { games } from "@/server/db/schema";

export const gameRouter = createTRPCRouter({
  create: publicProcedure.mutation(async () => {
    const game = await db.insert(games).values({}).returning({ id: games.id });
    if (!game) throw new Error("Error creating game");

    return game;
  }),
});
