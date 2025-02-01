import React from "react";

interface ToolButtonProps {
  icon: React.ComponentType<{ size: number }>;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon: Icon, title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-2 py-2 rounded-md  ${
        isActive ? "bg-background" : "hover:bg-secondary"
      }`}
      title={title}
    >
      <Icon size={14} />
    </button>
  );
};

export default ToolButton;
