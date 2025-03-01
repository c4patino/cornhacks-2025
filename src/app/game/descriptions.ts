import { PlayerRoleType } from "../../lib/types";

interface Role {
  role: PlayerRoleType;
  display_name: string;
  description: string;
}

export const roles: Role[] = [
  {
    role: "FREE_AGENT",
    display_name: "Free Agent",
    description:
      "You've been out of a job for a while now, so you'll join the first group that'll take you. \n \n Abilities: \n Select another player and view their role. For the remainder of the game, you will act as that role.",
  },
  {
    role: "CORRUPT_DEVELOPER",
    display_name: "Corrupt Developer",
    description:
      "You are as corrupt as the AI you developed. \n \n Abilities: \n You are on the AI's team. If they win, you win.",
  },
  {
    role: "INFLUENCER",
    display_name: "Influencer",
    description:
      "You're not really part of this whole thing, but it's great publicity to be involved. \n \n Abilites: \n You know who the other influencers are in the lobby.",
  },
  {
    role: "DETECTIVE",
    display_name: "Detective",
    description:
      "You don't know a lot about AIs or even about coding, but you do know quite a bit about people and their nature. \n \n Abilites: \n You can choose to look at another player's role or look at two unused roles.",
  },
  {
    role: "VIRUS",
    display_name: "Virus",
    description:
      "This whole ordeal is the perfect opportunity to extract some information from unsuspecting computers. \n \n Abilites: \n You can choose to swap your role with another player's but due to incryption, neither of you can look at the new card.",
  },
  {
    role: "HACKER",
    display_name: "Hacker",
    description:
      "As a gray hat hacker, you don't really want to cause trouble, but sometimes that happens when you practice your 'curiousity'. \n \n Abilties: \n You can swap two player's roles (Not including yourself).",
  },
  {
    role: "SKEPTIC",
    display_name: "Skeptic",
    description:
      "You've never trusted anyone in the past, so why would you start now? \n \n Abilites: \n You can look at your own role.",
  },
  {
    role: "CRAZIED",
    display_name: "Crazied",
    description:
      "Chaos! Chaos! Chaos! Wait... Was I saying something??? \n \n Abilities: \n You can swap your role with a random unused role.",
  },
  {
    role: "SHARED_FATE",
    display_name: "Shared Fate",
    description:
      "You don't particularly care for this AI, but you know deep down that what you really care about is: if you're going down, you're not going alone. \n \n Abilites: \n If you get voted out, whoever you voted for will be voted out as well.",
  },
  {
    role: "ILLITERATE",
    display_name: "Illiterate",
    description:
      "You don't know what's going on, but you know that you don't want you're factory job taken by some A...I? \n \n Abilities: \n None; survive until the end at all costs",
  },
];
