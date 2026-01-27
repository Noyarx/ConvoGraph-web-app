import {
  AltRouteRounded,
  ChatOutlined,
  NewReleasesRounded,
  QuestionMark,
  Tag,
} from "@mui/icons-material";
import type { GraphActions } from "../editor/GraphActions.model";
import type { MenuItem } from "./models/MenuItem.model";

interface selectNodeMenuItemsProps {
  position?: { x: number; y: number };
  actions: GraphActions;
}

export function getSelectNodeMenuItems({
  actions,
}: selectNodeMenuItemsProps): MenuItem[] {
  return [
    {
      type: "action",
      id: "action-add-node-statement",
      label: "Statement",
      icon: <ChatOutlined />,
      command: () => actions.selectNodeType("statement"),
    },
    {
      type: "action",
      id: "action-add-node-question",
      label: "Question",
      icon: <QuestionMark />,
      command: () => actions.selectNodeType("question"),
    },
    {
      type: "action",
      id: "action-add-node-condition",
      label: "Condition",
      icon: <AltRouteRounded className="rotate-180" />,
      command: () => actions.selectNodeType("condition"),
    },
    {
      type: "action",
      id: "action-add-node-event",
      label: "Event",
      icon: <NewReleasesRounded />,
      command: () => actions.selectNodeType("event"),
    },
    {
      type: "action",
      id: "action-add-node-comment",
      label: "Comment",
      icon: <Tag />,
      command: () => actions.selectNodeType("comment"),
    },
  ];
}
