import { Tools } from "@/types";
import { getElementAtPosition } from "./canvas-utils";
import {
  drawArrow,
  drawCircle,
  drawDiamond,
  drawLine,
  drawPencil,
  drawRect,
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
      if (shape.type === "pencil") {
        drawPencil(this.ctx, shape.points);
      } else if (shape.type === "rect") {
        drawRect(this.ctx, shape.x1, shape.y1, shape.x2, shape.y2);
      } else if (shape.type === "circle") {
        drawCircle(this.ctx, shape.x1, shape.y1,undefined ,undefined,shape.radius);
      } else if (shape.type === "arrow") {
        drawArrow(this.ctx, shape.x1, shape.y1, shape.x2, shape.y2);
      } else if (shape.type === "diamond") {
        drawDiamond(this.ctx, shape.x1, shape.y1, shape.x2, shape.y2);
      } else if (shape.type === "line") {
        drawLine(this.ctx, shape.x1, shape.y1, shape.x2, shape.y2);
      }
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    if (!this.selectedTool) return;
   
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
        if (this.selectedElement.type === "circle") {
          this.offsetX = this.selectedElement.x1 - e.clientX;
          this.offsetY = this.selectedElement.y1 - e.clientY;
        }
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
      drawPencil(this.ctx, this.pencilPoints);
    } else if (this.selectedTool === "rect") {
      drawRect(this.ctx, this.startX, this.startY, e.clientX, e.clientY);
    } else if (this.selectedTool === "circle") {
      drawCircle(this.ctx, this.startX, this.startY, e.clientX, e.clientY);
    } else if (this.selectedTool === "arrow") {
      drawArrow(this.ctx, this.startX, this.startY, e.clientX, e.clientY);
    } else if (this.selectedTool === "diamond") {
      drawDiamond(this.ctx, this.startX, this.startY, e.clientX, e.clientY);
    } else if (this.selectedTool === "line") {
      drawLine(this.ctx, this.startX, this.startY, e.clientX, e.clientY);
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    if (this.selectedTool === "pencil") {
      const element = drawPencil(this.ctx, this.pencilPoints);
      if (element) {
        this.existingShapes.push(element);
      }
    } else if (this.selectedTool === "rect") {
      this.existingShapes.push(
        drawRect(this.ctx, this.startX, this.startY, e.clientX, e.clientY)
      );
    } else if (this.selectedTool === "circle") {
      this.existingShapes.push(
        drawCircle(this.ctx, this.startX, this.startY, e.clientX, e.clientY)
      );
    } else if (this.selectedTool === "arrow") {
      this.existingShapes.push(
        drawArrow(this.ctx, this.startX, this.startY, e.clientX, e.clientY)
      );
    } else if (this.selectedTool === "diamond") {
      this.existingShapes.push(
        drawDiamond(this.ctx, this.startX, this.startY, e.clientX, e.clientY)
      );
    } else if (this.selectedTool === "line") {
      this.existingShapes.push(
        drawLine(this.ctx, this.startX, this.startY, e.clientX, e.clientY)
      );
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
