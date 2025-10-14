import { Handle, Position, type Node } from "@xyflow/react";
import type { ConditionalNode } from "../../models/NodeTypes.model";

export const bgColor = "#fc7bdbff";

function ConditionalNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as ConditionalNode;
  return (
    <div
      style={{
        backgroundColor: node.node_info.color || bgColor,
        borderRadius: "8px",
        padding: "10px",
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
        <strong>Variable</strong>: {node.data.condition}
      </span>

      <Handle type="target" position={Position.Top} />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />
    </div>
  );
  return <></>;
}

export default ConditionalNodeComponent;
