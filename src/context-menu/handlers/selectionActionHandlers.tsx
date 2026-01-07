import { type Node, useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { useFlowHistory } from "../../flow-history/FlowHistoryContext";

// define selection action handlers using reactflow hook
export function useSelectionActionHandlers() {
  const { getNodes, addNodes, deleteElements } = useReactFlow();
  const flowHistory = useFlowHistory();
  const selected = getNodes().filter((n) => n.selected === true);

  const onDuplicateNodes = () => {
    const offset = { x: 50, y: 120 };

    const newNodes: Node[] = selected.map((n) => ({
      ...n,
      id: uuidv4(),
      position: {
        x: n.position.x + offset.x,
        y: n.position.y + offset.y,
      },
      data: {
        ...n.data,
        node_info: n.data.node_info,
        data: n.data.data,
      },
    }));
    flowHistory.saveState();
    addNodes(newNodes);
  };

  const onDeleteNodes = () => {
    deleteElements({ nodes: selected });
  };

  return { onDuplicateNodes, onDeleteNodes };
}
