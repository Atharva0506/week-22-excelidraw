"use client";

import { useRef, useEffect, useState } from "react";
import { FiCircle, FiSquare, FiMinus, FiMousePointer } from "react-icons/fi";
import { FaFont, FaRegHandPaper, FaLongArrowAltRight, FaPencilAlt } from "react-icons/fa";
import { PiDiamond } from "react-icons/pi";
import ToolButton from "./ToolButton";
import { initDraw } from "@/utils/draw";

type ShapeType = "rect" | "circle" | "line" | "text" | "diamond" | "arrow" | "pencil";

const tools = [
  { type: "hand", icon: FaRegHandPaper, title: "Hand" },
  { type: null, icon: FiMousePointer, title: "Cursor" },
  { type: "circle", icon: FiCircle, title: "Circle" },
  { type: "rect", icon: FiSquare, title: "Rectangle" },
  { type: "pencil", icon: FaPencilAlt, title: "Pencil" },
  { type: "line", icon: FiMinus, title: "Line" },
  { type: "arrow", icon: FaLongArrowAltRight, title: "Arrow" },
  { type: "text", icon: FaFont, title: "Text" },
  { type: "diamond", icon: PiDiamond, title: "Diamond" },
];

export const Canvas = ({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<ReturnType<typeof initDraw>>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket).then((drawInstance) => {
        drawRef.current = drawInstance;
      });
    }
  }, [canvasRef, roomId, socket]);

  const setShapeType = (type: string | null) => {
    setSelectedTool(type);
    if (type) {
      drawRef.current?.setShapeType(type as ShapeType);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === "hand") {
      setIsDragging(true);
      setOffset({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      <canvas
        className="text-primary"
        ref={canvasRef}
        width={2000}
        height={1000}
        style={{
          cursor: selectedTool === "hand" ? "move" : "auto",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      ></canvas>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 px-3 py-2 bg-foreground text-primary rounded-2xl shadow-lg text-sm sm:text-base md:text-lg">
        {tools.map((tool) => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            title={tool.title}
            isActive={selectedTool === tool.type}
            onClick={() => setShapeType(tool.type)}
          />
        ))}
      </div>
    </div>
  );
};
