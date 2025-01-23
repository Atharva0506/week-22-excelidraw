export type Tools =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number }
  | {
      type: "arrow";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | { type: "diamond"; x: number; y: number; width: number; height: number }
  | { type: "pencil"; points: { x: number; y: number }[] }
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