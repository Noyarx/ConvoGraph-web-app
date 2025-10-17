import { Handle, Position, type Node } from "@xyflow/react";
import type { QuestionNode } from "../../models/NodeTypes.model";

export const bgColor = "#2db4a2ff";

function QuestionNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as QuestionNode;

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

      <Handle
        style={{ width: 16, height: 16, backgroundColor: "green" }}
        type="target"
        position={Position.Top}
      />
      <Handle
        style={{
          width: 16,
          height: 16,
          backgroundColor: "darkorange",
        }}
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}

export default QuestionNodeComponent;
