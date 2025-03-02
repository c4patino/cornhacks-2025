"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useGlobalState } from "@/app/_components/context";

const FormSchema = z.object({
  id: z.string().max(6, { message: "Not a valid game room id." }),
});

export default function StartPage() {
  const router = useRouter();
  const { setGameData, setPlayerData } = useGlobalState();
  const gameMutator = api.game.create.useMutation();
  const { mutateAsync: joinGame } = api.game.join.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { id: "" },
  });

  async function handleGameCreate() {
    const { game, player } = await gameMutator.mutateAsync();

    setPlayerData({ id: player.id });
    setGameData({ id: game.id });

    router.push("/game/join");
  }

  async function handleGameJoin(data: z.infer<typeof FormSchema>) {
    const { player } = await joinGame(Number(data.id));

    setPlayerData({ id: player.id });
    setGameData({ id: Number(data.id) });

    router.push("/game/join");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-evenly bg-gradient-to-b from-blue-800 to-blue-950">
      <div className="text-5xl text-center">The Final Transmission</div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div className="px-4 py-1">
            <Form {...form}>
              <form className="flex flex-row" onSubmit={form.handleSubmit(handleGameJoin)}>
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Join Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pl-4">
                  <Button type="submit">Join</Button>
                </div>
              </form>
            </Form>
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
      <div></div>
    </div>
  );
}
