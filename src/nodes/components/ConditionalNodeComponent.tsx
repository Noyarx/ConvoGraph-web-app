import Chip from "@mui/material/Chip";
import { Handle, Position, useStore, type Node } from "@xyflow/react";
import type { ConditionalNode } from "../../models/NodeTypes.model";
import "./placeholder.css";
import {
  getInverseScale,
  HANDLE_OFFSET,
  sourceHandleStyle,
  targetHandleStyle,
} from "./util";

export const bgColor = "#fc7bdbff";

function ConditionalNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as ConditionalNode;
  const nodo = flowNode as Node;
  const zoom = useStore((state) => state.transform[2]);
  const scale = getInverseScale(zoom);

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
      <div className="flex flex-row p-1 gap-3 max-w-full rounded-full items-center bg-black bg-opacity-10">
        <Chip
          className="!max-w-[152px] !text-white overflow-ellipsis"
          label={node.data.var_name}
        />
        <span>
          <strong>{node.data.operator}</strong>
        </span>
        <div className="!max-w-[92px] !overflow-clip">
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
              color={
                Number(node.data.value) - Number(node.data.value) === 0
                  ? "secondary"
                  : "default"
              }
              className="!text-white"
              label={node.data.value}
            />
          )}
        </div>
      </div>

      <Handle style={targetHandleStyle} type="target" position={Position.Top}>
        <div
          style={{
            position: "absolute",
            top: -30,
            width: 20,
            height: 20,
            display: nodo.selected ? "block" : "none",
            scale: scale,
            transform: `translateY(${-HANDLE_OFFSET * scale}px)`,
          }}
          className={`justify-self-center active:!hidden rounded-xl border-4 hover:border-2 border-green-300 bg-green-600`}
        ></div>
      </Handle>
      <Handle
        style={sourceHandleStyle}
        type="source"
        id={"left"}
        position={Position.Left}
      >
        <div
          style={{
            position: "absolute",
            top: -8,
            left: -40,
            width: 20,
            height: 20,
            display: nodo.selected ? "block" : "none",
            scale: scale,
            transform: `translateX(${-HANDLE_OFFSET * scale}px)`,
          }}
          className={`justify-self-center active:!hidden rounded-xl border-4 hover:border-2 border-orange-300 bg-orange-500`}
        ></div>
      </Handle>
      <Handle
        style={sourceHandleStyle}
        type="source"
        id={"right"}
        position={Position.Right}
      >
        <div
          style={{
            position: "absolute",
            top: -8,
            left: 20,
            width: 20,
            height: 20,
            display: nodo.selected ? "block" : "none",
            scale: scale,
            transform: `translateX(${HANDLE_OFFSET * scale}px)`,
          }}
          className={`justify-self-center active:!hidden rounded-xl border-4 hover:border-2 border-orange-300 bg-orange-500`}
        ></div>
      </Handle>
    </div>
  );
}

export default ConditionalNodeComponent;
