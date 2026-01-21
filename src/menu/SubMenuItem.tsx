import {
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
  Popover,
} from "@mui/material";
import { useRef, useState } from "react";
import { MenuItemsRenderer } from "./MenuItemsRenderer";
import type { MenuItem } from "./models/MenuItem.model";

export interface SubmenuItemProps {
  item: Extract<MenuItem, { type: "submenu" }>;

  openPath: string[];
  setOpenPath: (path: string[]) => void;
  parentPath: string[];

  onClose: () => void;
}

export function SubmenuItem({
  item,
  openPath,
  setOpenPath,
  parentPath,
  onClose,
}: SubmenuItemProps) {
  const submenuPath = [...parentPath, item.id];

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const hoverTimeout = useRef<number>(280);

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    hoverTimeout.current = window.setTimeout(() => {
      setOpenPath(submenuPath);
    }, 280);
  };

  const handleLeave = () => {
    clearTimeout(hoverTimeout.current);
  };

  const isOpen =
    openPath.length >= submenuPath.length &&
    submenuPath.every((id, i) => openPath[i] === id);

  return (
    <>
      <MuiMenuItem onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText>{item.label}</ListItemText>
        <span style={{ marginLeft: "auto" }}>▶</span>
      </MuiMenuItem>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          pointerEvents: "none",
        }}
        slotProps={{
          paper: {
            sx: { pointerEvents: "auto" },
          },
        }}
      >
        <MenuItemsRenderer
          openPath={openPath}
          setOpenPath={setOpenPath}
          parentPath={submenuPath}
          items={item.items}
          onClose={onClose}
        />
      </Popover>
    </>
  );
}
