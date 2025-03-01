import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const lobbyRouter = createTRPCRouter({
  makeLobby: publicProcedure.mutation(async () => {
    try {
      const result = await db
        .insert(schema.games)
        .values({
          status: "Starting",
          currentPhase: "Lobby",
        })
        .returning({ id: schema.games.id });

      return result[0]?.id ?? null;
    } catch (error) {
      console.error("Error creating lobby:", error);
      throw new Error("Failed to create lobby");
    }
  }),
});
