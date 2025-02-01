export const ZoomControl: React.FC<{
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}> = ({ zoomLevel, onZoomIn, onZoomOut }) => (
  <div
    className="
   flex items-center gap-2 px-4 py-2 bg-foreground text-primary rounded-xl shadow-lg"
  >
    <button
      onClick={onZoomOut}
      className="px-2 py-1 bg-secondary rounded-md text-primary"
    >
      -
    </button>
    <span className="bg-foreground mx-2">{Math.round(zoomLevel * 100)}%</span>
    <button
      onClick={onZoomIn}
      className="px-2 py-1 bg-secondary rounded-md text-primary"
    >
      +
    </button>
  </div>
);
