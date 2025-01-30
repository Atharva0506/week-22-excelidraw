import { WebSocket } from "ws";
import { verifyJWT } from "../utils/verifyToken";
import { prismaClient } from "@repo/db/client";
import { JOIN_ROOM, LEAVE_ROOM, CHAT } from "@repo/common/ws-messages";

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

const users: User[] = [];

export const onConnection = (ws: WebSocket, req: Request) => {
  const token = new URLSearchParams(req.url?.split("?")[1]).get("token") || "";
  const userId = verifyJWT(token);

  if (!userId) {
    ws.close(1008, "Unauthorized: Token expired or invalid");
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data as unknown as string);

      if (parsedData.type === JOIN_ROOM) {
        const user = users.find((x) => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
      }

      if (parsedData.type === LEAVE_ROOM) {
        const user = users.find((x) => x.ws === ws);
        if (user) {
          user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
        }
      }

      if (parsedData.type === CHAT) {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId,
          },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId,
              })
            );
          }
        });
      }
    } catch (err) {
      console.error("Error :", err);
      ws.close(1011, "Internal error");
    }
  });

  ws.on("close", () => {
    try {
      console.log(`User disconnected: ${userId}`);
      const index = users.findIndex((x) => x.ws === ws);
      if (index !== -1) {
        users.splice(index, 1);
      }
    } catch (err) {
      console.error("Error during cleanup:", err);
    }
  });
};
