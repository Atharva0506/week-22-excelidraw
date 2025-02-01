import { WebSocketServer } from "ws";
import { onConnection } from "../events/connection";

export const initWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });
  wss.on("connection", onConnection);
  console.log(`WebSocket Server running on ws://localhost:${port}`);
};
