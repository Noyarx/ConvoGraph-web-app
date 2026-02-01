import { Handle, Position, useStore, type Node } from "@xyflow/react";
import type { QuestionNode } from "../../models/NodeTypes.model";
import {
  getInverseScale,
  HANDLE_OFFSET,
  sourceHandleStyle,
  targetHandleStyle,
} from "./util";

export const bgColor = "#2db4a2ff";

function QuestionNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as QuestionNode;
  const nodo = flowNode as Node;
  const zoom = useStore((state) => state.transform[2]);
  const scale = getInverseScale(zoom);

  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
      style={{
        backgroundColor: node.node_info.color || bgColor,
      }}
    >
      <div className="flex flex-row justify-between">
        <span>
          <strong>{node.data.speaker}</strong>:
        </span>
        <span>
          <strong>{node.data.mood}</strong>
        </span>
      </div>
      <p>{node.data.text}</p>

      <Handle style={targetHandleStyle} type="target" position={Position.Top}>
        <div
          style={{
            position: "absolute",
            top: -30,
            width: 20,
            height: 20,
            display: nodo.selected ? "block" : "none",
            scale: scale,
            transform: `translateY(${-HANDLE_OFFSET * scale}px)`,
          }}
          className={`justify-self-center active:hidden rounded-xl border-4 hover:border-2 border-green-300 bg-green-600`}
        ></div>
      </Handle>
      <Handle
        style={sourceHandleStyle}
        type="source"
        position={Position.Bottom}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            width: 20,
            height: 20,
            display: nodo.selected ? "block" : "none",
            scale: scale,
            transform: `translateY(${HANDLE_OFFSET * scale}px)`,
          }}
          className={`justify-self-center active:hidden rounded-xl border-4 hover:border-2 border-orange-300 bg-orange-500`}
        ></div>
      </Handle>
    </div>
  );
}

export default QuestionNodeComponent;
