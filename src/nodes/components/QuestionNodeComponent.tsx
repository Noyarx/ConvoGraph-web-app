import { Handle, Position, type Node } from "@xyflow/react";
import type { QuestionNode } from "../../models/NodeTypes.model";

export const bgColor = "#33cfbaff";

function QuestionNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as QuestionNode;

  return (
    <div
      style={{
        backgroundColor: node.node_info.color || bgColor,
        borderRadius: "8px",
        padding: 15,
        color: "white",
        minWidth: "150px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          <strong>{node.node_info.title}</strong>
        </span>
        <span>{bgColor}</span>
      </div>
      <div>
        <span>
          <strong>{node.data.speaker}</strong>: {node.data.text}
        </span>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default QuestionNodeComponent;
