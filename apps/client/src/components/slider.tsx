import React from "react";

interface SliderProps {
  quality: number;
  setQuality: React.Dispatch<React.SetStateAction<number>>;
}

const qualityMap: Record<
  number,
  { label: string; colorClass: string; description: string }
> = {
  1: {
    label: "Smallest",
    colorClass: "bg-red-500", // Background color for the chip
    description: "72 DPI • Best for email/sharing",
  },
  2: {
    label: "Standard",
    colorClass: "bg-orange-500",
    description: "150 DPI • Best for E-books/Web",
  },
  3: {
    label: "High Quality",
    colorClass: "bg-green-600",
    description: "300 DPI • Best for printing",
  },
};

const Slider: React.FC<SliderProps> = ({ quality, setQuality }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Target Quality
          </label>
          <p className="text-sm font-medium text-gray-600">
            {qualityMap[quality].description}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold text-white transition-all duration-300 ${qualityMap[quality].colorClass}`}
        >
          {qualityMap[quality].label}
        </span>
      </div>

      <input
        type="range"
        min="1"
        max="3"
        step="1"
        value={quality}
        onChange={(e) => setQuality(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
      />

      <div className="flex justify-between text-[10px] font-bold text-gray-400">
        <span>MAX SIZE REDUCTION</span>
        <span>BALANCED</span>
        <span>MINIMAL LOSS</span>
      </div>
    </div>
  );
};

export default Slider;
