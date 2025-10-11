import { Handle, Position, type Node } from "@xyflow/react";
import type { QuestionNode } from "../../models/NodeTypes.model";

function QuestionNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as QuestionNode;

  return (
    <div
      style={{
        backgroundColor: node.node_info.color || "#33cfbaff",
        borderRadius: "8px",
        padding: "10px",
        color: "white",
        minWidth: "150px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{node.node_info.title}</div>
      <div style={{ fontSize: "0.9em" }}>
        <strong>{node.data.speaker}</strong>: {node.data.text}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default QuestionNodeComponent;
