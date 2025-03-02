'use client'

import { Button } from "@/components/ui/button";
import { roles } from "../../lib/descriptions";
import { prompts } from "../../lib/prompts";
import { useState, useEffect } from "react";
import { api } from "../../trpc/react";
import { alterGameState, findRoleId } from "./state";
import { GameStates } from "@/lib/types";

export default function Game() {
  // TODO: Make this dynamic
  const [gamestate, setGameState] = useState(GameStates.LOBBY);

  /*
  useEffect(() => {
    const state = api.gamestate.getState.useSubscription(undefined, {
      onData(data: any) {
        setGameState(data.json);
      },
      onError(err) {
        console.error(err);
      },
    });
  }, [api.gamestate.send]); 
  */

  const [actionId, setActionId] = useState(0);

  const handleRoleAction = () => {
    setActionId(12);
  }

  const samplePlayers = ["Player One", "Player Two", "Player Three"];

  const PlayerList = (players: string[], header: string) => {
    return (
      <div className="w-1/4 max-w-[300px] h-[400px] bg-gray-900 p-4 rounded-lg shadow-lg overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-2">{header}</h2>
        <div className="flex flex-col gap-2">
          {players.map((player, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
              onClick={handleRoleAction}
            >
              {player}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const VotingList = (players: string[], header: string) => {
    return (
      <div className="w-[80%] max-w-[300px] h-[400px] bg-gray-900 p-4 rounded-lg shadow-lg overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-2">{header}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {players.map((player, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
            >
              {player}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Timer = ({ duration }: {duration: number}) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    return <div>Time Left: {timeLeft}s</div>;
  }

  return(
    <div className="flex h-screen p-4 bg-gray-800">
      <div className="w-1/2 bg-gray-900 text-white p-6 border-r border-gray-700 flex flex-col rounded-2xl overflow-y-auto">
        <div className="flex flex-row w-[100%] justify-between">
          <h2 className="text-xl font-bold mb-4">The Final Transmission</h2>
          {gamestate == GameStates.CHATTING && <Timer duration={60}></Timer>}
        </div>
        <div className="h-[85%] flex-1 flex-col justify-end">
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="px-2 py-1">
            <Button variant="default">Send</Button>
          </div>
        </div>
      </div>

      {/* Right half of page */}
      <div className="w-1/2 h-[100%] bg-gray-800 flex flex-col justify-between">
        <div className="pl-8 pr-8 pb-8 h-[40%]">
          <div className="flex-1 h-[100%] bg-gray-900 text-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2">{roles[0]!.display_name}</h2>
            <p className="whitespace-pre-line">{roles[0]!.description}</p>
          </div>
        </div>
        <div className="pl-8 pr-8 pt-8 h-[60%]">
          <div className="flex-1 h-[100%] bg-gray-900 text-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2">Randomly Generated Name</h2>
            <p className="whitespace-pre-line">{prompts[actionId]!.prompt}</p>
            <div className="flex flex-row justify-evenly">
              {actionId == 0 &&
              <div className="flex flex-row justify-center p-4">
                <Button variant="default" onClick={() => setActionId(1)}>Continue</Button>
              </div>
              }
              {prompts[actionId]!.requires_players && PlayerList(samplePlayers, "Players")}
              {prompts[actionId]!.requires_unused && PlayerList(['Card One', 'Card Two', 'Card Three'], "Unused Roles")}
              {gamestate == GameStates.VOTING && VotingList(['Player One', 'Player Two', 'Player Three', 'Player Four', 'Player Five'], "Vote")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}