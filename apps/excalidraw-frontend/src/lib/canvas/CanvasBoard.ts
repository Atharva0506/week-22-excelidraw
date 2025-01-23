import { Tools } from "@/types";
import { createShape, drawArrow, drawDiamond, drawPencil, fillColor } from "./shape";
import { getExistingShapes } from "../network/api";

export class CanvasBoard {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Tools[];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tools["type"] = "circle";
  private pencilPoints: { x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool: Tools["type"]) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    console.log(this.existingShapes);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => {
      switch (shape.type) {
        case "rect":
          this.ctx.strokeStyle = fillColor;
          this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case "circle":
          this.ctx.strokeStyle = fillColor;
          this.ctx.beginPath();
          this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
          this.ctx.stroke();
          break;
        case "line":
          this.ctx.strokeStyle = fillColor;
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX, shape.startY);
          this.ctx.lineTo(shape.endX, shape.endY);
          this.ctx.stroke();
          break;
        case "arrow":
          drawArrow(this.ctx, shape.startX, shape.startY, shape.endX, shape.endY);
          break;
        case "diamond":
          drawDiamond(this.ctx, shape.x, shape.y, shape.x + shape.width, shape.y + shape.height);
          break;
        case "pencil":
          drawPencil(this.ctx, shape.points);
          break;
      }
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.offsetX; // Use offsetX instead of clientX
    this.startY = e.offsetY; // Use offsetY instead of clientY
    this.pencilPoints = []; // Clear pencil points at the start of drawing
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    const endX = e.offsetX; // Use offsetX instead of clientX
    const endY = e.offsetY; // Use offsetY instead of clientY

    const shape = createShape(this.selectedTool, this.startX, this.startY, endX, endY);
    if (!shape) return;

    this.existingShapes.push(shape);

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const endX = e.offsetX; // Use offsetX instead of clientX
    const endY = e.offsetY; // Use offsetY instead of clientY

    if (this.selectedTool === "cursor") {
      return;
    } else {
      this.drawPreview(this.ctx, this.selectedTool, this.startX, this.startY, endX, endY, this.pencilPoints);
      this.clearCanvas();
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  drawPreview(
    ctx: CanvasRenderingContext2D,
    type: Tools["type"],
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
}
