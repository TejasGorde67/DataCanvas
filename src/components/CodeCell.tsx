import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Trash2, Grip } from "lucide-react";

interface CodeCellProps {
  id: string;
  content: string;
  output?: string;
  onChange: (content: string) => void;
  onDelete: () => void;
  onExecute: () => Promise<void>;
}

export function CodeCell({
  content,
  onChange,
  onDelete,
  onExecute,
}: CodeCellProps) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    await onExecute();
    setIsExecuting(false);
  };

  return (
    <div className="group relative border border-gray-800 rounded-xl overflow-hidden bg-canvas-100 shadow-cell transition-shadow hover:shadow-lg">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-1.5 text-gray-500 cursor-grab hover:bg-white/5 rounded-md">
          <Grip className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center justify-between py-2 px-4 bg-canvas-50 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-300">Python</span>
          <span className="text-xs text-gray-600">|</span>
          <span className="text-xs text-gray-600">Cell 1</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <Editor
        height="200px"
        defaultLanguage="python"
        value={content}
        onChange={(value) => onChange(value || "")}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "off",
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          renderLineHighlight: "none",
          padding: { top: 8, bottom: 8 },
          theme: "vs-dark",
        }}
      />
    </div>
  );
}
