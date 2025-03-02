"use client";

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
import { useState } from "react";
import { Message } from "@/lib/types";
import { api } from "@/trpc/react";

const FormSchema = z.object({
  text: z.string().max(200, {
    message: "Your message must be less than 200 characters.",
  }),
});

export default function Game() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { mutate: send } = api.chat.send.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { text: "" },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    send({
      message: data.text,
      sender: 0,
      timestamp: new Date(),
    });
  }

  const result = api.chat.get.useSubscription(undefined, {
    onData(data: any) {
      setMessages([...messages, data.json]);
    },
    onError(err) {
      console.error(err);
    },
  });

  return (
    <div className="flex h-screen bg-gray-800 p-4">
      <div className="flex w-1/2 flex-col overflow-y-auto rounded-2xl border-r border-gray-700 bg-gray-900 p-6 text-white">
        <h2 className="mb-4 text-xl font-bold">The Final Transmission</h2>
        {result.status}
        <div className="h-[85%] flex-1 flex-col justify-end">
          {messages.map((message) => (
            <p>{message.message}</p>
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
