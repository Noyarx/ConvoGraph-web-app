import { Add } from "@mui/icons-material";
import type { MenuSection } from "../models/MenuAction.model";

// function to return a list of menu sections for edge context menu
export function createPaneMenuSections(handlers: {
  onAddNode: () => void;
}): MenuSection[] {
  return [
    {
      id: "pane-control",
      items: [
        {
          id: "add-node",
          label: "Add new node",
          icon: <Add />,
          onClick: handlers.onAddNode,
        },
      ],
    },
  ];
}
