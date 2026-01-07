import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import type { MenuSection } from "../models/MenuAction.model";
import { type Node } from "@xyflow/react";

// function to return a list of menu sections for node context menu
export function createNodeMenuSections(handlers: {
  onEditNode: (node: Node) => void;
  onDuplicateNode: (node: Node) => void;
  onDeleteNode: (node: Node) => void;
}): MenuSection[] {
  return [
    {
      id: "node-control",
      items: [
        {
          id: "edit-node",
          label: "Edit Node",
          icon: <Edit />,
          onClick: handlers.onEditNode,
        },
        {
          id: "duplicate-node",
          label: "Duplicate Node",
          icon: <ContentCopy />,
          shortcut: "Ctrl + D",
          onClick: handlers.onDuplicateNode,
        },
      ],
    },
    {
      id: "node-critical",
      items: [
        {
          id: "delete-node",
          label: "Delete Node",
          icon: <Delete />,
          variant: "critical",
          shortcut: "Del",
          onClick: handlers.onDeleteNode,
        },
      ],
    },
  ];
}
