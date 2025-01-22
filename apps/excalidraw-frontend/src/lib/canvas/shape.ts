export const fillColor = "#e0dfff";

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
}

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

export function drawPencil(
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

export function createShape(
  type: "rect" | "circle" | "line" | "arrow" | "diamond" | "pencil",
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  pencilPoints: { x: number; y: number }[] = []
) {
  switch (type) {
    case "rect":
      return {
        type: "rect",
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
      };
    case "circle":
      const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      return {
        type: "circle",
        centerX: startX,
        centerY: startY,
        radius,
      };
    case "line":
      return {
        type: "line",
        startX,
        startY,
        endX,
        endY,
      };
    case "arrow":
      return {
        type: "arrow",
        startX,
        startY,
        endX,
        endY,
      };
    case "diamond":
      return {
        type: "diamond",
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
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
