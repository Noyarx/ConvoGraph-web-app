import { Handle, Position, type Node } from "@xyflow/react";
import type { EventNode } from "../../models/NodeTypes.model";

function EventNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as EventNode;
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
        <strong>Esegui funzione</strong>: {node.data.event_name}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default EventNodeComponent;
