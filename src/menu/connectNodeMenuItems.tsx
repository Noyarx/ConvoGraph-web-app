import {
  AltRouteRounded,
  ChatOutlined,
  NewReleasesRounded,
  QuestionMark,
} from "@mui/icons-material";
import type { Node } from "@xyflow/react";
import type { GraphActions } from "../editor/GraphActions.model";
import type { MenuItem } from "./models/MenuItem.model";

interface ConnectNodeMenuItemsProps {
  position?: { x: number; y: number };
  sourceNode: Node;
  sourceHandle?: string;
  actions: GraphActions;
}

export function getConnectNodeMenuItems({
  position,
  sourceNode,
  sourceHandle,
  actions,
}: ConnectNodeMenuItemsProps): MenuItem[] {
  return [
    {
      type: "action",
      id: "action-add-node-statement",
      label: "Statement",
      icon: <ChatOutlined />,
      command: () =>
        actions.handleConnectNode(
          sourceNode,
          actions.handleAddNode({ position, type: "statement" }),
          sourceHandle,
        ),
    },
    {
      type: "action",
      id: "action-add-node-question",
      label: "Question",
      icon: <QuestionMark />,
      command: () =>
        actions.handleConnectNode(
          sourceNode,
          actions.handleAddNode({ position, type: "question" }),
          sourceHandle,
        ),
    },
    {
      type: "action",
      id: "action-add-node-condition",
      label: "Condition",
      icon: <AltRouteRounded className="rotate-180" />,
      command: () =>
        actions.handleConnectNode(
          sourceNode,
          actions.handleAddNode({ position, type: "condition" }),
          sourceHandle,
        ),
    },
    {
      type: "action",
      id: "action-add-node-event",
      label: "Event",
      icon: <NewReleasesRounded />,
      command: () =>
        actions.handleConnectNode(
          sourceNode,
          actions.handleAddNode({ position, type: "event" }),
          sourceHandle,
        ),
    },
  ];
}
