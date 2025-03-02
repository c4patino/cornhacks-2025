import { on } from "events";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ee } from "@/trpc/shared";
import { Message, MessageSchema } from "@/lib/types";

export const chatRouter = createTRPCRouter({
  send: publicProcedure.input(MessageSchema).mutation(({ input }) => {
    ee.emit("send", input);
  }),

  get: publicProcedure.subscription(async function* (opts) {
    for await (const [data] of on(ee, "send", {
      signal: opts.signal,
    })) {
      const message = data as Message;
      console.log(message);
      yield message;
    }
  }),
});
