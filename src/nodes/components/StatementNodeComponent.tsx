import { Handle, Position, useStore, type Node } from "@xyflow/react";
import { memo, useMemo } from "react";
import type { StatementNode } from "../../models/NodeTypes.model";
import { Placeholder } from "./placeholderComponent";
import {
  getInverseScale,
  HANDLE_OFFSET,
  sourceHandleStyle,
  targetHandleStyle,
} from "./util";

export const bgColor = "#4e73df";
function StatementNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as StatementNode;
  const nodo = flowNode as Node;
  const zoom = useStore((state) => state.transform[2]);
  const zoomedIn = useMemo(() => zoom >= 0.3, [zoom]);
  const scale = useMemo(() => getInverseScale(zoom), [zoom]);
  const showHandles = useMemo(
    () => zoomedIn && nodo.selected,
    [zoomedIn, nodo.selected],
  );

  return (
    <>
      <div
        className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
        style={{
          backgroundColor: node.node_info.color || bgColor,
        }}
      >
        {zoomedIn ? (
          <div>
            <div className="flex flex-row justify-between">
              <span>
                <strong>{node.data.speaker}</strong>:
              </span>
              <span>
                <strong>{node.data.mood}</strong>
              </span>
            </div>
            <p>{node.data.text}</p>
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
          position={Position.Bottom}
        >
          {showHandles && (
            <div
              style={{
                position: "absolute",
                display: "flex",
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
          )}
        </Handle>
      </div>
    </>
  );
}

export default memo(StatementNodeComponent);
