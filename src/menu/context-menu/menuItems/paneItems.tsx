import { Add, Fullscreen } from "@mui/icons-material";
import type { GraphActions } from "../../../editor/GraphActions.model";
import type { MenuItem } from "../../models/MenuItem.model";

export function getPaneContextMenuItems(
  position: { x: number; y: number },
  actions: GraphActions,
): MenuItem[] {
  return [
    {
      type: "submenu",
      id: "submenu-add-node",
      label: "Add new node",
      icon: <Add />,
      items: [
        {
          type: "action",
          id: "action-add-node-statement",
          label: "Statement",
          icon: <Add />,
          command: () => actions.handleAddNode({ position, type: "statement" }),
        },
        {
          type: "action",
          id: "action-add-node-question",
          label: "Question",
          icon: <Add />,
          command: () => actions.handleAddNode({ position, type: "question" }),
        },
        {
          type: "action",
          id: "action-add-node-condition",
          label: "Condition",
          icon: <Add />,
          command: () => actions.handleAddNode({ position, type: "condition" }),
        },
        {
          type: "action",
          id: "action-add-node-event",
          label: "Event",
          icon: <Add />,
          command: () => actions.handleAddNode({ position, type: "event" }),
        },
        {
          type: "action",
          id: "action-add-node-comment",
          label: "Comment",
          icon: <Add />,
          command: () => actions.handleAddNode({ position, type: "comment" }),
        },
      ],
    },
    { type: "separator" },
    {
      type: "action",
      id: "action-center-view",
      label: "Center View",
      icon: <Fullscreen />,
      command: () => actions.centerView(),
    },
  ];
}
