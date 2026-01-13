import { Stack } from "@mui/material";
import AddNodeMenu from "../../add-node-menu/components/addNodeMenu";
import type { nodeTypeString } from "../../models/NodeTypes.model";

interface FloatingToolbarProps {
  onAddNode: (type: nodeTypeString) => void;
}

function FloatingToolbar({ onAddNode }: FloatingToolbarProps) {
  return (
    <Stack
      direction={"row"}
      spacing={1.3}
      className={
        "flex flex-row p-1 border border-slate-100 rounded-lg shadow-none bg-surface-light bg-opacity-60 justify-around"
      }
    >
      <AddNodeMenu onAddNode={onAddNode} />
    </Stack>
  );
}

export default FloatingToolbar;
