import { Tools } from "@/types";

export const fillColor = "#e0dfff";

export function drawRect(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
)  :Tools {
  ctx.strokeStyle = fillColor;
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  return {
    type: "rect",
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
  };
}
export function drawLine(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) :Tools {
  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  return {
    type: "line",
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
  };
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) :Tools {
  const headLength = 10;
  const angle = Math.atan2(endY - startY, endX - startX);

  ctx.strokeStyle = fillColor;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

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
  return {
    type: "arrow",
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
  };
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX?: number,
  endY?: number,
  radius = 0
) : Tools{
  if (radius == 0) {
    radius = Math.sqrt((endX! - startX) ** 2 + (endY! - startY) ** 2);
  }
  
  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.stroke();
  return {
    type: "circle",
    x1: startX,
    y1: startY,
    radius,
  };
}
export function drawDiamond(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) :Tools {
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
  return {
    type: "diamond",
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
  };
}

export function drawPencil(
  ctx: CanvasRenderingContext2D,
  points: { x1: number; y1: number }[]
) : Tools | undefined {
  if (points.length < 2) return;

  ctx.strokeStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(points[0].x1, points[0].y1);
  points.forEach((point) => {
    ctx.lineTo(point.x1, point.y1);
  });
  ctx.stroke();
  return {
    type: "pencil",
    points,
  };
}
