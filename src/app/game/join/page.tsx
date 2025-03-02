"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-static";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [playerList, setPlayerList] = useState([]);

  const gameStart = api.game.start.useMutation();

  const gameIdParam = searchParams.get("id");
  const gameId = gameIdParam ? Number(gameIdParam) : NaN;

  useEffect(() => {
    if (isNaN(gameId)) {
      router.push("/");
    }
  }, [gameId, router]);

  api.game.playersList.useSubscription(gameId, {
    onData(data: any) {
      console.log(data);
      setPlayerList(data);
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleStart = () => {
    gameStart.mutate({ gameId, playerId: 1 });
  };

  return (
    <div className="flex h-screen flex-col items-center bg-gradient-to-b from-blue-800 to-blue-950 text-white">
      <div className="w-[100%] p-5 text-4xl">
        <Link href="./">The Final Transmission</Link>
      </div>
      <div className="max-h-[100%] max-w-[75%] items-center justify-evenly p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="w-[115px]"></div>
          <h1 className="text-3xl font-bold">Room ID: 123456</h1>
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
          {playerList.map((player: any, index: number) => (
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
