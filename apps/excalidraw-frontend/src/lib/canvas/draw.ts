import { FindElement, Shape } from "@/types";
import { getExistingShapes } from "../network/api";
import { CHAT } from "@repo/common/ws-messages";
import { clearCanvas, getElementAtPosition } from "./canvas-utils";
import { createShape, drawArrow, drawDiamond, drawPencil } from "./shape";

const fillColor = "#e0dfff";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const existingShapes: Shape[] = await getExistingShapes(roomId);

  clearCanvas(existingShapes, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;
  let currentShapeType: Shape["type"] | null = null;
  let pencilPoints: { x: number; y: number }[] = [];
  let selectedElement: FindElement | null = null;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === CHAT) {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  canvas.addEventListener("mousedown", (e) => {
    if (!currentShapeType) return;

    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;

    if (currentShapeType === "cursor") {
      const element = getElementAtPosition(startX, startY, existingShapes);
      if (element) {
        selectedElement = element;
        console.log("moving");
      }
    }

    if (currentShapeType === "pencil") {
      pencilPoints = [{ x: startX, y: startY }];
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked || !currentShapeType) return;

    const endX = e.offsetX;
    const endY = e.offsetY;

    if (currentShapeType === "cursor" && selectedElement) {
      moveElement(selectedElement, startX, startY, endX, endY);
      startX = endX;
      startY = endY;
    } else {
      clearCanvas(existingShapes, canvas, ctx);
      drawPreview(ctx, currentShapeType, startX, startY, endX, endY, pencilPoints);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked || !currentShapeType) return;

    clicked = false;

    if (currentShapeType === "cursor") {
      selectedElement = null;
      return;
    }

    const endX = e.offsetX;
    const endY = e.offsetY;

    const shape = createShape(currentShapeType, startX, startY, endX, endY, pencilPoints);
    if (shape) {
      existingShapes.push(shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  });

  return {
    setShapeType: (type: Shape["type"]) => {
      currentShapeType = type;
    },
  };
}

// Utility function to move a selected element
function moveElement(
  element: FindElement,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  switch (element.type) {
    case "rect":
    case "diamond":
      element.x += deltaX;
      element.y += deltaY;
      break;
    case "circle":
      element.centerX += deltaX;
      element.centerY += deltaY;
      break;
    case "line":
    case "arrow":
      element.startX += deltaX;
      element.startY += deltaY;
      element.endX += deltaX;
      element.endY += deltaY;
      break;
    case "pencil":
      element.points = element.points.map((point) => ({
        x: point.x + deltaX,
        y: point.y + deltaY,
      }));
      break;
  }
}

function drawPreview(
  ctx: CanvasRenderingContext2D,
  type: Shape["type"],
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  pencilPoints: { x: number; y: number }[]
) {
  ctx.strokeStyle = fillColor;

  switch (type) {
    case "rect":
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      break;
    case "circle":
      const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "line":
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      break;
    case "arrow":
      drawArrow(ctx, startX, startY, endX, endY);
      break;
    case "diamond":
      drawDiamond(ctx, startX, startY, endX, endY);
      break;
    case "pencil":
      pencilPoints.push({ x: endX, y: endY });
      drawPencil(ctx, pencilPoints);
      break;
  }
}
