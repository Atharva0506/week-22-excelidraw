import { WebSocket } from "ws";
import { verifyJWT } from "../utils/verifyToken";
import {prismaClient} from "@repo/db/client"
import {JOIN_ROOM,LEAVE_ROOM,CHAT} from "@repo/common/ws-messages"
interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

const users: User[] = [];
export const onConnection =  (ws: WebSocket, req: Request) => {
  const token = new URLSearchParams(req.url?.split("?")[1]).get("token") || "";
  const userId = verifyJWT(token);
  if (!userId) {
    ws.close(401, "Unauthorized");
    return;
  }
  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === JOIN_ROOM) {
      //TODO: check if room exist or not
      // Find the user and push it to globel array
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }
    if (parsedData.type === LEAVE_ROOM) {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
  
      user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
    }

    if (parsedData.type === CHAT) {
      const roomId = parsedData.roomId;
      const message = parsedData.message;
/** 
     * DB call to push the chat in db
     * TODO: Fix This approach 
     */
      await prismaClient.chat.create({
        data:{
          roomId:Number(roomId),
          message,
          userId
        }
        })
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
  ws.on("close", () => console.log(`User disconnected: ${userId}`));
};
