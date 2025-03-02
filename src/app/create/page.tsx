
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function JoinPage() {
  

  return (
    <div className="flex flex-col h-screen items-center text-white bg-gradient-to-b from-blue-800 to-blue-950 overflow-y-auto">
      <div className="w-[100%] text-4xl p-5">
        <Link href="./">
          The Final Transmission
        </Link>
      </div>
      <div className="max-w-[75%] max-h-[100%] p-5 justify-evenly items-center">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="w-[115px]"></div>
          <h1 className="text-3xl font-bold text-center">Room ID: 123456</h1>
          <div className="pl-5 pt-5 md:pt-0">
            <Link href="./game">
              <Button variant="default">Start Game</Button>
            </Link>
          </div>
        </div>
        
        {/* Spacing */}
        <div className="h-[40px]"></div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 flex-1 p-6 bg-gray-900 rounded-2xl shadow-lg overflow-y-auto min-h-0 place-items-center">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-[200px] h-[50px] flex p-4 items-center justify-center bg-gray-800 rounded-lg text-center">
              Player {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}