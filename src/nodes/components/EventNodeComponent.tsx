import { Handle, Position, useStore, type Node } from "@xyflow/react";
import type { EventNode } from "../../models/NodeTypes.model";
import {
  getInverseScale,
  HANDLE_OFFSET,
  sourceHandleStyle,
  targetHandleStyle,
} from "./util";
import { useMemo } from "react";

export const bgColor = "#FFA500";

function EventNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as EventNode;
  const nodo = flowNode as Node;
  const zoom = useStore((state) => state.transform[2]);
  const scale = getInverseScale(zoom);
  const showHandles = useMemo(
    () => zoom >= 0.25 && nodo.selected,
    [zoom, nodo.selected],
  );

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

      <Handle style={targetHandleStyle} type="target" position={Position.Top}>
        <div
          style={{
            position: "absolute",
            display: showHandles ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            top: -50,
            left: -13,
            width: 30,
            height: 30,
            scale: scale,
            transform: `translateY(${-HANDLE_OFFSET * scale}px)`,
          }}
          className="group hover:!scale-150 hover:-translate-y-1.5"
        >
          <div
            style={{
              position: "absolute",
              borderRadius: 9999,
              width: 20,
              height: 20,
            }}
            className={`active:hidden border-4 group-hover:border-2 border-green-300 bg-green-600`}
          ></div>
        </div>
      </Handle>

      <Handle
        style={sourceHandleStyle}
        type="source"
        position={Position.Bottom}
      >
        <div
          style={{
            position: "absolute",
            display: showHandles ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            top: 20,
            left: -13,
            width: 30,
            height: 30,
            scale: scale,
            transform: `translateY(${HANDLE_OFFSET * scale}px)`,
          }}
          className="group hover:!scale-150 hover:translate-y-1.5"
        >
          <div
            style={{
              position: "absolute",
              borderRadius: 9999,
              width: 20,
              height: 20,
            }}
            className={`active:hidden border-4 group-hover:border-2 border-orange-300 bg-orange-500`}
          ></div>
        </div>
      </Handle>
    </div>
  );
}

export default EventNodeComponent;
