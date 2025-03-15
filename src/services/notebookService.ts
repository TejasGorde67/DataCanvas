import { Notebook } from "../types";

// For demo purposes, we'll use localStorage
// In a real app, this would be a backend API

export const listNotebooks = async (): Promise<Notebook[]> => {
  try {
    const notebooks: Notebook[] = [];

    // Get all keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Check if the key is a notebook
      if (key && key.startsWith("notebook-")) {
        const notebookJson = localStorage.getItem(key);
        if (notebookJson) {
          try {
            const notebook = JSON.parse(notebookJson);

            // Convert string dates to Date objects
            notebook.lastModified = new Date(notebook.lastModified);
            if (notebook.createdAt) {
              notebook.createdAt = new Date(notebook.createdAt);
            }

            notebooks.push(notebook);
          } catch (error) {
            console.error(`Error parsing notebook ${key}:`, error);
          }
        }
      }
    }

    // Sort by last modified date (newest first)
    return notebooks.sort(
      (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
    );
  } catch (error) {
    console.error("Error listing notebooks:", error);
    return [];
  }
};

export const loadNotebook = async (id: string): Promise<Notebook | null> => {
  try {
    const notebookJson = localStorage.getItem(`notebook-${id}`);
    if (!notebookJson) {
      return null;
    }

    const notebook = JSON.parse(notebookJson);

    // Convert string dates to Date objects
    notebook.lastModified = new Date(notebook.lastModified);
    if (notebook.createdAt) {
      notebook.createdAt = new Date(notebook.createdAt);
    }

    return notebook;
  } catch (error) {
    console.error(`Error loading notebook ${id}:`, error);
    return null;
  }
};

export const saveNotebook = async (notebook: Notebook): Promise<void> => {
  try {
    // Update last modified date
    notebook.lastModified = new Date();

    // If no createdAt, set it
    if (!notebook.createdAt) {
      notebook.createdAt = new Date();
    }

    // Save to localStorage
    localStorage.setItem(`notebook-${notebook.id}`, JSON.stringify(notebook));
  } catch (error) {
    console.error(`Error saving notebook ${notebook.id}:`, error);
    throw error;
  }
};

export const deleteNotebook = async (id: string): Promise<void> => {
  try {
    localStorage.removeItem(`notebook-${id}`);
  } catch (error) {
    console.error(`Error deleting notebook ${id}:`, error);
    throw error;
  }
};

export const createNotebook = async (title: string): Promise<Notebook> => {
  try {
    // Generate a unique ID
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

    const notebook: Notebook = {
      id,
      title,
      cells: [],
      lastModified: new Date(),
      createdAt: new Date(),
    };

    // Save the new notebook
    await saveNotebook(notebook);

    return notebook;
  } catch (error) {
    console.error("Error creating notebook:", error);
    throw error;
  }
};
