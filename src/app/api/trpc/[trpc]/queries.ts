"use server";

import { db } from "@/server/db";
import * as schema from "@/server/db/schema";

export async function createLobby() {
  const result = await db
    .insert(schema.games)
    .values({
      status: "Starting",
      currentPhase: "Lobby",
    })
    .returning({ id: schema.games.id });

  return result[0]?.id ?? null;
}
