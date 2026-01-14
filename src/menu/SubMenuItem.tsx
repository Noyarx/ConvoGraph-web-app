import { ListItemIcon, ListItemText } from "@mui/material";
import { Menu, MenuItem as MuiMenuItem } from "@mui/material";
import { useState } from "react";
import type { MenuItem } from "./models/MenuItem.model";
import { MenuItemsRenderer } from "./MenuItemsRenderer";

export interface SubmenuItemProps {
  item: Extract<MenuItem, { type: "submenu" }>;
  onClose: () => void;
}

export function SubmenuItem({ item, onClose }: SubmenuItemProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MuiMenuItem onMouseEnter={handleOpen} onMouseLeave={handleClose}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText>{item.label}</ListItemText>
        <span style={{ marginLeft: "auto" }}>▶</span>
      </MuiMenuItem>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItemsRenderer items={item.items} onClose={onClose} />
      </Menu>
    </>
  );
}
