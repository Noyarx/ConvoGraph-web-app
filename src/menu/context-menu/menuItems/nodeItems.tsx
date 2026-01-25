import { ContentCopy, Delete } from "@mui/icons-material";
import type { Node } from "@xyflow/react";
import type { GraphActions } from "../../../editor/GraphActions.model";
import type { MenuItem } from "../../models/MenuItem.model";

export function getNodeContextMenuItems(
  target: Node,
  actions: GraphActions,
): MenuItem[] {
  return [
    {
      type: "action",
      id: "action-duplicate-node",
      label: "Duplicate node",
      icon: <ContentCopy />,
      command: () => actions.handleDuplicateNode(target),
    },
    {
      type: "separator",
    },
    {
      type: "action",
      id: "action-delete-node",
      label: "Delete node",
      icon: <Delete />,
      variant: "critical",
      command: () => actions.handleDeleteNode(target),
    },
  ];
}
