import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

import { gameRouter } from "@/server/api/routers/game";
import { chatRouter } from "@/server/api/routers/chat";
import { gamestateRouter } from "@/server/api/routers/gamestate";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => "ok"),
  gamestate: gamestateRouter,
  game: gameRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
