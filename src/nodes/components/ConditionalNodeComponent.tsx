import { Handle, Position, type Node } from "@xyflow/react";
import Chip from "@mui/material/Chip";
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
      <div>
        <span>
          <strong>Check if</strong>
        </span>
      </div>
      <div className="flex flex-row p-1 gap-3 rounded-full items-center bg-black bg-opacity-10">
        <Chip className="!text-white" label={node.data.var_name} />
        <span>
          <strong>{node.data.operator}</strong>
        </span>
        {node.data.operator === "is" ? (
          <Chip
            color={
              node.data.value === "true"
                ? "success"
                : node.data.value === "false"
                ? "error"
                : "default"
            }
            label={node.data.value}
          />
        ) : node.data.operator === "==" ? (
          <Chip
            color={"info"}
            className="!text-white"
            label={node.data.value}
          />
        ) : (
          <Chip
            color={"secondary"}
            className="!text-white"
            label={node.data.value}
          />
        )}
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
