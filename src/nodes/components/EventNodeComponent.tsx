import { Handle, Position, type Node } from "@xyflow/react";
import type { EventNode } from "../../models/NodeTypes.model";

export const bgColor = "#FFA500";

function EventNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as EventNode;
  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
      style={{
        backgroundColor: node.node_info.color || bgColor,
      }}
    >
      <div className="flex flex-row gap-4 justify-between">
        <span>
          <strong>Event Name</strong>:
        </span>
        <span>{node.data.event_name}</span>
      </div>

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

export default EventNodeComponent;
