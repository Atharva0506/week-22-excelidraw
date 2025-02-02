export type Tools =
| {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
  strokeFill: string;
  bgFill: string;
}
| {
  type: "ellipse";
  centerX: number;
  centerY: number;
  radX: number;
  radY: number;
  strokeWidth: number;
  strokeFill: string;
  bgFill: string;
}
| {
  type: "line";
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  strokeWidth: number;
  strokeFill: string;
}
| {
  type: "arrow";
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  strokeWidth: number;
  strokeFill: string;
}
| {
  type: "diamond";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
  strokeFill: string;
  bgFill: string;
}
| {
  type: "pencil";
  points: { x: number; y: number }[];
  strokeWidth: number;
  strokeFill: string;
}
| {
  type: "cursor";
}
| {
  type: "hand";
};