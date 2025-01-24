import { Tools } from "@/types";
import {
  createShape,
  drawArrow,
  drawDiamond,
  drawPencil,
  fillColor,
} from "./shape";

export class CanvasBoard {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Tools[];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tools["type"] = "cursor";
  private pencilPoints: { x1: number; y1: number }[] = [];

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;

    this.init();
    this.initMouseHandlers();
  }

  setTool(tool: Tools["type"]) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = [];
    this.clearCanvas();
    this.renderShapes();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderShapes() {
    this.existingShapes.forEach((shape) => {
      switch (shape.type) {
        case "rect":
          this.ctx.strokeStyle = fillColor;
          this.ctx.strokeRect(
            shape.x1,
            shape.y1,
            shape.x2 - shape.x1,
            shape.y2 - shape.y1
          );
          break;
        case "circle":
          this.ctx.strokeStyle = fillColor;
          this.ctx.beginPath();
          this.ctx.arc(shape.x1, shape.y1, shape.radius, 0, Math.PI * 2);
          this.ctx.stroke();
          break;
        case "line":
          this.ctx.strokeStyle = fillColor;
          this.ctx.beginPath();
          this.ctx.moveTo(shape.x1, shape.y1);
          this.ctx.lineTo(shape.x2, shape.y2);
          this.ctx.stroke();
          break;
        case "arrow":
          drawArrow(this.ctx, shape.x1, shape.y1, shape.x2, shape.y2);
          break;
        case "diamond":
          drawDiamond(this.ctx, shape.x1, shape.y1, shape.x2, shape.y2);
          break;
        case "pencil":
          drawPencil(this.ctx, shape.points || []);
          break;
      }
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    if (!this.selectedTool || this.selectedTool === "cursor") return;

    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    const element = createShape(
      this.selectedTool,
      this.startX,
      this.startY,
      this.startX,
      this.startY
    );
    if (!element) return;
    console.log(element)
    this.existingShapes.push(element);
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked || this.selectedTool == "cursor") return;

    const endX = e.clientX;
    const endY = e.clientY;
    const index = this.existingShapes.length - 1;
    const { x1, x2 } = this.existingShapes[index];
    const element = createShape(
      this.selectedTool,
      this.startX,
      this.startY,
      endX,
      endY
    );
    const elementCopy = [...this.existingShapes];
    elementCopy[index] = element;
    this.existingShapes = elementCopy;
    this.clearCanvas();
    this.renderShapes();
    console.log(this.existingShapes)
  };

  mouseUpHandler = () => {
    this.clicked = false;
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
