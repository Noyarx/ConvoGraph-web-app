import { Delete } from "@mui/icons-material";
import type { MenuItem } from "../../models/MenuItem.model";
import type { GraphActions } from "../../../editor/GraphActions.model";
import type { Edge } from "@xyflow/react";

export function getEdgeContextMenuItems(
  target: Edge,
  actions: GraphActions
): MenuItem[] {
  return [
    {
      type: "action",
      id: "action-delete-edge",
      label: "Delete Edge",
      variant: "critical",
      icon: <Delete />,
      command: () => actions.handleDeleteEdge(target),
    },
  ];
}
