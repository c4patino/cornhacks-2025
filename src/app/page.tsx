"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

const FormSchema = z.object({
  id: z.string().min(6, { message: "Not a valid game room id." }),
});

export default function StartPage() {
  const router = useRouter();
  const gameMutator = api.game.create.useMutation();
  const playerMutator = api.game.join.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { id: "" },
  });

  async function handleGameCreate() {
    const { game, player } = await gameMutator.mutateAsync();
    router.push(`/game/join?id=${game.id}`);
  }

  async function handleGameJoin() {
    const { game, player } = await playerMutator.mutateAsync();
    router.push(`/game/join?id=${game.id}`);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-evenly bg-gradient-to-b from-blue-800 to-blue-950">
      <div className="text-5xl">The Final Transmission</div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div className="w-12 px-4"></div>
          <input
            type="text"
            placeholder="Enter code to join"
            className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="px-4 py-1">
            <Link href="./create">
              <Button variant="default">Join</Button>
            </Link>
          </div>
        </div>
        <div className="pt-6">
          <div className="ml-2 px-4 py-2">
            <Button variant="default" onClick={handleGameCreate}>
              Start a room
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Link href="./game">
          <div>Go to Chat Page</div>
        </Link>
      </div>
    </div>
  );
}
