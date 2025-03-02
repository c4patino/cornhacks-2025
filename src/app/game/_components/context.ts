import { createContext, useContext } from "react";

interface GlobalStateInterface {
  gameData: {};
  playerData: {};
  setGameData: React.Dispatch<React.SetStateAction<{}>>;
  setPlayerData: React.Dispatch<React.SetStateAction<{}>>;
}

export const GameContext = createContext({
  gameData: {} as Partial<GlobalStateInterface>,
  playerData: {} as Partial<GlobalStateInterface>,
  setGameData: {} as React.Dispatch<
    React.SetStateAction<Partial<GlobalStateInterface>>
  >,
  setPlayerData: {} as React.Dispatch<
    React.SetStateAction<Partial<GlobalStateInterface>>
  >,
});

export function useGameState() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }

  return context;
}
