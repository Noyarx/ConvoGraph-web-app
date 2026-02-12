import Chip from "@mui/material/Chip";
import { Handle, Position, useStore, type Node } from "@xyflow/react";
import { useMemo } from "react";
import type { ConditionalNode } from "../../models/NodeTypes.model";
import "./placeholder.css";
import { Placeholder } from "./placeholderComponent";
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
  const zoomedIn = useMemo(() => zoom >= 0.3, [zoom]);
  const scale = useMemo(() => getInverseScale(zoom), [zoom]);
  const showHandles = useMemo(
    () => zoomedIn && nodo.selected,
    [zoomedIn, nodo.selected],
  );

  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
      style={{
        backgroundColor: node.node_info.color || bgColor,
      }}
    >
      {zoomedIn ? (
        <div>
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
        </div>
      ) : (
        <Placeholder />
      )}

      <Handle style={targetHandleStyle} type="target" position={Position.Top}>
        {showHandles && (
          <div
            style={{
              position: "absolute",
              display: "flex",
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
        )}
      </Handle>
      <Handle
        style={sourceHandleStyle}
        type="source"
        id={"left"}
        position={Position.Left}
      >
        {showHandles && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              top: -13,
              left: -40,
              width: 30,
              height: 30,
              scale: scale,
              transform: `translateX(${-HANDLE_OFFSET * scale}px)`,
            }}
            className="group hover:!scale-150 hover:-translate-x-1.5"
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
        )}
      </Handle>
      <Handle
        style={sourceHandleStyle}
        type="source"
        id={"right"}
        position={Position.Right}
      >
        {showHandles && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              top: -13,
              left: 15,
              width: 30,
              height: 30,
              scale: scale,
              transform: `translateX(${HANDLE_OFFSET * scale}px)`,
            }}
            className="group hover:!scale-150 hover:translate-x-1.5"
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
        )}
      </Handle>
    </div>
  );
}

export default ConditionalNodeComponent;
