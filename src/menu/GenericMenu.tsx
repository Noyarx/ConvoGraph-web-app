import { Menu } from "@mui/material";
import { useState } from "react";
import { MenuItemsRenderer } from "./MenuItemsRenderer";
import type { MenuItem } from "./models/MenuItem.model";

interface GenericMenuProps {
  items: MenuItem[] | null;
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
  // const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [openPath, setOpenPath] = useState<string[]>([]);
  const [isMenuActive, setIsMenuActive] = useState<boolean>(true);

  const trySetOpenPath = (path: string[]) => {
    if (!isMenuActive) return;
    setOpenPath(path);
  };

  const closeAllSubmenus = () => {
    setOpenPath([]);
  };

  const handleClose = () => {
    setIsMenuActive(false);
    closeAllSubmenus();
    onClose();
  };

  if (!items) return;
  return (
    <Menu
      open={open}
      onClose={handleClose}
      slotProps={{ transition: { onExited: () => setIsMenuActive(true) } }} //re-enable menu on animation ended
      anchorEl={anchorEl}
      anchorReference={anchorPosition ? "anchorPosition" : "anchorEl"}
      anchorPosition={
        anchorPosition
          ? { top: anchorPosition.y, left: anchorPosition.x }
          : undefined
      }
    >
      <MenuItemsRenderer
        openPath={openPath}
        setOpenPath={trySetOpenPath}
        items={items}
        onClose={handleClose}
      />
    </Menu>
  );
}
