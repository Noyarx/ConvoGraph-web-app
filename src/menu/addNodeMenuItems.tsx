import {
  AltRouteRounded,
  ChatOutlined,
  NewReleasesRounded,
  QuestionMark,
  Tag,
} from "@mui/icons-material";
import type { GraphActions } from "../editor/GraphActions.model";
import type { MenuItem } from "./models/MenuItem.model";

interface addNodeMenuItemsProps {
  position?: { x: number; y: number };
  actions: GraphActions;
}

export function getAddNodeMenuItems({
  position,
  actions,
}: addNodeMenuItemsProps): MenuItem[] {
  return [
    {
      type: "action",
      id: "action-add-node-statement",
      label: "Statement",
      icon: <ChatOutlined />,
      command: () => actions.handleAddNode({ position, type: "statement" }),
    },
    {
      type: "action",
      id: "action-add-node-question",
      label: "Question",
      icon: <QuestionMark />,
      command: () => actions.handleAddNode({ position, type: "question" }),
    },
    {
      type: "action",
      id: "action-add-node-condition",
      label: "Condition",
      icon: <AltRouteRounded className="rotate-180" />,
      command: () => actions.handleAddNode({ position, type: "condition" }),
    },
    {
      type: "action",
      id: "action-add-node-event",
      label: "Event",
      icon: <NewReleasesRounded />,
      command: () => actions.handleAddNode({ position, type: "event" }),
    },
    {
      type: "action",
      id: "action-add-node-comment",
      label: "Comment",
      icon: <Tag />,
      command: () => actions.handleAddNode({ position, type: "comment" }),
    },
  ];
}
