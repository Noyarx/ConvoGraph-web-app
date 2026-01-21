import type { Edge, Node } from "@xyflow/react";
import { useCallback } from "react";
import { useGraphActions } from "../../../editor/UseGraphActions";
import GenericMenu from "../../GenericMenu";
import { getEdgeContextMenuItems } from "../menuItems/edgeItems";
import { getNodeContextMenuItems } from "../menuItems/nodeItems";
import { getPaneContextMenuItems } from "../menuItems/paneItems";
import { getSelectionContextMenuItems } from "../menuItems/selectionItems";

interface ContextMenuProps {
  open: boolean;
  position: { x: number; y: number };
  target: Node | Edge | Node[] | Edge[] | null;
  targetType: "node" | "edge" | "pane" | "selection" | null;
  onClose: () => void;
}

export default function ContextMenu({
  open,
  position,
  target,
  targetType,
  onClose,
}: ContextMenuProps) {
  const actions = useGraphActions();
  const getMenuItems = useCallback(() => {
    switch (targetType) {
      case "node":
        return getNodeContextMenuItems(target as Node, actions);
      case "edge":
        return getEdgeContextMenuItems(target as Edge, actions);
      case "selection":
        return getSelectionContextMenuItems(target as Node[], actions);
      case "pane":
      default:
        return getPaneContextMenuItems(position, actions);
    }
  }, [
    target,
    position,
    getNodeContextMenuItems,
    getEdgeContextMenuItems,
    getPaneContextMenuItems,
    getSelectionContextMenuItems,
  ]);

  const items = getMenuItems();
  if (!items) return;

  return (
    <GenericMenu
      open={open}
      onClose={onClose}
      items={items}
      anchorPosition={position}
    />
  );
}
