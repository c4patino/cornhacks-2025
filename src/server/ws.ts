import { WebSocketServer } from "ws";
import { applyWssHandler } from "@trpc/server/routers/";

import { Message } from "@/lib/types";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocketServer) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);

  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });

  ws.on("message", (message: string) => {
    console.log(`Received message: ${message}`);

    wss.clients.forEach((client) => {
      const parsedMessage: Message = JSON.parse(message);
      console.log("Parsed Message:", parsedMessage);

      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(parsedMessage)); // Send as JSON string
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client disconnected`);
  });
});

console.log("WebSocket Server listening on ws://localhost:8080");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  wss.close();
});
