export interface Cell {
  id: string;
  type: "code" | "markdown";
  content: string;
  output?: string;
}

export interface Notebook {
  id: string;
  title: string;
  cells: Cell[];
  lastModified: Date;
}
