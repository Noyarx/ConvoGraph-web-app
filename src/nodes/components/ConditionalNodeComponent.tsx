import { Handle, Position, type Node } from "@xyflow/react";
import type { ConditionalNode } from "../../models/NodeTypes.model";

export const bgColor = "#fc7bdbff";

function ConditionalNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as ConditionalNode;
  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
      style={{
        backgroundColor: node.node_info.color || bgColor,
      }}
    >
      <div className="flex flex-row gap-4 justify-between">
        <span>
          <strong>Check</strong>:
        </span>
        <span>{node.data.condition}</span>
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
        id={"left"}
        position={Position.Left}
      />
      <Handle
        style={{
          width: 16,
          height: 16,
          backgroundColor: "darkorange",
        }}
        type="source"
        id={"right"}
        position={Position.Right}
      />
    </div>
  );
  return <></>;
}

export default ConditionalNodeComponent;
