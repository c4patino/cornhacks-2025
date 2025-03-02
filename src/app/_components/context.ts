import { createContext, useContext } from "react";
import type { TGame, TPlayer } from "@/server/db/schema";

// Define consistent interfaces for both contexts
export interface GameContextType {
  gameData: Partial<TGame>;
  setGameData: React.Dispatch<React.SetStateAction<Partial<TGame>>>;
}

export interface PlayerContextType {
  playerData: Partial<TPlayer>;
  setPlayerData: React.Dispatch<React.SetStateAction<Partial<TPlayer>>>;
}

// Create contexts with proper types, including non-null assertions for initial values
export const GameContext = createContext<GameContextType | null>(null);
export const PlayerContext = createContext<PlayerContextType | null>(null);

// Custom hook with proper type safety
export function useGlobalState() {
  const gameContext = useContext(GameContext);
  const playerContext = useContext(PlayerContext);

  if (!gameContext || !playerContext) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return { ...gameContext, ...playerContext };
}
