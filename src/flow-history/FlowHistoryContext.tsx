import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import type { ReactFlowInstance, Node, Edge } from "@xyflow/react";

interface FlowSnapshot {
  nodes: Node[];
  edges: Edge[];
}

interface FlowHistoryContextType {
  rfInstance: ReactFlowInstance | null;
  setRfInstance: (inst: ReactFlowInstance) => void;
  getHistoryStacks: () => {
    undoStack: React.RefObject<FlowSnapshot[]>;
    redoStack: React.RefObject<FlowSnapshot[]>;
  };
  saveState: () => void;
  clearHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const FlowHistoryContext = createContext<FlowHistoryContextType | null>(null);

export function FlowHistoryProvider({ children }: any) {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const undoStack = useRef<FlowSnapshot[]>([]);
  const redoStack = useRef<FlowSnapshot[]>([]);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  /** Read current state */
  const getCurrentSnapshot = useCallback((): FlowSnapshot | null => {
    if (!rfInstance) return null;

    const flow = rfInstance.toObject();
    return {
      nodes: flow.nodes ?? [],
      edges: flow.edges ?? [],
    };
  }, [rfInstance]);

  const getHistoryStacks = useCallback(() => {
    return { undoStack: undoStack, redoStack: redoStack };
  }, [undoStack, redoStack]);
  /** Save a new snapshot to the undo stack */
  const saveState = useCallback(() => {
    const snap = getCurrentSnapshot();
    if (!snap) return;

    undoStack.current.push(snap);
    redoStack.current = []; // clear redo

    setCanUndo(undoStack.current.length > 0);
    setCanRedo(false);
  }, [getCurrentSnapshot]);

  const clearHistory = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  /* Undo */
  const undo = useCallback(() => {
    if (!rfInstance) return;
    if (undoStack.current.length === 0) return;

    const current = getCurrentSnapshot();
    if (current) redoStack.current.push(current);

    const previous = undoStack.current.pop();
    if (!previous) return;

    rfInstance.setNodes(previous.nodes);
    rfInstance.setEdges(previous.edges);

    setCanUndo(undoStack.current.length > 0);
    setCanRedo(redoStack.current.length > 0);
  }, [rfInstance, getCurrentSnapshot]);

  /* Redo */
  const redo = useCallback(() => {
    if (!rfInstance) return;
    if (redoStack.current.length === 0) return;

    const current = getCurrentSnapshot();
    if (current) undoStack.current.push(current);

    const next = redoStack.current.pop();
    if (!next) return;

    rfInstance.setNodes(next.nodes);
    rfInstance.setEdges(next.edges);

    setCanUndo(undoStack.current.length > 0);
    setCanRedo(redoStack.current.length > 0);
  }, [rfInstance, getCurrentSnapshot]);

  /* Context value */
  const value: FlowHistoryContextType = {
    rfInstance,
    setRfInstance,
    getHistoryStacks,

    saveState,
    clearHistory,
    undo,
    redo,

    canUndo,
    canRedo,
  };

  return (
    <FlowHistoryContext.Provider value={value}>
      {children}
    </FlowHistoryContext.Provider>
  );
}

export function useFlowHistory() {
  const context = useContext(FlowHistoryContext);
  if (!context)
    throw new Error("useFlowHistory must be used within <FlowHistoryProvider>");
  return context;
}
