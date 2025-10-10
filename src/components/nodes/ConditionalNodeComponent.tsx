import { Handle, Position } from "@xyflow/react";
import type { ConditionalNodeData } from "../../models/NodeDataTypes.model";

type ConditionalRenderData = ConditionalNodeData & {
  title?: string;
  color?: string;
};

export default function ConditionalNodeComponent({
  data,
}: {
  data: ConditionalRenderData;
}) {
  return (
    <div
      style={{
        backgroundColor: data.color || "#4e73df",
        borderRadius: "8px",
        padding: "10px",
        color: "white",
        minWidth: "150px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{data.title}</div>
      <div style={{ fontSize: "0.9em" }}>
        <strong>La variabile: </strong>: {data.condition}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />
    </div>
  );
}
