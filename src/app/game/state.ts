"use server";

import { GameStates, PlayerRole, GameStateSchema } from "../../lib/types";
import { api } from "../../trpc/react";

/*

Game state accepts the current game state with the intention of changing 
all necessary values only once.

The things that are affected by game state are:
 - The actions available to the players
 - Whether a player is alive
 - Checks if game is over by ai and corrupt_devs being the only ones left
 - The roles assigned to each player

*/

export async function alterGameState(gameId: number, state: GameStates) {
  const { mutate: send } = api.gamestate.send.useMutation();

  function onChange() {
    send({
      state: state + 1,
      sender: 0,
      timestamp: new Date(),
    });
  }
  onChange();

  const newState = state + 1;

  switch (newState) {
    case "actions":
      actionMode();
      break;
    case "chatting":
      chattingMode();
      break;
    case "voting":
      votingMode();
      break;
    case "kicking":
      kickingMode();
      break;
    case "end":
      endMode();
      break;
    default:
      console.error("Invalid game state found", newState);
  }

  const runTimer = (duration: number) => {
    setTimeout(() => {}, duration * 1000);
  };

  function actionMode() {
    // Default state
    // Should render role in top right and action in bottom right
    // Chat should be disabled
  }

  function chattingMode() {
    // Actionid should be set to 12
    // Chat should be opened
    runTimer(60);
  }

  function votingMode() {
    // Chat is disabled
    // Game is frozen until all votes are cast
  }

  function kickingMode() {
    // Short and functional state
    // Followed by actionMode or endMode depending on win condition
  }

  function endMode() {
    // Handles the end of the game
  }
}

export function findRoleId(value: string) {
  return Object.values(PlayerRole).indexOf(value as PlayerRole);
}
