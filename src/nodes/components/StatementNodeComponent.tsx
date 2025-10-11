import { Handle, Position, type Node } from "@xyflow/react";
import type { StatementNode } from "../../models/NodeTypes.model";

function StatementNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as StatementNode;

  return (
    <div
      style={{
        backgroundColor: node.node_info.color || "#4e73df",
        borderRadius: "8px",
        padding: "10px",
        color: "white",
        minWidth: "150px",
      }}
    >
      <div style={{ display: "flex", fontWeight: "bold" }}>
        {node.node_info.title}
        <span>{node.id}</span>
      </div>
      <div style={{ fontSize: "0.9em" }}>
        <strong>{node.data.speaker}</strong>: {node.data.text}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default StatementNodeComponent;
