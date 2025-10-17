import { type Node } from "@xyflow/react";
import type { CommentNode } from "../../models/NodeTypes.model";

export const bgColor = "#73cf4e";

function CommentNodeComponent(flowNode: Pick<Node, "data">) {
  const node = flowNode.data as any as CommentNode;
  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4 break-words max-w-[330px] min-w-[200px] text-white"
      style={{
        backgroundColor: node.node_info.color || bgColor,
      }}
    >
      <div className="flex flex-col justify-between">
        <span>
          <b>#</b> {node.data.text} <b>#</b>
        </span>
      </div>
    </div>
  );
}

export default CommentNodeComponent;
