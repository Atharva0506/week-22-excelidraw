import { BACKEND_URL } from "@/config";
import { getCookie } from "../cookie";
import { Shape } from "@/types";
import axios from "axios";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
    try {
      const res = await axios.get(`${BACKEND_URL}/room/get-chats/${roomId}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      const messages = res.data;
  
      if (!Array.isArray(messages)) {
        console.error("Unexpected response structure: messages is not an array");
        return [];
      }
  
      const shapes = messages
        .map((x: { message?: string }) => {
          try {
            if (typeof x.message === "string") {
              const messageData = JSON.parse(x.message);
              return messageData.shape;
            }
            console.warn("Invalid message format", x);
            return null;
          } catch (err) {
            console.error("Error parsing message", x.message, err);
            return null;
          }
        })
        .filter((shape): shape is Shape => shape !== null);
  
      return shapes;
    } catch (err) {
      console.error("Error fetching existing shapes:", err);
      return [];
    }
  }
