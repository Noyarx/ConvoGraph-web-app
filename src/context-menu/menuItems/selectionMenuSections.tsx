import { ContentCopy, Delete } from "@mui/icons-material";
import type { MenuSection } from "../models/MenuAction.model";

// function to return a list of menu sections for node context menu
export function createSelectionMenuSections(handlers: {
  onDuplicateNodes: () => void;
  onDeleteNodes: () => void;
}): MenuSection[] {
  return [
    {
      id: "selection-control",
      items: [
        {
          id: "duplicate-selected-nodes",
          label: "Duplicate Nodes",
          icon: <ContentCopy />,
          shortcut: "Ctrl + D",
          onClick: handlers.onDuplicateNodes,
        },
      ],
    },
    {
      id: "selection-critical",
      items: [
        {
          id: "delete-selected-nodes",
          label: "Delete Nodes",
          icon: <Delete />,
          variant: "critical",
          shortcut: "Del",
          onClick: handlers.onDeleteNodes,
        },
      ],
    },
  ];
}
