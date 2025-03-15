import { useState } from "react";
import { Trash2, Grip, Edit, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MarkdownCellProps {
  id: string;
  content: string;
  onChange: (content: string) => void;
  onDelete: () => void;
}

export function MarkdownCell({
  id,
  content,
  onChange,
  onDelete,
}: MarkdownCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);

  const handleSave = () => {
    onChange(value);
    setIsEditing(false);
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
          <span className="text-sm font-medium text-gray-300">Markdown</span>
          <span className="text-xs text-gray-600">|</span>
          <span className="text-xs text-gray-600">Cell {id.slice(0, 4)}</span>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-4 bg-canvas-100 text-gray-200 focus:outline-none min-h-[150px]"
          placeholder="Enter markdown content..."
        />
      ) : (
        <div className="p-4 prose prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
