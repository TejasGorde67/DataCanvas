import type { Notebook } from "../types";

export const saveNotebook = async (notebook: Notebook): Promise<void> => {
  try {
    // For local storage
    localStorage.setItem(`notebook-${notebook.id}`, JSON.stringify(notebook));

    // For server persistence (when you have a backend)
    // await fetch('http://localhost:5000/notebooks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(notebook),
    // });
  } catch (error) {
    console.error("Error saving notebook:", error);
    throw error;
  }
};

export const loadNotebook = async (id: string): Promise<Notebook | null> => {
  try {
    // From local storage
    const notebookJson = localStorage.getItem(`notebook-${id}`);
    if (notebookJson) {
      const notebook = JSON.parse(notebookJson);
      // Convert string date back to Date object
      notebook.lastModified = new Date(notebook.lastModified);
      return notebook;
    }

    // From server (when you have a backend)
    // const response = await fetch(`http://localhost:5000/notebooks/${id}`);
    // if (!response.ok) return null;
    // return await response.json();

    return null;
  } catch (error) {
    console.error("Error loading notebook:", error);
    return null;
  }
};

export const listNotebooks = async (): Promise<Notebook[]> => {
  try {
    // From local storage
    const notebooks: Notebook[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("notebook-")) {
        const notebookJson = localStorage.getItem(key);
        if (notebookJson) {
          const notebook = JSON.parse(notebookJson);
          notebook.lastModified = new Date(notebook.lastModified);
          notebooks.push(notebook);
        }
      }
    }
    return notebooks;

    // From server (when you have a backend)
    // const response = await fetch('http://localhost:5000/notebooks');
    // if (!response.ok) return [];
    // return await response.json();
  } catch (error) {
    console.error("Error listing notebooks:", error);
    return [];
  }
};
