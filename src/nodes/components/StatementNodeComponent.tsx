import { Handle, Position, type Node } from "@xyflow/react";
import type { StatementNode } from "../../models/NodeTypes.model";

export const bgColor = "#4e73df";

function StatementNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as StatementNode;

  return (
    <div
      style={{
        background: bgColor,
        color: "white",
        borderRadius: 8,
        padding: 15,
        minWidth: 180,
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

export default StatementNodeComponent;
