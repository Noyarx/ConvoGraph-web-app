import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import type { MenuItem } from "./models/MenuItem.model";
import { SubmenuItem } from "./SubMenuItem";

export interface MenuItemsRendererProps {
  items: MenuItem[];
  onClose: () => void;
}

export function MenuItemsRenderer({ items, onClose }: MenuItemsRendererProps) {
  return (
    <>
      {items.map((item, index) => {
        switch (item.type) {
          case "separator":
            return <Divider key={`sep-${index}`} />;

          case "action":
            return (
              <MuiMenuItem
                key={item.id}
                onClick={() => {
                  item.command();
                  onClose();
                }}
                sx={
                  item.variant === "critical"
                    ? {
                        color: "error.main",
                      }
                    : undefined
                }
              >
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText>{item.label}</ListItemText>
                {item.shortcut && (
                  <kbd style={{ marginLeft: 16, opacity: 0.6 }}>
                    {item.shortcut}
                  </kbd>
                )}
              </MuiMenuItem>
            );

          case "submenu":
            return <SubmenuItem key={item.id} item={item} onClose={onClose} />;

          default:
            return null;
        }
      })}
    </>
  );
}
