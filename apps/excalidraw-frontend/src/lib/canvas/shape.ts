import { Tools } from "@/types";

export const fillColor = "#e0dfff";

/**
 * Draws an arrow on a canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {number} startX - Starting x-coordinate.
 * @param {number} startY - Starting y-coordinate.
 * @param {number} endX - Ending x-coordinate.
 * @param {number} endY - Ending y-coordinate.
 */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const headLength = 10;
  const angle = Math.atan2(endY - startY, endX - startX);

  ctx.strokeStyle = fillColor;

  // Draw the main line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

/**
 * Draws a diamond shape on a canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {number} startX - Starting x-coordinate.
 * @param {number} startY - Starting y-coordinate.
 * @param {number} endX - Ending x-coordinate.
 * @param {number} endY - Ending y-coordinate.
 */
export function drawDiamond(
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

/**
 * Draws a freehand pencil line on a canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {{ x1: number; y1: number }[]} points - Array of points for the pencil line.
 */
export function drawPencil(
  ctx: CanvasRenderingContext2D,
  points: { x1: number; y1: number }[]
) {
  if (points.length < 2) return;

  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(points[0].x1, points[0].y1);
  points.forEach((point) => {
    ctx.lineTo(point.x1, point.y1);
  });
  ctx.stroke();
}

/**
 * Creates a shape object based on the specified type.
 * @param {Tools["type"]} type - Type of the shape.
 * @param {number} startX - Starting x-coordinate.
 * @param {number} startY - Starting y-coordinate.
 * @param {number} endX - Ending x-coordinate.
 * @param {number} endY - Ending y-coordinate.
 * @param {{ x1: number; y1: number }[]} [pencilPoints] - Array of points for the pencil line (optional).
 * @returns {Tools | null} - Shape object or null if the type is unsupported.
 */
export function createShape(
  type: Tools["type"],
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  pencilPoints: { x1: number; y1: number }[] = []
): Tools | null {
  switch (type) {
    case "rect":
      return {
        type: "rect",
        x1: startX,
        y1: startY,
        x2: endX - startX,
        y2: endY - startY,
      };
    case "circle": {
      const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      return {
        type: "circle",
        x1: startX,
        y1: startY,
        radius,
      };
    }
    case "line":
      return {
        type: "line",
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
      };
    case "arrow":
      return {
        type: "arrow",
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
      };
    case "diamond":
      return {
        type: "diamond",
        x1: startX,
        y1: startY,
        x2: endX - startX,
        y2: endY - startY,
      };
    case "pencil":
      return {
        type: "pencil",
        points: pencilPoints,
      };
    default:
      console.warn("Unsupported shape type");
      return null;
  }
}
