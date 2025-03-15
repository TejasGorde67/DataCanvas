export interface Cell {
  id: string;
  type: "code" | "markdown";
  content: string;
  output?: string;
  error?: string;
  visualizations?: Visualization[];
}

export interface Visualization {
  type: "image" | "chart" | "table";
  data: any;
}

export interface Notebook {
  id: string;
  title: string;
  cells: Cell[];
  lastModified: Date;
  createdAt?: Date;
  owner?: string;
  collaborators?: string[];
  isPublic?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface NotebookService {
  listNotebooks: () => Promise<Notebook[]>;
  getNotebook: (id: string) => Promise<Notebook | null>;
  saveNotebook: (notebook: Notebook) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  createNotebook: (title: string) => Promise<Notebook>;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  visualizations?: Visualization[];
}

export interface ExecutionService {
  executeCode: (code: string) => Promise<ExecutionResult>;
}
