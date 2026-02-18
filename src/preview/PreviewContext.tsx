import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PreviewState {
  visitedNodeIds: Set<string>;
  currentNodeId: string | null;
  active: boolean;
}

interface PreviewContextValue extends PreviewState {
  setHighlight: (visited: Set<string>, current: string | null) => void;
  activate: () => void;
  deactivate: () => void;
}

const defaultState: PreviewState = {
  visitedNodeIds: new Set(),
  currentNodeId: null,
  active: false,
};

const PreviewContext = createContext<PreviewContextValue>({
  ...defaultState,
  setHighlight: () => {},
  activate: () => {},
  deactivate: () => {},
});

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PreviewState>(defaultState);

  const setHighlight = useCallback((visited: Set<string>, current: string | null) => {
    setState((prev) => ({
      ...prev,
      visitedNodeIds: visited,
      currentNodeId: current,
    }));
  }, []);

  const activate = useCallback(() => {
    setState((prev) => ({ ...prev, active: true }));
  }, []);

  const deactivate = useCallback(() => {
    setState({ visitedNodeIds: new Set(), currentNodeId: null, active: false });
  }, []);

  return (
    <PreviewContext.Provider value={{ ...state, setHighlight, activate, deactivate }}>
      {children}
    </PreviewContext.Provider>
  );
}

export type HighlightState = "current" | "visited" | "dimmed" | "normal";

export function usePreviewHighlight(nodeId: string): HighlightState {
  const { active, currentNodeId, visitedNodeIds } = useContext(PreviewContext);
  if (!active) return "normal";
  if (nodeId === currentNodeId) return "current";
  if (visitedNodeIds.has(nodeId)) return "visited";
  return "dimmed";
}

export function usePreviewContext() {
  return useContext(PreviewContext);
}
