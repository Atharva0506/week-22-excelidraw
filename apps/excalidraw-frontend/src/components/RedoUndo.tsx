import React from "react";

import { LuRedo,LuUndo } from "react-icons/lu";


const RedoUndo :React.FC<{
    handleUndo: () => void;
    handleRedo: () => void;
  }> = ({handleRedo,handleUndo}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-foreground text-primary rounded-xl shadow-lg">
      {" "}
      <button
        onClick={handleUndo}
        className="px-2 py-1 hover:bg-secondary rounded-md text-primary"
        title="Undo"
      >
      <LuUndo size={18}/>
      </button>
      <button
        onClick={handleRedo}
        className="px-2 py-1 hover:bg-secondary rounded-md text-primary"
        title="Redo"
      >
        <LuRedo size={18} />
      </button>
    </div>
  );
};

export default RedoUndo;
