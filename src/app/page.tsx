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

const FormSchema = z.object({
  id: z.string().max(6, { message: "Not a valid game room id." }),
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

  async function handleGameJoin(data: z.infer<typeof FormSchema>) {
    const idAsNumber = Number(data.id);
    const { player } = await playerMutator.mutateAsync(idAsNumber);

    router.push(`/game/join?id=${data.id}`);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-evenly bg-gradient-to-b from-blue-800 to-blue-950">
      <div className="text-5xl">The Final Transmission</div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div className="px-4 py-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGameJoin)}>
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
                <Button type="submit">Join</Button>
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
      <div>
        <Link href="./game">
          <div>Go to Chat Page</div>
        </Link>
      </div>
    </div>
  );
}
