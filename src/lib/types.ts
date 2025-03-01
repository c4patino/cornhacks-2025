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

export type Message = {
  sender: number;
  timestamp: Date;
  text: string;
};
