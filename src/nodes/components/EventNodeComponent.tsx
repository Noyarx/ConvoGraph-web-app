import { Handle, Position, type Node } from "@xyflow/react";
import type { EventNode } from "../../models/NodeTypes.model";

export const bgColor = "#FFA500";

function EventNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as EventNode;
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
      <span>
        <strong>Event Name</strong>: {node.data.event_name}
      </span>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default EventNodeComponent;
