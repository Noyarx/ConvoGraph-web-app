import { ContentCopy, Delete } from "@mui/icons-material";
import type { Node } from "@xyflow/react";
import type { GraphActions } from "../../../editor/GraphActions.model";
import type { MenuItem } from "../../models/MenuItem.model";

export function getSelectionContextMenuItems(
  targets: Node[],
  actions: GraphActions,
): MenuItem[] {
  return [
    {
      type: "action",
      id: "action-duplicate-nodes",
      label: "Duplicate nodes",
      icon: <ContentCopy />,
      command: () => actions.handleDuplicateNodes(targets),
    },
    {
      type: "separator",
    },
    {
      type: "action",
      id: "action-delete-nodes",
      label: "Delete nodes",
      icon: <Delete />,
      variant: "critical",
      command: () => actions.handleDeleteNodes(targets),
    },
  ];
}
