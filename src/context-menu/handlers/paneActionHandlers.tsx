import { useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

export function usePaneActionHandlers({ x, y }: { x: number; y: number }) {
  const { getNodes, setNodes, screenToFlowPosition } = useReactFlow();

  const evtX = x;
  const evtY = y;

  const onAddNode = () => {
    const id = uuidv4();
    const evtPosition = { x: evtX, y: evtY };
    const newNode = {
      id,
      type: "statement",
      position: screenToFlowPosition(evtPosition),
      data: {
        id: id,
        type: "statement",
        node_info: {
          position: screenToFlowPosition(evtPosition),
          shape: "",
          color: "",
        },
        data: {
          speaker: "Matthew",
          mood: "neutral",
          text: "",
        },
        next_node: "",
      },
    };

    setNodes([...getNodes(), newNode]);
  };

  return { onAddNode };
}
