"use client";

import { Button } from "@/components/ui/button";
import { roles } from "../../lib/descriptions";
import { prompts } from "../../lib/prompts";
import { useState, useEffect } from "react";
import { api } from "../../trpc/react";
import { alterGameState, findRoleId } from "./state";
import { GameStates } from "@/lib/types";

export default function Game() {
  const {
    data: livingPlayers,
    isLoading,
    error,
  } = api.gamestate.getLivingPlayers.useQuery();
  const { data: recState } = api.gamestate.getState.useQuery(1);
  const [gamestate, setGameState] = useState<GameStates | null>(null);
  const [actionId, setActionId] = useState(0);

  useEffect(() => {
    if (recState && recState.length > 0) {
      setGameState(recState[0]!.current_phase as GameStates);
    }
  }, [recState]);

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
  };

  const samplePlayers = ["Player One", "Player Two", "Player Three"];

  const PlayerList = (players: string[], header: string) => {
    return (
      <div className="h-auto max-w-[400px] overflow-y-auto rounded-lg bg-gray-900 p-4 shadow-lg">
        <h2 className="mb-2 text-lg font-bold text-white">{header}</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {players.map((player, index) => (
            <button
              key={index}
              className="rounded-md bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800"
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
      <div className="h-auto max-w-[400px] overflow-y-auto rounded-lg bg-gray-900 p-4 shadow-lg">
        <h2 className="mb-2 text-lg font-bold text-white">{header}</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {players.map((player, index) => (
            <button
              key={index}
              className="rounded-md bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800"
            >
              {player}
            </button>
          ))}
        </div>
      </div>
    );
  };
  const Timer = ({ duration }: { duration: number }) => {
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
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden overflow-y-auto bg-gray-800 p-4 md:flex-row">
      {/* Right side (should be on top when stacked) */}
      <div className="order-1 flex h-auto w-full flex-col justify-between bg-gray-800 md:order-2 md:h-full md:w-1/2">
        <div className="h-auto pb-8 pl-8 pr-8 md:h-[40%]">
          <div className="h-[100%] flex-1 rounded-2xl bg-gray-900 p-4 text-white shadow-lg">
            <h2 className="mb-2 text-xl font-bold">{roles[1]!.display_name}</h2>
            <p className="whitespace-pre-line">{roles[1]!.description}</p>
          </div>
        </div>
        <div className="h-auto pb-8 pl-8 pr-8 md:h-[60%] md:pb-0 md:pt-8">
          <div className="h-[100%] flex-1 rounded-2xl bg-gray-900 p-4 text-white shadow-lg">
            <h2 className="mb-2 text-xl font-bold">Randomly Generated Name</h2>
            <p className="whitespace-pre-line">{prompts[actionId]!.prompt}</p>
            <div className="flex flex-row justify-evenly">
              {actionId == 0 && (
                <div className="flex flex-row justify-center p-4">
                  <Button variant="default" onClick={() => setActionId(2)}>
                    Continue
                  </Button>
                </div>
              )}
              {prompts[actionId]!.requires_players &&
                PlayerList(samplePlayers, "Players")}
              {prompts[actionId]!.requires_unused &&
                PlayerList(
                  ["Card One", "Card Two", "Card Three"],
                  "Unused Roles",
                )}
              {gamestate == GameStates.VOTING &&
                VotingList(
                  livingPlayers!.map((player) => player.name),
                  "Vote",
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Left side (should be on bottom when stacked) */}
      <div className="order-2 flex w-full flex-col rounded-2xl border-r border-gray-700 bg-gray-900 p-6 text-white md:order-1 md:w-1/2 md:overflow-y-auto">
        <div className="flex w-full flex-row justify-between">
          <h2 className="mb-4 text-xl font-bold">
            The Final Transmission Chat
          </h2>
          {gamestate == GameStates.CHATTING && <Timer duration={60} />}
        </div>
        <div className="min-h-[400px] flex-1 flex-col justify-end md:h-[85%]"></div>
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="px-2 py-1">
            <Button variant="default">Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
