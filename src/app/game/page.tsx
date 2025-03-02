"use client";

import { roles } from "../../lib/descriptions";
import { prompts } from "../../lib/prompts";
import { GameStates } from "@/lib/types";

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
import { useState, useEffect } from "react";
import { Message } from "@/lib/types";
import { api } from "@/trpc/react";
import { useGlobalState } from "@/app/_components/context";

const FormSchema = z.object({
  text: z.string().max(200, {
    message: "Your message must be less than 200 characters.",
  }),
});

const SecondFormSchema = z.object({
  text: z.string().max(200, {
    message: "Your message must be less than 200 characters.",
  }),
});

export default function Game() {
  const {
    data: livingPlayers,
    isLoading,
    error,
  } = api.gamestate.getLivingPlayers.useQuery();

  const { gameData, playerData } = useGlobalState();

  const [gamestate, setGameState] = useState<{} | undefined>(undefined);
  const [actionId, setActionId] = useState(0);

  const [messages, setMessages] = useState<Message[]>([]);

  const { mutate: send } = api.chat.send.useMutation();
  const { data: recState } = api.gamestate.getState.useQuery(1);
  const { mutate: modifyState } = api.gamestate.advanceState.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { text: "" },
  });

  const secondForm = useForm<z.infer<typeof SecondFormSchema>>({
    resolver: zodResolver(SecondFormSchema),
    defaultValues: { text: "" },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    send({
      message: data.text,
      sender: 0,
      timestamp: new Date(),
    });
  }

  function onSecondSubmit(data: z.infer<typeof SecondFormSchema>) {
    modifyState({ gameId: 1, state: data.text });
  }

  api.chat.get.useSubscription(undefined, {
    onData(data) {
      setMessages([...messages, data]);
    },
    onError(err) {
      console.error(err);
    },
  });

  api.gamestate.getGameState.useSubscription(1, {
    onData(data) {
      setGameState(data);
    },
    onError(err) {
      console.error(err);
    },
  });

  useEffect(() => {
    if (recState && recState.length > 0) {
      setGameState(recState[0]!.current_phase as GameStates);
    }
  }, [recState]);

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
            <h2 className="mb-2 text-xl font-bold">{roles[0]!.display_name}</h2>
            <p className="whitespace-pre-line">{roles[0]!.description}</p>
          </div>
        </div>
        <div className="h-auto pb-8 pl-8 pr-8 md:h-[60%] md:pb-0 md:pt-8">
          <div className="h-[100%] flex-1 rounded-2xl bg-gray-900 p-4 text-white shadow-lg">
            <h2 className="mb-2 text-xl font-bold">Randomly Generated Name</h2>
            <p className="whitespace-pre-line">{prompts[actionId]!.prompt}</p>
            <div className="flex flex-row justify-evenly">
              {actionId == 0 && (
                <div className="flex flex-row justify-center p-4">
                  <Button variant="default" onClick={() => setActionId(1)}>
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
            The Final Transmission Chat: {gamestate && gamestate?.currentPhase}
          </h2>
          {gamestate == GameStates.CHATTING && <Timer duration={60} />}
        </div>
        <div className="h-[85%] flex-1 flex-col justify-end">
          {messages.map((message) => (
            <p>{message.message}</p>
          ))}
        </div>
        <div className="mt-4 flex">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Type a message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Send</Button>
            </form>
          </Form>
        </div>
        <div className="mt-4 flex">
          <Form {...secondForm}>
            <form
              onSubmit={secondForm.handleSubmit(onSecondSubmit)}
              className="flex w-full"
            >
              <FormField
                control={secondForm.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Game state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Switch</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
