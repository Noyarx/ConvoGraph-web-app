import { useStore, type Node } from "@xyflow/react";
import { useMemo } from "react";
import type { CommentNode } from "../../models/NodeTypes.model";
import { useNodeHighlight } from "../../highlight/NodeHighlightContext";
import { Placeholder } from "./placeholderComponent";
import { getHighlightStyle } from "./util";

export const bgColor = "#73cf4e";

function CommentNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as CommentNode;
  const zoom = useStore((state) => state.transform[2]);
  const zoomedIn = useMemo(() => zoom >= 0.3, [zoom]);
  const highlightState = useNodeHighlight(node.id);

  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
      style={{
        backgroundColor: node.node_info.color || bgColor,
        ...getHighlightStyle(highlightState),
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
