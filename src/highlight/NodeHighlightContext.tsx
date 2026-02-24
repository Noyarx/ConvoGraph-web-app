import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type HighlightState = "current" | "visited" | "dimmed" | "normal";

interface NodeHighlightState {
  highlightedNodeIds: Set<string>;
  currentNodeId: string | null;
  active: boolean;
}

interface NodeHighlightContextValue extends NodeHighlightState {
  setHighlight: (highlighted: Set<string>, current: string | null) => void;
  activate: () => void;
  deactivate: () => void;
}

const defaultState: NodeHighlightState = {
  highlightedNodeIds: new Set(),
  currentNodeId: null,
  active: false,
};

const NodeHighlightContext = createContext<NodeHighlightContextValue>({
  ...defaultState,
  setHighlight: () => {},
  activate: () => {},
  deactivate: () => {},
});

export function NodeHighlightProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NodeHighlightState>(defaultState);

  const setHighlight = useCallback((highlighted: Set<string>, current: string | null) => {
    setState((prev) => ({
      ...prev,
      highlightedNodeIds: highlighted,
      currentNodeId: current,
    }));
  }, []);

  const activate = useCallback(() => {
    setState({ highlightedNodeIds: new Set(), currentNodeId: null, active: true });
  }, []);

  const deactivate = useCallback(() => {
    setState({ highlightedNodeIds: new Set(), currentNodeId: null, active: false });
  }, []);

  return (
    <NodeHighlightContext.Provider value={{ ...state, setHighlight, activate, deactivate }}>
      {children}
    </NodeHighlightContext.Provider>
  );
}

export function useNodeHighlight(nodeId: string): HighlightState {
  const { active, currentNodeId, highlightedNodeIds } = useContext(NodeHighlightContext);
  if (!active) return "normal";
  if (nodeId === currentNodeId) return "current";
  if (highlightedNodeIds.has(nodeId)) return "visited";
  return "dimmed";
}

export function useNodeHighlightContext() {
  return useContext(NodeHighlightContext);
}

export function useEdgeHighlightDimming(source: string, target: string): boolean {
  const sourceState = useNodeHighlight(source);
  const targetState = useNodeHighlight(target);
  return sourceState === "dimmed" || targetState === "dimmed";
}
