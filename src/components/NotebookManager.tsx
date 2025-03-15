import { useState, useEffect } from "react";
import {
  listNotebooks,
  loadNotebook,
  saveNotebook,
} from "../services/notebookService";
import { Notebook } from "../types";
import { Search, Plus, Folder, Clock, Download, Trash2 } from "lucide-react";

interface NotebookManagerProps {
  onSelectNotebook: (notebook: Notebook) => void;
  onCreateNotebook: () => void;
  currentNotebook: Notebook | null;
}

export function NotebookManager({
  onSelectNotebook,
  onCreateNotebook,
  currentNotebook,
}: NotebookManagerProps) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotebooks = async () => {
      setIsLoading(true);
      try {
        const notebookList = await listNotebooks();
        setNotebooks(notebookList);
      } catch (error) {
        console.error("Error fetching notebooks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotebooks();
  }, []);

  const filteredNotebooks = notebooks.filter((notebook) =>
    notebook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNotebook = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this notebook?")) {
      try {
        // Remove from local storage
        localStorage.removeItem(`notebook-${id}`);
        setNotebooks(notebooks.filter((nb) => nb.id !== id));
      } catch (error) {
        console.error("Error deleting notebook:", error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-canvas-100 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Notebooks</h2>
        <button
          onClick={onCreateNotebook}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          New Notebook
        </button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search notebooks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading notebooks...</p>
        </div>
      ) : filteredNotebooks.length === 0 ? (
        <div className="text-center py-8">
          <Folder className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No notebooks found</p>
          <button
            onClick={onCreateNotebook}
            className="text-blue-500 hover:text-blue-400"
          >
            Create your first notebook
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotebooks.map((notebook) => (
            <div
              key={notebook.id}
              onClick={() => onSelectNotebook(notebook)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                currentNotebook?.id === notebook.id
                  ? "bg-blue-600/20 border border-blue-600/50"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">{notebook.title}</h3>
                <button
                  onClick={(e) => handleDeleteNotebook(notebook.id, e)}
                  className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last modified: {formatDate(notebook.lastModified)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {notebook.cells.length} cell
                {notebook.cells.length !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
