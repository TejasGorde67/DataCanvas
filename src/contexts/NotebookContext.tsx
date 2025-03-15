import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Cell, Notebook } from "../types";
import { saveNotebook, loadNotebook } from "../services/notebookService";
import { executeCode } from "../services/executionService";

interface NotebookContextType {
  notebook: Notebook;
  isLoading: boolean;
  error: string | null;
  addCell: (type: "code" | "markdown") => void;
  updateCell: (id: string, content: string) => void;
  deleteCell: (id: string) => void;
  executeCell: (id: string) => Promise<void>;
  saveNotebook: () => Promise<void>;
  loadNotebook: (id: string) => Promise<void>;
  createNewNotebook: (title?: string) => void;
  updateNotebookTitle: (title: string) => void;
}

const NotebookContext = createContext<NotebookContextType | undefined>(
  undefined
);

export function useNotebook() {
  const context = useContext(NotebookContext);
  if (context === undefined) {
    throw new Error("useNotebook must be used within a NotebookProvider");
  }
  return context;
}

interface NotebookProviderProps {
  children: React.ReactNode;
}

export function NotebookProvider({ children }: NotebookProviderProps) {
  const [notebook, setNotebook] = useState<Notebook>({
    id: uuidv4(),
    title: "Untitled Notebook",
    cells: [],
    lastModified: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCell = (type: "code" | "markdown") => {
    const newCell: Cell = {
      id: uuidv4(),
      type,
      content: "",
    };
    setNotebook((prev) => ({
      ...prev,
      cells: [...prev.cells, newCell],
      lastModified: new Date(),
    }));
  };

  const updateCell = (id: string, content: string) => {
    setNotebook((prev) => ({
      ...prev,
      cells: prev.cells.map((cell) =>
        cell.id === id ? { ...cell, content } : cell
      ),
      lastModified: new Date(),
    }));
  };

  const deleteCell = (id: string) => {
    setNotebook((prev) => ({
      ...prev,
      cells: prev.cells.filter((cell) => cell.id !== id),
      lastModified: new Date(),
    }));
  };

  const executeCell = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const cell = notebook.cells.find((c) => c.id === id);
      if (!cell) {
        throw new Error("Cell not found");
      }

      // Update cell to show it's executing
      setNotebook((prev) => ({
        ...prev,
        cells: prev.cells.map((c) =>
          c.id === id ? { ...c, output: "Executing..." } : c
        ),
      }));

      // Execute the code
      const result = await executeCode(cell.content);

      // Update cell with the result
      setNotebook((prev) => ({
        ...prev,
        cells: prev.cells.map((c) =>
          c.id === id ? { ...c, output: result.output, error: result.error } : c
        ),
        lastModified: new Date(),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");

      // Update cell with the error
      setNotebook((prev) => ({
        ...prev,
        cells: prev.cells.map((c) =>
          c.id === id
            ? {
                ...c,
                output: "Error executing cell",
                error: err instanceof Error ? err.message : "An error occurred",
              }
            : c
        ),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentNotebook = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await saveNotebook(notebook);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save notebook");
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotebookById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedNotebook = await loadNotebook(id);
      if (loadedNotebook) {
        setNotebook(loadedNotebook);
      } else {
        throw new Error("Notebook not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notebook");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewNotebook = (title = "Untitled Notebook") => {
    setNotebook({
      id: uuidv4(),
      title,
      cells: [],
      lastModified: new Date(),
    });
  };

  const updateNotebookTitle = (title: string) => {
    setNotebook((prev) => ({
      ...prev,
      title,
      lastModified: new Date(),
    }));
  };

  // Auto-save notebook when it changes
  useEffect(() => {
    const autoSave = async () => {
      if (notebook.cells.length > 0) {
        try {
          await saveNotebook(notebook);
        } catch (err) {
          console.error("Auto-save failed:", err);
        }
      }
    };

    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [notebook]);

  const value = {
    notebook,
    isLoading,
    error,
    addCell,
    updateCell,
    deleteCell,
    executeCell,
    saveNotebook: saveCurrentNotebook,
    loadNotebook: loadNotebookById,
    createNewNotebook,
    updateNotebookTitle,
  };

  return (
    <NotebookContext.Provider value={value}>
      {children}
    </NotebookContext.Provider>
  );
}
