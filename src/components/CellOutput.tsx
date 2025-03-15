import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CellOutputProps {
  output: string;
  error?: string;
}

export function CellOutput({ output, error }: CellOutputProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!output && !error) return null;

  return (
    <div className="border-t border-gray-800">
      <div
        className="flex items-center justify-between py-2 px-4 bg-canvas-50 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span
          className={`text-sm font-medium ${
            error ? "text-red-400" : "text-gray-400"
          }`}
        >
          {error ? "Error" : "Output"}
        </span>
        <button className="p-1 text-gray-500 hover:text-gray-300">
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div
          className={`p-4 ${
            error ? "bg-red-900/20" : "bg-canvas-900"
          } text-gray-300 font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto`}
        >
          {error || output}
        </div>
      )}
    </div>
  );
}
