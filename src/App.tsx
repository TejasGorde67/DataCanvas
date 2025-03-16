import { useState, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { CodeCell } from "./components/CodeCell";
import { MarkdownCell } from "./components/MarkdownCell";
import { AddCellButton } from "./components/AddCellButton";
import { NotebookHeader } from "./components/NotebookHeader";
import { UserPresence } from "./components/UserPresence";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { NotebookProvider, useNotebook } from "./contexts/NotebookContext";
import {
  initAuth,
  getAuthState,
  subscribeToAuth,
} from "./services/authService";
import { LoginForm } from "./components/auth/LoginForm";
import { Book, Search, Settings, Zap } from "lucide-react";

function NotebookApp({ activeUsers }: { activeUsers: any[] }) {
  const {
    notebook,
    addCell,
    updateCell,
    deleteCell,
    executeCell,
    saveNotebook,
    updateNotebookTitle,
  } = useNotebook();

  const handleAddCodeCell = () => {
    addCell("code");
  };

  const handleAddMarkdownCell = () => {
    addCell("markdown");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-black/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Book className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold gradient-text">
                  DataCanvas
                </span>
              </div>
              <div className="hidden md:flex md:items-center md:space-x-1 ml-8">
                <a
                  href="#"
                  className="px-3 py-2 text-sm font-medium text-white rounded-md bg-white/10"
                >
                  Notebooks
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-white/5"
                >
                  Visualizations
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-white/5"
                >
                  Datasets
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-white/5"
                >
                  Changelog
                </a>
                <div className="px-2 py-1 text-xs font-medium bg-white/10 rounded ml-2">
                  New
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search notebooks..."
                    className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center ml-4 space-x-2">
                <ThemeSwitcher />

                <button className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5">
                  <Settings className="h-5 w-5" />
                </button>

                <div className="flex items-center ml-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    U
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-4 py-8">
        <NotebookHeader
          title={notebook.title}
          onTitleChange={updateNotebookTitle}
          onSave={saveNotebook}
          lastSaved={notebook.lastModified}
        />

        <div className="mt-8 space-y-6">
          {notebook.cells.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl">
              <Zap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                This notebook is empty
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start by adding a code or markdown cell to begin your data
                analysis journey
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleAddCodeCell}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Add Code Cell
                </button>
                <button
                  onClick={handleAddMarkdownCell}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center gap-2"
                >
                  Add Markdown Cell
                </button>
              </div>
            </div>
          ) : (
            <Virtuoso
              totalCount={notebook.cells.length}
              overscan={5}
              itemContent={(index) => {
                const cell = notebook.cells[index];

                if (cell.type === "code") {
                  return (
                    <CodeCell
                      key={cell.id}
                      id={cell.id}
                      content={cell.content}
                      output={cell.output}
                      onChange={(content) => updateCell(cell.id, content)}
                      onDelete={() => deleteCell(cell.id)}
                      onExecute={() => executeCell(cell.id)}
                    />
                  );
                } else {
                  return (
                    <MarkdownCell
                      key={cell.id}
                      id={cell.id}
                      content={cell.content}
                      onChange={(content) => updateCell(cell.id, content)}
                      onDelete={() => deleteCell(cell.id)}
                    />
                  );
                }
              }}
              components={{
                Footer: () => (
                  <div className="py-6 flex justify-center">
                    <AddCellButton
                      onAddCodeCell={handleAddCodeCell}
                      onAddMarkdownCell={handleAddMarkdownCell}
                    />
                  </div>
                ),
              }}
            />
          )}
        </div>
      </main>

      <UserPresence users={activeUsers} />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeUsers, setActiveUsers] = useState([
    { id: "1", name: "User1", color: "#2563eb" },
    { id: "2", name: "User2", color: "#34d399" },
    // Add more users as needed
  ]);

  useEffect(() => {
    // Initialize authentication
    initAuth();

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuth((state) => {
      setIsAuthenticated(state.isAuthenticated);
    });

    // Check current auth state
    const authState = getAuthState();
    setIsAuthenticated(authState.isAuthenticated);

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <NotebookProvider>
      <NotebookApp activeUsers={activeUsers} />
    </NotebookProvider>
  );
}

export default App;
