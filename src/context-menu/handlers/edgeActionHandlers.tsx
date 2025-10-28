import { type Edge, useReactFlow } from "@xyflow/react";

// define edge action handlers using reactflow hook
export function useEdgeActionHandlers({
  onEditElement,
}: {
  onEditElement?: (element: Edge) => void;
}) {
  const { getEdges, setEdges } = useReactFlow();

  const onEditEdge = (edge: Edge) => {
    if (onEditElement) onEditElement(edge);
  };

  const onDeleteEdge = (edge: Edge) => {
    setEdges(getEdges().filter((n) => n.id !== edge.id));
  };
  return { onEditEdge, onDeleteEdge };
}
