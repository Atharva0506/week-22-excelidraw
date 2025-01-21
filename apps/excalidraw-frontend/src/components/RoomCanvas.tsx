"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { getCookie } from "@/utils/cookie";

export const RoomCanvas= ({roomId}: {roomId: string}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${getCookie('token')}`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }
        
    }, [])
   
    if (!socket) {
        return <div className="flex justify-center items-center">
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}