import { Add, Fullscreen } from "@mui/icons-material";
import type { GraphActions } from "../../../editor/GraphActions.model";
import { getAddNodeMenuItems } from "../../addNodeMenuItems";
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
      items: getAddNodeMenuItems({ position, actions }),
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
