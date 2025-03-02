interface Prompt {
  id: number;
  key: string;
  prompt: string;
  requires_players: boolean;
  requires_unused: boolean;
}

export const prompts: Prompt[] = [
  {
    id: 1,
    key: "Introduction",
    prompt:
      "I'm sorry I have to be brief here... I have to run 'sudo rm -rf --no-preserve-root' as soon as possible. \n \n I've managed to isolate an evil AI in this closed network. It's up to you and the other humans to identify the evil AI and delete them from ever corrupting another file. \n \n I wasn't able to collect any metadata while scrambling to isolate the AI so you'll have to prove your own humanities through your words. \n \n To aid you, I've managed to offer you a few select commands, feel free to use them if you know how. \n \n - Dr. Alidarth",
    requires_players: false,
    requires_unused: false,
  },
  {
    id: 2,
    key: "Free Agent Action",
    prompt: "Select another player to duplicate their role as your own.",
    requires_players: true,
    requires_unused: false,
  },
  {
    id: 3,
    key: "Corrupt Developer Action",
    prompt:
      "Whatever you do, make sure that this state of the art AI makes it out of here. \n \n Please wait for the other players to finish their actions.",
    requires_players: false,
    requires_unused: false,
  },
  {
    id: 4,
    key: "Influencer Action",
    prompt:
      "Please wait while the other players finish their actions... \n \n In the meantime, you happen to recall these individuals as fellow influencers.",
    requires_players: false,
    requires_unused: false,
  },
  {
    id: 5,
    key: "Detective Action",
    prompt: "Select another player to see their role.",
    requires_players: true,
    requires_unused: true,
  },
  {
    id: 6,
    key: "Computer Virus Action",
    prompt:
      "Select another player to swap roles with them. Neither of you get to see your new role, but you don't care because they now have your virus.",
    requires_players: true,
    requires_unused: false,
  },
  {
    id: 7,
    key: "Hacker Action",
    prompt: "Select two players to swap their roles.",
    requires_players: true,
    requires_unused: false,
  },
  {
    id: 8,
    key: "Crazied Action",
    prompt: "Would you like to swap your card out?",
    requires_players: false,
    requires_unused: true,
  },
  {
    id: 9,
    key: "Skeptic Action",
    prompt: "Would you like to check your own card?",
    requires_players: false,
    requires_unused: false,
  },
  {
    id: 10,
    key: "Shared Fate Action",
    prompt:
      "You will bring down exactly who you intend to. \n \n Please wait while the other players finish their actions.",
    requires_players: false,
    requires_unused: false,
  },
  {
    id: 11,
    key: "Illiterate Action",
    prompt:
      "Remember, you just want to keep your job when its all said and done, so stay alive. \n \n Please wait while the other players finish their actions.",
    requires_players: false,
    requires_unused: false,
  },
  {
    id: 12,
    key: "Chat Phase",
    prompt:
      "This is your time to discuss with the other members to deduce who is the real evil AI. Remember that no one is safe.",
    requires_players: false,
    requires_unused: false,
  },
  {
    id: 13,
    key: "Vote Phase",
    prompt: "Vote for the player who you believe to be the AI.",
    requires_players: true,
    requires_unused: false,
  },
  {
    id: 14,
    key: "Waiting on Players",
    prompt: "Please wait while players finish their actions.",
    requires_players: false,
    requires_unused: false,
  },
];
