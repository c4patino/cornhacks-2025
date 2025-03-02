import { z } from "zod";

export enum PlayerRole {
  FREE_AGENT = "free_agent",
  CORRUPT_DEVELOPER = "corrupt_developer",
  INFLUENCER = "influencer",
  DETECTIVE = "detective",
  VIRUS = "virus",
  HACKER = "hacker",
  SKEPTIC = "skeptic",
  CRAZIED = "crazied",
  SHARED_FATE = "shared_fate",
  ILLITERATE = "illiterate",
}

export type PlayerRoleType = keyof typeof PlayerRole;

export const MessageSchema = z.object({
  sender: z.number(),
  timestamp: z.date(),
  message: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export enum GameStates {
  LOBBY = "lobby",
  ACTIONS = "actions",
  CHATTING = "chatting",
  VOTING = "voting",
  KICKING = "kicking",
  END = "end",
}

export const GameStateSchema = z.object({
  sender: z.number(),
  timestamp: z.date(),
  state: z.string(),
});

export type GameStateMessage = z.infer<typeof GameStateSchema>;

export enum GameStatus {
  JOINING = "joining",
  IN_PROGRESS = "in_progress",
  COMPLETE = "complete",
}
