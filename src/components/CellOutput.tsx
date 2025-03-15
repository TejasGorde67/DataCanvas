import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CellOutputProps {
  output: string;
}

export function CellOutput({ output }: CellOutputProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!output) return null;

  return (
    <div className="border-t border-gray-800">
      <div
        className="flex items-center justify-between py-2 px-4 bg-canvas-50 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-sm font-medium text-gray-400">Output</span>
        <button className="p-1 text-gray-500 hover:text-gray-300">
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 bg-canvas-900 text-gray-300 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
          {output}
        </div>
      )}
    </div>
  );
}
