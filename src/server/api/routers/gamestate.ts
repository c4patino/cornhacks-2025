import { on } from "events";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ee } from "@/trpc/shared";
import { GameState, GameStateSchema } from "@/lib/types";

export const gamestateRouter = createTRPCRouter({
  send: publicProcedure.input(GameStateSchema).mutation(({ input }) => {
    ee.emit("send", input);
  }),

  getState: publicProcedure.subscription(async function* (opts) {
    for await (const [data] of on(ee, "send", {
      signal: opts.signal,
    })) {
      const state = data as GameState;
      yield state;
    }
  }),
});
