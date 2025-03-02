'use client'

import { Button } from "@/components/ui/button";
import { roles } from "../../lib/descriptions";
import { prompts } from "../../lib/prompts";
import { useState, useEffect } from "react";
import { api } from "../../trpc/react";
import { alterGameState, findRoleId } from "./state";
import { GameStates } from "@/lib/types";

export default function Game() {
  const { data: livingPlayers, isLoading, error } = api.gamestate.getLivingPlayers.useQuery();
  const { data: recState } = api.gamestate.getState.useQuery(1); 
  const [gamestate, setGameState] = useState<GameStates | null>(null);
  const [actionId, setActionId] = useState(0);

  useEffect(() => {
    if (recState && recState.length > 0) {
      setGameState(recState[0]!.current_phase as GameStates)
    }
  }, [recState])

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


  const handleRoleAction = () => {
    setActionId(12);
  }

  const samplePlayers = ["Player One", "Player Two", "Player Three"];

  const PlayerList = (players: string[], header: string) => {
    return (
      <div className="max-w-[400px] h-auto bg-gray-900 p-4 rounded-lg shadow-lg overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-2">{header}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
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
      <div className="max-w-[400px] h-auto bg-gray-900 p-4 rounded-lg shadow-lg overflow-y-auto">
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
    <div className="flex flex-col md:flex-row h-screen p-4 bg-gray-800 overflow-hidden overflow-y-auto">
      {/* Right side (should be on top when stacked) */}
      <div className="w-full md:w-1/2 h-auto md:h-full bg-gray-800 flex flex-col justify-between order-1 md:order-2">
        <div className="pl-8 pr-8 pb-8 h-auto md:h-[40%]">
          <div className="flex-1 h-[100%] bg-gray-900 text-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2">{roles[1]!.display_name}</h2>
            <p className="whitespace-pre-line">{roles[1]!.description}</p>
          </div>
        </div>
        <div className="pl-8 pr-8 pb-8 md:pb-0 md:pt-8 h-auto md:h-[60%]">
          <div className="flex-1 h-[100%] bg-gray-900 text-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-2">Randomly Generated Name</h2>
            <p className="whitespace-pre-line">{prompts[actionId]!.prompt}</p>
            <div className="flex flex-row justify-evenly">
              {actionId == 0 && (
                <div className="flex flex-row justify-center p-4">
                  <Button variant="default" onClick={() => setActionId(2)}>Continue</Button>
                </div>
              )}
              {prompts[actionId]!.requires_players && PlayerList(samplePlayers, "Players")}
              {prompts[actionId]!.requires_unused && PlayerList(['Card One', 'Card Two', 'Card Three'], "Unused Roles")}
              {gamestate == GameStates.VOTING && VotingList(livingPlayers!.map((player) => player.name), "Vote")}
            </div>
          </div>
        </div>
      </div>

      {/* Left side (should be on bottom when stacked) */}
      <div className="w-full md:w-1/2 bg-gray-900 text-white p-6 border-r border-gray-700 flex flex-col rounded-2xl md:overflow-y-auto order-2 md:order-1">
        <div className="flex flex-row w-full justify-between">
          <h2 className="text-xl font-bold mb-4">The Final Transmission Chat</h2>
          {gamestate == GameStates.CHATTING && <Timer duration={60} />}
        </div>
        <div className="min-h-[400px] md:h-[85%] flex-1 flex-col justify-end"></div>
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
    </div>
  );
}