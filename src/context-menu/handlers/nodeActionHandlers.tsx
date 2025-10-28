import { type Node, useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
// define node action handlers using reactflow hook
export function useNodeActionHandlers({
  onEditElement,
}: {
  onEditElement?: (element: Node) => void;
}) {
  const { getNodes, setNodes } = useReactFlow();

  const onEditNode = (node: Node) => {
    if (onEditElement) onEditElement(node);
  };

  const onDuplicateNode = (node: Node) => {
    const newId = uuidv4();
    const offset = { x: 50, y: 120 };
    const newNode = {
      ...node,
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
    setNodes([...getNodes(), newNode]);
  };

  const onDeleteNode = (node: Node) => {
    setNodes(getNodes().filter((n) => n.id !== node.id));
  };

  return { onEditNode, onDuplicateNode, onDeleteNode };
}
