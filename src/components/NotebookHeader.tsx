import { useState, useEffect, useRef } from "react";
import { Save, Share, Download, Settings } from "lucide-react";

interface NotebookHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => Promise<void>;
  lastSaved?: Date;
}

export function NotebookHeader({
  title,
  onTitleChange,
  onSave,
  lastSaved,
}: NotebookHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleSubmit = () => {
    onTitleChange(editableTitle);
    setIsEditing(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Never";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-800">
      <div>
        {isEditing ? (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              className="px-2 py-1 bg-canvas-900 border border-gray-700 rounded text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <h1
            className="text-xl font-bold text-white cursor-pointer hover:text-blue-400"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </h1>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Last saved: {formatDate(lastSaved)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save
            </>
          )}
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5">
          <Share className="h-4 w-4" />
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5">
          <Download className="h-4 w-4" />
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
