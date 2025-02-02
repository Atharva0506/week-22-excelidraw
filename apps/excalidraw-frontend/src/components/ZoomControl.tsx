import React, { useState } from 'react';

export const ZoomControl = ({ scale, setScale }: { scale: number, setScale: (scale: number) => void }) => {
  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.1, 3));  
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.1)); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.1 && value <= 3) {
      setScale(value);
    }
  };

  return (
    <div className="w-fit py-2 px-4">
      <div className="flex bg-[#232329] px-4 py-2 rounded-md gap-3 items-center">
        <button
          className="text-white text-xl"
          onClick={handleZoomIn}
        >
          +
        </button>

        <input
          type="number"
          value={Math.round(scale * 100)}
          onChange={handleInputChange}
          className="w-16 text-center text-white bg-[#232329] border border-gray-500 rounded-md"
        />

        <button
          className="text-white text-xl"
          onClick={handleZoomOut}
        >
          -
        </button>

        <p className="text-white">%</p>
      </div>
    </div>
  );
};
