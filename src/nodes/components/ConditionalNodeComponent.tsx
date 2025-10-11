import { Handle, Position, type Node } from "@xyflow/react";
import type { ConditionalNode } from "../../models/NodeTypes.model";

function ConditionalNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as ConditionalNode;
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
      <div style={{ fontWeight: "bold" }}>{node.node_info.title}</div>
      <div style={{ fontSize: "0.9em" }}>
        <strong>La variabile: </strong>: {node.data.condition}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />
    </div>
  );
}

export default ConditionalNodeComponent;
