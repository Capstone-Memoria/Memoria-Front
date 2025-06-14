import { cn } from "@/lib/utils/className";
import React from "react";

const PRESET_COLORS = [
  "bg-black",
  "bg-red-400",
  "bg-yellow-200",
  "bg-green-400",
  "bg-blue-300",
  "bg-pink-300",
  "bg-gray-600",
  "bg-white",
];

interface ColorPickerProps {
  selectedColor: string | undefined;
  onColorSelect: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {PRESET_COLORS.map((color) => (
        <div
          className={cn(
            "size-12 flex items-center justify-center rounded-full border-2 border-gray-300 transition-colors",
            {
              "border-black": selectedColor === color,
            }
          )}
        >
          <div
            key={color}
            className={cn("size-8 rounded-full cursor-pointer", color)}
            onClick={() => onColorSelect(color)}
          />
        </div>
      ))}
    </div>
  );
};

export default ColorPicker;
