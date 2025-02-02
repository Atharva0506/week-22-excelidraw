import { Tools } from "@/types";

export const fillColor = "#e0dfff";

export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeWidth: number,
  strokeFill: string,
  bgFill: string
) {
  const posX = width < 0 ? x + width : x;
  const posY = height < 0 ? y + height : y;
  const normalizedWidth = Math.abs(width);
  const normalizedHeight = Math.abs(height);

  strokeWidth = strokeWidth || 1;
  strokeFill = strokeFill || "rgba(255, 255, 255)";
  bgFill = bgFill || "rgba(18, 18, 18)";

  const radius = Math.min(
    Math.abs(Math.max(normalizedWidth, normalizedHeight) / 20),
    normalizedWidth / 2,
    normalizedHeight / 2
  );

  // RoundRect : https://stackoverflow.com/a/3368118
  ctx.moveTo(posX + radius, posY);
  ctx.beginPath();
  ctx.strokeStyle = strokeFill;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = bgFill;
  ctx.lineTo(posX + normalizedWidth - radius, posY);
  ctx.quadraticCurveTo(
    posX + normalizedWidth,
    posY,
    posX + normalizedWidth,
    posY + radius
  );
  ctx.lineTo(posX + normalizedWidth, posY + normalizedHeight - radius);
  ctx.quadraticCurveTo(
    posX + normalizedWidth,
    posY + normalizedHeight,
    posX + normalizedWidth - radius,
    posY + normalizedHeight
  );
  ctx.lineTo(posX + radius, posY + normalizedHeight);
  ctx.quadraticCurveTo(
    posX,
    posY + normalizedHeight,
    posX,
    posY + normalizedHeight - radius
  );
  ctx.lineTo(posX, posY + radius);
  ctx.quadraticCurveTo(posX, posY, posX + radius, posY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  strokeWidth: number,
  strokeFill: string
) {
  strokeWidth = strokeWidth || 1;
  strokeFill = strokeFill || "rgba(255, 255, 255)";

  ctx.beginPath();
  ctx.strokeStyle = strokeFill;
  ctx.lineWidth = strokeWidth;
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  strokeWidth: number,
  strokeFill: string
) {

  ctx.strokeStyle = strokeFill;
  ctx.lineWidth = strokeWidth;

  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  const arrowSize = 10; 
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle - Math.PI / 6),
    toY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowSize * Math.cos(angle + Math.PI / 6),
    toY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeWidth: number,
  strokeFill: string,
  bgFill: string
) {
  strokeWidth = strokeWidth || 1;
  strokeFill = strokeFill || "rgba(255, 255, 255)";
  bgFill = bgFill || "rgba(18, 18, 18)";

  ctx.beginPath();
  ctx.strokeStyle = strokeFill;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = bgFill;
  ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

export function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeWidth: number,
  strokeFill: string,
  bgFill: string
) {
  
  ctx.fillStyle = bgFill;
  ctx.strokeStyle = strokeFill;
  ctx.lineWidth = strokeWidth;

  ctx.beginPath();
  ctx.moveTo(x, y - height / 2); 
  ctx.lineTo(x + width / 2, y); 
  ctx.lineTo(x, y + height / 2); 
  ctx.lineTo(x - width / 2, y); 
  ctx.closePath(); 


  ctx.fill();

  ctx.stroke();
}

export function drawPencil(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  strokeWidth: number,
  strokeFill: string
) {
  ctx.beginPath();
  ctx.strokeStyle = strokeFill;
  ctx.lineWidth = strokeWidth;
  if (points[0] === undefined) return null;
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.stroke();
}
