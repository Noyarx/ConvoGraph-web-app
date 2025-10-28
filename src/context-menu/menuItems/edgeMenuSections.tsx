import { Delete, Edit } from "@mui/icons-material";
import type { MenuSection } from "../models/MenuAction.model";
import type { Edge } from "@xyflow/react";

// function to return a list of menu sections for edge context menu
export function createEdgeMenuSections(handlers: {
  onEditEdge: (edge: Edge) => void;
  onDeleteEdge: (edge: Edge) => void;
}): MenuSection[] {
  return [
    {
      id: "edge-control",
      items: [
        {
          id: "edit-edge",
          label: "Edit Edge",
          icon: <Edit />,
          onClick: handlers.onEditEdge,
        },
      ],
    },
    {
      id: "edge-critical",
      items: [
        {
          id: "delete-edge",
          label: "Delete Edge",
          icon: <Delete />,
          variant: "critical",
          onClick: handlers.onDeleteEdge,
        },
      ],
    },
  ];
}
