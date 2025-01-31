import { Tools } from "@/types";
import {
  drawArrow,
  drawCircle,
  drawDiamond,
  drawLine,
  drawPencil,
  drawRect,
} from "./shape";

export const createShape = (
  ctx: CanvasRenderingContext2D,
  type: Tools["type"],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius:number = 0,
  pencilPoints: { x1: number; y1: number }[] = []
) => {
  switch (type) {
    case "rect":
      return drawRect(ctx, x1, y1, x2, y2);
    case "line":
      return drawLine(ctx, x1, y1, x2, y2);
    case "arrow":
      return drawArrow(ctx, x1, y1, x2, y2);
    case "circle":
      return drawCircle(ctx, x1, y1, x2, y2,radius);
    case "diamond":
      return drawDiamond(ctx, x1, y1, x2, y2);
    case "pencil":
        return drawPencil(ctx,pencilPoints)
  }
};
