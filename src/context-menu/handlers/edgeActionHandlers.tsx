import { type Edge, useReactFlow } from "@xyflow/react";
import { useFlowHistory } from "../../flow-history/FlowHistoryContext";

// define edge action handlers using reactflow hook
export function useEdgeActionHandlers({
  onEditElement,
}: {
  onEditElement?: (element: Edge) => void;
}) {
  const { deleteElements } = useReactFlow();
  const flowHistory = useFlowHistory();
  const onEditEdge = (edge: Edge) => {
    if (onEditElement) onEditElement(edge);
  };

  const onDeleteEdge = (edge: Edge) => {
    flowHistory.saveState();
    deleteElements({ edges: [edge] });
  };
  return { onEditEdge, onDeleteEdge };
}
