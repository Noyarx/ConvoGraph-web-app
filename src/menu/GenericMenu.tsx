import type { PopoverOrigin } from "@mui/material";
import { useState } from "react";
import { StyledMenu } from "./context-menu/components/ContextMenuStyle";
import { MenuItemsRenderer } from "./MenuItemsRenderer";
import type { MenuItem } from "./models/MenuItem.model";

interface GenericMenuProps {
  items: MenuItem[] | null;
  open: boolean;
  onClose: () => void;

  orientation?: "top" | "bottom";
  anchorOffset?: { x: number; y: number };
  anchorEl?: HTMLElement | null;
  anchorPosition?: { x: number; y: number };
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export default function GenericMenu({
  items,
  open,
  onClose,
  anchorOffset,
  anchorEl,
  anchorPosition,
  anchorOrigin,
  transformOrigin,
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
    <StyledMenu
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorPosition={
        anchorPosition
          ? { top: anchorPosition.y, left: anchorPosition.x }
          : undefined
      }
      anchorReference={anchorPosition ? "anchorPosition" : "anchorEl"}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={anchorOffset && { mt: anchorOffset?.y, ml: anchorOffset?.x }}
      slotProps={{
        transition: { onExited: () => setIsMenuActive(true) },
      }} //re-enable menu on animation ended
    >
      <MenuItemsRenderer
        openPath={openPath}
        setOpenPath={trySetOpenPath}
        items={items}
        onClose={handleClose}
      />
    </StyledMenu>
  );
}
