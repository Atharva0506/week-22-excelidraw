import { Tools } from "@/types";
import { createShape } from "./createShape";
import { getElementAtPosition } from "./canvas-utils";

export class CanvasBoard {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Tools[];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private offsetX = 0;
  private offsetY = 0;
  private selectedTool: Tools["type"] = "cursor";
  private pencilPoints: { x1: number; y1: number }[] = [];
  private selectedElement: Tools | null;
  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.selectedElement = null;
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
      createShape(
        this.ctx,
        shape.type,
        shape.x1,
        shape.y1,
        shape.x2,
        shape.y2,
        shape.radius,
        shape.points
      );
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    if (!this.selectedTool) return;
    console.log("exsting shape", JSON.stringify(this.existingShapes));
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    if (this.selectedTool === "cursor") {
      const element = getElementAtPosition(
        e.clientX,
        e.clientY,
        this.existingShapes
      );

      if (element) {
        this.selectedElement = element;
        this.offsetX = this.selectedElement.x1 - e.clientX;
        this.offsetY = this.selectedElement.y1 - e.clientY;
        console.log(this.selectedElement);
      }
    }

    if (this.selectedTool === "pencil") {
      this.pencilPoints = [{ x1: this.startX, y1: this.startY }];
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;
    this.clearCanvas();
    if (this.selectedTool === "cursor" && this.selectedElement) {
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;

      this.startX = e.clientX;
      this.startY = e.clientY;

      if (
        this.selectedElement.type === "rect" ||
        this.selectedElement.type === "line" ||
        this.selectedElement.type === "arrow" ||
        this.selectedElement.type === "diamond"
      ) {
        this.selectedElement.x1 += dx;
        this.selectedElement.y1 += dy;
        this.selectedElement.x2 += dx;
        this.selectedElement.y2 += dy;
      } else if (this.selectedElement.type === "circle") {
        this.selectedElement.x1 = e.clientX + this.offsetX;
        this.selectedElement.y1 = e.clientY + this.offsetY;
      } else if (this.selectedElement.type === "pencil") {
        this.selectedElement.points.forEach((point) => {
          point.x1 += dx;
          point.y1 += dy;
        });
      }
    }
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
      0,
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
        0,
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
    this.selectedElement = null;
    this.clearCanvas();
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
