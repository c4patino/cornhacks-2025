import { WebSocketServer } from "ws";

import type { NextApiRequest } from "next";

const clients = new Map();

export async function GET(req: NextApiRequest) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws, _) => {
    const clientId = req.url?.split("?id=")[1] || Date.now();
    clients.set(clientId, ws);

    console.log(`New connection: ${clientId}`);

    ws.send(`Welcome client ${clientId}`);

    ws.on("message", (message) => {
      console.log(`Received message from ${clientId}: ${message}`);
    });

    ws.on("close", () => {
      console.log(`Client ${clientId} disconnected`);
      clients.delete(clientId); // Remove client from the map
    });
  });

  return Response.json({}, { status: 200 });
}
