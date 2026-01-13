import { type Node, useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { useFlowHistory } from "../../flow-history/FlowHistoryContext";
// define node action handlers using reactflow hook
export function useNodeActionHandlers({
  onEditElement,
}: {
  onEditElement?: (element: Node) => void;
}) {
  const { addNodes, deleteElements } = useReactFlow();
  const flowHistory = useFlowHistory();
  const onEditNode = (node: Node) => {
    if (onEditElement) onEditElement(node);
  };

  const onDuplicateNode = (node: Node) => {
    const newId = uuidv4();
    const offset = { x: 50, y: 120 };
    const newNode = {
      ...node,
      selected: false,
      id: newId,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      data: {
        ...node.data,
        node_info: node.data.node_info,
        data: node.data.data,
      },
    };
    flowHistory.saveState();
    addNodes(newNode);
  };

  const onDeleteNode = (node: Node) => {
    deleteElements({ nodes: [node] });
  };

  return { onEditNode, onDuplicateNode, onDeleteNode };
}
