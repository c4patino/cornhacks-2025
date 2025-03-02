"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/app/_components/context";
import { type TPlayer } from "@/server/db/schema";

export const dynamic = "force-static";

export default function JoinPage() {
  const router = useRouter();

  const { gameData, playerData } = useGlobalState();

  const [playerList, setPlayerList] = useState<TPlayer[]>([]);

  const gameStart = api.game.start.useMutation();

  useEffect(() => {
    if (!gameData?.id) {
      router.push("/");
    }
  }, [gameData, router]);

  api.game.playersList.useSubscription(gameData.id!, {
    onData(data) {
      setPlayerList(data);
    },
    onError(err) {
      console.error(err);
    },
  });

  api.game.isGameStarted.useSubscription(gameData.id!, {
    onData(_) {
      router.push("/game");
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleStart = () => {
    if (!gameData?.id || !playerData?.id) return;

    gameStart.mutate({ gameId: gameData.id, playerId: playerData.id });
    router.push("/game");
  };

  return (
    <div className="flex h-screen flex-col items-center bg-gradient-to-b from-blue-800 to-blue-950 text-white">
      <div className="w-[100%] p-5 text-4xl">
        <Link href="./">The Final Transmission</Link>
      </div>
      <div className="max-h-[100%] max-w-[75%] items-center justify-evenly p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="w-[115px]"></div>
          <h1 className="text-3xl font-bold">Room ID: {gameData.id}</h1>
          <div className="pl-5">
            <Button variant="default" onClick={handleStart}>
              Start Game
            </Button>
          </div>
        </div>

        {/* Spacing */}
        <div className="h-[40px]"></div>

        {/* Players Grid */}
        <div className="grid min-h-0 flex-1 grid-cols-1 place-items-center gap-12 overflow-y-auto rounded-2xl bg-gray-900 p-6 shadow-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {playerList.map((player, index: number) => (
            <div
              key={player.id}
              className="flex h-[50px] w-[200px] items-center justify-center rounded-lg bg-gray-800 p-4 text-center"
            >
              Player {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
