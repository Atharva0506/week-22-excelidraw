import { Tools } from "@/types";
import { createShape } from "./createShape";

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
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.existingShapes.forEach((shape) => {
   
      createShape(this.ctx, shape.type, shape.x1, shape.y1, shape.x2, shape.y2,shape.points);
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    if (!this.selectedTool || this.selectedTool === "cursor") return;
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    if (this.selectedTool === "pencil") {
      this.pencilPoints = [{ x1: this.startX, y1: this.startY }];
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked || this.selectedTool == "cursor") return;
    this.clearCanvas();
    if (this.selectedTool === "pencil") {
      this.pencilPoints.push({ x1: e.clientX, y1: e.clientY });
    }
    createShape(
      this.ctx,
      this.selectedTool,
      this.startX,
      this.startY,
      e.clientX,
      e.clientY,
      this.pencilPoints
    );
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    if (this.selectedTool === "pencil") {
      const element = createShape(
        this.ctx,
        this.selectedTool,
        this.startX,
        this.startY,
        e.clientX,
        e.clientY,
        this.pencilPoints
      );
      if (element) {
        this.existingShapes.push(element);
      }
      this.pencilPoints = [];
    } else {
      const element = createShape(
        this.ctx,
        this.selectedTool,
        this.startX,
        this.startY,
        e.clientX,
        e.clientY
      );
      if (element) {
        this.existingShapes.push(element);
      }
    }

    this.clearCanvas();
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
