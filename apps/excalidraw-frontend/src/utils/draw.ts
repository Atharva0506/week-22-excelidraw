import { BACKEND_URL } from "@/config";
import { CHAT } from "@repo/common/ws-messages";
import axios from "axios";
import { getCookie } from "./cookie";

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number }
  | { type: "arrow"; startX: number; startY: number; endX: number; endY: number }
  | { type: "diamond"; x: number; y: number; width: number; height: number }
  | { type: "pencil"; points: { x: number; y: number }[] };

const fillColor = "#e0dfff"; 

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  let clicked = false;
  let startX = 0;
  let startY = 0;
  let currentShapeType: Shape["type"] | null = null;
  let pencilPoints: { x: number; y: number }[] = [];

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === CHAT) {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);

  canvas.addEventListener("mousedown", (e) => {
    if (!currentShapeType) return;

    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;

    if (currentShapeType === "pencil") {
      pencilPoints = [{ x: startX, y: startY }];
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked || !currentShapeType) return;

    clicked = false;

    const endX = e.offsetX;
    const endY = e.offsetY;

    let shape: Shape;

    if (currentShapeType === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
      };
    } else if (currentShapeType === "circle") {
      const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      );
      shape = {
        type: "circle",
        centerX: startX,
        centerY: startY,
        radius,
      };
    } else if (currentShapeType === "line") {
      shape = {
        type: "line",
        startX,
        startY,
        endX,
        endY,
      };
    } else if (currentShapeType === "arrow") {
      shape = {
        type: "arrow",
        startX,
        startY,
        endX,
        endY,
      };
    } else if (currentShapeType === "diamond") {
      const width = endX - startX;
      const height = endY - startY;
      shape = {
        type: "diamond",
        x: startX,
        y: startY,
        width,
        height,
      };
    } else if (currentShapeType === "pencil") {
      shape = {
        type: "pencil",
        points: pencilPoints,
      };
    } else {
      console.error("Unsupported shape type");
      return;
    }

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId,
      })
    );

    clearCanvas(existingShapes, canvas, ctx);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked || !currentShapeType) return;

    clearCanvas(existingShapes, canvas, ctx);

    const endX = e.offsetX;
    const endY = e.offsetY;

    if (currentShapeType === "rect") {
      ctx.strokeStyle = fillColor;
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    } else if (currentShapeType === "circle") {
      const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      );
      ctx.strokeStyle = fillColor;
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (currentShapeType === "line") {
      ctx.strokeStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (currentShapeType === "arrow") {
      drawArrow(ctx, startX, startY, endX, endY);
    } else if (currentShapeType === "diamond") {
      drawDiamond(ctx, startX, startY, endX, endY);
    } else if (currentShapeType === "pencil") {
      pencilPoints.push({ x: endX, y: endY });
      drawPencil(ctx, pencilPoints);
    }
  });

  return {
    setShapeType: (type: Shape["type"]) => {
      currentShapeType = type;
    },
  };
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const headLength = 10;
  const angle = Math.atan2(endY - startY, endX - startX);

  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const width = endX - startX;
  const height = endY - startY;
  ctx.strokeStyle = fillColor;

  ctx.beginPath();
  ctx.moveTo(startX + width / 2, startY);
  ctx.lineTo(startX, startY + height / 2);
  ctx.lineTo(startX + width / 2, endY);
  ctx.lineTo(endX, startY + height / 2);
  ctx.closePath();
  ctx.stroke();
}

function drawPencil(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[]
) {
  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = fillColor;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.strokeStyle = fillColor;
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "line") {
      ctx.strokeStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    } else if (shape.type === "arrow") {
      drawArrow(ctx, shape.startX, shape.startY, shape.endX, shape.endY);
    } else if (shape.type === "diamond") {
      drawDiamond(ctx, shape.x, shape.y, shape.x + shape.width, shape.y + shape.height);
    } else if (shape.type === "pencil") {
      drawPencil(ctx, shape.points);
    }
  });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
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
