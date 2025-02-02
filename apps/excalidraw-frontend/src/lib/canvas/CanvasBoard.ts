import { Tools } from "@/types";
import { getElementAtPosition } from "./canvas-utils";
import {
  drawArrow,
  drawEllipse,
  drawDiamond,
  drawLine,
  drawPencil,
  drawRect,
} from "./shape";
import { start } from "node:repl";
import { after } from "node:test";

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

  private panX: number = 0;
  private panY: number = 0;
  private scale: number = 1;
  private onScaleChangeCallback: (scale: number) => void;
  public outputScale: number = 1;
  private pencilPoints: { x: number; y: number }[] = [];
  private selectedElement: Tools | null;
  private strokeWidth: number = 1;
  private strokeFill: string = "rgba(255, 255, 255)";
  private bgFill: string = "rgba(18, 18, 18,0.2)";
  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    onScaleChangeCallback: (scale: number) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.selectedElement = null;
    this.onScaleChangeCallback = onScaleChangeCallback;
    this.init();
    this.initMouseHandlers();
  }

  setTool(tool: Tools["type"]) {
    this.selectedTool = tool;
  }
  setStrokeWidth(width: number) {
    this.strokeWidth = width;
    this.clearCanvas();
  }

  setStrokeFill(fill: string) {
    this.strokeFill = fill;
    this.clearCanvas();
  }

  setBgFill(fill: string) {
    this.bgFill = fill;
    this.clearCanvas();
  }

  async init() {
    this.existingShapes = [];
    this.clearCanvas();
  }

  clearCanvas() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
    this.ctx.clearRect(
      -this.panX / this.scale,
      -this.panY / this.scale,
      this.canvas.width / this.scale,
      this.canvas.height / this.scale
    );

    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        drawRect(
          this.ctx,
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          shape.strokeWidth,
          shape.strokeFill,
          shape.bgFill
        );
      } else if (shape.type === "diamond") {
        drawDiamond(
          this.ctx,
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          shape.strokeWidth,
          shape.strokeFill,
          shape.bgFill
        );
      } else if (shape.type === "ellipse") {
        drawEllipse(
          this.ctx,
          shape.centerX,
          shape.centerY,
          shape.radX,
          shape.radY,
          shape.strokeWidth,
          shape.strokeFill,
          shape.bgFill
        );
      } else if (shape.type === "line") {
        drawLine(
          this.ctx,
          shape.fromX,
          shape.fromY,
          shape.toX,
          shape.toY,
          shape.strokeWidth,
          shape.strokeFill
        );
      } else if (shape.type === "arrow") {
        drawArrow(
          this.ctx,
          shape.fromX,
          shape.fromY,
          shape.toX,
          shape.toY,
          shape.strokeWidth,
          shape.strokeFill
        );
      } else if (shape.type === "pencil") {
        drawPencil(this.ctx, shape.points, shape.strokeWidth, shape.strokeFill);
      }
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    if (!this.selectedTool) return;

    this.clicked = true;

    const { clientX, clientY } = this.transformPanScale(e.clientX, e.clientY);
    this.startX = clientX;
    this.startY = clientY;

    if (this.selectedTool === "cursor") {
      const element = getElementAtPosition(
        clientX,
        clientY,
        this.existingShapes
      );
      if (element) {
        console.log(element);
        this.selectedElement = element;
      }
    }
    if (this.selectedTool === "pencil") {
      this.pencilPoints = [{ x: this.startX, y: this.startY }];
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    this.clearCanvas();
    let { clientX, clientY } = this.transformPanScale(e.clientX, e.clientY);

    const width = clientX - this.startX;
    const height = clientY - this.startY;

    if (this.selectedTool === "cursor" && this.selectedElement) {
      const dx = clientX - this.startX;
      const dy = clientY - this.startY;

      this.startX = clientX;
      this.startY = clientY;

      switch (this.selectedElement.type) {
        case "rect":
          this.selectedElement.x += dx;
          this.selectedElement.y += dy;
          break;

        case "ellipse":
          this.selectedElement.centerX += dx;
          this.selectedElement.centerY += dy;
          break;

        case "line":
        case "arrow":
          this.selectedElement.fromX += dx;
          this.selectedElement.fromY += dy;
          this.selectedElement.toX += dx;
          this.selectedElement.toY += dy;
          break;

        case "diamond":
          this.selectedElement.x += dx;
          this.selectedElement.y += dy;
          break;

        case "pencil":
          this.selectedElement.points.forEach((point) => {
            point.x += dx;
            point.y += dy;
          });
          break;

        default:
          break;
      }
    }

    if (this.selectedTool === "rect") {
      drawRect(
        this.ctx,
        this.startX,
        this.startY,
        width,
        height,
        this.strokeWidth,
        this.strokeFill,
        this.bgFill
      );
    } else if (this.selectedTool === "line") {
      drawLine(
        this.ctx,
        this.startX,
        this.startY,
        clientX,
        clientY,
        this.strokeWidth,
        this.strokeFill
      );
    } else if (this.selectedTool === "arrow") {
      drawArrow(
        this.ctx,
        this.startX,
        this.startY,
        clientX,
        clientY,
        this.strokeWidth,
        this.strokeFill
      );
    } else if (this.selectedTool === "diamond") {
      drawDiamond(
        this.ctx,
        this.startX,
        this.startY,
        width,
        height,
        this.strokeWidth,
        this.strokeFill,
        this.bgFill
      );
    } else if (this.selectedTool === "ellipse") {
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radX = Math.abs(width / 2);
      const radY = Math.abs(height / 2);
      drawEllipse(
        this.ctx,
        centerX,
        centerY,
        radX,
        radY,
        this.strokeWidth,
        this.strokeFill,
        this.bgFill
      );
    } else if (this.selectedTool === "pencil") {
      this.pencilPoints.push({ x: clientX, y: clientY });
      drawPencil(
        this.ctx,
        this.pencilPoints,
        this.strokeWidth,
        this.strokeFill
      );
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    let { clientX, clientY } = this.transformPanScale(e.clientX, e.clientY);
    const width = clientX - this.startX;
    const height = clientY - this.startY;

    let shape: Tools | null = null;

    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
        strokeWidth: this.strokeWidth,
        strokeFill: this.strokeFill,
        bgFill: this.bgFill,
      };
    } else if (this.selectedTool === "line") {
      shape = {
        type: "line",
        fromX: this.startX,
        fromY: this.startY,
        toX: clientX,
        toY: clientY,
        strokeWidth: this.strokeWidth,
        strokeFill: this.strokeFill,
      };
    } else if (this.selectedTool === "arrow") {
      shape = {
        type: "arrow",
        fromX: this.startX,
        fromY: this.startY,
        toX: clientX,
        toY: clientY,
        strokeWidth: this.strokeWidth,
        strokeFill: this.strokeFill,
      };
    } else if (this.selectedTool === "diamond") {
      shape = {
        type: "diamond",
        x: this.startX,
        y: this.startY,
        width,
        height,
        strokeWidth: this.strokeWidth,
        strokeFill: this.strokeFill,
        bgFill: this.bgFill,
      };
    } else if (this.selectedTool === "ellipse") {
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radX = Math.abs(width / 2);
      const radY = Math.abs(height / 2);

      shape = {
        type: "ellipse",
        centerX,
        centerY,
        radX,
        radY,
        strokeWidth: this.strokeWidth,
        strokeFill: this.strokeFill,
        bgFill: this.bgFill,
      };
    } else if (this.selectedTool === "pencil") {
      this.pencilPoints.push({ x: clientX, y: clientY });
      shape = {
        type: "pencil",
        points: this.pencilPoints,
        strokeWidth: this.strokeWidth,
        strokeFill: this.strokeFill,
      };
    }
    if (!shape) return;
    this.existingShapes.push(shape);
    this.selectedElement = null;
    this.clearCanvas();
  };
  mouseWheelHandler = (e: WheelEvent) => {
    e.preventDefault();

    const scaleAmount = -e.deltaY / 200;
    const newScale = this.scale * (1 + scaleAmount);

    const mouseX = e.clientX - this.canvas.offsetLeft;
    const mouseY = e.clientY - this.canvas.offsetTop;

    const canvasMouseX = (mouseX - this.panX) / this.scale;
    const canvasMouseY = (mouseY - this.panY) / this.scale;

    this.panX -= canvasMouseX * (newScale - this.scale);
    this.panY -= canvasMouseY * (newScale - this.scale);

    this.scale = newScale;

    this.onScaleChange(this.scale);
    this.clearCanvas();
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("wheel", this.mouseWheelHandler);
  }
  transformPanScale(
    x: number,
    y: number
  ): { clientX: number; clientY: number } {
    const clientX = (x - this.panX) / this.scale;
    const clientY = (y - this.panY) / this.scale;
    return { clientX, clientY };
  }
  onScaleChange(scale: number) {
    this.outputScale = scale;
    if (this.onScaleChangeCallback) {
      this.onScaleChangeCallback(scale);
    }
  }
  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("wheel", this.mouseWheelHandler);
  }
}
