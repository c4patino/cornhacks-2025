"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { Message } from "@/lib/types";

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

const CLIENT_ID = 69;

const FormSchema = z.object({
  text: z.string().max(200, {
    message: "Your message must be less than 200 characters.",
  }),
});

export default function Game() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (ws) {
      const messageToSend: Message = {
        sender: CLIENT_ID,
        timestamp: new Date(),
        text: data.text,
      };
      console.log("Sending to server:", messageToSend);

      ws.send(JSON.stringify(messageToSend));
    }
  }

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log(`Connected to WebSocket Server`);

      const initialMessage = {
        sender: CLIENT_ID,
        timestamp: new Date(),
        message: `Hello from Client ${CLIENT_ID}`,
      };

      socket.send(JSON.stringify(initialMessage));
    };

    socket.onmessage = (event) => {
      console.log(event);
      const message: Message = JSON.parse(event.data);
      console.log("Received from server:", message);

      // Add the received message to the state
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log(`Connection for ${CLIENT_ID} closed`);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [CLIENT_ID]);

  return (
    <div className="flex h-screen bg-gray-800 p-4">
      <div className="flex w-1/2 flex-col overflow-y-auto rounded-2xl border-r border-gray-700 bg-gray-900 p-6 text-white">
        <h2 className="mb-4 text-xl font-bold">The Final Transmission</h2>
        <div className="h-[85%] flex-1 flex-col justify-end">
          {messages.map((message) => (
            <p>{message.text}</p>
          ))}
        </div>
        <div className="mt-4 flex">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Type message here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Right half of page */}
      <div className="flex h-[100%] w-1/2 flex-col justify-between bg-gray-800">
        <div className="h-[40%] pb-8 pl-8 pr-8">
          <div className="h-[100%] flex-1 rounded-2xl bg-gray-900 p-4 text-white shadow-lg">
            <h2 className="mb-2 text-xl font-bold">Role</h2>
            <p>Add role description here</p>
          </div>
        </div>
        <div className="h-[60%] pl-8 pr-8 pt-8">
          <div className="h-[100%] flex-1 rounded-2xl bg-gray-900 p-4 text-white shadow-lg">
            <h2 className="mb-2 text-xl font-bold">Job</h2>
            <p>Add task here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
