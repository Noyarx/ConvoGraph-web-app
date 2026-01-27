import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { NodeTypeString } from "../../models/NodeTypes.model";

interface GraphStateContextValue {
  selectedNodeType: NodeTypeString;
  setSelectedNodeType: (type: NodeTypeString) => void;
}

const GraphStateContext = createContext<GraphStateContextValue | null>(null);

export function GraphStateProvider({ children }: PropsWithChildren) {
  const [selectedNodeType, setSelectedNodeType] =
    useState<NodeTypeString>("statement");

  //   const selectNodeType = (type: NodeTypeString) => setSelectedNodeType(type);

  return (
    <GraphStateContext.Provider
      value={{ selectedNodeType, setSelectedNodeType }}
    >
      {children}
    </GraphStateContext.Provider>
  );
}

export function useGraphState(): GraphStateContextValue {
  const context = useContext(GraphStateContext);

  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }

  return context;
}
