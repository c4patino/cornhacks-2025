"use client";

import { useState } from "react";

import { GameContext, PlayerContext } from "@/app/_components/context";
import type { TPlayer, TGame } from "@/server/db/schema";

export default function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gameData, setGameData] = useState<Partial<TGame>>({});
  const [playerData, setPlayerData] = useState<Partial<TPlayer>>({});

  return (
    <GameContext.Provider value={{ gameData, setGameData }}>
      <PlayerContext.Provider value={{ playerData, setPlayerData }}>
        {children}
      </PlayerContext.Provider>
    </GameContext.Provider>
  );
}
