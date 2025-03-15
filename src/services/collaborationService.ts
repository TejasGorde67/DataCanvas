import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import type { editor } from "monaco-editor";

let doc: Y.Doc | null = null;
let provider: WebsocketProvider | null = null;
let awareness: any | null = null;

export const initializeCollaboration = (
  notebookId: string,
  username: string
) => {
  // Create a new Y.Doc
  doc = new Y.Doc();

  // Connect to the WebSocket server
  provider = new WebsocketProvider(
    "ws://localhost:1234", // Replace with your WebSocket server URL
    `notebook-${notebookId}`,
    doc
  );

  // Get the awareness instance from the provider
  awareness = provider.awareness;

  // Set user information
  awareness.setLocalStateField("user", {
    name: username,
    color: getRandomColor(),
    activeCell: null,
  });

  return { doc, provider, awareness };
};

export const bindEditorToYjs = (
  editor: editor.IStandaloneCodeEditor,
  cellId: string
) => {
  if (!doc) return null;

  // Create a Y.Text for this cell
  const yText = doc.getText(`cell-${cellId}`);

  // Bind the Monaco editor to the Y.Text
  const binding = new MonacoBinding(
    yText,
    editor.getModel()!,
    new Set([editor]),
    awareness
  );

  return binding;
};

export const setActiveCell = (cellId: string | null) => {
  if (!awareness) return;

  const currentState = awareness.getLocalState();
  awareness.setLocalStateField("user", {
    ...currentState.user,
    activeCell: cellId,
  });
};

export const getActiveUsers = () => {
  if (!awareness) return [];

  const states = awareness.getStates();
  const users: any[] = [];

  states.forEach((state: any, clientId: number) => {
    if (state.user) {
      users.push({
        clientId,
        name: state.user.name,
        color: state.user.color,
        activeCell: state.user.activeCell,
      });
    }
  });

  return users;
};

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
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export const cleanupCollaboration = () => {
  if (provider) {
    provider.disconnect();
    provider = null;
  }
  doc = null;
  awareness = null;
};
