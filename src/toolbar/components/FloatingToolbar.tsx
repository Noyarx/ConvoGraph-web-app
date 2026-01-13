import { Stack } from "@mui/material";
import AddNodeMenu from "../../add-node-menu/components/addNodeMenu";
import type { nodeTypeString } from "../../models/NodeTypes.model";

interface FloatingToolbarProps {
  onAddNode: (type: nodeTypeString) => void;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "right"
    | "right-start"
    | "right-end"
    | "left"
    | "left-start"
    | "left-end";
}

function FloatingToolbar({ onAddNode, placement }: FloatingToolbarProps) {
  return (
    <Stack
      direction={"row"}
      spacing={1.3}
      className={
        "flex flex-row p-1 border border-slate-100 rounded-lg shadow-none bg-surface-light bg-opacity-60 justify-around"
      }
    >
      <AddNodeMenu placement={placement} onAddNode={onAddNode} />
    </Stack>
  );
}

export default FloatingToolbar;
