"use client";

import { useState } from "react";

import { GameContext } from "@/app/game/_components/context";

export default function GameStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gameData, setGameData] = useState({});
  const [playerData, setPlayerData] = useState({});

  return (
    <GameContext.Provider
      value={{ gameData, setGameData, playerData, setPlayerData }}
    >
      {children}
    </GameContext.Provider>
  );
}
