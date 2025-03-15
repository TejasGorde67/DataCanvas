import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Trash2, Grip, Users } from "lucide-react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";
import { CellOutput } from "./CellOutput";

interface CollaborativeCodeCellProps {
  id: string;
  content: string;
  output?: string;
  onChange: (content: string) => void;
  onDelete: () => void;
  onExecute: () => Promise<void>;
  roomName: string;
  username: string;
}

export function CollaborativeCodeCell({
  id,
  content,
  output,
  onChange,
  onDelete,
  onExecute,
  roomName,
  username,
}: CollaborativeCodeCellProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const yDocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  useEffect(() => {
    // Initialize Yjs document
    const yDoc = new Y.Doc();
    yDocRef.current = yDoc;

    // Initialize WebSocket provider
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev", // Replace with your WebSocket server URL in production
      `datacanvas-${roomName}-cell-${id}`,
      yDoc
    );
    providerRef.current = provider;

    // Set user information
    provider.awareness.setLocalStateField("user", {
      name: username,
      color: getRandomColor(),
      colorLight: getRandomColorLight(),
    });

    // Update active users when awareness changes
    const updateActiveUsers = () => {
      const users: string[] = [];
      provider.awareness.getStates().forEach((state: any) => {
        if (state.user && state.user.name && !users.includes(state.user.name)) {
          users.push(state.user.name);
        }
      });
      setActiveUsers(users);
    };

    provider.awareness.on("change", updateActiveUsers);

    // Cleanup function
    return () => {
      provider.awareness.off("change", updateActiveUsers);
      provider.disconnect();
      yDoc.destroy();
    };
  }, [id, roomName, username]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    if (yDocRef.current && providerRef.current) {
      // Get the Y.Text from the Y.Doc
      const yText = yDocRef.current.getText(`cell-${id}`);

      // If the Y.Text is empty, initialize it with the current content
      if (yText.toString() === "" && content) {
        yText.insert(0, content);
      }

      // Create the Monaco binding
      const binding = new MonacoBinding(
        yText,
        editor.getModel()!,
        new Set([editor]),
        providerRef.current.awareness
      );
      bindingRef.current = binding;

      // Listen for changes to update the parent component
      yText.observe(() => {
        onChange(yText.toString());
      });
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecute();
    } finally {
      setIsExecuting(false);
    }
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
          <span className="text-sm font-medium text-gray-300">Python</span>
          <span className="text-xs text-gray-600">|</span>
          <span className="text-xs text-gray-600">Cell {id.slice(0, 4)}</span>

          {activeUsers.length > 0 && (
            <div className="flex items-center ml-2">
              <Users className="h-3.5 w-3.5 text-gray-500 mr-1" />
              <span className="text-xs text-gray-500">
                {activeUsers.length}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <Editor
        height="200px"
        defaultLanguage="python"
        value={content}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "off",
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          renderLineHighlight: "none",
          padding: { top: 8, bottom: 8 },
          theme: "vs-dark",
        }}
      />

      {output && <CellOutput output={output} />}
    </div>
  );
}

// Helper function to generate random colors
function getRandomColor() {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomColorLight() {
  const colors = [
    "#ffcdd2",
    "#f8bbd0",
    "#e1bee7",
    "#d1c4e9",
    "#c5cae9",
    "#bbdefb",
    "#b3e5fc",
    "#b2ebf2",
    "#b2dfdb",
    "#c8e6c9",
    "#dcedc8",
    "#f0f4c3",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
