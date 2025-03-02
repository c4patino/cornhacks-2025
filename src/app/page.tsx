"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../trpc/react";


export default function StartPage() {
  const router = useRouter();

  const makeLobby = async () => {
    //router.push(`/create?id=${lobbyId}`)
  }

  return (
    <div className="flex flex-col items-center justify-evenly h-screen bg-gradient-to-b from-blue-800 to-blue-950">
      <div className="text-5xl">The Final Transmission</div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div className="w-12 px-4"></div>
          <input
            type="text"
            placeholder="Enter code to join"
            className="px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="px-4 py-1">
            <Link href="./create">
              <Button variant="default">Join</Button>
            </Link>
          </div>
        </div>
        <div className="pt-6">
          <div className="ml-2 px-4 py-2">
            <Button variant="default" onClick={makeLobby}>Start a room</Button>
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
