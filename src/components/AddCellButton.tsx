import { PlusCircle, Code, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AddCellButtonProps {
  onAddCodeCell: () => void;
  onAddMarkdownCell: () => void;
}

export function AddCellButton({
  onAddCodeCell,
  onAddMarkdownCell,
}: AddCellButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add Cell
      </button>

      {isMenuOpen && (
        <div className="absolute mt-2 w-48 bg-canvas-50 border border-gray-800 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              onAddCodeCell();
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5"
          >
            <Code className="h-4 w-4" />
            Code Cell
          </button>
          <button
            onClick={() => {
              onAddMarkdownCell();
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5"
          >
            <FileText className="h-4 w-4" />
            Markdown Cell
          </button>
        </div>
      )}
    </div>
  );
}
