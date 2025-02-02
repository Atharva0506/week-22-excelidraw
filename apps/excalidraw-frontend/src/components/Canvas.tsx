import { useRef, useEffect, useState } from "react";
import { FiCircle, FiSquare, FiMinus, FiMousePointer } from "react-icons/fi";
import {
  FaFont,
  FaRegHandPaper,
  FaLongArrowAltRight,
  FaPencilAlt,
} from "react-icons/fa";
import { PiDiamond } from "react-icons/pi";
import ToolButton from "./ToolButton";
import { ZoomControl } from "./ZoomControl";
import RedoUndo from "./RedoUndo";
import { CanvasBoard } from "@/lib/canvas/CanvasBoard";
import { Tools } from "@/types";

const tools = [
  { type: "hand", icon: FaRegHandPaper, title: "Hand" },
  { type: "cursor", icon: FiMousePointer, title: "Cursor" },
  { type: "ellipse", icon: FiCircle, title: "Ellipse" },
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
  const [canvasBoard, setCanvasBoard] = useState<CanvasBoard>();
  const [selectedTool, setSelectedTool] = useState<Tools['type']>("arrow");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scale, setScale] = useState<number>(1)

  useEffect(() => {
    canvasBoard?.setTool(selectedTool);
  }, [selectedTool, canvasBoard]);

  useEffect(() => {
    if (canvasRef.current) {
      const board = new CanvasBoard(canvasRef.current, roomId, socket, (newScale) => setScale(newScale));
      setCanvasBoard(board);
    }
  }, [canvasRef,roomId,socket]);

  useEffect(()=>{
    setScale(canvasBoard?.outputScale || 1)
}, [canvasBoard?.outputScale])


  return (
    <div className="relative w-screen h-screen bg-background overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="text-primary absolute z-0"
      ></canvas>

      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 px-3 py-2 bg-foreground text-primary rounded-2xl shadow-lg text-sm sm:text-base md:text-lg">
        {tools.map((tool) => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            title={tool.title}
            isActive={selectedTool === tool.type}
            onClick={() => setSelectedTool(tool.type as Tools['type'])}
          />
        ))}
      </div>

      <div className="fixed bottom-4 left-4 flex items-center gap-2 w-[200px] h-[50px]">
        <ZoomControl
         scale={scale} setScale={setScale}
        />
        <RedoUndo handleRedo={() => {}} handleUndo={() => {}} />
      </div>
    </div>
  );
};
