import { Menu } from "@mui/material";
import type { MenuItem } from "../menu/models/MenuItem.model";
import { MenuItemsRenderer } from "./MenuItemsRenderer";

interface GenericMenuProps {
  items: MenuItem[];
  open: boolean;
  onClose: () => void;

  anchorEl?: HTMLElement | null;
  anchorPosition?: { x: number; y: number };
}

export default function GenericMenu({
  items,
  open,
  onClose,
  anchorEl,
  anchorPosition,
}: GenericMenuProps) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorReference={anchorPosition ? "anchorPosition" : "anchorEl"}
      anchorPosition={
        anchorPosition
          ? { top: anchorPosition.y, left: anchorPosition.x }
          : undefined
      }
      //   MenuListProps={{ dense: true }}
    >
      <MenuItemsRenderer items={items} onClose={onClose} />
    </Menu>
  );
}
