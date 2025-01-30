export type Tools =
  | { type: "rect"; x1: number; y1: number; x2: number; y2: number }
  | { type: "circle"; x1: number; y1: number; radius: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number }
  | {
      type: "arrow";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }
  | { type: "diamond"; x1: number; y1: number; x2: number; y2: number }
  | { type: "pencil"; points: { x1: number; y1: number }[] }
  | { type: "cursor" };


  export type FindElement = {
    type: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    centerX?: number;
    centerY?: number;
    radius?: number;
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    points?: { x: number; y: number }[];
  };