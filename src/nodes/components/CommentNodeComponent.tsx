import { useStore, type Node } from "@xyflow/react";
import { useMemo } from "react";
import type { CommentNode } from "../../models/NodeTypes.model";
import { usePreviewHighlight } from "../../preview/PreviewContext";
import { Placeholder } from "./placeholderComponent";

export const bgColor = "#73cf4e";

function CommentNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as CommentNode;
  const zoom = useStore((state) => state.transform[2]);
  const zoomedIn = useMemo(() => zoom >= 0.3, [zoom]);
  const highlightState = usePreviewHighlight(node.id);

  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
      style={{
        backgroundColor: node.node_info.color || bgColor,
        ...(highlightState === "dimmed" && { opacity: 0.15, filter: "grayscale(0.5)" }),
        ...(highlightState === "current" && {
          boxShadow: "0 0 14px 4px rgba(99,102,241,0.6), 0 0 4px 1px rgba(99,102,241,0.3)",
          outline: "2px solid rgba(99,102,241,0.8)",
          outlineOffset: 2,
        }),
        transition: "opacity 0.3s, filter 0.3s, box-shadow 0.3s, outline 0.3s",
      }}
    >
      {zoomedIn ? (
        <div className="flex flex-col justify-between">
          <span>
            <b>#</b> {node.data.text} <b>#</b>
          </span>
        </div>
      ) : (
        <Placeholder />
      )}
    </div>
  );
}

export default CommentNodeComponent;
