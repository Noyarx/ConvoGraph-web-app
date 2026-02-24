import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useNodeHighlightContext } from "../highlight/NodeHighlightContext";

interface PreviewContextValue {
  active: boolean;
  setHighlight: (visited: Set<string>, current: string | null) => void;
  activate: () => void;
  deactivate: () => void;
}

const PreviewContext = createContext<PreviewContextValue>({
  active: false,
  setHighlight: () => {},
  activate: () => {},
  deactivate: () => {},
});

export function PreviewProvider({ children }: { children: ReactNode }) {
  const highlight = useNodeHighlightContext();

  const activate = useCallback(() => {
    highlight.activate();
  }, [highlight]);

  const deactivate = useCallback(() => {
    highlight.deactivate();
  }, [highlight]);

  const setHighlight = useCallback(
    (visited: Set<string>, current: string | null) => {
      highlight.setHighlight(visited, current);
    },
    [highlight],
  );

  return (
    <PreviewContext.Provider
      value={{ active: highlight.active, setHighlight, activate, deactivate }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreviewContext() {
  return useContext(PreviewContext);
}
